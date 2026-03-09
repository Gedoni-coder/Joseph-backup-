import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import {
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  AlertTriangle,
  TrendingDown,
  DollarSign,
  Users,
  Zap,
  Shield,
  RefreshCw,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
} from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  type: string;
  description: string;
  probability: number;
}

interface SimulationResult {
  scenario: string;
  revenueImpact: number;
  demandChange: number;
  costImpact: number;
  pricingReaction: number;
  employmentChange: number;
}

interface RiskMetric {
  category: string;
  vulnerability: number;
  exposure: number;
  threat: number;
  fragility: number;
}

export function ScenarioSimulation() {
  const [activeTab, setActiveTab] = useState("simulator");
  const [selectedScenario, setSelectedScenario] =
    useState<string>("tax-policy");
  const [simulationResults, setSimulationResults] = useState<
    SimulationResult[]
  >([]);
  const [showResults, setShowResults] = useState(false);

  const scenarios: Scenario[] = [
    {
      id: "tax-policy",
      name: "New Tax Policy Implementation",
      type: "fiscal",
      description:
        "Government introduces 5% additional tax on corporate income",
      probability: 75,
    },
    {
      id: "interest-rate",
      name: "Interest Rate Hike",
      type: "monetary",
      description: "Central Bank increases benchmark rate by 2%",
      probability: 60,
    },
    {
      id: "currency",
      name: "Currency Devaluation",
      type: "economic",
      description: "Local currency depreciates 15% against USD",
      probability: 45,
    },
    {
      id: "supply-chain",
      name: "Supply Chain Disruption",
      type: "operational",
      description: "Major supplier unable to fulfill orders for 3 months",
      probability: 30,
    },
    {
      id: "policy-ban",
      name: "Policy Ban or Deregulation",
      type: "regulatory",
      description: "Industry-specific ban or removal of protective policies",
      probability: 35,
    },
    {
      id: "import-restriction",
      name: "Import Restrictions",
      type: "trade",
      description: "Government imposes 40% tariffs on imported goods",
      probability: 55,
    },
    {
      id: "wage-policy",
      name: "Minimum Wage Policy",
      type: "labor",
      description: "Minimum wage increased by 25%",
      probability: 65,
    },
  ];

  const riskMetrics: RiskMetric[] = [
    {
      category: "Operational Risk",
      vulnerability: 65,
      exposure: 72,
      threat: 58,
      fragility: 45,
    },
    {
      category: "Financial Risk",
      vulnerability: 78,
      exposure: 85,
      threat: 72,
      fragility: 68,
    },
    {
      category: "Market Risk",
      vulnerability: 55,
      exposure: 62,
      threat: 48,
      fragility: 52,
    },
    {
      category: "Supply Chain Risk",
      vulnerability: 72,
      exposure: 68,
      threat: 65,
      fragility: 70,
    },
    {
      category: "Regulatory Risk",
      vulnerability: 48,
      exposure: 55,
      threat: 42,
      fragility: 38,
    },
  ];

  const shockAbsorptionScores = [
    { shock: "Policy Shock", score: 62, category: "Regulatory" },
    { shock: "Market Crash", score: 45, category: "Financial" },
    { shock: "Inflation Wave", score: 52, category: "Economic" },
    { shock: "Exchange Rate", score: 38, category: "Monetary" },
    { shock: "Sector Disruption", score: 55, category: "Operational" },
  ];

  const handleSimulate = () => {
    const selected = scenarios.find((s) => s.id === selectedScenario);
    if (!selected) return;

    const results: SimulationResult[] = [
      {
        scenario: "Conservative Impact",
        revenueImpact: -8,
        demandChange: -5,
        costImpact: 12,
        pricingReaction: 3,
        employmentChange: -2,
      },
      {
        scenario: "Moderate Impact",
        revenueImpact: -15,
        demandChange: -12,
        costImpact: 25,
        pricingReaction: 6,
        employmentChange: -5,
      },
      {
        scenario: "Severe Impact",
        revenueImpact: -28,
        demandChange: -25,
        costImpact: 45,
        pricingReaction: 12,
        employmentChange: -12,
      },
    ];

    setSimulationResults(results);
    setShowResults(true);
  };

  const getRiskColor = (value: number) => {
    if (value > 70) return "bg-red-100 border-red-300";
    if (value > 50) return "bg-yellow-100 border-yellow-300";
    return "bg-green-100 border-green-300";
  };

  const getRiskTextColor = (value: number) => {
    if (value > 70) return "text-red-600";
    if (value > 50) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 sm:grid-cols-8 gap-2 w-full rounded-md bg-muted p-1 text-muted-foreground">
          <TabsList className="contents">
            <TabsTrigger
              value="simulator"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-3"
            >
              What-If
            </TabsTrigger>
            <TabsTrigger
              value="heat-map"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-3"
            >
              Heat Map
            </TabsTrigger>
            <TabsTrigger
              value="absorption"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-3"
            >
              Absorption
            </TabsTrigger>
          </TabsList>
        </div>

        {/* What-If Simulator Tab */}
        <TabsContent value="simulator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>What-If Scenario Simulator</CardTitle>
              <CardDescription>
                Test policy and economic scenarios and see their impact on your
                business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Select Scenario
                  </label>
                  <Select
                    value={selectedScenario}
                    onValueChange={setSelectedScenario}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {scenarios.map((scenario) => (
                        <SelectItem key={scenario.id} value={scenario.id}>
                          {scenario.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    {scenarios.find((s) => s.id === selectedScenario) && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">
                          {
                            scenarios.find((s) => s.id === selectedScenario)
                              ?.name
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {
                            scenarios.find((s) => s.id === selectedScenario)
                              ?.description
                          }
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          <span className="text-xs text-muted-foreground">
                            Probability:
                          </span>
                          <Badge variant="outline">
                            {
                              scenarios.find((s) => s.id === selectedScenario)
                                ?.probability
                            }
                            %
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Simulation Parameters
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox id="revenue" defaultChecked />
                      <label
                        htmlFor="revenue"
                        className="text-sm cursor-pointer"
                      >
                        Include revenue impact
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="demand" defaultChecked />
                      <label
                        htmlFor="demand"
                        className="text-sm cursor-pointer"
                      >
                        Calculate demand changes
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="cost" defaultChecked />
                      <label htmlFor="cost" className="text-sm cursor-pointer">
                        Evaluate cost implications
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="pricing" defaultChecked />
                      <label
                        htmlFor="pricing"
                        className="text-sm cursor-pointer"
                      >
                        Assess pricing reactions
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="employment" defaultChecked />
                      <label
                        htmlFor="employment"
                        className="text-sm cursor-pointer"
                      >
                        Employment impact analysis
                      </label>
                    </div>
                  </div>

                  <Button onClick={handleSimulate} className="w-full mt-4">
                    <Zap className="h-4 w-4 mr-2" />
                    Run Simulation
                  </Button>
                </div>
              </div>

              {/* Simulation Results */}
              {showResults && simulationResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Simulation Results</h3>

                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={simulationResults}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="scenario" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="revenueImpact"
                        fill="#ef4444"
                        name="Revenue Impact %"
                      />
                      <Bar
                        dataKey="costImpact"
                        fill="#f97316"
                        name="Cost Impact %"
                      />
                      <Bar
                        dataKey="employmentChange"
                        fill="#8b5cf6"
                        name="Employment Change %"
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {simulationResults.map((result) => (
                      <Card
                        key={result.scenario}
                        className="border-l-4 border-l-orange-500"
                      >
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <p className="font-semibold text-center">
                              {result.scenario}
                            </p>

                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Revenue Impact
                                </p>
                                <p
                                  className={`text-lg font-bold ${
                                    result.revenueImpact < 0
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {result.revenueImpact}%
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Demand Change
                                </p>
                                <p className="text-lg font-bold text-orange-600">
                                  {result.demandChange}%
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Pricing Adjustment
                                </p>
                                <p className="text-lg font-bold text-blue-600">
                                  {result.pricingReaction > 0 ? "+" : ""}
                                  {result.pricingReaction}%
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Employment Change
                                </p>
                                <p
                                  className={`text-lg font-bold ${
                                    result.employmentChange < 0
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }`}
                                >
                                  {result.employmentChange}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <p className="text-sm text-blue-900">
                        <strong>Recommendation:</strong> The moderate impact
                        scenario is most likely. Begin contingency planning with
                        focus on cost optimization and customer retention
                        strategies.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Heat Map Tab */}
        <TabsContent value="heat-map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Heat Map</CardTitle>
              <CardDescription>
                Comprehensive view of business vulnerabilities and exposure
                points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {riskMetrics.map((metric) => (
                  <Card
                    key={metric.category}
                    className={`border-2 ${getRiskColor(metric.vulnerability)}`}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{metric.category}</h4>
                          <Badge
                            variant={
                              metric.vulnerability > 70
                                ? "destructive"
                                : metric.vulnerability > 50
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {metric.vulnerability > 70
                              ? "✗ High Risk"
                              : metric.vulnerability > 50
                                ? "⚠ Medium Risk"
                                : "✓ Low Risk"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Vulnerability
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  metric.vulnerability > 70
                                    ? "bg-red-500"
                                    : metric.vulnerability > 50
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                                style={{
                                  width: `${metric.vulnerability}%`,
                                }}
                              />
                            </div>
                            <p
                              className={`text-xs font-semibold mt-1 ${getRiskTextColor(metric.vulnerability)}`}
                            >
                              {metric.vulnerability}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Exposure
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  metric.exposure > 70
                                    ? "bg-red-500"
                                    : metric.exposure > 50
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                                style={{
                                  width: `${metric.exposure}%`,
                                }}
                              />
                            </div>
                            <p
                              className={`text-xs font-semibold mt-1 ${getRiskTextColor(metric.exposure)}`}
                            >
                              {metric.exposure}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Threat Level
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  metric.threat > 70
                                    ? "bg-red-500"
                                    : metric.threat > 50
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                                style={{
                                  width: `${metric.threat}%`,
                                }}
                              />
                            </div>
                            <p
                              className={`text-xs font-semibold mt-1 ${getRiskTextColor(metric.threat)}`}
                            >
                              {metric.threat}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Fragility
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  metric.fragility > 70
                                    ? "bg-red-500"
                                    : metric.fragility > 50
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                }`}
                                style={{
                                  width: `${metric.fragility}%`,
                                }}
                              />
                            </div>
                            <p
                              className={`text-xs font-semibold mt-1 ${getRiskTextColor(metric.fragility)}`}
                            >
                              {metric.fragility}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Risk Profile Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={riskMetrics}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Vulnerability"
                        dataKey="vulnerability"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Exposure"
                        dataKey="exposure"
                        stroke="#f97316"
                        fill="#f97316"
                        fillOpacity={0.4}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shock Absorption Tab */}
        <TabsContent value="absorption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shock Absorption Rating</CardTitle>
              <CardDescription>
                How well can your business survive major disruptions?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {shockAbsorptionScores.map((shock) => (
                  <Card
                    key={shock.shock}
                    className={`border-l-4 ${
                      shock.score > 70
                        ? "border-l-green-500 bg-green-50"
                        : shock.score > 50
                          ? "border-l-yellow-500 bg-yellow-50"
                          : "border-l-red-500 bg-red-50"
                    }`}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{shock.shock}</h4>
                          <p className="text-xs text-muted-foreground">
                            {shock.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">
                            {shock.score}
                          </div>
                          <p className="text-xs text-muted-foreground">/100</p>
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            shock.score > 70
                              ? "bg-green-500"
                              : shock.score > 50
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{
                            width: `${shock.score}%`,
                          }}
                        />
                      </div>

                      <p className="text-xs mt-2 text-muted-foreground">
                        {shock.score > 70
                          ? "✓ Well-equipped to handle this shock"
                          : shock.score > 50
                            ? "⚠ Moderate ability to absorb impact"
                            : "✗ Limited resilience to this shock"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Overall Assessment */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      Overall Resilience Assessment
                    </h4>
                    <p className="text-sm text-blue-900">
                      Your business has moderate shock absorption capacity.
                      Focus on:
                    </p>
                    <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
                      <li>Building cash reserves for unexpected costs</li>
                      <li>Diversifying supplier and customer base</li>
                      <li>
                        Developing contingency plans for high-impact scenarios
                      </li>
                      <li>Regular stress-testing of operations</li>
                      <li>Insurance coverage for key business interruptions</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Strengthening Resilience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">
                          Operational Redundancy
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Create backup suppliers and distribution channels
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">
                          Financial Cushion
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Maintain 3-6 months operating costs in reserves
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-sm">
                          Market Diversification
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expand to new geographies or customer segments
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
