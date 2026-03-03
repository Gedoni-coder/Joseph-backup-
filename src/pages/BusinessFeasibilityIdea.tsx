import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModuleHeader from "@/components/ui/module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle, MessageSquare, FileText, TrendingUp, TrendingDown, AlertCircle, Zap, Target, Gauge } from "lucide-react";
import { Speedometer } from "@/components/ui/speedometer";
import { cn } from "@/lib/utils";
import { generateAIResponse } from "@/lib/ai";
import type { ChatMessage } from "@/lib/chatbot-data";
import { STORAGE_KEY, FeasibilityReport, Mode, computeFeasibility } from "@/lib/feasibility";

const chatKey = (id: string) => `joseph_feasibility_chat_${id}`;

function VerdictCard({ mode, score, verdict }: { mode: Mode; score: number; verdict: string }) {
  const bgColor = verdict === "Feasible" ? "from-green-50 to-emerald-50 border-green-200" : verdict === "Borderline" ? "from-yellow-50 to-amber-50 border-yellow-200" : "from-red-50 to-rose-50 border-red-200";
  const textColor = verdict === "Feasible" ? "text-green-700" : verdict === "Borderline" ? "text-amber-700" : "text-red-700";
  const badgeBg = verdict === "Feasible" ? "bg-green-100 text-green-800" : verdict === "Borderline" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800";

  return (
    <Card className={`bg-gradient-to-br ${bgColor} border-2`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-base font-bold">{mode} Mode</div>
          <Badge className={badgeBg}>{verdict}</Badge>
        </div>
        <div className="text-4xl font-black mb-2">{score}<span className="text-lg text-muted-foreground">/100</span></div>
        <div className="text-xs text-muted-foreground font-semibold">Feasibility Score</div>
      </CardContent>
    </Card>
  );
}

function getStatusColor(value: number, isNegative = false, isPercentage = false) {
  if (isNegative) {
    // For penalties/negative values: lower is better (green)
    if (value < 20) return "from-green-50 to-emerald-50 border-green-200";
    if (value < 50) return "from-yellow-50 to-amber-50 border-yellow-200";
    return "from-red-50 to-rose-50 border-red-200";
  }
  if (isPercentage) {
    // For percentages/rates: could be good or bad depending on context
    if (value < 5) return "from-green-50 to-emerald-50 border-green-200";
    if (value < 10) return "from-yellow-50 to-amber-50 border-yellow-200";
    return "from-red-50 to-rose-50 border-red-200";
  }
  // For positive values: higher is better
  if (value > 0.7) return "from-green-50 to-emerald-50 border-green-200";
  if (value > 0.5) return "from-yellow-50 to-amber-50 border-yellow-200";
  return "from-red-50 to-rose-50 border-red-200";
}

function MetricBox({ icon: Icon, label, value, trend, isGood, isNegative = false }: { icon: any; label: string; value: string | number; trend?: number; isGood?: boolean; isNegative?: boolean }) {
  const isTrendUp = trend !== undefined && trend > 0;
  const isTrendDown = trend !== undefined && trend < 0;
  const trendColor = isTrendUp ? "text-green-600" : isTrendDown ? "text-red-600" : "text-gray-400";

  let bgColor = "from-gray-50 to-slate-50 border-gray-200";
  if (isGood === true) {
    bgColor = "from-green-50 to-emerald-50 border-green-200";
  } else if (isGood === false) {
    bgColor = "from-red-50 to-rose-50 border-red-200";
  }

  return (
    <Card className={`bg-gradient-to-br ${bgColor} border-2 shadow-sm hover:shadow-md transition-all`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="p-2 rounded-lg bg-white/60">
            <Icon className={cn("h-5 w-5", isGood === true ? "text-green-600" : isGood === false ? "text-red-600" : "text-gray-600")} />
          </div>
          {trend !== undefined && (isTrendUp ? <TrendingUp className={cn("h-4 w-4", trendColor)} /> : isTrendDown ? <TrendingDown className={cn("h-4 w-4", trendColor)} /> : null)}
        </div>
        <div className={cn("text-sm font-semibold", isGood === true ? "text-green-700" : isGood === false ? "text-red-700" : "text-gray-700")}>{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}

export default function BusinessFeasibilityIdea() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<FeasibilityReport | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "report">("chat");
  const [activeMode, setActiveMode] = useState<Mode>("Safe");
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationalMode, setConversationalMode] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list: FeasibilityReport[] = raw ? JSON.parse(raw) : [];
      const r = list.find((x) => x.id === id);
      if (r) setReport(r);
    } catch {}
  }, [id]);

  useEffect(() => {
    if (!id) return;
    try {
      const raw = localStorage.getItem(chatKey(id));
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, [id]);

  useEffect(() => {
    if (!id) return;
    try {
      localStorage.setItem(chatKey(id), JSON.stringify(messages));
    } catch {}
  }, [id, messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !report) return;
    const user: ChatMessage = {
      id: `u_${Date.now()}`,
      type: "user",
      content: text,
      timestamp: new Date(),
      context: "business-feasibility",
    };
    setMessages((prev) => [...prev, user]);
    setInput("");
    setIsTyping(true);

    const history = [...messages, user];
    const system = `You are Joseph AI, Business Feasibility Expert. Idea: "${report.idea}". Mode: ${activeMode}. 
Provide bold, practical analysis. Use metrics. Reference Risk/ROI/Time factors. Be concise and actionable. Use 🟢 (feasible), 🟡 (borderline), 🔴 (risky) indicators.`;
    const ai = await generateAIResponse(history, { system });
    const content = ai || "I couldn't reach the AI. Please try again.";
    const assistant: ChatMessage = {
      id: `a_${Date.now()}`,
      type: "assistant",
      content,
      timestamp: new Date(),
      context: "business-feasibility",
    };
    setMessages((prev) => [...prev, assistant]);
    setIsTyping(false);
  };

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <ModuleHeader
          icon={<CheckCircle className="h-6 w-6" />}
          title="Business Feasibility Analysis"
          description="Helps decide if a business idea is viable"
          showConnectionStatus={false}
          onConversationalModeChange={setConversationalMode}
        />
        <main className="container mx-auto px-4 py-8">
          <Button variant="outline" onClick={() => navigate("/business-feasibility")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="mt-6 text-sm text-muted-foreground">Idea not found.</div>
        </main>
      </div>
    );
  }

  const modeResults = {
    Conservative: computeFeasibility("Conservative", report.derivedInputs),
    Safe: computeFeasibility("Safe", report.derivedInputs),
    Wild: computeFeasibility("Wild", report.derivedInputs),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <ModuleHeader
        icon={<CheckCircle className="h-6 w-6" />}
        title="Business Feasibility Analysis"
        description="Helps decide if a business idea is viable"
        showConnectionStatus={false}
        onConversationalModeChange={setConversationalMode}
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/business-feasibility")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Ideas
          </Button>
          <div className="text-xs text-muted-foreground">{new Date(report.createdAt).toLocaleString()}</div>
        </div>

        {/* Idea Header Card */}
        <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-100 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700 uppercase">Your Idea</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{report.idea}</div>
              <div className="flex flex-wrap gap-2">
                {report.tags.map((t) => (
                  <Badge key={t} className="bg-blue-100 text-blue-800 border-blue-200 font-medium">
                    #{t}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="h-4 w-4" /> Chat with Joseph
            </TabsTrigger>
            <TabsTrigger value="report" className="gap-2">
              <FileText className="h-4 w-4" /> Feasibility Report
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat">
            <Card className="shadow-lg border-2">
              <CardContent className="p-6">
                <div className="h-96 overflow-y-auto space-y-4 pr-2 mb-4 border border-border/50 rounded-lg p-4 bg-gradient-to-b from-white to-slate-50">
                  {messages.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">Start a conversation about your idea's feasibility</p>
                    </div>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className={cn("flex", m.type === "user" ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3 border shadow-sm",
                          m.type === "user"
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white border-blue-700 rounded-br-none"
                            : "bg-white text-gray-900 border-border/50 rounded-bl-none"
                        )}
                      >
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-2">
                      <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>

                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about feasibility, risks, ROI timing..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    disabled={isTyping}
                  />
                  <Button onClick={sendMessage} disabled={!input.trim() || isTyping} className="gap-2">
                    {isTyping ? "Thinking..." : "Send"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report Tab */}
          <TabsContent value="report" className="space-y-6">
            {/* Summary Note Section */}
            <Card className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Idea Overview</p>
                    <p className="text-sm text-gray-700">{report.idea}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">Key Details</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Risk Level:</span>
                        <span className="font-medium ml-2">{report.derivedInputs.risk}/100</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Timeline:</span>
                        <span className="font-medium ml-2">{report.derivedInputs.lengthTimeFactor} months</span>
                      </div>
                      <div>
                        <span className="text-gray-600">ROI Timeline:</span>
                        <span className="font-medium ml-2">{report.derivedInputs.roiTime} months</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Discount Rate:</span>
                        <span className="font-medium ml-2">{report.derivedInputs.timeValue}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Analysis Recommendation</p>
                    <p className="text-sm text-gray-700">
                      This idea has been analyzed across three scenarios: Conservative, Safe, and Wild. Each scenario applies different risk and time value assumptions to provide a comprehensive feasibility assessment. Review the detailed analysis below to understand how this idea performs under varying market conditions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mode Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["Conservative", "Safe", "Wild"] as Mode[]).map((m) => (
                <Card
                  key={m}
                  className={cn("cursor-pointer transition-all border-2", activeMode === m ? "ring-2 ring-primary bg-primary/5 border-primary" : "hover:shadow-md border-border/50")}
                  onClick={() => setActiveMode(m)}
                >
                  <VerdictCard mode={m} score={modeResults[m].score} verdict={modeResults[m].verdict} />
                </Card>
              ))}
            </div>

            {/* Active Mode Details */}
            {activeMode && (
              <div className="space-y-6">
                {/* Speedometer - Main Verdict */}
                <div className="flex justify-center">
                  <Speedometer value={modeResults[activeMode].score} label={`${activeMode} Mode Feasibility`} size="lg" showValue={true} />
                </div>

                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-blue-600" />
                      {activeMode} Mode Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <MetricBox
                        icon={AlertCircle}
                        label="Risk Penalty"
                        value={`-${modeResults[activeMode].details.riskPenalty} pts`}
                        trend={-modeResults[activeMode].details.riskPenalty}
                        isGood={modeResults[activeMode].details.riskPenalty < 30}
                        isNegative={true}
                      />
                      <MetricBox
                        icon={TrendingUp}
                        label="Time Value (PV)"
                        value={modeResults[activeMode].pvFactor.toFixed(3)}
                        isGood={modeResults[activeMode].pvFactor > 0.7}
                      />
                      <MetricBox
                        icon={Target}
                        label="ROI Time"
                        value={`${report.derivedInputs.roiTime}m`}
                        isGood={report.derivedInputs.roiTime <= report.derivedInputs.lengthTimeFactor}
                      />
                      <MetricBox
                        icon={Target}
                        label="Length Time Factor"
                        value={`${report.derivedInputs.lengthTimeFactor}m`}
                        isGood={report.derivedInputs.lengthTimeFactor >= 12}
                      />
                      <MetricBox
                        icon={TrendingUp}
                        label="Interest Rate"
                        value={`${report.derivedInputs.interestRate}%`}
                        isGood={report.derivedInputs.interestRate < 8}
                        isNegative={false}
                      />
                      <MetricBox
                        icon={CheckCircle}
                        label="Final Score"
                        value={`${modeResults[activeMode].score}/100`}
                        isGood={modeResults[activeMode].verdict === "Feasible"}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-white border-2 border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="h-4 w-4" /> Key Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div>
                        • Risk Score: <strong>{report.derivedInputs.risk}/100</strong>
                      </div>
                      <div>
                        • Discount Rate: <strong>{report.derivedInputs.timeValue}%</strong>
                      </div>
                      <div>
                        • Combined Rate: <strong>{modeResults[activeMode].combinedRate}%</strong>
                      </div>
                      <div>
                        • Timeline Penalty: <strong>-{modeResults[activeMode].details.timelinePenalty} pts</strong>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border-2 border-border/50">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Thresholds
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Feasible Score:</span>
                        <Badge className="bg-green-100 text-green-800">≥ {modeResults[activeMode].details.thresholds.feasible}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Borderline Score:</span>
                        <Badge className="bg-amber-100 text-amber-800">≥ {modeResults[activeMode].details.thresholds.borderline}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Score:</span>
                        <Badge
                          className={
                            modeResults[activeMode].verdict === "Feasible"
                              ? "bg-green-100 text-green-800"
                              : modeResults[activeMode].verdict === "Borderline"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {modeResults[activeMode].score}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
