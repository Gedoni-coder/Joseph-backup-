import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModuleHeader from "@/components/ui/module-header";
import { useCompanyInfo } from "@/lib/company-context";
import { getCompanyName } from "@/lib/get-company-name";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Gauge,
  CalendarClock,
  Tag,
  FileText,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { generateAIResponse } from "@/lib/ai";
import type { ChatMessage } from "@/lib/chatbot-data";
import { BusinessPlanningContent } from "./BusinessPlanning";
import { STORAGE_KEYS } from "@/lib/app-config";
import {
  FEASIBILITY_MODE_THRESHOLDS,
  FEASIBILITY_INPUT_DEFAULTS,
  FEASIBILITY_STOP_WORDS,
  FEASIBILITY_UI_LABELS,
  FEASIBILITY_AI_PROMPTS,
  getModeThresholds,
  getModePrompt,
  useLargeTimeFactor,
} from "@/mocks/business-feasibility";

// Modes
type Mode = "Conservative" | "Safe" | "Wild";

// Inputs used to compute feasibility
interface Inputs {
  risk: number; // 0-100
  timeValue: number; // % (discount rate)
  roiTime: number; // months
  lengthTimeFactor: number; // months
  interestRate: number; // %
}

// Per-mode computed result
interface ModeResult {
  score: number; // 0-100
  verdict: "Feasible" | "Borderline" | "Not Feasible";
  colorClass: string;
  pvFactor: number;
  combinedRate: number; // %
  details: {
    riskPenalty: number;
    timelinePenalty: number;
    ratePenalty: number;
    thresholds: { feasible: number; borderline: number };
  };
  narrative?: string;
}

// Full report for an idea
interface FeasibilityReport {
  id: string;
  idea: string;
  createdAt: string;
  tags: string[];
  derivedInputs: Inputs;
  resultsByMode: Record<Mode, ModeResult>;
}

// Use mock data configuration for storage key
const STORAGE_KEY = STORAGE_KEYS.FEASIBILITY_IDEAS;

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function computeFeasibility(mode: Mode, inputs: Inputs): ModeResult {
  const { risk, timeValue, roiTime, lengthTimeFactor, interestRate } = inputs;
  const combinedRate = (timeValue + interestRate) / 100;
  const years = Math.max(roiTime, 0) / 12;
  const pvFactor = 1 / Math.pow(1 + combinedRate, years || 0);

  // Get thresholds from mock data configuration
  const thresholds = getModeThresholds(mode);

  const baseScore = 100 * pvFactor;
  const riskPenalty = risk * thresholds.risk;
  const timelinePenalty =
    Math.max(0, roiTime - lengthTimeFactor) * thresholds.time;
  const ratePenalty = combinedRate * 100 * thresholds.rate;
  const rawScore = baseScore - riskPenalty - timelinePenalty - ratePenalty;
  const score = clamp(Number.isFinite(rawScore) ? rawScore : 0);

  let verdict: ModeResult["verdict"] = "Not Feasible";
  if (score >= thresholds.feasible) verdict = "Feasible";
  else if (score >= thresholds.borderline) verdict = "Borderline";

  const colorClass =
    verdict === "Feasible"
      ? "text-green-700 bg-green-100 border-green-200"
      : verdict === "Borderline"
        ? "text-yellow-700 bg-yellow-100 border-yellow-200"
        : "text-red-700 bg-red-100 border-red-200";

  return {
    score: Math.round(score),
    verdict,
    colorClass,
    pvFactor,
    combinedRate: Math.round(combinedRate * 10000) / 100,
    details: {
      riskPenalty: Math.round(riskPenalty),
      timelinePenalty: Math.round(timelinePenalty),
      ratePenalty: Math.round(ratePenalty),
      thresholds: {
        feasible: thresholds.feasible,
        borderline: thresholds.borderline,
      },
    },
  };
}

function extractKeywords(text: string): string[] {
  // Use stop words from mock data configuration
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !FEASIBILITY_STOP_WORDS.includes(w));
  const counts: Record<string, number> = {};
  for (const w of words) counts[w] = (counts[w] || 0) + 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([w]) => w);
}

function deriveInputsFromIdea(text: string): Inputs {
  const lower = text.toLowerCase();
  const pct = /([0-9]{1,2}(?:\.[0-9]+)?)%/;
  const months = /([0-9]{1,3})\s*(?:months|month|mo)/;
  const rateMatch = lower.match(pct);
  const monthsMatch = lower.match(months);

  // Use mock data defaults from configuration
  const defaults = FEASIBILITY_INPUT_DEFAULTS;

  let interestRate = rateMatch
    ? clamp(parseFloat(rateMatch[1]), 0, 100)
    : defaults.interestRate;
  let timeValue =
    interestRate > 0
      ? Math.max(
          defaults.timeValueMin,
          Math.min(interestRate, defaults.timeValueMax),
        )
      : 5;
  let roiTime = monthsMatch
    ? clamp(parseInt(monthsMatch[1], 10), 0, 600)
    : defaults.roiTime;

  let risk = defaults.defaultRisk;
  if (/(high\s*risk|uncertain|unproven|new\s*market)/.test(lower)) risk = 60;
  if (/(regulated|enterprise|long\s*cycle)/.test(lower))
    risk = Math.max(risk, 50);
  if (/(recurring|existing\s*customers|loyal)/.test(lower)) risk = 25;

  // Check if text mentions large time factor categories using config helper
  let lengthTimeFactor = defaults.lengthTimeFactor;
  if (useLargeTimeFactor(text)) {
    lengthTimeFactor = defaults.lengthTimeFactorLarge;
  }

  return { risk, timeValue, roiTime, lengthTimeFactor, interestRate };
}

