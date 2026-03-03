import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  Zap,
  Download,
  Rocket,
} from "lucide-react";
import { type RevenueStream } from "@/lib/revenue-data";
import { generateOptimizationPlanPDF } from "@/lib/optimize-plan-pdf-generator";
import { useToast } from "@/hooks/use-toast";

interface OptimizeStreamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stream: RevenueStream | null;
  allStreams: RevenueStream[];
  onImplement?: (updatedStream: RevenueStream) => void;
}

interface Bottleneck {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium";
  impact: string;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  projectedImpact: number;
  projectedImpactUnit: string;
  difficulty: "easy" | "medium" | "hard";
  timeframe: string;
  action: string;
}

function analyzeStream(
  stream: RevenueStream,
  allStreams: RevenueStream[]
): {
  bottlenecks: Bottleneck[];
  recommendations: Recommendation[];
} {
  const bottlenecks: Bottleneck[] = [];
  const recommendations: Recommendation[] = [];

  if (!allStreams || allStreams.length === 0) {
    return { bottlenecks, recommendations };
  }

  const avgGrowth =
    allStreams.reduce((sum, s) => sum + (s.growth || 0), 0) / allStreams.length;
  const avgMargin =
    allStreams.reduce((sum, s) => sum + (s.margin || 0), 0) / allStreams.length;
  const avgArpc =
    allStreams.reduce((sum, s) => sum + (s.avgRevenuePerCustomer || 0), 0) /
    allStreams.length;

  if (stream.growth && avgGrowth && stream.growth < avgGrowth * 0.5) {
    bottlenecks.push({
      id: "low-growth",
      title: "Below-Average Growth Rate",
      description: `This stream is growing at ${stream.growth}%, significantly below the portfolio average of ${avgGrowth.toFixed(1)}%. This suggests untapped expansion potential.`,
      severity: "high",
      impact: "Revenue Growth",
    });
  }

  if (stream.margin && avgMargin && stream.margin < avgMargin * 0.8) {
    bottlenecks.push({
      id: "low-margin",
      title: "Margin Compression",
      description: `Current margin of ${stream.margin}% is below portfolio average of ${avgMargin.toFixed(1)}%. Cost structure may need optimization.`,
      severity: "high",
      impact: "Profitability",
    });
  }

  if (
    stream.avgRevenuePerCustomer &&
    avgArpc &&
    stream.avgRevenuePerCustomer < avgArpc * 0.7
  ) {
    bottlenecks.push({
      id: "low-arpc",
      title: "Low Revenue Per Customer",
      description: `ARPC of $${stream.avgRevenuePerCustomer} is ${((1 - stream.avgRevenuePerCustomer / avgArpc) * 100).toFixed(0)}% below average. Pricing or product mix optimization needed.`,
      severity: "medium",
      impact: "Unit Economics",
    });
  }

  if (stream.currentRevenue < 500000) {
    bottlenecks.push({
      id: "small-stream",
      title: "Underdeveloped Revenue Stream",
      description: "This stream is early-stage with limited scale. Focus on proving unit economics before expansion.",
      severity: "medium",
      impact: "Scale",
    });
  }

  if (stream.growth && avgGrowth && stream.growth < avgGrowth) {
    recommendations.push({
      id: "expansion-marketing",
      title: "Increase Marketing Investment",
      description: `Allocate additional marketing budget to this ${stream.type} stream. A 30% increase in customer acquisition could drive revenue growth.`,
      projectedImpact: Math.max(0, stream.currentRevenue * 0.15),
      projectedImpactUnit: "$",
      difficulty: "easy",
      timeframe: "90 days",
      action: "Create marketing campaign",
    });
  }

  if (stream.margin && avgMargin && stream.margin < avgMargin) {
    const marginImprovement = stream.margin * 0.03;
    recommendations.push({
      id: "cost-optimization",
      title: "Optimize Cost Structure",
      description: `Review and optimize operational costs. Target 2-3% margin improvement through operational efficiency and automation.`,
      projectedImpact: Math.max(0, stream.currentRevenue * marginImprovement),
      projectedImpactUnit: "$",
      difficulty: "medium",
      timeframe: "120 days",
      action: "Conduct cost analysis",
    });
  }

  if (
    stream.avgRevenuePerCustomer &&
    avgArpc &&
    stream.avgRevenuePerCustomer < avgArpc
  ) {
    recommendations.push({
      id: "pricing-optimization",
      title: "Implement Tiered Pricing",
      description: `Develop premium tiers or add-ons to increase ARPC. Even a 10% increase in pricing realization could significantly boost revenue.`,
      projectedImpact: Math.max(0, stream.currentRevenue * 0.1),
      projectedImpactUnit: "$",
      difficulty: "medium",
      timeframe: "90 days",
      action: "Design pricing experiment",
    });
  }

  if (stream.type === "subscription") {
    recommendations.push({
      id: "churn-reduction",
      title: "Reduce Churn Rate",
      description: `Implement retention program targeting high-value customers. Even 5% churn reduction could protect significant revenue.`,
      projectedImpact: Math.max(0, stream.currentRevenue * 0.08),
      projectedImpactUnit: "$",
      difficulty: "medium",
      timeframe: "180 days",
      action: "Launch retention program",
    });
  }

  if (stream.currentRevenue && stream.currentRevenue < 1000000) {
    const upsellImpact = stream.customers
      ? stream.customers * (stream.avgRevenuePerCustomer || 0) * 0.15
      : 0;
    recommendations.push({
      id: "upsell-program",
      title: "Develop Cross-Sell Strategy",
      description: `Create targeted upsell program for existing customers. Leverage complementary offerings to increase customer lifetime value.`,
      projectedImpact: Math.max(0, upsellImpact),
      projectedImpactUnit: "$",
      difficulty: "easy",
      timeframe: "60 days",
      action: "Identify upsell opportunities",
    });
  }

  if (stream.currentRevenue) {
    recommendations.push({
      id: "customer-segmentation",
      title: "Advanced Customer Segmentation",
      description: `Segment customers by profitability and engagement. Tailor offers and messaging to each segment for improved conversion and retention.`,
      projectedImpact: Math.max(0, stream.currentRevenue * 0.12),
      projectedImpactUnit: "$",
      difficulty: "hard",
      timeframe: "150 days",
      action: "Build segmentation model",
    });
  }

  return {
    bottlenecks,
    recommendations: recommendations.slice(0, 5),
  };
}

