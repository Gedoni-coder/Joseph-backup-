import React, { useMemo, useState } from "react";
import {
  BudgetAlignmentItem,
  BudgetValidationSummary,
  ForecastImprovementArea,
  ForecastValidationRecord,
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
import { Progress } from "../ui/progress";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  Calendar,
  Target,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { ValidationReportDialog } from "./validation-report-dialog";
import { ImprovementCard } from "./improvement-card";

interface BudgetValidationProps {
  budgetValidationSummary: BudgetValidationSummary | null;
  forecastValidationRecords: ForecastValidationRecord[];
  budgetAlignmentMetrics: BudgetAlignmentItem[];
  forecastImprovementAreas: ForecastImprovementArea[];
}

export function BudgetValidation({
  budgetValidationSummary,
  forecastValidationRecords,
  budgetAlignmentMetrics,
  forecastImprovementAreas,
}: BudgetValidationProps) {
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

  const summary = useMemo(() => {
    const validatedFromRecords = forecastValidationRecords.filter(
      (row) => row.validationStatus !== "pending",
    ).length;
    const avgVarianceFromRecords = forecastValidationRecords.length
      ? forecastValidationRecords.reduce(
          (sum, row) => sum + Math.abs(row.revenueVariance),
          0,
        ) / forecastValidationRecords.length
      : 0;
    const avgAccuracyFromRecords = forecastValidationRecords.length
      ? forecastValidationRecords.reduce((sum, row) => sum + row.accuracyScore, 0) /
        forecastValidationRecords.length
      : 0;
    const avgAlignmentFromRows = budgetAlignmentMetrics.length
      ? budgetAlignmentMetrics.reduce((sum, row) => sum + row.score, 0) /
        budgetAlignmentMetrics.length
      : 0;

    return {
      accuracyScore: budgetValidationSummary?.accuracyScore ?? avgAccuracyFromRecords,
      avgVariance: budgetValidationSummary?.avgVariance ?? avgVarianceFromRecords,
      validatedForecasts: budgetValidationSummary?.validatedForecasts ?? validatedFromRecords,
      budgetAlignment: budgetValidationSummary?.budgetAlignment ?? avgAlignmentFromRows,
    };
  }, [budgetAlignmentMetrics, budgetValidationSummary, forecastValidationRecords]);

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

  const getThemeStyles = (theme: ForecastImprovementArea["theme"]) => {
    if (theme === "green") {
      return {
        iconColor: "text-green-600",
        actionWrap: "bg-green-50 border border-green-200",
        actionTitle: "text-green-900",
        actionBody: "text-green-800",
      };
    }
    if (theme === "yellow") {
      return {
        iconColor: "text-yellow-600",
        actionWrap: "bg-yellow-50 border border-yellow-200",
        actionTitle: "text-yellow-900",
        actionBody: "text-yellow-800",
      };
    }
    return {
      iconColor: "text-blue-600",
      actionWrap: "bg-blue-50 border border-blue-200",
      actionTitle: "text-blue-900",
      actionBody: "text-blue-800",
    };
  };

  const getAreaIcon = (icon: ForecastImprovementArea["icon"]) => {
    if (icon === "alert-circle") return AlertCircle;
    if (icon === "calendar") return Calendar;
    return TrendingUp;
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
                  {summary.accuracyScore.toFixed(0)}%
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
                  {summary.avgVariance.toFixed(1)}%
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
                  {summary.validatedForecasts}
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
                <p className="text-2xl font-bold text-orange-600">
                  {summary.budgetAlignment.toFixed(0)}%
                </p>
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
                {forecastValidationRecords.map((record) => {
                  const hasActuals = typeof record.actualRevenue === "number";
                  const varianceStatus = getVarianceStatus(record.revenueVariance);
                  const StatusIcon = varianceStatus.icon;
                  const rowAccuracy = record.accuracyScore;

                  return (
                    <tr key={record.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{record.period}</span>
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
                                record.validationStatus === "accurate"
                                  ? "bg-green-100 text-green-800"
                                  : record.validationStatus === "acceptable"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }
                            >
                              {record.validationStatus}
                            </Badge>
                          </div>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {formatCurrency(record.forecastedRevenue)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {hasActuals
                          ? formatCurrency(record.actualRevenue ?? 0)
                          : "-"}
                      </td>
                      <td className="text-right py-3 px-4">
                        {hasActuals ? (
                          <span
                            className={
                              record.revenueVariance >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {formatPercent(record.revenueVariance)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {formatCurrency(record.forecastedNetIncome)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {hasActuals ? formatCurrency(record.actualNetIncome ?? 0) : "-"}
                      </td>
                      <td className="text-center py-3 px-4">
                        {hasActuals ? (
                          <div className="flex items-center justify-center">
                            <div className="w-16">
                              <Progress value={rowAccuracy} className="h-2" />
                            </div>
                            <span className="ml-2 text-sm font-medium">
                              {rowAccuracy.toFixed(0)}%
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
              {budgetAlignmentMetrics.map((metric) => (
                <div key={metric.id} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{metric.name}</span>
                  <div className="flex items-center gap-2">
                    <Progress value={metric.score} className="w-24 h-2" />
                    <span className="text-sm font-medium">{metric.score.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
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
              {forecastImprovementAreas.map((area) => {
                const Icon = getAreaIcon(area.icon);
                const styles = getThemeStyles(area.theme);

                return (
                  <ImprovementCard
                    key={area.id}
                    icon={Icon}
                    iconColor={styles.iconColor}
                    title={area.title}
                    summary={area.summary}
                    details={
                      <div className="space-y-3">
                        {area.sections.map((section, index) => (
                          <div key={`${area.id}-section-${index}`}>
                            <h5 className="font-semibold text-gray-900 mb-2">
                              {section.heading}
                            </h5>
                            {section.body ? (
                              <p className="text-sm text-gray-700">{section.body}</p>
                            ) : null}
                            {section.bullets && section.bullets.length > 0 ? (
                              <ul className="text-sm text-gray-700 space-y-2 mt-2">
                                {section.bullets.map((bullet, bulletIndex) => (
                                  <li
                                    key={`${area.id}-section-${index}-bullet-${bulletIndex}`}
                                    className="flex gap-2"
                                  >
                                    <span>•</span>
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        ))}
                        <div className={`${styles.actionWrap} rounded p-3`}>
                          <p className={`text-xs font-semibold mb-1 ${styles.actionTitle}`}>
                            RECOMMENDED ACTION
                          </p>
                          <p className={`text-sm ${styles.actionBody}`}>{area.recommendedAction}</p>
                        </div>
                      </div>
                    }
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
