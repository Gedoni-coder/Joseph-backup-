import React, { useState } from "react";
import { GeneratedInsightReport } from "../../lib/ai-insights-engine";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Download,
  Save,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  BarChart3,
  DollarSign,
} from "lucide-react";

interface InsightsReportPanelProps {
  report: GeneratedInsightReport | null;
  onClose: () => void;
}

export function InsightsReportPanel({
  report,
  onClose,
}: InsightsReportPanelProps) {
  const [activeSection, setActiveSection] = useState("summary");

  if (!report) return null;

  const isOpen = report !== null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const exportToPDF = () => {
    const content = generatePDFContent(report);
    const blob = new Blob([content], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `insights-report-${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const saveInsight = () => {
    const existingReports = JSON.parse(
      localStorage.getItem("savedInsightReports") || "[]",
    );
    existingReports.push({
      ...report,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem(
      "savedInsightReports",
      JSON.stringify(existingReports),
    );
    alert("Insight report saved successfully!");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getHealthColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const renderContent = () => {
    switch (activeSection) {
      case "summary":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${getHealthColor(report.executiveSummary.overallHealthScore)}`}
                    >
                      {report.executiveSummary.overallHealthScore}
                      <span className="text-lg">/100</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {report.executiveSummary.financialPosition} Financial
                      Position
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        report.executiveSummary.keyMetrics.totalRevenue,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expenses</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        report.executiveSummary.keyMetrics.totalExpenses,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Income</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(
                        report.executiveSummary.keyMetrics.netIncome,
                      )}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-gray-700">
                  Health score:{" "}
                  <strong>
                    {report.executiveSummary.overallHealthScore}/100
                  </strong>
                </p>
                <p className="text-gray-600 text-xs">
                  {report.executiveSummary.financialPosition} financial position
                  with stable operations and identified optimization
                  opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "observations":
        return (
          <div className="space-y-3">
            {report.keyObservations.map((obs, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      {obs.severity === "critical" ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : (
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm text-gray-900">
                          {obs.title}
                        </h3>
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getSeverityColor(obs.severity)}`}
                        >
                          {obs.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{obs.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "recommendations":
        return (
          <div className="space-y-3">
            {report.recommendations.map((rec) => (
              <Card key={rec.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">
                        {rec.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {rec.description}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs flex-shrink-0 ${getPriorityColor(rec.priority)}`}
                    >
                      {rec.priority}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                    <div>
                      <span className="text-gray-500">Impact</span>
                      <div className="font-semibold text-green-600">
                        {formatCurrency(rec.estimatedImpact)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Timeframe</span>
                      <div className="font-semibold">{rec.timeframe}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Actions</span>
                      <div className="font-semibold">
                        {rec.actionItems.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "scenarios":
        return (
          <div className="grid grid-cols-3 gap-3">
            {report.strategicScenarios.map((scenario) => (
              <Card
                key={scenario.name}
                className={`overflow-hidden ${
                  scenario.name === "expected" ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs capitalize">
                    {scenario.name.replace("-", " ")}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {scenario.probability}% probability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div>
                    <span className="text-gray-500">Revenue</span>
                    <div className="font-semibold">
                      {formatCurrency(scenario.projections.revenue)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Net Income</span>
                    <div className="font-semibold text-green-600">
                      {formatCurrency(scenario.projections.netIncome)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Margin</span>
                    <div className="font-semibold">
                      {scenario.projections.profitMargin.toFixed(1)}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "risks":
        return (
          <div className="space-y-3">
            {report.riskAlerts.map((risk, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">
                        {risk.riskName}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {risk.description}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs flex-shrink-0 ${getSeverityColor(risk.severity)}`}
                    >
                      {risk.severity}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Actions:</span>{" "}
                    {risk.recommendedActions.length}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "roadmap":
        return (
          <div className="space-y-3">
            {report.strategicRoadmap.map((phase, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{phase.timeframe}</CardTitle>
                  <CardDescription className="text-xs capitalize">
                    {phase.phase} focus
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium text-gray-900">
                      Objectives:
                    </span>
                    <ul className="text-gray-600 mt-1 space-y-1">
                      {phase.objectives.slice(0, 2).map((obj, idx) => (
                        <li key={idx}>• {obj}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">
                      Expected Outcomes:
                    </span>
                    <ul className="text-gray-600 mt-1 space-y-1">
                      {(Array.isArray(phase.expectedOutcomes)
                        ? phase.expectedOutcomes
                        : [phase.expectedOutcomes]
                      )
                        .slice(0, 2)
                        .map((outcome, idx) => (
                          <li key={idx}>✓ {outcome}</li>
                        ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Strategic Advisory Report</DialogTitle>
          <DialogDescription>
            AI-Generated Financial Insights & Recommendations
          </DialogDescription>
          <div className="flex gap-2 mt-4">
            <Button
              onClick={exportToPDF}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-3 w-3 mr-1.5" />
              Export PDF
            </Button>
            <Button onClick={saveInsight} size="sm" variant="outline">
              <Save className="h-3 w-3 mr-1.5" />
              Save Report
            </Button>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b overflow-x-auto px-0 -mx-6 px-6">
          {[
            { id: "summary", label: "Summary" },
            { id: "observations", label: "Observations" },
            { id: "recommendations", label: "Recommendations" },
            { id: "scenarios", label: "Scenarios" },
            { id: "risks", label: "Risks" },
            { id: "roadmap", label: "Roadmap" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`py-2 px-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeSection === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">{renderContent()}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generatePDFContent(report: GeneratedInsightReport): string {
  return `Strategic Advisory Report
Generated: ${new Date(report.generatedAt).toLocaleDateString()}

EXECUTIVE SUMMARY
Overall Health Score: ${report.executiveSummary.overallHealthScore}/100
Financial Position: ${report.executiveSummary.financialPosition}

Key Metrics:
- Total Revenue: $${(report.executiveSummary.keyMetrics.totalRevenue / 1000000).toFixed(2)}M
- Total Expenses: $${(report.executiveSummary.keyMetrics.totalExpenses / 1000000).toFixed(2)}M
- Net Income: $${(report.executiveSummary.keyMetrics.netIncome / 1000000).toFixed(2)}M
- Liquid Cash: $${(report.executiveSummary.keyMetrics.liquidityCash / 1000000).toFixed(2)}M

KEY OBSERVATIONS
${report.keyObservations.map((obs) => `- ${obs.title} (${obs.severity}): ${obs.description}`).join("\n")}

STRATEGIC RECOMMENDATIONS
${report.recommendations
  .map(
    (rec) => `
- ${rec.title} (${rec.priority} priority)
  Description: ${rec.description}
  Estimated Impact: $${(rec.estimatedImpact / 1000).toFixed(0)}K
  Timeframe: ${rec.timeframe}
`,
  )
  .join("\n")}

RISK ALERTS
${report.riskAlerts.map((risk) => `- ${risk.riskName} (${risk.severity}): ${risk.description}`).join("\n")}

STRATEGIC SCENARIOS
${report.strategicScenarios
  .map(
    (scenario) => `
${scenario.name.toUpperCase()} (${scenario.probability}% probability)
Revenue: $${(scenario.projections.revenue / 1000000).toFixed(2)}M
Net Income: $${(scenario.projections.netIncome / 1000000).toFixed(2)}M
Profit Margin: ${scenario.projections.profitMargin.toFixed(1)}%
`,
  )
  .join("\n")}

STRATEGIC ROADMAP
${report.strategicRoadmap
  .map(
    (phase) => `
${phase.timeframe}:
Objectives: ${phase.objectives.join("; ")}
Expected Outcomes: ${(Array.isArray(phase.expectedOutcomes) ? phase.expectedOutcomes : [phase.expectedOutcomes]).join("; ")}
`,
  )
  .join("\n")}`;
}
