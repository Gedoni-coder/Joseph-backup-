import React, { useState } from "react";
import { BudgetForecast } from "../../lib/financial-advisory-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { ValidationReportDialog } from "./validation-report-dialog";
import { ImprovementCard } from "./improvement-card";

interface BudgetValidationProps {
  budgetForecasts: BudgetForecast[];
}

export function BudgetValidation({ budgetForecasts }: BudgetValidationProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [reportDialogOpen, setReportDialogOpen] = useState(false);

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

  // Calculate validation metrics
  const validatedForecasts = budgetForecasts.filter(
    (f) => f.actualVsForecasted,
  );
  const totalVariance =
    validatedForecasts.reduce((sum, f) => sum + Math.abs(f.variance), 0) /
    validatedForecasts.length;
  const accuracyScore = Math.max(0, 100 - totalVariance * 10);

  const getVarianceStatus = (variance: number) => {
    if (Math.abs(variance) <= 2)
      return { status: "accurate", color: "text-green-600", icon: CheckCircle };
    if (Math.abs(variance) <= 5)
      return {
        status: "acceptable",
        color: "text-yellow-600",
        icon: AlertCircle,
      };
    return { status: "concerning", color: "text-red-600", icon: XCircle };
  };

  const getValidationScore = (forecast: BudgetForecast) => {
    if (!forecast.actualVsForecasted) return null;

    const revenueVariance = Math.abs(
      ((forecast.actualVsForecasted.actualRevenue! - forecast.revenue) /
        forecast.revenue) *
        100,
    );
    const expenseVariance = Math.abs(
      ((forecast.actualVsForecasted.actualExpenses! - forecast.expenses) /
        forecast.expenses) *
        100,
    );
    const netIncomeVariance = Math.abs(
      ((forecast.actualVsForecasted.actualNetIncome! - forecast.netIncome) /
        forecast.netIncome) *
        100,
    );

    const averageVariance =
      (revenueVariance + expenseVariance + netIncomeVariance) / 3;
    return Math.max(0, 100 - averageVariance * 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Forecast-Driven Budget Validation
          </h2>
          <p className="text-gray-600">
            Align budgets with forecasts and track performance accuracy
          </p>
        </div>
        <Button
          onClick={() => setReportDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Generate Validation Report
        </Button>
      </div>

      <ValidationReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
      />

      {/* Validation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Accuracy Score
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {accuracyScore.toFixed(0)}%
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Variance
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalVariance.toFixed(1)}%
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Validated Forecasts
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {validatedForecasts.length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Budget Alignment
                </p>
                <p className="text-2xl font-bold text-orange-600">92%</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast vs Actual Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast vs Actual Performance</CardTitle>
          <CardDescription>
            Detailed comparison of forecasted vs actual financial performance
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
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Validation Status
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Forecasted Revenue
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Actual Revenue
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Revenue Variance
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Forecasted Net Income
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Actual Net Income
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Accuracy Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {budgetForecasts.map((forecast) => {
                  const hasActuals = forecast.actualVsForecasted;
                  const revenueVariance = hasActuals
                    ? ((forecast.actualVsForecasted!.actualRevenue! -
                        forecast.revenue) /
                        forecast.revenue) *
                      100
                    : 0;
                  const varianceStatus = getVarianceStatus(revenueVariance);
                  const StatusIcon = varianceStatus.icon;
                  const accuracyScore = getValidationScore(forecast);

                  return (
                    <tr key={forecast.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{forecast.period}</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        {hasActuals ? (
                          <div className="flex items-center justify-center gap-2">
                            <StatusIcon
                              className={`h-4 w-4 ${varianceStatus.color}`}
                            />
                            <Badge
                              className={
                                varianceStatus.status === "accurate"
                                  ? "bg-green-100 text-green-800"
                                  : varianceStatus.status === "acceptable"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {varianceStatus.status}
                            </Badge>
                          </div>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {formatCurrency(forecast.revenue)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {hasActuals
                          ? formatCurrency(
                              forecast.actualVsForecasted!.actualRevenue!,
                            )
                          : "-"}
                      </td>
                      <td className="text-right py-3 px-4">
                        {hasActuals ? (
                          <span
                            className={
                              revenueVariance >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {formatPercent(revenueVariance)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {formatCurrency(forecast.netIncome)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {hasActuals
                          ? formatCurrency(
                              forecast.actualVsForecasted!.actualNetIncome!,
                            )
                          : "-"}
                      </td>
                      <td className="text-center py-3 px-4">
                        {accuracyScore !== null ? (
                          <div className="flex items-center justify-center">
                            <div className="w-16">
                              <Progress value={accuracyScore} className="h-2" />
                            </div>
                            <span className="ml-2 text-sm font-medium">
                              {accuracyScore.toFixed(0)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Validation Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Alignment Analysis</CardTitle>
            <CardDescription>
              How well budgets align with economic forecasts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Revenue Forecasting</span>
                <div className="flex items-center gap-2">
                  <Progress value={88} className="w-24 h-2" />
                  <span className="text-sm font-medium">88%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Expense Planning</span>
                <div className="flex items-center gap-2">
                  <Progress value={94} className="w-24 h-2" />
                  <span className="text-sm font-medium">94%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Cash Flow Prediction
                </span>
                <div className="flex items-center gap-2">
                  <Progress value={79} className="w-24 h-2" />
                  <span className="text-sm font-medium">79%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Market Condition Factors
                </span>
                <div className="flex items-center gap-2">
                  <Progress value={86} className="w-24 h-2" />
                  <span className="text-sm font-medium">86%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Continuous Improvement Areas</CardTitle>
            <CardDescription>
              Key focus areas for forecast accuracy enhancement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ImprovementCard
                icon={TrendingUp}
                iconColor="text-green-600"
                title="Revenue Forecasting Strength"
                summary="Consistently outperforming forecasts by 3.2% on average"
                details={
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Current Performance
                      </h5>
                      <p className="text-sm text-gray-700">
                        Your revenue forecasts consistently underestimate actual
                        results, with an average outperformance of{" "}
                        <span className="font-semibold">+3.2%</span>. This
                        pattern is consistent across multiple periods,
                        indicating a systemic tendency toward conservative
                        estimation rather than random variance.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Root Cause Analysis
                      </h5>
                      <p className="text-sm text-gray-700">
                        This outperformance may result from: (1) conservative
                        sales forecasting by nature, (2) stronger-than-expected
                        market demand, or (3) superior sales execution exceeding
                        internal expectations. Each requires different strategic
                        responses.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Strategic Implication
                      </h5>
                      <p className="text-sm text-gray-700">
                        While consistent outperformance is positive, it suggests
                        you may be leaving strategic opportunities on the table.
                        More aggressive revenue forecasting could enable better
                        resource allocation and unlock profitable growth
                        initiatives.
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-xs text-green-900 font-semibold mb-1">
                        RECOMMENDED ACTION
                      </p>
                      <p className="text-sm text-green-800">
                        Increase revenue targets by 3–4% in next forecast cycle
                        and incorporate leading sales indicators for better
                        upside visibility.
                      </p>
                    </div>
                  </div>
                }
              />

              <ImprovementCard
                icon={AlertCircle}
                iconColor="text-yellow-600"
                title="Expense Volatility Control"
                summary="Higher variance in operating expenses requires refinement"
                details={
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Current Challenge
                      </h5>
                      <p className="text-sm text-gray-700">
                        Operating expenses exhibit noticeable volatility,
                        particularly in weeks 1–2 of each period. This
                        unpredictability increases the challenge of accurate net
                        income forecasting and weakens the overall stability of
                        financial projections.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Affected Areas
                      </h5>
                      <ul className="text-sm text-gray-700 space-y-2">
                        <li className="flex gap-2">
                          <span>•</span>{" "}
                          <span>
                            Procurement patterns and supplier payment timing
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>{" "}
                          <span>
                            Staffing costs and hourly labor fluctuations
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>{" "}
                          <span>
                            Discretionary spending and project-based expenses
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Impact Assessment
                      </h5>
                      <p className="text-sm text-gray-700">
                        This volatility is the primary source of forecasting
                        noise and complicates strategic decision-making. It
                        weakens confidence in cash flow projections and makes
                        budget variance analysis less actionable.
                      </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-xs text-yellow-900 font-semibold mb-1">
                        RECOMMENDED ACTION
                      </p>
                      <p className="text-sm text-yellow-800">
                        Implement granular expense tracking by sub-category.
                        Establish fixed vs. variable expense analysis and
                        develop rolling 13-week expense forecasts.
                      </p>
                    </div>
                  </div>
                }
              />

              <ImprovementCard
                icon={Calendar}
                iconColor="text-blue-600"
                title="Seasonal Pattern Optimization"
                summary="Strengthen seasonal weighting in quarterly forecasts"
                details={
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Pattern Identification
                      </h5>
                      <p className="text-sm text-gray-700">
                        Q1 and Q4 consistently demonstrate significant seasonal
                        uplift in revenue, indicating strong recurring patterns
                        driven by market cycles or business seasonality. These
                        patterns are partially captured in current forecasts but
                        insufficiently weighted.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Current State Assessment
                      </h5>
                      <p className="text-sm text-gray-700">
                        While seasonal effects are acknowledged in forecasting,
                        the magnitude of seasonal adjustments appears to
                        underestimate the actual impact. Q1 shows approximately{" "}
                        <span className="font-semibold">15–18% uplift</span> vs.
                        baseline, but current models incorporate only 8–10%.
                      </p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">
                        Improvement Potential
                      </h5>
                      <p className="text-sm text-gray-700">
                        Incorporating stronger seasonal adjustments with
                        multi-year historical data analysis could improve
                        forecast accuracy by{" "}
                        <span className="font-semibold">
                          3–5 percentage points
                        </span>
                        .
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                      <p className="text-xs text-blue-900 font-semibold mb-1">
                        RECOMMENDED ACTION
                      </p>
                      <p className="text-sm text-blue-800">
                        Conduct 3-year seasonal analysis by quarter and product
                        line. Increase seasonal weighting in Q1/Q4 forecasts and
                        establish dynamic seasonal factors.
                      </p>
                    </div>
                  </div>
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