export function OptimizeStreamDialog({
  open,
  onOpenChange,
  stream,
  allStreams,
  onImplement,
}: OptimizeStreamDialogProps) {
  const [selectedRecs, setSelectedRecs] = useState<string[]>([]);
  const [isImplementing, setIsImplementing] = useState(false);
  const { toast } = useToast();

  if (!stream) return null;

  const { bottlenecks, recommendations } = analyzeStream(stream, allStreams);

  const severityColors = {
    critical: "bg-red-100 text-red-800 border-red-300",
    high: "bg-orange-100 text-orange-800 border-orange-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
  };

  const difficultyColors = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-blue-100 text-blue-800",
    hard: "bg-purple-100 text-purple-800",
  };

  const selectedRecommendations = recommendations.filter((r) =>
    selectedRecs.includes(r.id)
  );
  const totalProjectedImpact = selectedRecommendations.reduce(
    (sum, rec) => sum + rec.projectedImpact,
    0
  );

  const toggleRec = (recId: string) => {
    setSelectedRecs((prev) =>
      prev.includes(recId)
        ? prev.filter((id) => id !== recId)
        : [...prev, recId]
    );
  };

  const handleImplement = async () => {
    if (selectedRecs.length === 0) {
      toast({
        title: "No recommendations selected",
        description: "Please select at least one recommendation to implement.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsImplementing(true);

      const selectedRecommendations = recommendations.filter((r) =>
        selectedRecs.includes(r.id)
      );

      const totalImpact = selectedRecommendations.reduce(
        (sum, rec) => sum + rec.projectedImpact,
        0
      );

      const updatedStream: RevenueStream = {
        ...stream,
        currentRevenue: stream.currentRevenue + totalImpact,
        forecastRevenue:
          stream.forecastRevenue + totalImpact * 1.2,
        growth: stream.growth + (selectedRecommendations.length * 2),
        margin: Math.min(
          100,
          stream.margin +
            (selectedRecommendations.filter((r) => r.id === "cost-optimization")
              .length > 0
              ? 2
              : 0)
        ),
      };

      if (onImplement) {
        onImplement(updatedStream);
      }

      toast({
        title: "Implementation Successful",
        description: `Applied ${selectedRecommendations.length} recommendations. Stream updated with projected improvements.`,
      });

      setSelectedRecs([]);
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Implementation Error",
        description: "Failed to implement recommendations. Please try again.",
        variant: "destructive",
      });
      console.error("Implementation error:", error);
    } finally {
      setIsImplementing(false);
    }
  };

  const handleExportPlan = async () => {
    try {
      await generateOptimizationPlanPDF(
        stream,
        bottlenecks,
        recommendations,
        selectedRecs
      );
      toast({
        title: "Success",
        description: "Optimization plan exported as PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export plan. Please try again.",
        variant: "destructive",
      });
      console.error("Export error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Zap className="w-6 h-6 text-blue-600" />
            Optimize: {stream.name}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            Performance diagnosis and optimization recommendations for your{" "}
            {stream.type} revenue stream
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Current Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ${(stream.currentRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-gray-600">Current Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stream.growth}%
                  </div>
                  <div className="text-xs text-gray-600">Growth Target</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stream.margin}%
                  </div>
                  <div className="text-xs text-gray-600">Margin</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {stream.customers.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Customers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Diagnosis */}
          {bottlenecks.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Performance Diagnosis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {bottlenecks.map((bottleneck) => (
                  <div
                    key={bottleneck.id}
                    className={`p-3 rounded-lg border ${severityColors[bottleneck.severity]}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-sm">{bottleneck.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {bottleneck.severity}
                      </Badge>
                    </div>
                    <p className="text-sm mb-1">{bottleneck.description}</p>
                    <div className="text-xs opacity-75">Impact: {bottleneck.impact}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Optimization Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Optimization Recommendations
              </CardTitle>
              <CardDescription>
                Select recommendations to implement and view projected impact
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedRecs.length > 0 && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-sm text-green-800 font-semibold">
                        {selectedRecs.length} recommendation(s) selected
                      </div>
                      <div className="text-xs text-green-700 mt-1">
                        Total projected impact:
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        +${(totalProjectedImpact / 1000000).toFixed(2)}M
                      </div>
                      <div className="text-xs text-green-600">annual revenue</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div
                    key={rec.id}
                    className={`border rounded-lg p-4 transition-all ${
                      selectedRecs.includes(rec.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <Checkbox
                        checked={selectedRecs.includes(rec.id)}
                        onCheckedChange={() => toggleRec(rec.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-green-600 mb-1">
                          +${(rec.projectedImpact / 1000000).toFixed(2)}M
                        </div>
                        <Badge
                          className={difficultyColors[rec.difficulty]}
                          variant="outline"
                        >
                          {rec.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 ml-6">
                      Timeframe: {rec.timeframe}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recommended Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
                  <span>Select recommendations you want to implement</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
                  <span>Click "Implement Selected" to apply optimizations</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
                  <span>Stream metrics will be updated with projected improvements</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
                  <span>Export plan to PDF for team alignment and tracking</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPlan}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Export Plan
          </Button>
          <Button
            onClick={handleImplement}
            disabled={selectedRecs.length === 0 || isImplementing}
            className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
          >
            <Rocket className="w-4 h-4" />
            {isImplementing ? "Implementing..." : "Implement Selected"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
