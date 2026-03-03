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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Users, DollarSign, AlertTriangle } from "lucide-react";

interface ScenarioParams {
  id: string;
  name: string;
  color: string;
  customerAcquisition: number; // % monthly growth
  churnRate: number; // % monthly
  avgPrice: number; // average price per customer
  marketGrowth: number; // % annual market growth
  probability: number; // % likelihood
}

interface ScenarioComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRevenue: number;
  onSave?: (scenarios: ScenarioParams[]) => void;
}

const DEFAULT_SCENARIOS: ScenarioParams[] = [
  {
    id: "base",
    name: "Base Case",
    color: "#3b82f6",
    customerAcquisition: 5, // 5% monthly growth
    churnRate: 2, // 2% monthly churn
    avgPrice: 100,
    marketGrowth: 10,
    probability: 50,
  },
  {
    id: "optimistic",
    name: "Optimistic",
    color: "#10b981",
    customerAcquisition: 10, // 10% monthly growth
    churnRate: 1, // 1% monthly churn
    avgPrice: 120,
    marketGrowth: 20,
    probability: 30,
  },
  {
    id: "pessimistic",
    name: "Pessimistic",
    color: "#ef4444",
    customerAcquisition: 2, // 2% monthly growth
    churnRate: 4, // 4% monthly churn
    avgPrice: 80,
    marketGrowth: 5,
    probability: 20,
  },
];

function calculateProjection(
  params: ScenarioParams,
  baseRevenue: number,
  months: number = 12,
) {
  const data = [];
  let revenue = baseRevenue;
  let customers = baseRevenue / params.avgPrice;

  for (let month = 0; month <= months; month++) {
    data.push({
      month,
      [params.name]: Math.round(revenue),
    });

    // Calculate next month
    const acquisition = customers * (params.customerAcquisition / 100);
    const churn = customers * (params.churnRate / 100);
    customers = customers + acquisition - churn;
    revenue = customers * params.avgPrice;
  }

  return data;
}

function mergeProjections(scenarios: ScenarioParams[], baseRevenue: number) {
  const projections = scenarios.map((s) => calculateProjection(s, baseRevenue));
  const merged: Record<string, number | string>[] = [];

  if (projections.length === 0 || projections[0].length === 0) {
    return merged;
  }

  for (let i = 0; i < projections[0].length; i++) {
    const monthData: Record<string, number | string> = { month: i };
    projections.forEach((proj) => {
      if (proj[i]) {
        Object.entries(proj[i]).forEach(([key, value]) => {
          if (key !== "month") {
            monthData[key] = value;
          }
        });
      }
    });
    merged.push(monthData);
  }

  return merged;
}

export function ScenarioComparisonDialog({
  open,
  onOpenChange,
  currentRevenue,
  onSave,
}: ScenarioComparisonDialogProps) {
  const [scenarios, setScenarios] =
    useState<ScenarioParams[]>(DEFAULT_SCENARIOS);

  const updateScenario = (
    id: string,
    field: keyof Omit<ScenarioParams, "id" | "name" | "color">,
    value: number,
  ) => {
    setScenarios((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, [field]: Math.max(0, Math.min(100, value)) } : s,
      ),
    );
  };

  const projectionData = mergeProjections(scenarios, currentRevenue);
  const scenarioColors = {
    "Base Case": "#3b82f6",
    Optimistic: "#10b981",
    Pessimistic: "#ef4444",
  };

  const handleSave = () => {
    if (onSave) {
      onSave(scenarios);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-6xl max-h-[90vh] overflow-y-auto"
        data-joseph-no-explain
      >
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Scenario Comparison
          </DialogTitle>
          <DialogDescription>
            Adjust parameters for each scenario and compare revenue projections
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Revenue Projection Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                12-Month Revenue Projection
              </CardTitle>
              <CardDescription>
                Projected revenue based on your scenario parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    label={{
                      value: "Month",
                      position: "insideBottomRight",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Revenue ($)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value) =>
                      `$${(value as number).toLocaleString()}`
                    }
                  />
                  <Legend />
                  {scenarios.map((scenario) => (
                    <Line
                      key={scenario.id}
                      type="monotone"
                      dataKey={scenario.name}
                      stroke={scenario.color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Scenario Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="border-l-4"
                style={{ borderLeftColor: scenario.color }}
              >
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    {scenario.name}
                    <Badge
                      style={{
                        backgroundColor: scenario.color,
                        color: "white",
                      }}
                    >
                      {scenario.probability}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Customer Acquisition */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      Customer Acquisition
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={scenario.customerAcquisition}
                        onChange={(e) =>
                          updateScenario(
                            scenario.id,
                            "customerAcquisition",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-8 text-right">
                        %/mo
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Monthly growth rate
                    </p>
                  </div>

                  {/* Churn Rate */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      Churn Rate
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={scenario.churnRate}
                        onChange={(e) =>
                          updateScenario(
                            scenario.id,
                            "churnRate",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-8 text-right">
                        %/mo
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Monthly churn rate
                    </p>
                  </div>

                  {/* Average Price */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      Average Price
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">$</span>
                      <Input
                        type="number"
                        min="0"
                        value={scenario.avgPrice}
                        onChange={(e) =>
                          updateScenario(
                            scenario.id,
                            "avgPrice",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600">/mo</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Price per customer
                    </p>
                  </div>

                  {/* Market Growth */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      Market Growth
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={scenario.marketGrowth}
                        onChange={(e) =>
                          updateScenario(
                            scenario.id,
                            "marketGrowth",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-8 text-right">
                        %/yr
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Annual market expansion
                    </p>
                  </div>

                  {/* Probability */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Likelihood
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={scenario.probability}
                        onChange={(e) =>
                          updateScenario(
                            scenario.id,
                            "probability",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-8 text-right">
                        %
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Probability of occurrence
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Stats */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base">
                Weighted Average Outcome
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Expected 12-Month Revenue
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    $
                    {(
                      scenarios.reduce((total, scenario) => {
                        const finalRevenue =
                          currentRevenue *
                          Math.pow(
                            1 +
                              (scenario.customerAcquisition -
                                scenario.churnRate) /
                                100,
                            12,
                          );
                        return (
                          total + (finalRevenue * scenario.probability) / 100
                        );
                      }, 0) / 1000000
                    ).toFixed(2)}
                    M
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Confidence Level</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {scenarios.reduce((acc, s) => acc + s.probability, 0)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Scenarios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
