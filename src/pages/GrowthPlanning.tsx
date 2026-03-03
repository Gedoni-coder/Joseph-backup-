import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModuleHeader from "@/components/ui/module-header";
import { useGrowthPlanningAPI } from "@/hooks/useGrowthPlanningAPI";
import {
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  Zap,
  Brain,
  Download,
  Settings,
  Play,
  Pause,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lightbulb,
  Sparkles,
} from "lucide-react";

const GrowthPlanning = () => {
  const [selectedScenario, setSelectedScenario] = useState("base");
  const [acquisitionCost, setAcquisitionCost] = useState(150);
  const [marketingSpend, setMarketingSpend] = useState(50000);
  const [pricingStrategy, setPricingStrategy] = useState(99);

  const { metrics, levers, isLoading, isConnected, lastUpdated, refreshData } =
    useGrowthPlanningAPI();

  // Overview Data
  const overviewMetrics = {
    currentGrowth: metrics.find((m) => m.id === "1")?.value || 15.2,
    targetGrowth: metrics.find((m) => m.id === "2")?.value || 25.0,
    revenueTarget: metrics.find((m) => m.id === "3")?.value || 13.7,
    timeHorizon: "12 months",
    lastUpdated: lastUpdated.toLocaleString(),
  };

  // Growth Levers Data - use from API hook
  const growthLevers = levers || [
    {
      name: "Sales Efficiency",
      current: 78,
      target: 85,
      impact: "High",
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Customer Retention",
      current: 82,
      target: 90,
      impact: "High",
      trend: "up",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Market Expansion",
      current: 45,
      target: 65,
      impact: "Medium",
      trend: "up",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Product Innovation",
      current: 63,
      target: 75,
      impact: "Medium",
      trend: "up",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      name: "Marketing ROI",
      current: 340,
      target: 450,
      impact: "High",
      trend: "up",
      color: "text-green-600",
      bgColor: "bg-green-100",
      unit: "%",
    },
    {
      name: "Operational Efficiency",
      current: 71,
      target: 80,
      impact: "Medium",
      trend: "stable",
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ];

  // Scenario Data
  const scenarios = {
    conservative: { growth: 18, revenue: 11.8, probability: 85 },
    base: { growth: 25, revenue: 13.7, probability: 70 },
    aggressive: { growth: 35, revenue: 16.2, probability: 45 },
  };

  // Strategy Roadmap
  const roadmapItems = [
    {
      quarter: "Q1 2024",
      milestone: "Customer Acquisition Campaign",
      progress: 85,
      status: "On Track",
      kpis: ["CAC Reduction", "Conversion Rate"],
    },
    {
      quarter: "Q2 2024",
      milestone: "Product Feature Expansion",
      progress: 60,
      status: "In Progress",
      kpis: ["Feature Adoption", "User Retention"],
    },
    {
      quarter: "Q3 2024",
      milestone: "Market Expansion Initiative",
      progress: 25,
      status: "Planning",
      kpis: ["Market Penetration", "Brand Awareness"],
    },
    {
      quarter: "Q4 2024",
      milestone: "Operational Optimization",
      progress: 10,
      status: "Planned",
      kpis: ["Cost Reduction", "Process Efficiency"],
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Planning":
        return "bg-orange-100 text-orange-800";
      case "Planned":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-3 w-3 text-green-600" />;
      case "down":
        return <ArrowDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  const calculateImpact = () => {
    const baseRevenue = 10000000;
    const impactMultiplier = {
      conservative:
        1 +
        acquisitionCost * 0.001 +
        marketingSpend * 0.000001 +
        pricingStrategy * 0.01,
      base:
        1 +
        acquisitionCost * 0.002 +
        marketingSpend * 0.000002 +
        pricingStrategy * 0.015,
      aggressive:
        1 +
        acquisitionCost * 0.003 +
        marketingSpend * 0.000003 +
        pricingStrategy * 0.02,
    };

    return (
      Math.round(
        ((baseRevenue * impactMultiplier[selectedScenario]) / 1000000) * 100,
      ) / 100
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<Target className="h-6 w-6" />}
        title="Growth Planning Dashboard"
        description="Strategic growth planning with AI-powered insights and scenario modeling"
        isConnected={isConnected}
        lastUpdated={lastUpdated}
        onReconnect={refreshData}
        connectionLabel="Live"
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Growth
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {overviewMetrics.currentGrowth}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Target Goal</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {overviewMetrics.targetGrowth}%
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Revenue Target
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${overviewMetrics.revenueTarget}M
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Time Horizon</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {overviewMetrics.timeHorizon}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Growth Levers Dashboard */}
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Growth Levers Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {growthLevers.map((lever, index) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">
                            {lever.name}
                          </h4>
                          <div className="flex items-center gap-1">
                            {getTrendIcon(lever.trend)}
                            <Badge
                              className={lever.bgColor + " " + lever.color}
                            >
                              {lever.impact}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>
                              Current: {lever.current}
                              {lever.unit || "%"}
                            </span>
                            <span>
                              Target: {lever.target}
                              {lever.unit || "%"}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                              style={{
                                width: `${(lever.current / lever.target) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Progress:{" "}
                            {Math.round((lever.current / lever.target) * 100)}%
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Growth Forecast - Projected vs Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Scenario Selector */}
                  <div className="flex gap-2">
                    {Object.entries(scenarios).map(([key, scenario]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedScenario(key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedScenario === key
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Scenario Details */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {scenarios[selectedScenario].growth}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Growth Rate
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        ${scenarios[selectedScenario].revenue}M
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Revenue
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {scenarios[selectedScenario].probability}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Probability
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategy Roadmap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Strategy Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {roadmapItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex-shrink-0 text-center">
                        <div className="text-sm font-medium">
                          {item.quarter}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{item.milestone}</h4>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {item.kpis.map((kpi, kpiIndex) => (
                              <Badge
                                key={kpiIndex}
                                variant="outline"
                                className="text-xs"
                              >
                                {kpi}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Scenario Planning Tool */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Scenario Planning Tool
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Customer Acquisition Cost
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={acquisitionCost}
                      onChange={(e) =>
                        setAcquisitionCost(parseInt(e.target.value))
                      }
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">
                      ${acquisitionCost}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Marketing Spend
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="10000"
                      max="100000"
                      step="5000"
                      value={marketingSpend}
                      onChange={(e) =>
                        setMarketingSpend(parseInt(e.target.value))
                      }
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-16">
                      ${marketingSpend / 1000}K
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Pricing Strategy
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="49"
                      max="199"
                      value={pricingStrategy}
                      onChange={(e) =>
                        setPricingStrategy(parseInt(e.target.value))
                      }
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">
                      ${pricingStrategy}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      Projected Revenue
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${calculateImpact()}M
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights Panel */}
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Joseph AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Growth Opportunity</p>
                      <p className="text-muted-foreground">
                        Your customer retention rate shows potential for 12%
                        improvement. Focus on loyalty programs.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Risk Alert</p>
                      <p className="text-muted-foreground">
                        Aggressive scenario has 45% probability. Consider risk
                        mitigation strategies.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-lg border">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Strategy Tip</p>
                      <p className="text-muted-foreground">
                        Market expansion timing is optimal. Economic indicators
                        support Q3 launch.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Run What-If Analysis
                  </Button>
                  <Link to="/ai-insights">
                    <Button variant="outline" className="w-full" size="sm">
                      <Brain className="h-4 w-4 mr-2" />
                      Chat with Joseph
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GrowthPlanning;