async function buildNarrative(
  idea: string,
  mode: Mode,
  res: ModeResult,
): Promise<string | undefined> {
  const history: ChatMessage[] = [
    {
      id: "u1",
      type: "user",
      content: idea,
      timestamp: new Date(),
      context: "business-feasibility",
    },
  ];
  // Get AI prompt from mock data configuration
  const system = getModePrompt(mode);
  try {
    const text = await generateAIResponse(history, { system });
    return text || undefined;
  } catch {
    return undefined;
  }
}

export default function BusinessFeasibility() {
  const navigate = useNavigate();
  const { companyInfo } = useCompanyInfo();
  const companyName = getCompanyName(companyInfo?.companyName);

  const [ideaInput, setIdeaInput] = useState("");
  const [reports, setReports] = useState<FeasibilityReport[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedReport = useMemo(
    () => reports.find((r) => r.id === selectedId) || null,
    [reports, selectedId],
  );

  // Load/save from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setReports(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch {}
  }, [reports]);

  const analyzeIdea = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = ideaInput.trim();
    if (!text) return;

    const derivedInputs = deriveInputsFromIdea(text);
    const modes: Mode[] = ["Conservative", "Safe", "Wild"];
    const resultsByMode: Record<Mode, ModeResult> = {
      Conservative: computeFeasibility("Conservative", derivedInputs),
      Safe: computeFeasibility("Safe", derivedInputs),
      Wild: computeFeasibility("Wild", derivedInputs),
    };

    // Optional AI narratives (non-blocking)
    for (const m of modes) {
      buildNarrative(text, m, resultsByMode[m]).then((n) => {
        if (!n) return;
        setReports((prev) =>
          prev.map((r) =>
            r.id === id
              ? {
                  ...r,
                  resultsByMode: {
                    ...r.resultsByMode,
                    [m]: { ...r.resultsByMode[m], narrative: n },
                  },
                }
              : r,
          ),
        );
      });
    }

    const id = `idea_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const report: FeasibilityReport = {
      id,
      idea: text,
      createdAt: new Date().toISOString(),
      tags: extractKeywords(text),
      derivedInputs,
      resultsByMode,
    };

    // Save to localStorage immediately
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const existing: FeasibilityReport[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([report, ...existing]));
    } catch {}

    setReports((prev) => [report, ...prev]);
    setIdeaInput("");
    // Navigate after small delay to ensure localStorage is persisted
    setTimeout(() => {
      navigate(`/business-feasibility/${id}`);
    }, 100);
  };

  const deleteReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const [activeTab, setActiveTab] = useState("feasibility");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<CheckCircle className="h-6 w-6" />}
        title={FEASIBILITY_UI_LABELS.moduleTitle}
        description={`Evaluate and analyze business ideas for ${companyName} expansion, new categories, and strategic initiatives`}
        showConnectionStatus={false}
      />

      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6"
        >
          <div className="grid grid-cols-2 sm:grid-cols-8 gap-2 w-full rounded-md bg-muted p-1 text-muted-foreground">
            <TabsList className="contents">
              <TabsTrigger
                value="feasibility"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Business Feasibility
              </TabsTrigger>
              <TabsTrigger
                value="planning"
                className="w-full justify-center data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Business Planning
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="feasibility" className="space-y-8">
            {/* Conversational Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Got an Idea?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={analyzeIdea} className="flex gap-2">
                  <Input
                    value={ideaInput}
                    onChange={(e) => setIdeaInput(e.target.value)}
                    placeholder={FEASIBILITY_UI_LABELS.formPlaceholder}
                  />
                  <Button type="submit">
                    {FEASIBILITY_UI_LABELS.formButtonText}
                  </Button>
                </form>
                <div className="text-xs text-muted-foreground mt-2">
                  Tip: include rough timelines (e.g., “18 months”) or rates
                  (e.g., “8%”) to refine the analysis.
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  {FEASIBILITY_UI_LABELS.pastIdeasHeading}
                </h3>
                <Badge variant="secondary">{reports.length}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {reports.map((r) => (
                  <Card
                    key={r.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 bg-gradient-to-br from-white to-muted/20",
                    )}
                    onClick={() => {
                      try {
                        (navigate as any)(`/business-feasibility/${r.id}`);
                      } catch {}
                    }}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded bg-green-100 text-green-700">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium line-clamp-2">
                            {r.idea}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(r.createdAt).toLocaleString()}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {r.tags.map((t) => (
                              <Badge
                                key={t}
                                variant="outline"
                                className="text-2xs"
                              >
                                #{t}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteReport(r.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/business-planning/${r.id}`);
                        }}
                      >
                        Start Planning
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {reports.length === 0 && (
                <div className="text-xs text-muted-foreground">
                  {FEASIBILITY_UI_LABELS.emptyStateText}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="planning" className="space-y-8">
            <BusinessPlanningContent />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
