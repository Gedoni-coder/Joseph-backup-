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
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Activity,
  Globe,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface IndicatorData {
  name: string;
  value: number;
  previousValue: number;
  change: number;
  trend: "up" | "down" | "stable";
  icon: React.ReactNode;
  status: "good" | "warning" | "critical";
}

interface SectorDynamics {
  sector: string;
  demandPressure: number;
  supplyGap: number;
  marketEquilibrium: number;
  seasonalTrend: string;
  competitorMovement: number;
  fragmentationScore: number;
}

interface ForecastData {
  period: string;
  value: number;
  opportunity: number;
  risk: number;
  confidence: number;
}

export function EconomicPulseboard() {
  const [activeTab, setActiveTab] = useState("indicators");
  const [refreshing, setRefreshing] = useState(false);

  const liveIndicators: IndicatorData[] = [
    {
      name: "Inflation (CPI)",
      value: 28.5,
      previousValue: 27.2,
      change: 4.8,
      trend: "up",
      icon: <TrendingUp className="h-4 w-4" />,
      status: "warning",
    },
    {
      name: "Exchange Rate",
      value: 1240,
      previousValue: 1180,
      change: 5.1,
      trend: "up",
      icon: <Globe className="h-4 w-4" />,
      status: "critical",
    },
    {
      name: "Unemployment Rate",
      value: 4.2,
      previousValue: 4.5,
      change: -6.7,
      trend: "down",
      icon: <TrendingDown className="h-4 w-4" />,
      status: "good",
    },
    {
      name: "Consumer Spending",
      value: 2350000000000,
      previousValue: 2280000000000,
      change: 3.1,
      trend: "up",
      icon: <DollarSign className="h-4 w-4" />,
      status: "good",
    },
    {
      name: "Purchasing Power",
      value: 85.3,
      previousValue: 89.2,
      change: -4.4,
      trend: "down",
      icon: <Activity className="h-4 w-4" />,
      status: "warning",
    },
    {
      name: "Interest Rate",
      value: 18.5,
      previousValue: 16.0,
      change: 15.6,
      trend: "up",
      icon: <Percent className="h-4 w-4" />,
      status: "critical",
    },
  ];

  const importExportData = [
    { month: "Jan", imports: 45, exports: 38 },
    { month: "Feb", imports: 52, exports: 41 },
    { month: "Mar", imports: 48, exports: 45 },
    { month: "Apr", imports: 61, exports: 52 },
    { month: "May", imports: 55, exports: 48 },
    { month: "Jun", imports: 67, exports: 56 },
  ];

  const sectorMetrics: SectorDynamics[] = [
    {
      sector: "Manufacturing",
      demandPressure: 72,
      supplyGap: 35,
      marketEquilibrium: 58,
      seasonalTrend: "Increasing",
      competitorMovement: 15,
      fragmentationScore: 42,
    },
    {
      sector: "Agriculture",
      demandPressure: 65,
      supplyGap: 28,
      marketEquilibrium: 52,
      seasonalTrend: "Seasonal Peak",
      competitorMovement: 12,
      fragmentationScore: 38,
    },
    {
      sector: "Technology",
      demandPressure: 88,
      supplyGap: 45,
      marketEquilibrium: 71,
      seasonalTrend: "Rising",
      competitorMovement: 22,
      fragmentationScore: 55,
    },
    {
      sector: "Retail",
      demandPressure: 58,
      supplyGap: 20,
      marketEquilibrium: 48,
      seasonalTrend: "Stable",
      competitorMovement: 18,
      fragmentationScore: 65,
    },
    {
      sector: "Energy",
      demandPressure: 76,
      supplyGap: 42,
      marketEquilibrium: 62,
      seasonalTrend: "Stable High",
      competitorMovement: 8,
      fragmentationScore: 28,
    },
  ];

  const forecastData: ForecastData[] = [
    {
      period: "Q1 2024",
      value: 4.2,
      opportunity: 2.1,
      risk: 1.8,
      confidence: 92,
    },
    {
      period: "Q2 2024",
      value: 4.5,
      opportunity: 2.4,
      risk: 2.1,
      confidence: 88,
    },
    {
      period: "Q3 2024",
      value: 4.8,
      opportunity: 2.6,
      risk: 2.4,
      confidence: 85,
    },
    {
      period: "Q4 2024",
      value: 5.1,
      opportunity: 2.8,
      risk: 2.7,
      confidence: 82,
    },
  ];

  const sectorPerformance = [
    { name: "Tech", value: 35, color: "#3b82f6" },
    { name: "Manufacturing", value: 28, color: "#8b5cf6" },
    { name: "Agriculture", value: 18, color: "#10b981" },
    { name: "Retail", value: 12, color: "#f59e0b" },
    { name: "Energy", value: 7, color: "#ef4444" },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800 border-green-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-50";
      case "warning":
        return "bg-yellow-50";
      case "critical":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Economic Pulseboard</h2>
          <p className="text-muted-foreground">
            Real-time economic indicators and sector dynamics
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 sm:grid-cols-8 gap-2 w-full rounded-md bg-muted p-1 text-muted-foreground">
          <TabsList className="contents">
            <TabsTrigger
              value="indicators"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-3"
            >
              Indicators
            </TabsTrigger>
            <TabsTrigger
              value="sector"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-3"
            >
              Sector
            </TabsTrigger>
            <TabsTrigger
              value="forecast"
              className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm px-2 sm:px-3"
            >
              Forecast
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Live Indicators Tab */}
        <TabsContent value="indicators" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {liveIndicators.map((indicator) => (
              <Card
                key={indicator.name}
                className={getStatusBg(indicator.status)}
              >
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        {indicator.name}
                      </p>
                      <div
                        className={`p-2 rounded ${getStatusBg(indicator.status)}`}
                      >
                        {indicator.icon}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-2xl font-bold">
                        {indicator.value.toLocaleString()}
                        {indicator.name.includes("Rate")
                          ? "%"
                          : indicator.name.includes("Exchange")
                            ? "₦/$"
                            : indicator.name === "Consumer Spending"
                              ? "₦"
                              : ""}
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant="outline"
                          className={
                            indicator.change > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {indicator.change > 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownLeft className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(indicator.change).toFixed(1)}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          vs previous period
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Previous Value
                      </p>
                      <p className="text-sm font-semibold">
                        {indicator.previousValue.toLocaleString()}
                      </p>
                    </div>

                    <Badge className={getStatusColor(indicator.status)}>
                      {indicator.status === "good"
                        ? "✓ Favorable"
                        : indicator.status === "warning"
                          ? "⚠ Watch"
                          : "✗ Critical"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Import/Export Balance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Import/Export Balance</CardTitle>
              <CardDescription>
                Trend analysis of trade flows (in billions)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={importExportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="imports" fill="#8b5cf6" name="Imports" />
                  <Bar dataKey="exports" fill="#10b981" name="Exports" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sector Dynamics Tab */}
        <TabsContent value="sector" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Industry Demand–Supply Modeling</CardTitle>
              <CardDescription>
                Analyze market conditions for key sectors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectorMetrics.map((sector) => (
                  <div
                    key={sector.sector}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-lg">{sector.sector}</h4>
                      <Badge variant="outline">{sector.seasonalTrend}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Demand Pressure
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                sector.demandPressure > 70
                                  ? "bg-red-500"
                                  : sector.demandPressure > 50
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${sector.demandPressure}%`,
                              }}
                            />
                          </div>
                          <span className="font-semibold text-sm">
                            {sector.demandPressure}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Supply Shortage Gap
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                sector.supplyGap > 40
                                  ? "bg-orange-500"
                                  : sector.supplyGap > 20
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${sector.supplyGap}%`,
                              }}
                            />
                          </div>
                          <span className="font-semibold text-sm">
                            {sector.supplyGap}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Market Equilibrium
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                sector.marketEquilibrium > 70
                                  ? "bg-green-500"
                                  : sector.marketEquilibrium > 50
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              style={{
                                width: `${sector.marketEquilibrium}%`,
                              }}
                            />
                          </div>
                          <span className="font-semibold text-sm">
                            {sector.marketEquilibrium}
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Competitor Activity
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{
                                width: `${sector.competitorMovement}%`,
                              }}
                            />
                          </div>
                          <span className="font-semibold text-sm">
                            {sector.competitorMovement}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Market Fragility
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                sector.fragmentationScore > 60
                                  ? "bg-red-500"
                                  : sector.fragmentationScore > 40
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${sector.fragmentationScore}%`,
                              }}
                            />
                          </div>
                          <span className="font-semibold text-sm">
                            {sector.fragmentationScore}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-2 rounded text-sm">
                      <p className="text-muted-foreground">
                        <strong>Insight:</strong>{" "}
                        {sector.demandPressure > 70
                          ? "High demand opportunity - consider market expansion"
                          : sector.demandPressure > 50
                            ? "Moderate demand - stable growth potential"
                            : "Low demand - focus on efficiency"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sector Performance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Sector Performance Distribution</CardTitle>
              <CardDescription>Growth rate by industry</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sectorPerformance}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} ${entry.value}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sectorPerformance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sectoral Forecast Tab */}
        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sectoral Impact Forecast</CardTitle>
              <CardDescription>
                12-month macroeconomic impact projections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Forecast Chart */}
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Baseline Growth"
                    />
                    <Line
                      type="monotone"
                      dataKey="opportunity"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Opportunity Potential"
                    />
                    <Line
                      type="monotone"
                      dataKey="risk"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Risk Exposure"
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Forecast Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Quarterly Outlook</h4>
                  {forecastData.map((item) => (
                    <Card key={item.period} className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold">{item.period}</p>
                          <Badge variant="outline">
                            {item.confidence}% confidence
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Growth</p>
                            <p className="font-semibold text-blue-600">
                              {item.value.toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Opportunity</p>
                            <p className="font-semibold text-green-600">
                              {item.opportunity.toFixed(1)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Risk</p>
                            <p className="font-semibold text-red-600">
                              {item.risk.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Key Insights */}
                <Card className="border-l-4 border-l-blue-500 bg-blue-50">
                  <CardContent className="pt-4">
                    <div className="flex gap-3">
                      <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="font-semibold text-blue-900">
                          Business Viability Over Next 12 Months
                        </p>
                        <ul className="text-sm text-blue-900 space-y-1">
                          <li>
                            • <strong>Q1-Q2:</strong> Moderate growth expected
                            with manageable risks
                          </li>
                          <li>
                            • <strong>Q3-Q4:</strong> Increased opportunities
                            due to seasonal demand
                          </li>
                          <li>
                            • <strong>Risk Mitigation:</strong> Monitor exchange
                            rates and policy changes
                          </li>
                          <li>
                            • <strong>Recommendation:</strong> Build operational
                            resilience and diversify revenue streams
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
