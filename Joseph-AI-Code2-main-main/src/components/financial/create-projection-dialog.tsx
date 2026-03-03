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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Calendar,
  Download,
  DollarSign,
} from "lucide-react";

interface ProjectionInputs {
  currentBalance: number;
  expectedRevenues: number;
  expectedExpenses: number;
  paymentCycleDays: number;
  seasonalPattern: "stable" | "seasonal" | "growth" | "decline";
  minimumCashThreshold: number;
}

interface CashFlowDay {
  day: number;
  date: string;
  balance: number;
  inflows: number;
  outflows: number;
  status: "healthy" | "warning" | "critical";
}

interface HighImpactDate {
  date: string;
  event: string;
  amount: number;
  type: "inflow" | "outflow";
  impact: "high" | "medium" | "low";
}

interface CreateProjectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (projection: any) => void;
}

const DEFAULT_INPUTS: ProjectionInputs = {
  currentBalance: 50000,
  expectedRevenues: 25000,
  expectedExpenses: 15000,
  paymentCycleDays: 30,
  seasonalPattern: "stable",
  minimumCashThreshold: 10000,
};

function generateCashFlowProjection(
  inputs: ProjectionInputs,
  days: number,
): CashFlowDay[] {
  const data: CashFlowDay[] = [];
  let balance = inputs.currentBalance;
  const dailyRevenue = inputs.expectedRevenues / days;
  const dailyExpense = inputs.expectedExpenses / days;

  const now = new Date();

  for (let day = 1; day <= days; day++) {
    const currentDate = new Date(now);
    currentDate.setDate(currentDate.getDate() + day);

    let inflows = dailyRevenue;
    let outflows = dailyExpense;

    // Apply seasonal pattern
    if (inputs.seasonalPattern === "seasonal") {
      const seasonalFactor = 0.8 + Math.sin((day / days) * Math.PI) * 0.4;
      inflows *= seasonalFactor;
      outflows *= seasonalFactor;
    } else if (inputs.seasonalPattern === "growth") {
      const growthFactor = 1 + (day / days) * 0.2;
      inflows *= growthFactor;
    } else if (inputs.seasonalPattern === "decline") {
      const declineFactor = 1 - (day / days) * 0.15;
      inflows *= declineFactor;
    }

    // Apply payment cycle distribution
    if (day % inputs.paymentCycleDays === 0) {
      outflows *= 1.3;
    }

    balance = balance + inflows - outflows;

    let status: "healthy" | "warning" | "critical" = "healthy";
    if (balance < inputs.minimumCashThreshold * 1.5) {
      status = "warning";
    }
    if (balance < inputs.minimumCashThreshold) {
      status = "critical";
    }

    data.push({
      day,
      date: currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      balance: Math.round(balance),
      inflows: Math.round(inflows),
      outflows: Math.round(outflows),
      status,
    });
  }

  return data;
}

function generateHighImpactDates(
  projection: CashFlowDay[],
  inputs: ProjectionInputs,
): HighImpactDate[] {
  const dates: HighImpactDate[] = [];

  // Critical cash days
  projection.forEach((day) => {
    if (day.status === "critical") {
      dates.push({
        date: day.date,
        event: "Critical Cash Level",
        amount: day.balance,
        type: "outflow",
        impact: "high",
      });
    } else if (day.status === "warning") {
      dates.push({
        date: day.date,
        event: "Warning: Low Cash",
        amount: day.balance,
        type: "outflow",
        impact: "medium",
      });
    }
  });

  // Large outflow dates
  projection.forEach((day) => {
    if (day.outflows > inputs.expectedExpenses / 10) {
      dates.push({
        date: day.date,
        event: "Scheduled Payment",
        amount: day.outflows,
        type: "outflow",
        impact: "high",
      });
    }
  });

  // Large inflow dates
  projection.forEach((day) => {
    if (day.inflows > inputs.expectedRevenues / 10) {
      dates.push({
        date: day.date,
        event: "Expected Revenue",
        amount: day.inflows,
        type: "inflow",
        impact: "high",
      });
    }
  });

  return dates.slice(0, 5); // Return top 5 events
}

