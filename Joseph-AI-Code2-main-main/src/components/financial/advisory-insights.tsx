import React, { useState } from "react";
import { AdvisoryInsight, BudgetForecast, CashFlowProjection, PerformanceDriver, RiskAssessment } from "../../lib/financial-advisory-data";
import { generateInsightsReport, GeneratedInsightReport } from "../../lib/ai-insights-engine";
import { InsightsLoadingDialog } from "./insights-loading-dialog";
import { InsightsReportPanel } from "./insights-report-panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Shield,
  DollarSign,
  Target,
  Zap,
  BarChart3,
  CheckCircle,
  Clock,
  Eye,
  X,
} from "lucide-react";

interface AdvisoryInsightsProps {
  advisoryInsights: AdvisoryInsight[];
  onUpdateInsightStatus: (
    id: string,
    status: AdvisoryInsight["status"],
  ) => void;
  budgets?: BudgetForecast[];
  cashFlows?: CashFlowProjection[];
  drivers?: PerformanceDriver[];
  risks?: RiskAssessment[];
}

export function AdvisoryInsights({
  advisoryInsights,
  onUpdateInsightStatus,
  budgets = [],
  cashFlows = [],
  drivers = [],
  risks = [],
}: AdvisoryInsightsProps) {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<GeneratedInsightReport | null>(null);
  const [showReportPanel, setShowReportPanel] = useState(false);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);

    // Simulate processing time (2-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate the insights report
    const report = generateInsightsReport(budgets, cashFlows, drivers, risks);
    setGeneratedReport(report);
    setShowReportPanel(true);
    setIsGenerating(false);
  };

  const filteredInsights = advisoryInsights.filter((insight) => {
    if (selectedType !== "all" && insight.type !== selectedType) return false;
    if (selectedPriority !== "all" && insight.priority !== selectedPriority)
      return false;
    if (selectedCategory !== "all" && insight.category !== selectedCategory)
      return false;
    return true;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "recommendation":
        return <Lightbulb className="h-4 w-4" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4" />;
      case "opportunity":
        return <TrendingUp className="h-4 w-4" />;
      case "risk":
        return <Shield className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "recommendation":
        return "bg-blue-100 text-blue-800";
      case "alert":
        return "bg-red-100 text-red-800";
      case "opportunity":
        return "bg-green-100 text-green-800";
      case "risk":
        return "bg-yellow-100 text-yellow-800";
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "investment":
        return "bg-purple-100 text-purple-800";
      case "cost_optimization":
        return "bg-orange-100 text-orange-800";
      case "revenue_growth":
        return "bg-green-100 text-green-800";
      case "risk_management":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Zap className="h-4 w-4" />;
      case "reviewed":
        return <Eye className="h-4 w-4" />;
      case "implemented":
        return <CheckCircle className="h-4 w-4" />;
      case "dismissed":
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "reviewed":
        return "bg-yellow-100 text-yellow-800";
      case "implemented":
        return "bg-green-100 text-green-800";
      case "dismissed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const totalPotentialImpact = filteredInsights
    .filter((insight) => insight.status !== "dismissed")
    .reduce((sum, insight) => sum + insight.financialImpact.estimated, 0);

  const highPriorityCount = filteredInsights.filter(
    (insight) => insight.priority === "high",
  ).length;
  const implementedCount = filteredInsights.filter(
    (insight) => insight.status === "implemented",
  ).length;

  return (
    <TooltipProvider>
      <InsightsLoadingDialog isOpen={isGenerating} />
      <InsightsReportPanel report={generatedReport} onClose={() => setShowReportPanel(false)} />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Decision Support & Advisory Insights
            </h2>
            <p className="text-gray-600">
              AI-driven recommendations and strategic guidance
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="recommendation">Recommendation</SelectItem>
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="opportunity">Opportunity</SelectItem>
                <SelectItem value="risk">Risk</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedPriority}
              onValueChange={setSelectedPriority}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleGenerateInsights}>
                  Generate Insights
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate AI-powered insights and recommendations</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Insights Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Insights
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredInsights.length}
                  </p>
                </div>
                <Lightbulb className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    High Priority
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {highPriorityCount}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Potential Impact
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalPotentialImpact)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Implemented
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {implementedCount}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advisory Insights Table */}
        <Card>
          <CardHeader>
            <CardTitle>Strategic Advisory Insights</CardTitle>
            <CardDescription>
              AI-powered recommendations with financial impact analysis and
              confidence scoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(insight.type)}
                      <h4 className="font-medium text-gray-900">
                        {insight.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(insight.priority)}>
                        {insight.priority}
                      </Badge>
                      <Badge className={getTypeColor(insight.type)}>
                        {insight.type}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {insight.description}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <span className="text-xs text-gray-500">
                        Financial Impact
                      </span>
                      <div className="font-medium text-green-600">
                        {formatCurrency(insight.financialImpact.estimated)}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Timeframe</span>
                      <div className="font-medium">
                        {insight.financialImpact.timeframe}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Confidence</span>
                      <div
                        className={`font-medium ${getConfidenceColor(insight.financialImpact.confidence)}`}
                      >
                        {insight.financialImpact.confidence}%
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(insight.status)}
                      <Badge className={getStatusColor(insight.status)}>
                        {insight.status}
                      </Badge>
                    </div>
                    <Select
                      value={insight.status}
                      onValueChange={(status) =>
                        onUpdateInsightStatus(
                          insight.id,
                          status as AdvisoryInsight["status"],
                        )
                      }
                    >
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="implemented">Implemented</SelectItem>
                        <SelectItem value="dismissed">Dismissed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
