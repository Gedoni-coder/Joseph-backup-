import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Target,
  Zap,
  FileText,
  Download,
} from "lucide-react";

interface BusinessDriver {
  id: string;
  name: string;
  category: "revenue" | "cost" | "efficiency" | "growth";
  currentValue: number;
  targetValue: number;
  unit: string;
  impact: "high" | "medium" | "low";
}

interface ForecastInputs {
  inputMode: "automatic" | "manual";
  historicalRevenue: number;
  historicalExpenses: number;
  currentYear: number;
  forecastPeriod: "monthly" | "quarterly";
  drivers: BusinessDriver[];
  plannedChanges: string[];
  dataSource?: string;
}

interface MonthlyForecast {
  month: string;
  monthNum: number;
  revenue: number;
  expenses: number;
  netIncome: number;
  variance: number;
  status: "on-track" | "warning" | "critical";
}

interface ForecastResult {
  monthly: MonthlyForecast[];
  driverImpacts: Array<{
    driver: string;
    impact: number;
    recommendation: string;
  }>;
  warnings: Array<{
    month: string;
    issue: string;
    severity: "high" | "medium" | "low";
  }>;
  opportunities: Array<{
    month: string;
    opportunity: string;
    impact: number;
  }>;
}

interface CreateForecastDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (forecast: any) => void;
}

const DEFAULT_DRIVERS: BusinessDriver[] = [
  {
    id: "revenue-growth",
    name: "Revenue Growth Rate",
    category: "growth",
    currentValue: 8,
    targetValue: 12,
    unit: "%",
    impact: "high",
  },
  {
    id: "customer-acquisition",
    name: "Customer Acquisition",
    category: "growth",
    currentValue: 15,
    targetValue: 25,
    unit: "customers/month",
    impact: "high",
  },
  {
    id: "avg-transaction",
    name: "Average Transaction Value",
    category: "revenue",
    currentValue: 450,
    targetValue: 520,
    unit: "$",
    impact: "medium",
  },
  {
    id: "operating-cost-ratio",
    name: "Operating Cost Ratio",
    category: "cost",
    currentValue: 65,
    targetValue: 58,
    unit: "%",
    impact: "high",
  },
  {
    id: "marketing-spend",
    name: "Marketing Spend Efficiency",
    category: "efficiency",
    currentValue: 3.2,
    targetValue: 4.5,
    unit: "ROI",
    impact: "medium",
  },
];

const SAMPLE_DATA_SOURCE = {
  historicalRevenue: 2400000,
  historicalExpenses: 1560000,
  trend: "Imported from QuickBooks",
  automationNote: "AI detected 8% seasonal pattern and 12% YoY growth trend",
};