function generatePDFReport(
  inputs: ProjectionInputs,
  projection7: CashFlowDay[],
  projection14: CashFlowDay[],
  projection30: CashFlowDay[],
): void {
  // Simple text-based PDF generation
  const content = `
CASH FLOW PROJECTION REPORT
Generated: ${new Date().toLocaleDateString()}

=== INPUT PARAMETERS ===
Current Cash Balance: $${inputs.currentBalance.toLocaleString()}
Expected Monthly Revenues: $${inputs.expectedRevenues.toLocaleString()}
Expected Monthly Expenses: $${inputs.expectedExpenses.toLocaleString()}
Payment Cycle: Every ${inputs.paymentCycleDays} days
Seasonal Pattern: ${inputs.seasonalPattern}
Minimum Cash Threshold: $${inputs.minimumCashThreshold.toLocaleString()}

=== 7-DAY PROJECTION ===
Starting Balance: $${inputs.currentBalance.toLocaleString()}
Ending Balance: $${projection7[projection7.length - 1]?.balance.toLocaleString() || 0}
Total Inflows: $${projection7.reduce((sum, d) => sum + d.inflows, 0).toLocaleString()}
Total Outflows: $${projection7.reduce((sum, d) => sum + d.outflows, 0).toLocaleString()}

=== 14-DAY PROJECTION ===
Starting Balance: $${inputs.currentBalance.toLocaleString()}
Ending Balance: $${projection14[projection14.length - 1]?.balance.toLocaleString() || 0}
Total Inflows: $${projection14.reduce((sum, d) => sum + d.inflows, 0).toLocaleString()}
Total Outflows: $${projection14.reduce((sum, d) => sum + d.outflows, 0).toLocaleString()}

=== 30-DAY PROJECTION ===
Starting Balance: $${inputs.currentBalance.toLocaleString()}
Ending Balance: $${projection30[projection30.length - 1]?.balance.toLocaleString() || 0}
Total Inflows: $${projection30.reduce((sum, d) => sum + d.inflows, 0).toLocaleString()}
Total Outflows: $${projection30.reduce((sum, d) => sum + d.outflows, 0).toLocaleString()}

=== ALERTS ===
${projection7.filter((d) => d.status === "critical").length > 0 ? `⚠️ CRITICAL: Low cash detected in 7-day period` : "✓ No critical cash alerts in 7-day period"}
${projection14.filter((d) => d.status === "critical").length > 0 ? `⚠️ CRITICAL: Low cash detected in 14-day period` : "✓ No critical cash alerts in 14-day period"}
${projection30.filter((d) => d.status === "critical").length > 0 ? `⚠️ CRITICAL: Low cash detected in 30-day period` : "✓ No critical cash alerts in 30-day period"}

Generated by Joseph AI - Financial Advisory Module
  `.trim();

  const blob = new Blob([content], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `cash-flow-projection-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function CreateProjectionDialog({
  open,
  onOpenChange,
  onSave,
}: CreateProjectionDialogProps) {
  const [inputs, setInputs] = useState<ProjectionInputs>(DEFAULT_INPUTS);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("7-day");

  const projection7 = generateCashFlowProjection(inputs, 7);
  const projection14 = generateCashFlowProjection(inputs, 14);
  const projection30 = generateCashFlowProjection(inputs, 30);

  const activeProjection =
    activeTab === "7-day"
      ? projection7
      : activeTab === "14-day"
        ? projection14
        : projection30;

  const highImpactDates = generateHighImpactDates(
    activeTab === "7-day"
      ? projection7
      : activeTab === "14-day"
        ? projection14
        : projection30,
    inputs,
  );

  const criticalDays =
    activeTab === "7-day"
      ? projection7.filter((d) => d.status === "critical").length
      : activeTab === "14-day"
        ? projection14.filter((d) => d.status === "critical").length
        : projection30.filter((d) => d.status === "critical").length;

  const warningDays =
    activeTab === "7-day"
      ? projection7.filter((d) => d.status === "warning").length
      : activeTab === "14-day"
        ? projection14.filter((d) => d.status === "warning").length
        : projection30.filter((d) => d.status === "warning").length;

  const handleInputChange = (field: keyof ProjectionInputs, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [field]:
        field === "minimumCashThreshold"
          ? parseInt(value) || 0
          : parseFloat(value) || 0,
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        inputs,
        projection7,
        projection14,
        projection30,
      });
    }
    onOpenChange(false);
    setShowResults(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (showResults) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cash Flow Projection Results</DialogTitle>
            <DialogDescription>
              Generated by Joseph AI - Short-term cash flow forecast and
              analysis
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="7-day">7-Day</TabsTrigger>
              <TabsTrigger value="14-day">14-Day</TabsTrigger>
              <TabsTrigger value="30-day">30-Day</TabsTrigger>
            </TabsList>

            <TabsContent value="7-day" className="space-y-6">
              <div className="space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Starting Balance</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(inputs.currentBalance)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Ending Balance</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(
                          projection7[projection7.length - 1]?.balance || 0,
                        )}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Net Cash Flow</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(
                          (projection7[projection7.length - 1]?.balance || 0) -
                            inputs.currentBalance,
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Alerts */}
                {(criticalDays > 0 || warningDays > 0) && (
                  <div className="space-y-2">
                    {criticalDays > 0 && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-900">
                            Critical Alert
                          </p>
                          <p className="text-sm text-red-800">
                            Cash balance falls below minimum threshold on{" "}
                            <span className="font-semibold">
                              {criticalDays}
                            </span>{" "}
                            day{criticalDays !== 1 ? "s" : ""}. Immediate action
                            recommended.
                          </p>
                        </div>
                      </div>
                    )}
                    {warningDays > 0 && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-yellow-900">
                            Cash Flow Warning
                          </p>
                          <p className="text-sm text-yellow-800">
                            Cash balance is low on{" "}
                            <span className="font-semibold">{warningDays}</span>{" "}
                            day{warningDays !== 1 ? "s" : ""}. Monitor closely.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {criticalDays === 0 && warningDays === 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Healthy cash flow throughout period
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="14-day" className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Starting Balance</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(inputs.currentBalance)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Ending Balance</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(
                          projection14[projection14.length - 1]?.balance || 0,
                        )}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Net Cash Flow</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(
                          (projection14[projection14.length - 1]?.balance ||
                            0) - inputs.currentBalance,
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {(criticalDays > 0 || warningDays > 0) && (
                  <div className="space-y-2">
                    {criticalDays > 0 && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-900">
                            Critical Alert
                          </p>
                          <p className="text-sm text-red-800">
                            Cash balance falls below minimum threshold on{" "}
                            <span className="font-semibold">
                              {criticalDays}
                            </span>{" "}
                            day{criticalDays !== 1 ? "s" : ""}. Immediate action
                            recommended.
                          </p>
                        </div>
                      </div>
                    )}
                    {warningDays > 0 && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-yellow-900">
                            Cash Flow Warning
                          </p>
                          <p className="text-sm text-yellow-800">
                            Cash balance is low on{" "}
                            <span className="font-semibold">{warningDays}</span>{" "}
                            day{warningDays !== 1 ? "s" : ""}. Monitor closely.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {criticalDays === 0 && warningDays === 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Healthy cash flow throughout period
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="30-day" className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Starting Balance</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(inputs.currentBalance)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Ending Balance</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(
                          projection30[projection30.length - 1]?.balance || 0,
                        )}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600">Net Cash Flow</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatCurrency(
                          (projection30[projection30.length - 1]?.balance ||
                            0) - inputs.currentBalance,
                        )}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {(criticalDays > 0 || warningDays > 0) && (
                  <div className="space-y-2">
                    {criticalDays > 0 && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-900">
                            Critical Alert
                          </p>
                          <p className="text-sm text-red-800">
                            Cash balance falls below minimum threshold on{" "}
                            <span className="font-semibold">
                              {criticalDays}
                            </span>{" "}
                            day{criticalDays !== 1 ? "s" : ""}. Immediate action
                            recommended.
                          </p>
                        </div>
                      </div>
                    )}
                    {warningDays > 0 && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-yellow-900">
                            Cash Flow Warning
                          </p>
                          <p className="text-sm text-yellow-800">
                            Cash balance is low on{" "}
                            <span className="font-semibold">{warningDays}</span>{" "}
                            day{warningDays !== 1 ? "s" : ""}. Monitor closely.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {criticalDays === 0 && warningDays === 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Healthy cash flow throughout period
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Cash Balance Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={activeProjection}>
                  <defs>
                    <linearGradient
                      id="colorBalance"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    labelFormatter={(label) => `Day ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorBalance)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* High Impact Dates */}
          {highImpactDates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">High-Impact Dates</CardTitle>
                <CardDescription>
                  Key events that significantly affect your cash position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {highImpactDates.map((event, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border flex items-start justify-between"
                    >
                      <div className="flex items-start space-x-3 flex-1">
                        {event.type === "inflow" ? (
                          <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600 mt-0.5" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {event.event}
                          </p>
                          <p className="text-sm text-gray-600">{event.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(event.amount)}
                        </p>
                        <Badge
                          className={
                            event.impact === "high"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {event.impact} impact
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <DialogFooter className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() =>
                generatePDFReport(
                  inputs,
                  projection7,
                  projection14,
                  projection30,
                )
              }
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" onClick={() => setShowResults(false)}>
              Back to Inputs
            </Button>
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Projection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Cash Flow Projection</DialogTitle>
          <DialogDescription>
            Generate automatic short-term cash flow forecasts by providing your
            expected revenues, expenses, and payment patterns
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Input Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Current Cash Balance
                </label>
                <div className="mt-1 relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    value={inputs.currentBalance}
                    onChange={(e) =>
                      handleInputChange("currentBalance", e.target.value)
                    }
                    placeholder="0"
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Minimum Cash Threshold
                </label>
                <div className="mt-1 relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    value={inputs.minimumCashThreshold}
                    onChange={(e) =>
                      handleInputChange("minimumCashThreshold", e.target.value)
                    }
                    placeholder="0"
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Expected Monthly Revenues
                </label>
                <div className="mt-1 relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    value={inputs.expectedRevenues}
                    onChange={(e) =>
                      handleInputChange("expectedRevenues", e.target.value)
                    }
                    placeholder="0"
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Expected Monthly Expenses
                </label>
                <div className="mt-1 relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="number"
                    value={inputs.expectedExpenses}
                    onChange={(e) =>
                      handleInputChange("expectedExpenses", e.target.value)
                    }
                    placeholder="0"
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Payment Cycle (Days)
                </label>
                <Input
                  type="number"
                  value={inputs.paymentCycleDays}
                  onChange={(e) =>
                    handleInputChange("paymentCycleDays", e.target.value)
                  }
                  placeholder="30"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Seasonal Pattern
                </label>
                <select
                  value={inputs.seasonalPattern}
                  onChange={(e) =>
                    handleInputChange("seasonalPattern", e.target.value)
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="stable">Stable</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="growth">Growth</option>
                  <option value="decline">Decline</option>
                </select>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Joseph AI Analysis:</span> This
                projection will generate 7-day, 14-day, and 30-day forecasts
                with automatic alerts for low cash periods and high-impact
                dates.
              </p>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => setShowResults(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Generate Projection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
