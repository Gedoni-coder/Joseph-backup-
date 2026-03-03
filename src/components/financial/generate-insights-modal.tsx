import React, { useState, useEffect } from "react";
import {
  AdvisoryInsight,
  PerformanceDriver,
  RiskAssessment,
  BudgetForecast,
} from "../../lib/financial-advisory-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
  Download,
  Save,
  Send,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUpIcon,
  BarChart3,
} from "lucide-react";

interface GenerateInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: AdvisoryInsight[];
  performanceDrivers: PerformanceDriver[];
  risks: RiskAssessment[];
  budgets: BudgetForecast[];
}

interface StrategicReport {
  executiveSummary: string;
  keyObservations: {
    title: string;
    description: string;
    impact: "positive" | "negative" | "neutral";
  }[];
  recommendations: {
    title: string;
    description: string;
    impact: number;
    priority: "high" | "medium" | "low";
  }[];
  scenarios: {
    name: string;
    profitImpact: number;
    revenueForecast: number;
    liquidityRisk: string;
  }[];
  riskAlerts: {
    risk: string;
    severity: "low" | "medium" | "high" | "critical";
    mitigation: string;
  }[];
  roadmap: {
    timeframe: string;
    actions: string[];
  }[];
}

export function GenerateInsightsModal({
  isOpen,
  onClose,
  insights,
  performanceDrivers,
  risks,
  budgets,
}: GenerateInsightsModalProps) {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<StrategicReport | null>(null);
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    if (isOpen && !report) {
      generateReport();
    }
  }, [isOpen]);

  const generateReport = () => {
    setLoading(true);
    setTimeout(() => {
      const atRiskKpis = performanceDrivers.filter(
        (d) => d.status === "at_risk" || d.status === "critical",
      );
      const highRisks = risks.filter((r) => r.riskScore >= 70);
      const avgBudgetVariance =
        budgets.reduce((sum, b) => sum + b.variance, 0) / budgets.length;

      const strategicReport: StrategicReport = {
        executiveSummary: `The organization maintains a stable financial position with strong revenue growth and improving operational efficiency. Current KPI performance shows ${performanceDrivers.filter((d) => d.status === "on_track" || d.status === "exceeding_target").length}/${performanceDrivers.length} metrics on track. Key areas requiring attention include ${atRiskKpis
          .map((d) => d.name)
          .slice(0, 2)
          .join(
            " and ",
          )}. Cash flow projections remain healthy with adequate liquidity buffers for operational needs and strategic investments.`,

        keyObservations: [
          {
            title: "Strong Revenue Performance",
            description:
              "Revenue KPIs outperforming targets by average of 12%, driven by strong market demand and effective pricing strategy",
            impact: "positive",
          },
          {
            title: "Cost Efficiency Improvements",
            description:
              "Operating expense ratio declining 3 percentage points YoY, indicating effective cost management initiatives",
            impact: "positive",
          },
          {
            title:
              atRiskKpis.length > 0
                ? `${atRiskKpis.length} KPI(s) Approaching Thresholds`
                : "KPI Performance Stable",
            description:
              atRiskKpis.length > 0
                ? `${atRiskKpis.map((d) => d.name).join(", ")} approaching critical thresholds. Immediate attention recommended.`
                : "All KPIs maintain healthy distance from warning thresholds",
            impact: atRiskKpis.length > 0 ? "negative" : "positive",
          },
          {
            title: "Budget Variance Analysis",
            description: `Average budget variance of ${Math.abs(avgBudgetVariance).toFixed(1)}% indicates ${avgBudgetVariance > 2 ? "need for tighter controls" : "good forecast accuracy"}`,
            impact: avgBudgetVariance > 2 ? "negative" : "positive",
          },
          {
            title: "Market Positioning",
            description:
              "Customer acquisition cost down 13% while maintaining quality metrics, strengthening competitive position",
            impact: "positive",
          },
        ],

        recommendations: [
          {
            title: "Accelerate High-Performing Initiatives",
            description:
              "Increase budget allocation to revenue-driving channels showing 15%+ above-target performance",
            impact: 320000,
            priority: "high",
          },
          {
            title: "Strengthen Working Capital Management",
            description:
              "Implement automated cash flow forecasting to reduce DSO by 5 days, freeing up $280K in working capital",
            impact: 280000,
            priority: "high",
          },
          {
            title: "Risk Mitigation for Critical KPIs",
            description: `Create contingency plans and reserve budgets for ${atRiskKpis.length} at-risk KPIs`,
            impact: -150000,
            priority: "high",
          },
          {
            title: "Operational Excellence Program",
            description:
              "Expand efficiency initiatives to achieve 40% operating expense ratio vs. current 42%",
            impact: 180000,
            priority: "medium",
          },
          {
            title: "Strategic Pricing Optimization",
            description:
              "Conduct pricing elasticity analysis to capture additional 2-3% revenue without volume loss",
            impact: 225000,
            priority: "medium",
          },
        ],

        scenarios: [
          {
            name: "Best Case Scenario",
            profitImpact: 850000,
            revenueForecast: 2750000,
            liquidityRisk:
              "Low - Strong cash generation supports growth investments",
          },
          {
            name: "Expected Scenario",
            profitImpact: 520000,
            revenueForecast: 2500000,
            liquidityRisk:
              "Moderate - Adequate reserves for operations and contingencies",
          },
          {
            name: "Worst Case Scenario",
            profitImpact: 120000,
            revenueForecast: 2100000,
            liquidityRisk:
              "High - May require external financing or expense reduction",
          },
        ],

        riskAlerts: highRisks.map((risk) => ({
          risk: risk.riskName,
          severity:
            risk.riskScore >= 70
              ? "critical"
              : risk.riskScore >= 50
                ? "high"
                : "medium",
          mitigation:
            risk.currentMitigation[0] || "Develop mitigation strategy",
        })),

        roadmap: [
          {
            timeframe: "Next 7 Days",
            actions: [
              "Complete detailed variance analysis for at-risk KPIs",
              "Brief leadership on key risks and opportunities",
              "Establish daily monitoring for critical metrics",
            ],
          },
          {
            timeframe: "Next 30 Days",
            actions: [
              "Implement recommended budget reallocations",
              "Launch risk mitigation initiatives",
              "Establish automated KPI dashboard",
              "Conduct market analysis for pricing optimization",
            ],
          },
          {
            timeframe: "Next Quarter",
            actions: [
              "Complete operational excellence program",
              "Review and adjust KPI targets based on performance",
              "Evaluate ROI of implemented recommendations",
              "Prepare strategic plan for next fiscal period",
            ],
          },
        ],
      };

      setReport(strategicReport);
      setLoading(false);
    }, 1500);
  };

  const handleExportPDF = () => {
    // Mock PDF export - in production, would use jsPDF or similar
    alert(
      "Exporting to PDF... (Feature would generate actual PDF in production)",
    );
  };

  const handleSaveInsight = () => {
    alert("Insights saved to dashboard");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-white border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Strategic Advisory Report</CardTitle>
              <CardDescription>
                Joseph AI Generated Financial Insights & Analysis
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>

        {loading ? (
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <p>Analyzing financial data and generating insights...</p>
            </div>
          </CardContent>
        ) : report ? (
          <>
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
              >
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="observations">Observations</TabsTrigger>
                  <TabsTrigger value="recommendations">
                    Recommendations
                  </TabsTrigger>
                  <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                  <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                </TabsList>

                {/* Executive Summary */}
                <TabsContent value="summary" className="space-y-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Executive Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {report.executiveSummary}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">KPIs On Track</span>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-3xl font-bold text-green-600">
                          {
                            performanceDrivers.filter(
                              (d) =>
                                d.status === "on_track" ||
                                d.status === "exceeding_target",
                            ).length
                          }
                          /{performanceDrivers.length}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">At-Risk KPIs</span>
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <p className="text-3xl font-bold text-red-600">
                          {
                            performanceDrivers.filter(
                              (d) =>
                                d.status === "at_risk" ||
                                d.status === "critical",
                            ).length
                          }
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Key Observations */}
                <TabsContent value="observations" className="space-y-3">
                  {report.keyObservations.map((obs, idx) => (
                    <Card
                      key={idx}
                      className={
                        obs.impact === "positive"
                          ? "border-l-4 border-l-green-500"
                          : obs.impact === "negative"
                            ? "border-l-4 border-l-red-500"
                            : ""
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {obs.impact === "positive" ? (
                            <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          ) : obs.impact === "negative" ? (
                            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {obs.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {obs.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Recommendations */}
                <TabsContent value="recommendations" className="space-y-3">
                  {report.recommendations.map((rec, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {rec.title}
                            </h4>
                            <Badge
                              className={
                                rec.priority === "high"
                                  ? "bg-red-100 text-red-800 mt-1"
                                  : rec.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-800 mt-1"
                                    : "bg-green-100 text-green-800 mt-1"
                              }
                            >
                              {rec.priority}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                              ${(rec.impact / 1000).toFixed(0)}K
                            </p>
                            <p className="text-xs text-gray-500">
                              Potential Impact
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">
                          {rec.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Scenarios */}
                <TabsContent value="scenarios" className="space-y-4">
                  {report.scenarios.map((scenario, idx) => (
                    <Card
                      key={idx}
                      className={idx === 1 ? "border-blue-300 bg-blue-50" : ""}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          {scenario.name}
                        </h4>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-600">
                              Profit Impact
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              ${(scenario.profitImpact / 1000).toFixed(0)}K
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">
                              Revenue Forecast
                            </p>
                            <p className="text-lg font-bold text-blue-600">
                              ${(scenario.revenueForecast / 1000000).toFixed(2)}
                              M
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">
                              Liquidity Risk
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {scenario.liquidityRisk.split(" - ")[0]}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          {scenario.liquidityRisk}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Roadmap */}
                <TabsContent value="roadmap" className="space-y-4">
                  {report.roadmap.map((phase, idx) => (
                    <Card key={idx}>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          {phase.timeframe}
                        </h4>
                        <ul className="space-y-2">
                          {phase.actions.map((action, aIdx) => (
                            <li
                              key={aIdx}
                              className="flex items-start gap-2 text-sm text-gray-700"
                            >
                              <span className="text-blue-600 font-bold mt-0.5">
                                •
                              </span>
                              {action}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>

            <div className="sticky bottom-0 bg-white border-t p-4 flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button variant="outline" onClick={handleSaveInsight}>
                <Save className="h-4 w-4 mr-2" />
                Save Insights
              </Button>
              <Button
                onClick={handleExportPDF}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </>
        ) : null}
      </Card>
    </div>
  );
}
