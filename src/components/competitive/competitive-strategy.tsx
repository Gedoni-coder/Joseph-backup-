import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Lightbulb,
  Target,
  Clock,
  TrendingUp,
  Award,
  Zap,
  Check,
  AlertCircle,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  type CompetitiveAdvantage,
  type StrategyRecommendation,
} from "@/lib/competitive-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAgent } from "@/hooks/useAgent";
import { useToast } from "@/hooks/use-toast";

interface StrengthenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  advantage: CompetitiveAdvantage | null;
  strategyRecommendations: StrategyRecommendation[];
  selectedRecs: Record<string, Set<string>>;
  onApply: (recs: Set<string>) => void;
}

const typeCategoryMap: Record<string, string[]> = {
  technology: ["product", "partnerships"],
  process: ["operations", "partnerships"],
  brand: ["marketing", "pricing"],
  talent: ["operations", "partnerships"],
  data: ["operations", "partnerships"],
  patents: ["product", "partnerships"],
  supply_chain: ["operations", "partnerships"],
  distribution: ["marketing", "partnerships"],
  customer_relationships: ["marketing", "partnerships"],
  cost_structure: ["pricing", "operations"],
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function StrengthenDialogComponent({
  open,
  onOpenChange,
  advantage,
  strategyRecommendations,
  selectedRecs,
  onApply,
}: StrengthenDialogProps) {
  if (!advantage) return null;

  const allowedCategories = typeCategoryMap[advantage.type];
  const choices = strategyRecommendations.filter((s) =>
    allowedCategories.includes(s.category),
  );

  const current = selectedRecs[advantage.id] || new Set<string>();
  const [temp, setTemp] = useState<Set<string>>(new Set(current));

  const toggleChoice = (id: string) => {
    setTemp((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const handleApply = () => {
    onApply(temp);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select strengthening actions</DialogTitle>
          <DialogDescription>
            Choose recommendations to apply for "{advantage.advantage}".
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[300px] overflow-auto pr-1">
          {(choices || []).map((c) => (
            <label
              key={c.id}
              className="flex items-start gap-3 rounded-md border p-3 hover:bg-accent cursor-pointer"
            >
              <input
                type="checkbox"
                checked={temp.has(c.id)}
                onChange={() => toggleChoice(c.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{c.title}</span>
                  <Badge className={getImpactColor(c.expectedImpact)}>
                    {c.expectedImpact} impact
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {c.description}
                </div>
              </div>
            </label>
          ))}
          {choices.length === 0 && (
            <div className="text-sm text-muted-foreground">
              No recommendations available for this advantage type.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Check className="w-4 h-4 mr-2" /> Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CompetitiveStrategyProps {
  competitiveAdvantages: CompetitiveAdvantage[];
  strategyRecommendations: StrategyRecommendation[];
}

export function CompetitiveStrategy({
  competitiveAdvantages,
  strategyRecommendations,
}: CompetitiveStrategyProps) {
  const [analyzeOpen, setAnalyzeOpen] = useState(false);
  const [strengthenFor, setStrengthenFor] = useState<string | null>(null);
  const [localAdvantages, setLocalAdvantages] = useState<
    CompetitiveAdvantage[]
  >([]);
  const [monitored, setMonitored] = useState<Record<string, boolean>>({});
  const [selectedRecs, setSelectedRecs] = useState<Record<string, Set<string>>>(
    {},
  );
  const [createStrategyOpen, setCreateStrategyOpen] = useState(false);
  const [scheduleReviewOpen, setScheduleReviewOpen] = useState<string | null>(
    null,
  );
  const [reviewDate, setReviewDate] = useState<Date | undefined>(undefined);
  const [reviewNotes, setReviewNotes] = useState("");
  const [implementingStrategy, setImplementingStrategy] = useState<
    string | null
  >(null);
  const {
    addAgentTask,
    isLoading: agentLoading,
    error: agentError,
  } = useAgent();
  const { toast } = useToast();

  const [newAdv, setNewAdv] = useState({
    type: "technology" as CompetitiveAdvantage["type"],
    advantage: "",
    description: "",
    sustainability: "medium" as CompetitiveAdvantage["sustainability"],
    timeToReplicate: 12,
    strategicImportance:
      "important" as CompetitiveAdvantage["strategicImportance"],
    competitorResponse: "", // String for form input, converted to array on save
  });

  const [newStrategy, setNewStrategy] = useState({
    title: "",
    description: "",
    category: "positioning" as
      | "positioning"
      | "pricing"
      | "partnerships"
      | "product"
      | "marketing",
    timeframe: "short-term" as "immediate" | "short-term" | "long-term",
    expectedImpact: "medium" as "low" | "medium" | "high",
    budget: "",
    owner: "",
    objectives: "",
  });

  const advantages = useMemo(
    () => [...competitiveAdvantages, ...localAdvantages],
    [competitiveAdvantages, localAdvantages],
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "technology":
        return <Zap className="w-5 h-5 text-purple-600" />;
      case "cost":
        return <Target className="w-5 h-5 text-green-600" />;
      case "service":
        return <Award className="w-5 h-5 text-blue-600" />;
      case "brand":
        return <Shield className="w-5 h-5 text-red-600" />;
      case "distribution":
        return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case "partnerships":
        return <Lightbulb className="w-5 h-5 text-indigo-600" />;
      default:
        return <Shield className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "technology":
        return "bg-purple-100 text-purple-800";
      case "cost":
        return "bg-green-100 text-green-800";
      case "service":
        return "bg-blue-100 text-blue-800";
      case "brand":
        return "bg-red-100 text-red-800";
      case "distribution":
        return "bg-orange-100 text-orange-800";
      case "partnerships":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSustainabilityColor = (sustainability: string) => {
    switch (sustainability) {
      case "high":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "important":
        return "bg-yellow-100 text-yellow-800";
      case "moderate":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case "immediate":
        return "bg-red-100 text-red-800";
      case "short-term":
        return "bg-yellow-100 text-yellow-800";
      case "long-term":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openStrengthen = (advId: string) => setStrengthenFor(advId);
  const closeStrengthen = () => setStrengthenFor(null);

  const toggleMonitor = (advId: string) => {
    setMonitored((prev) => ({ ...prev, [advId]: !prev[advId] }));
  };

  const applyRecommendations = (advId: string, ids: Set<string>) => {
    setSelectedRecs((prev) => ({ ...prev, [advId]: ids }));
  };

  const handleCreateStrategy = () => {
    if (!newStrategy.title.trim() || !newStrategy.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Strategy Created",
      description: `"${newStrategy.title}" has been added to your strategic initiatives.`,
    });

    setCreateStrategyOpen(false);
    setNewStrategy({
      title: "",
      description: "",
      category: "positioning",
      timeframe: "short-term",
      expectedImpact: "medium",
      budget: "",
      owner: "",
      objectives: "",
    });
  };

  const handleScheduleReview = (strategyId: string) => {
    if (!reviewDate) {
      toast({
        title: "Missing Date",
        description: "Please select a date for the review",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Review Scheduled",
      description: `Review scheduled for ${reviewDate.toLocaleDateString()}`,
    });

    setScheduleReviewOpen(null);
    setReviewDate(undefined);
    setReviewNotes("");
  };

  const handleImplementStrategy = async (strategy: StrategyRecommendation) => {
    setImplementingStrategy(strategy.id);
    try {
      await addAgentTask({
        type: "implement_strategy",
        strategy: {
          id: strategy.id,
          title: strategy.title,
          description: strategy.description,
          category: strategy.category,
          resources: strategy.resources,
          timeframe: strategy.timeframe,
          expectedImpact: strategy.expectedImpact,
          metrics: strategy.metrics,
          risks: strategy.risks,
        },
        action:
          "Implement this competitive strategy. Break it down into actionable steps, identify required resources, create a timeline, and establish success metrics.",
      });

      toast({
        title: "Strategy Implementation Started",
        description: `Joseph AI is now working on implementing "${strategy.title}"`,
      });
    } catch (err) {
      toast({
        title: "Implementation Failed",
        description: agentError || "Failed to start strategy implementation",
        variant: "destructive",
      });
    } finally {
      setImplementingStrategy(null);
    }
  };

  const handleAnalyzeSubmit = () => {
    if (!newAdv.advantage.trim() || !newAdv.description.trim()) return;

    // Safely convert competitorResponse string to array
    const responseArray = (newAdv.competitorResponse || "")
      .split(/\n|,/) // split by newlines or commas
      .map((s) => s.trim())
      .filter(Boolean);

    const adv: CompetitiveAdvantage = {
      id: `${Date.now()}`,
      type: newAdv.type,
      advantage: newAdv.advantage.trim(),
      description: newAdv.description.trim(),
      sustainability: newAdv.sustainability,
      competitorResponse: responseArray,
      timeToReplicate: Number(newAdv.timeToReplicate) || 0,
      strategicImportance: newAdv.strategicImportance,
    };
    setLocalAdvantages((prev) => [adv, ...prev]);
    setAnalyzeOpen(false);
    setNewAdv({
      type: "technology",
      advantage: "",
      description: "",
      sustainability: "medium",
      timeToReplicate: 12,
      strategicImportance: "important",
      competitorResponse: "", // String input reset
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Competitive Advantage Evaluation
          </h2>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setAnalyzeOpen(true)}
          >
            <Shield className="w-4 h-4 mr-2" />
            Analyze New Advantage
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {advantages.map((advantage) => {
            const isMonitoring = !!monitored[advantage.id];
            const applied = selectedRecs[advantage.id];
            return (
              <Card
                key={advantage.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(advantage.type)}
                      <CardTitle className="text-lg">
                        {advantage.advantage}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {isMonitoring && (
                        <Badge className="bg-emerald-100 text-emerald-800">
                          Monitoring
                        </Badge>
                      )}
                      <Badge className={getTypeColor(advantage.type)}>
                        {advantage.type}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{advantage.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">
                        Sustainability
                      </div>
                      <div
                        className={`text-lg font-bold ${getSustainabilityColor(advantage.sustainability)}`}
                      >
                        {advantage.sustainability}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">
                        Time to Replicate
                      </div>
                      <div className="text-lg font-bold">
                        {advantage.timeToReplicate} months
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Strategic Importance
                      </span>
                      <Badge
                        className={getImportanceColor(
                          advantage.strategicImportance,
                        )}
                      >
                        {advantage.strategicImportance}
                      </Badge>
                    </div>
                    <Progress
                      value={
                        advantage.strategicImportance === "critical"
                          ? 100
                          : advantage.strategicImportance === "important"
                            ? 75
                            : 50
                      }
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      Potential Competitor Responses
                    </div>
                    <ul className="space-y-1">
                      {(advantage.competitorResponse || []).map((response, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {response}
                        </li>
                      ))}
                      {(!advantage.competitorResponse || advantage.competitorResponse.length === 0) && (
                        <li className="text-sm text-gray-500 italic">
                          No competitor responses analyzed yet.
                        </li>
                      )}
                    </ul>
                  </div>

                  {applied && applied.size > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-sm font-medium text-gray-900 mb-2">
                        Applied Strengthening Actions
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[...applied].map((rid) => {
                          const r = strategyRecommendations.find(
                            (s) => s.id === rid,
                          );
                          if (!r) return null;
                          return (
                            <Badge
                              key={rid}
                              className="bg-blue-100 text-blue-800"
                            >
                              {r.title}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-3 border-t">
                    <Button
                      variant={isMonitoring ? "secondary" : "outline"}
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleMonitor(advantage.id)}
                    >
                      {isMonitoring ? "Unmonitor" : "Monitor"}
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => openStrengthen(advantage.id)}
                    >
                      Strengthen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Strategy Recommendations
          </h2>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setCreateStrategyOpen(true)}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            Create Strategy
          </Button>
        </div>

        <div className="space-y-6">
          {(strategyRecommendations || []).map((strategy) => (
            <Card
              key={strategy.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-xl">
                        {strategy.title}
                      </CardTitle>
                      <Badge className={getTypeColor(strategy.category)}>
                        {strategy.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-base">
                      {strategy.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Badge className={getImpactColor(strategy.expectedImpact)}>
                      {strategy.expectedImpact} impact
                    </Badge>
                    <Badge className={getTimeframeColor(strategy.timeframe)}>
                      {strategy.timeframe}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Expected Impact</div>
                    <Badge className={getImpactColor(strategy.expectedImpact)}>
                      {strategy.expectedImpact}
                    </Badge>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Complexity</div>
                    <Badge
                      className={getComplexityColor(
                        strategy.implementationComplexity,
                      )}
                    >
                      {strategy.implementationComplexity}
                    </Badge>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Timeframe</div>
                    <Badge className={getTimeframeColor(strategy.timeframe)}>
                      {strategy.timeframe}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Strategic Rationale
                  </h4>
                  <p className="text-sm text-gray-700">{strategy.rationale}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Required Resources
                    </h4>
                    <ul className="space-y-1">
                      {(strategy.resources || []).map((resource, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Success Metrics
                    </h4>
                    <ul className="space-y-1">
                      {(strategy.metrics || []).map((metric, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {metric}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Key Risks
                    </h4>
                    <ul className="space-y-1">
                      {(strategy.risks || []).map((risk, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setScheduleReviewOpen(strategy.id)}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Schedule Review
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleImplementStrategy(strategy)}
                    disabled={
                      implementingStrategy === strategy.id || agentLoading
                    }
                  >
                    <Target className="w-3 h-3 mr-1" />
                    {implementingStrategy === strategy.id
                      ? "Implementing..."
                      : "Implement Strategy"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">
            Competitive Strategy Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {
                  advantages.filter((a) => a.strategicImportance === "critical")
                    .length
                }
              </div>
              <div className="text-sm text-blue-700">Critical Advantages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {Math.round(
                  advantages.reduce((acc, a) => acc + a.timeToReplicate, 0) /
                    advantages.length,
                )}
              </div>
              <div className="text-sm text-blue-700">
                Avg Months to Replicate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {Object.values(selectedRecs).reduce(
                  (acc, s) => acc + (s?.size || 0),
                  0,
                )}
              </div>
              <div className="text-sm text-blue-700">
                Strengthening Actions Applied
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-900">
                {Object.values(monitored).filter(Boolean).length}
              </div>
              <div className="text-sm text-blue-700">Advantages Monitored</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={analyzeOpen} onOpenChange={setAnalyzeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Analyze New Advantage</DialogTitle>
            <DialogDescription>
              Capture details about a new competitive advantage to evaluate and
              track.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-sm mb-1">Type</div>
                <select
                  value={newAdv.type}
                  onChange={(e) =>
                    setNewAdv((p) => ({
                      ...p,
                      type: e.target.value as CompetitiveAdvantage["type"],
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="technology">Technology</option>
                  <option value="cost">Cost</option>
                  <option value="service">Service</option>
                  <option value="brand">Brand</option>
                  <option value="distribution">Distribution</option>
                  <option value="partnerships">Partnerships</option>
                </select>
              </div>
              <div>
                <div className="text-sm mb-1">Strategic Importance</div>
                <select
                  value={newAdv.strategicImportance}
                  onChange={(e) =>
                    setNewAdv((p) => ({
                      ...p,
                      strategicImportance: e.target
                        .value as CompetitiveAdvantage["strategicImportance"],
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="critical">Critical</option>
                  <option value="important">Important</option>
                  <option value="moderate">Moderate</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-sm mb-1">Sustainability</div>
                <select
                  value={newAdv.sustainability}
                  onChange={(e) =>
                    setNewAdv((p) => ({
                      ...p,
                      sustainability: e.target
                        .value as CompetitiveAdvantage["sustainability"],
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <div className="text-sm mb-1">Time to Replicate (months)</div>
                <Input
                  type="number"
                  min={0}
                  value={newAdv.timeToReplicate}
                  onChange={(e) =>
                    setNewAdv((p) => ({
                      ...p,
                      timeToReplicate: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <div className="text-sm mb-1">Advantage Title</div>
              <Input
                placeholder="e.g., Real-time Processing Engine"
                value={newAdv.advantage}
                onChange={(e) =>
                  setNewAdv((p) => ({ ...p, advantage: e.target.value }))
                }
              />
            </div>
            <div>
              <div className="text-sm mb-1">Description</div>
              <Textarea
                placeholder="Describe the advantage and why it matters"
                value={newAdv.description}
                onChange={(e) =>
                  setNewAdv((p) => ({ ...p, description: e.target.value }))
                }
                className="min-h-[90px]"
              />
            </div>
            <div>
              <div className="text-sm mb-1">
                Potential Competitor Responses (one per line or comma-separated)
              </div>
              <Textarea
                placeholder="Invest in infrastructure upgrades\nAcquire real-time technology companies"
                value={newAdv.competitorResponse}
                onChange={(e) =>
                  setNewAdv((p) => ({
                    ...p,
                    competitorResponse: e.target.value,
                  }))
                }
                className="min-h-[80px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnalyzeOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAnalyzeSubmit}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StrengthenDialogComponent
        open={!!strengthenFor}
        onOpenChange={(open) => !open && closeStrengthen()}
        advantage={advantages.find((a) => a.id === strengthenFor) || null}
        strategyRecommendations={strategyRecommendations}
        selectedRecs={selectedRecs}
        onApply={(recs) => {
          if (strengthenFor) {
            applyRecommendations(strengthenFor, recs);
          }
        }}
      />

      <Dialog open={createStrategyOpen} onOpenChange={setCreateStrategyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Strategy</DialogTitle>
            <DialogDescription>
              Define a new competitive strategy to pursue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="strategy-title">Strategy Title</Label>
              <Input
                id="strategy-title"
                placeholder="e.g., Enter Premium Market Segment"
                value={newStrategy.title}
                onChange={(e) =>
                  setNewStrategy((p) => ({ ...p, title: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="strategy-description">Description</Label>
              <Textarea
                id="strategy-description"
                placeholder="Describe the strategy and its objectives"
                value={newStrategy.description}
                onChange={(e) =>
                  setNewStrategy((p) => ({ ...p, description: e.target.value }))
                }
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="strategy-category">Category</Label>
                <select
                  id="strategy-category"
                  value={newStrategy.category}
                  onChange={(e) =>
                    setNewStrategy((p) => ({
                      ...p,
                      category: e.target.value as any,
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="positioning">Positioning</option>
                  <option value="pricing">Pricing</option>
                  <option value="partnerships">Partnerships</option>
                  <option value="product">Product</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>

              <div>
                <Label htmlFor="strategy-impact">Expected Impact</Label>
                <select
                  id="strategy-impact"
                  value={newStrategy.expectedImpact}
                  onChange={(e) =>
                    setNewStrategy((p) => ({
                      ...p,
                      expectedImpact: e.target.value as any,
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="strategy-timeframe">Timeframe</Label>
                <select
                  id="strategy-timeframe"
                  value={newStrategy.timeframe}
                  onChange={(e) =>
                    setNewStrategy((p) => ({
                      ...p,
                      timeframe: e.target.value as any,
                    }))
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="immediate">Immediate</option>
                  <option value="short-term">Short-term (0-6 months)</option>
                  <option value="long-term">Long-term (6+ months)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="strategy-owner">Owner</Label>
                <Input
                  id="strategy-owner"
                  placeholder="Responsible person/team"
                  value={newStrategy.owner}
                  onChange={(e) =>
                    setNewStrategy((p) => ({ ...p, owner: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="strategy-budget">Budget</Label>
              <Input
                id="strategy-budget"
                placeholder="e.g., $50,000"
                value={newStrategy.budget}
                onChange={(e) =>
                  setNewStrategy((p) => ({ ...p, budget: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="strategy-objectives">Key Objectives</Label>
              <Textarea
                id="strategy-objectives"
                placeholder="List the main objectives (one per line)"
                value={newStrategy.objectives}
                onChange={(e) =>
                  setNewStrategy((p) => ({ ...p, objectives: e.target.value }))
                }
                className="min-h-[60px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateStrategyOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateStrategy}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Strategy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {scheduleReviewOpen && (
        <Dialog
          open={!!scheduleReviewOpen}
          onOpenChange={(open) => !open && setScheduleReviewOpen(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Strategy Review</DialogTitle>
              <DialogDescription>
                Set a date and time for reviewing this strategy
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Review Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {reviewDate
                        ? reviewDate.toLocaleDateString()
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={reviewDate}
                      onSelect={(date) => {
                        setReviewDate(date);
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      defaultMonth={reviewDate || new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {reviewDate && (
                <div>
                  <Label htmlFor="review-time">Time</Label>
                  <Input
                    id="review-time"
                    type="time"
                    defaultValue="09:00"
                    className="h-10"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="review-notes">Review Notes</Label>
                <Textarea
                  id="review-notes"
                  placeholder="Add notes for the review session"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {!reviewDate && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 rounded border border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-700">
                    Please select a date for the review
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setScheduleReviewOpen(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleScheduleReview(scheduleReviewOpen)}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!reviewDate}
              >
                Schedule Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
