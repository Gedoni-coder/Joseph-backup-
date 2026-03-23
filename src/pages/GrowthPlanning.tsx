import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ModuleHeader from "@/components/ui/module-header";
import { useGrowthPlanningAPI } from "@/hooks/useGrowthPlanningAPI";
import {
  Target,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart3,
  Zap,
  Brain,
  Play,
  ArrowUp,
  ArrowDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Settings,
} from "lucide-react";

const formatMillions = (value: number): string => {
  if (!Number.isFinite(value)) {
    return "N/A";
  }
  return `${value.toFixed(2)}M`;
};

const GrowthPlanning = () => {
  const [selectedScenario, setSelectedScenario] = useState("");
  const [acquisitionCost, setAcquisitionCost] = useState(150);
  const [marketingSpend, setMarketingSpend] = useState(50000);
  const [pricingStrategy, setPricingStrategy] = useState(99);

  const {
    metrics,
    levers,
    scenarios,
    roadmapItems,
    insights,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
  } = useGrowthPlanningAPI();

  useEffect(() => {
    if (scenarios.length === 0) {
      return;
    }
    if (!selectedScenario || !scenarios.some((scenario) => scenario.key === selectedScenario)) {
      setSelectedScenario(scenarios[0].key);
    }
  }, [scenarios, selectedScenario]);

  const currentGrowth = metrics.find((metric) => metric.id === "current-growth")?.value;
  const targetGrowth = metrics.find((metric) => metric.id === "target-growth")?.value;
  const revenueTarget = metrics.find((metric) => metric.id === "revenue-target")?.value;

  const selectedScenarioData = useMemo(
    () => scenarios.find((scenario) => scenario.key === selectedScenario),
    [scenarios, selectedScenario],
  );

  const calculateImpact = (): string => {
    if (!selectedScenarioData) {
      return "N/A";
    }

    const scenarioWeight = 1 + selectedScenarioData.probability / 1000;
    const adjustmentFactor =
      1 +
      acquisitionCost / 10000 +
      marketingSpend / 10000000 +
      pricingStrategy / 1000;

    const projectedRevenue =
      (selectedScenarioData.annualRevenue * scenarioWeight * adjustmentFactor) /
      1_000_000;
    return `${projectedRevenue.toFixed(2)}M`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Planning":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: "up" | "down") => {
    if (trend === "up") {
      return <ArrowUp className="h-3 w-3 text-green-600" />;
    }
    if (trend === "down") {
      return <ArrowDown className="h-3 w-3 text-red-600" />;
    }
    return <Minus className="h-3 w-3 text-gray-600" />;
  };

  const getInsightIcon = (kind: "opportunity" | "risk" | "tip") => {
    if (kind === "opportunity") {
      return <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />;
    }
    if (kind === "risk") {
      return <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ModuleHeader
        icon={<Target className="h-6 w-6" />}
        title="Growth Planning Dashboard"
        description="Strategic growth planning with AI-powered insights and scenario modeling"
        isConnected={isConnected}
        lastUpdated={lastUpdated ?? undefined}
        onReconnect={refreshData}
        error={error}
        connectionLabel="Live"
      />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 text-sm text-red-700">{error}</CardContent>
          </Card>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Growth</p>
                  <p className="text-3xl font-bold text-green-600">
                    {currentGrowth !== undefined ? `${currentGrowth.toFixed(2)}%` : "N/A"}
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
                    {targetGrowth !== undefined ? `${targetGrowth.toFixed(2)}%` : "N/A"}
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
                  <p className="text-sm text-muted-foreground">Revenue Target</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {revenueTarget !== undefined ? `$${formatMillions(revenueTarget)}` : "N/A"}
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
                    {roadmapItems.length > 0 ? `${roadmapItems.length} milestones` : "N/A"}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Growth Levers Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading growth levers...</div>
                ) : levers.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No growth lever data is available yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {levers.map((lever) => {
                      const progress =
                        lever.target > 0
                          ? Math.max(0, Math.min(100, Math.round((lever.current / lever.target) * 100)))
                          : 0;

                      return (
                        <Card key={lever.name} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm">{lever.name}</h4>
                              <div className="flex items-center gap-1">
                                {getTrendIcon(lever.trend)}
                                <Badge className={`${lever.bgColor} ${lever.color}`}>{lever.impact}</Badge>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>
                                  Current: {lever.current}
                                  {lever.unit}
                                </span>
                                <span>
                                  Target: {lever.target}
                                  {lever.unit}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-muted-foreground">Progress: {progress}%</div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Growth Forecast - Projected vs Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                {scenarios.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No scenario snapshots are available yet.
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex gap-2 flex-wrap">
                      {scenarios.map((scenario) => (
                        <button
                          key={scenario.key}
                          onClick={() => setSelectedScenario(scenario.key)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            selectedScenario === scenario.key
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {scenario.label}
                        </button>
                      ))}
                    </div>

                    {selectedScenarioData ? (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedScenarioData.growthRate.toFixed(2)}%
                          </div>
                          <div className="text-sm text-muted-foreground">Growth Rate</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            ${formatMillions(selectedScenarioData.annualRevenue / 1_000_000)}
                          </div>
                          <div className="text-sm text-muted-foreground">Revenue</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedScenarioData.probability}%
                          </div>
                          <div className="text-sm text-muted-foreground">Probability</div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Strategy Roadmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                {roadmapItems.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No roadmap action items are available yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {roadmapItems.map((item) => (
                      <div
                        key={`${item.timeline}-${item.milestone}`}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex-shrink-0 text-center">
                          <div className="text-sm font-medium">{item.timeline}</div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{item.milestone}</h4>
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>

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
                            <Badge variant="outline" className="text-xs mt-2">
                              Priority: {item.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Scenario Planning Tool
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Customer Acquisition Cost</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="50"
                      max="300"
                      value={acquisitionCost}
                      onChange={(e) => setAcquisitionCost(parseInt(e.target.value, 10))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">${acquisitionCost}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Marketing Spend</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="10000"
                      max="100000"
                      step="5000"
                      value={marketingSpend}
                      onChange={(e) => setMarketingSpend(parseInt(e.target.value, 10))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-16">${marketingSpend / 1000}K</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Pricing Strategy</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="49"
                      max="199"
                      value={pricingStrategy}
                      onChange={(e) => setPricingStrategy(parseInt(e.target.value, 10))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">${pricingStrategy}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Projected Revenue</div>
                    <div className="text-2xl font-bold text-green-600">${calculateImpact()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Joseph AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.length === 0 ? (
                  <div className="p-3 bg-white rounded-lg border text-sm text-muted-foreground">
                    No insights are available yet. Add assumptions, risks, and scenarios to populate this panel.
                  </div>
                ) : (
                  insights.map((insight) => (
                    <div key={`${insight.kind}-${insight.title}`} className="p-3 bg-white rounded-lg border">
                      <div className="flex items-start gap-2">
                        {getInsightIcon(insight.kind)}
                        <div className="text-sm">
                          <p className="font-medium mb-1">{insight.title}</p>
                          <p className="text-muted-foreground">{insight.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                <div className="space-y-2">
                  <Button className="w-full" size="sm" disabled={scenarios.length === 0}>
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
