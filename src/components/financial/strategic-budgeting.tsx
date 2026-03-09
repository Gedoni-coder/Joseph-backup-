import React, { useState } from "react";
import {
  BudgetForecast,
  BudgetAssumption,
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
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  DollarSign,
  Target,
} from "lucide-react";
import { CreateForecastDialog } from "./create-forecast-dialog";

interface StrategicBudgetingProps {
  budgetForecasts: BudgetForecast[];
  budgetAssumptions: BudgetAssumption[];
  onCreateForecast: (
    forecast: Omit<BudgetForecast, "id" | "lastUpdated">,
  ) => void;
  onUpdateAssumption: (id: string, updates: Partial<BudgetAssumption>) => void;
}

export function StrategicBudgeting({
  budgetForecasts,
  budgetAssumptions,
  onCreateForecast,
  onUpdateAssumption,
}: StrategicBudgetingProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [createForecastOpen, setCreateForecastOpen] = useState(false);

  const filteredForecasts = budgetForecasts.filter((forecast) => {
    if (selectedType !== "all" && forecast.type !== selectedType) return false;
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

  const formatPercent = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 2) return "text-green-600";
    if (variance < -2) return "text-red-600";
    return "text-yellow-600";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "bg-green-100 text-green-800";
    if (confidence >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Strategic Budgeting & Rolling Forecasts
          </h2>
          <p className="text-gray-600">
            Rolling forecasts and budget alignment with business drivers
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setCreateForecastOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Create Forecast
          </Button>
        </div>
      </div>

      {/* Create Forecast Dialog */}
      <CreateForecastDialog
        open={createForecastOpen}
        onOpenChange={setCreateForecastOpen}
        onSave={(forecastData) => {
          onCreateForecast({
            period: `${forecastData.inputs.currentYear}-Q1`,
            type: "monthly",
            revenue: forecastData.forecast.monthly[0]?.revenue || 0,
            expenses: forecastData.forecast.monthly[0]?.expenses || 0,
            netIncome: forecastData.forecast.monthly[0]?.netIncome || 0,
            confidence: 85,
            assumptions: forecastData.inputs.plannedChanges,
            variance: 0,
          });
        }}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Forecasted Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    filteredForecasts.reduce((sum, f) => sum + f.revenue, 0),
                  )}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Income</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    filteredForecasts.reduce((sum, f) => sum + f.netIncome, 0),
                  )}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Confidence
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {(
                    filteredForecasts.reduce(
                      (sum, f) => sum + f.confidence,
                      0,
                    ) / filteredForecasts.length
                  ).toFixed(0)}
                  %
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Forecasts
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredForecasts.length}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rolling Forecasts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rolling Forecasts</CardTitle>
          <CardDescription>
            Real-time budget forecasts with variance tracking and confidence
            scoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Period
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Type
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Revenue
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Expenses
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Net Income
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Variance
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Confidence
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Actual vs Forecast
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredForecasts.map((forecast) => (
                  <tr key={forecast.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{forecast.period}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{forecast.type}</Badge>
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      {formatCurrency(forecast.revenue)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      {formatCurrency(forecast.expenses)}
                    </td>
                    <td className="text-right py-3 px-4 font-medium">
                      {formatCurrency(forecast.netIncome)}
                    </td>
                    <td className="text-center py-3 px-4">
                      <span
                        className={`font-medium ${getVarianceColor(forecast.variance)}`}
                      >
                        {formatPercent(forecast.variance)}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge
                        className={getConfidenceColor(forecast.confidence)}
                      >
                        {forecast.confidence}%
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      {forecast.actualVsForecasted ? (
                        <div className="flex items-center justify-center">
                          {forecast.actualVsForecasted.actualNetIncome! >
                          forecast.netIncome ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Budget Assumptions */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Assumptions</CardTitle>
          <CardDescription>
            Key assumptions linked to forecasts and business drivers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgetAssumptions.map((assumption) => (
              <div key={assumption.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {assumption.assumption}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {assumption.category}
                    </p>
                  </div>
                  <Badge
                    className={
                      assumption.impact === "high"
                        ? "bg-red-100 text-red-800"
                        : assumption.impact === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }
                  >
                    {assumption.impact} impact
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Value:</span>
                    <span className="ml-2 font-medium">
                      {assumption.value}
                      {assumption.unit}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Confidence:</span>
                    <span className="ml-2 font-medium">
                      {assumption.confidence}%
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-sm">
                  <span className="text-gray-600">Source:</span>
                  <span className="ml-2">{assumption.source}</span>
                </div>

                <div className="mt-3 text-xs text-gray-500">
                  Last validated:{" "}
                  {new Date(assumption.lastValidated).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