function generateForecast(inputs: ForecastInputs): ForecastResult {
  const monthly: MonthlyForecast[] = [];
  let baseRevenue = inputs.historicalRevenue / 12;
  let baseExpenses = inputs.historicalExpenses / 12;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Calculate driver impacts
  const driverImpacts = inputs.drivers
    .filter((d) => d.targetValue !== d.currentValue)
    .map((driver) => {
      const change =
        ((driver.targetValue - driver.currentValue) / driver.currentValue) *
        100;
      let recommendation = "";

      if (driver.category === "revenue") {
        if (change > 0) {
          recommendation = `Increase ${driver.name} to boost revenue growth`;
        } else {
          recommendation = `Monitor ${driver.name} decline`;
        }
      } else if (driver.category === "cost") {
        if (change < 0) {
          recommendation = `Implement cost reduction in ${driver.name}`;
        } else {
          recommendation = `Manage ${driver.name} increase`;
        }
      }

      return {
        driver: driver.name,
        impact: change,
        recommendation,
      };
    });

  // Generate 12-month forecast
  for (let month = 0; month < 12; month++) {
    let monthRevenue = baseRevenue;
    let monthExpenses = baseExpenses;

    // Apply seasonal pattern
    const seasonalFactor = 1 + Math.sin((month / 12) * Math.PI) * 0.15;
    monthRevenue *= seasonalFactor;

    // Apply driver impacts
    inputs.drivers.forEach((driver) => {
      if (driver.category === "revenue") {
        const impact =
          ((driver.targetValue - driver.currentValue) / driver.currentValue) *
          0.5;
        monthRevenue *= 1 + impact;
      } else if (driver.category === "growth") {
        const growthImpact =
          (driver.targetValue - driver.currentValue) * (month / 12) * 0.001;
        monthRevenue *= 1 + growthImpact;
      } else if (driver.category === "cost") {
        const costImpact =
          ((driver.targetValue - driver.currentValue) / driver.currentValue) *
          0.5;
        monthExpenses *= 1 + costImpact;
      }
    });

    // Add variance
    const variance = (Math.random() - 0.5) * 4;

    const netIncome = monthRevenue - monthExpenses;
    let status: "on-track" | "warning" | "critical" = "on-track";
    if (netIncome < 0) {
      status = "critical";
    } else if (netIncome < baseRevenue * 0.2) {
      status = "warning";
    }

    monthly.push({
      month: months[month],
      monthNum: month + 1,
      revenue: Math.round(monthRevenue),
      expenses: Math.round(monthExpenses),
      netIncome: Math.round(netIncome),
      variance: parseFloat(variance.toFixed(1)),
      status,
    });
  }

  // Generate warnings
  const warnings = monthly
    .filter((m) => m.status !== "on-track")
    .map((m) => ({
      month: m.month,
      issue:
        m.status === "critical"
          ? "Operating costs will exceed revenue"
          : "Net income falls below 20% of revenue threshold",
      severity: m.status === "critical" ? "high" : "medium",
    }));

  // Generate opportunities
  const opportunities = [
    {
      month: "Q2",
      opportunity: "Increase marketing spend during peak season",
      impact: 180000,
    },
    {
      month: "Q3",
      opportunity: "Shift hiring to meet cash targets",
      impact: 240000,
    },
    {
      month: "Q4",
      opportunity: "Launch new revenue stream for year-end push",
      impact: 320000,
    },
  ];

  return {
    monthly,
    driverImpacts,
    warnings,
    opportunities,
  };
}

export function CreateForecastDialog({
  open,
  onOpenChange,
  onSave,
}: CreateForecastDialogProps) {
  const [step, setStep] = useState<"mode" | "inputs" | "results">("mode");
  const [inputMode, setInputMode] = useState<"automatic" | "manual">(
    "automatic",
  );
  const [inputs, setInputs] = useState<ForecastInputs>({
    inputMode: "automatic",
    historicalRevenue: SAMPLE_DATA_SOURCE.historicalRevenue,
    historicalExpenses: SAMPLE_DATA_SOURCE.historicalExpenses,
    currentYear: new Date().getFullYear(),
    forecastPeriod: "monthly",
    drivers: DEFAULT_DRIVERS,
    plannedChanges: [
      "New product launch in Q2",
      "Team expansion in Q3",
      "Marketing campaign increase",
    ],
    dataSource: SAMPLE_DATA_SOURCE.trend,
  });

  const forecast = generateForecast(inputs);

  const handleModeSelect = (mode: "automatic" | "manual") => {
    setInputMode(mode);
    setInputs((prev) => ({
      ...prev,
      inputMode: mode,
    }));
    setStep("inputs");
  };

  const handleInputChange = (field: keyof ForecastInputs, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDriverChange = (
    driverId: string,
    field: string,
    value: number,
  ) => {
    setInputs((prev) => ({
      ...prev,
      drivers: prev.drivers.map((d) =>
        d.id === driverId ? { ...d, [field]: value } : d,
      ),
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        inputs,
        forecast,
      });
    }
    onOpenChange(false);
    setStep("mode");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = forecast.monthly.reduce((sum, m) => sum + m.revenue, 0);
  const totalExpenses = forecast.monthly.reduce(
    (sum, m) => sum + m.expenses,
    0,
  );
  const totalNetIncome = totalRevenue - totalExpenses;
  const criticalMonths = forecast.monthly.filter(
    (m) => m.status === "critical",
  ).length;

  // MODE SELECTION STEP
  if (step === "mode") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Rolling Forecast</DialogTitle>
            <DialogDescription>
              Choose how you'd like to build your AI-driven forecast
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
            {/* Automatic Input Option */}
            <div
              onClick={() => handleModeSelect("automatic")}
              className="p-6 rounded-lg border-2 border-gray-200 hover:border-blue-500 cursor-pointer transition"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Automatic Input (Recommended)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Joseph AI will automatically pull your historical data and
                    detect business drivers
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      Historical revenue & expense data
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      Auto-detect seasonal patterns
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      Identify business drivers
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      AI-powered predictions
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Manual Input Option */}
            <div
              onClick={() => handleModeSelect("manual")}
              className="p-6 rounded-lg border-2 border-gray-200 hover:border-green-500 cursor-pointer transition"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Manual Input
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    You provide data and decide business drivers manually
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                      Manual data entry
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                      Custom business drivers
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                      Full control over inputs
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                      Manual assumptions
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // INPUTS STEP
  if (step === "inputs") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {inputMode === "automatic"
                ? "Automatic Forecast Setup"
                : "Manual Forecast Setup"}
            </DialogTitle>
            <DialogDescription>
              {inputMode === "automatic"
                ? "Review and adjust Joseph AI's automatic inputs"
                : "Enter your historical data and business drivers"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="data" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="data">Historical Data</TabsTrigger>
              <TabsTrigger value="drivers">Business Drivers</TabsTrigger>
              <TabsTrigger value="changes">Planned Changes</TabsTrigger>
            </TabsList>

            {/* Historical Data Tab */}
            <TabsContent value="data" className="space-y-4">
              {inputMode === "automatic" && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Auto-detected:</span>{" "}
                      {SAMPLE_DATA_SOURCE.automationNote}
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Historical Annual Revenue
                  </label>
                  <Input
                    type="number"
                    value={inputs.historicalRevenue}
                    onChange={(e) =>
                      handleInputChange(
                        "historicalRevenue",
                        parseFloat(e.target.value),
                      )
                    }
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Historical Annual Expenses
                  </label>
                  <Input
                    type="number"
                    value={inputs.historicalExpenses}
                    onChange={(e) =>
                      handleInputChange(
                        "historicalExpenses",
                        parseFloat(e.target.value),
                      )
                    }
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Forecast Year
                  </label>
                  <Input
                    type="number"
                    value={inputs.currentYear}
                    onChange={(e) =>
                      handleInputChange("currentYear", parseInt(e.target.value))
                    }
                    placeholder="2024"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Forecast Period
                  </label>
                  <select
                    value={inputs.forecastPeriod}
                    onChange={(e) =>
                      handleInputChange(
                        "forecastPeriod",
                        e.target.value as "monthly" | "quarterly",
                      )
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>
            </TabsContent>

            {/* Business Drivers Tab */}
            <TabsContent value="drivers" className="space-y-4">
              <p className="text-sm text-gray-600">
                Adjust business drivers to influence the forecast
              </p>
              <div className="space-y-4">
                {inputs.drivers.map((driver) => (
                  <Card key={driver.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {driver.name}
                        </CardTitle>
                        <Badge
                          className={
                            driver.impact === "high"
                              ? "bg-red-100 text-red-800"
                              : driver.impact === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {driver.impact} impact
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Current Value
                          </label>
                          <Input
                            type="number"
                            value={driver.currentValue}
                            onChange={(e) =>
                              handleDriverChange(
                                driver.id,
                                "currentValue",
                                parseFloat(e.target.value),
                              )
                            }
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {driver.unit}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Target Value
                          </label>
                          <Input
                            type="number"
                            value={driver.targetValue}
                            onChange={(e) =>
                              handleDriverChange(
                                driver.id,
                                "targetValue",
                                parseFloat(e.target.value),
                              )
                            }
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {driver.unit}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">
                            Change
                          </label>
                          <div className="mt-1 p-2 bg-gray-100 rounded text-center">
                            <p className="text-sm font-semibold">
                              {(
                                ((driver.targetValue - driver.currentValue) /
                                  driver.currentValue) *
                                100
                              ).toFixed(1)}
                              %
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Planned Changes Tab */}
            <TabsContent value="changes" className="space-y-4">
              <p className="text-sm text-gray-600">
                Describe planned changes that will affect your business
              </p>
              <div className="space-y-3">
                {inputs.plannedChanges.map((change, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border">
                    <p className="text-sm text-gray-900">{change}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex space-x-3">
            <Button variant="outline" onClick={() => setStep("mode")}>
              Back
            </Button>
            <Button
              onClick={() => setStep("results")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Generate Forecast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // RESULTS STEP
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rolling Forecast Results</DialogTitle>
          <DialogDescription>
            12-month AI-driven forecast with budget alignment and driver impacts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Total Revenue (12m)</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {formatCurrency(totalRevenue)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Total Expenses (12m)</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {formatCurrency(totalExpenses)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Net Income (12m)</p>
                <p
                  className={`text-2xl font-bold mt-1 ${totalNetIncome > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(totalNetIncome)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Critical Months</p>
                <p
                  className={`text-2xl font-bold mt-1 ${criticalMonths === 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {criticalMonths}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts */}
          {(forecast.warnings.length > 0 || criticalMonths > 0) && (
            <div className="space-y-2">
              {forecast.warnings.map((warning, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border flex items-start space-x-3 ${
                    warning.severity === "high"
                      ? "bg-red-50 border-red-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <AlertTriangle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      warning.severity === "high"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-semibold ${
                        warning.severity === "high"
                          ? "text-red-900"
                          : "text-yellow-900"
                      }`}
                    >
                      {warning.month}: {warning.issue}
                    </p>
                    <p
                      className={`text-sm ${
                        warning.severity === "high"
                          ? "text-red-800"
                          : "text-yellow-800"
                      }`}
                    >
                      Immediate review recommended
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {forecast.warnings.length === 0 && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                ✓ Healthy forecast - All months on track
              </p>
            </div>
          )}

          {/* 12-Month Forecast Chart */}
          <Card>
            <CardHeader>
              <CardTitle>12-Month Budget Forecast</CardTitle>
              <CardDescription>
                Projected revenues, expenses, and net income
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={forecast.monthly}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                    }}
                    formatter={(value: any) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    name="Expenses"
                  />
                  <Line
                    type="monotone"
                    dataKey="netIncome"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    name="Net Income"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Driver Impacts */}
          {forecast.driverImpacts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Driver-Based Predictions & Recommendations
                </CardTitle>
                <CardDescription>
                  How business drivers affect your forecast
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {forecast.driverImpacts.map((item, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {item.driver}
                        </h4>
                        <Badge
                          className={
                            item.impact > 5
                              ? "bg-green-100 text-green-800"
                              : item.impact < -5
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {item.impact > 0 ? "+" : ""}
                          {item.impact.toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">
                        {item.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Budget Adjustments */}
          <Card>
            <CardHeader>
              <CardTitle>Suggested Budget Adjustments</CardTitle>
              <CardDescription>
                AI recommendations to align budget with business drivers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    suggestion:
                      "Increase marketing budget by ₦300,000 to maintain sales growth",
                    quarter: "Q2",
                    impact: 300000,
                  },
                  {
                    suggestion:
                      "Cut non-essential spending in Q2 due to expense spike",
                    quarter: "Q2",
                    impact: -150000,
                  },
                  {
                    suggestion:
                      "Shift hiring to Q3 to optimize cash flow targets",
                    quarter: "Q3",
                    impact: 200000,
                  },
                  {
                    suggestion:
                      "Allocate additional budget to customer retention in Q4",
                    quarter: "Q4",
                    impact: 250000,
                  },
                ].map((adj, idx) => (
                  <div
                    key={idx}
                    className="p-3 border rounded-lg flex items-start justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {adj.suggestion}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {adj.quarter}
                      </p>
                    </div>
                    <Badge
                      className={
                        adj.impact > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {adj.impact > 0 ? "+" : ""}
                      {formatCurrency(adj.impact)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Opportunities */}
          {forecast.opportunities.length > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-900">
                  Identified Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {forecast.opportunities.map((opp, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-3 bg-white rounded border border-green-100"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {opp.opportunity}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {opp.month}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        +{formatCurrency(opp.impact)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="flex space-x-3">
          <Button variant="outline" onClick={() => setStep("inputs")}>
            Back to Inputs
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Forecast
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
