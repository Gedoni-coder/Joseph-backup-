import React, { useRef } from "react";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

interface ValidationReportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  startDate: Date;
  endDate: Date;
}

// Mock data generator
const generateMockReportData = (startDate: Date, endDate: Date) => {
  const periodLabel = `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd, yyyy")}`;

  return {
    period: periodLabel,
    generatedAt: new Date(),
    executiveSummary: {
      accuracyScore: 88.5,
      conclusion: "Pass",
      keyVariances: [
        { metric: "Revenue", variance: 2.3 },
        { metric: "Expenses", variance: -1.8 },
        { metric: "Net Income", variance: 3.1 },
      ],
    },
    forecastVsActual: [
      {
        period: "Week 1",
        status: "accurate",
        forecastedRevenue: 450000,
        actualRevenue: 461000,
        revenueVariance: 2.4,
        forecastedNetIncome: 125000,
        actualNetIncome: 132000,
        accuracyScore: 89,
      },
      {
        period: "Week 2",
        status: "accurate",
        forecastedRevenue: 425000,
        actualRevenue: 418000,
        revenueVariance: -1.6,
        forecastedNetIncome: 118000,
        actualNetIncome: 115000,
        accuracyScore: 87,
      },
      {
        period: "Week 3",
        status: "acceptable",
        forecastedRevenue: 480000,
        actualRevenue: 492000,
        revenueVariance: 2.5,
        forecastedNetIncome: 133000,
        actualNetIncome: 140000,
        accuracyScore: 90,
      },
      {
        period: "Week 4",
        status: "accurate",
        forecastedRevenue: 410000,
        actualRevenue: 403000,
        revenueVariance: -1.7,
        forecastedNetIncome: 113000,
        actualNetIncome: 109000,
        accuracyScore: 86,
      },
    ],
    budgetAlignment: {
      revenueAlignment: 88,
      expenseAlignment: 94,
      cashFlowAlignment: 79,
      marketAlignment: 86,
    },
    insights: [
      {
        type: "positive",
        title: "Strong Revenue Performance",
        description:
          "Revenue consistently outperforms forecasts by an average of 2.3%, indicating robust market demand and effective sales execution.",
        icon: TrendingUp,
      },
      {
        type: "neutral",
        title: "Expense Volatility Detected",
        description:
          "Operating expenses show higher variance than forecasted, particularly in weeks 1-2. Review procurement patterns and staffing costs.",
        icon: AlertCircle,
      },
      {
        type: "positive",
        title: "Improved Seasonal Forecasting",
        description:
          "Q1 and Q4 forecasts now incorporate stronger seasonal patterns, improving prediction accuracy by 4.2%.",
        icon: TrendingUp,
      },
      {
        type: "neutral",
        title: "Cash Flow Forecast Gap",
        description:
          "Cash flow predictions lag by approximately 3-5 days. Consider adjusting payment cycle assumptions in future forecasts.",
        icon: AlertCircle,
      },
    ],
  };
};

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "accurate":
      return "bg-green-100 text-green-800";
    case "acceptable":
      return "bg-yellow-100 text-yellow-800";
    case "concerning":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getConclusionColor = (conclusion: string) => {
  switch (conclusion) {
    case "Pass":
      return "bg-green-100 text-green-800";
    case "Needs Review":
      return "bg-yellow-100 text-yellow-800";
    case "Fail":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ValidationReport({
  open,
  onOpenChange,
  startDate,
  endDate,
}: ValidationReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const data = generateMockReportData(startDate, endDate);

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(
        `Validated-Forecast-${format(new Date(), "yyyy-MM-dd-HHmmss")}.pdf`,
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const downloadCSV = () => {
    const headers = [
      "Period",
      "Status",
      "Forecasted Revenue",
      "Actual Revenue",
      "Revenue Variance",
      "Forecasted Net Income",
      "Actual Net Income",
      "Accuracy Score",
    ];

    const rows = data.forecastVsActual.map((row) => [
      row.period,
      row.status,
      row.forecastedRevenue,
      row.actualRevenue,
      row.revenueVariance,
      row.forecastedNetIncome,
      row.actualNetIncome,
      row.accuracyScore,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Validated-Forecast-${format(new Date(), "yyyy-MM-dd-HHmmss")}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Validation Report</DialogTitle>
          <DialogDescription>
            {data.period} • Generated on{" "}
            {format(data.generatedAt, "MMM dd, yyyy")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6" ref={reportRef}>
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-2">
              Validated Forecast Report
            </h1>
            <p className="text-blue-100">
              Comprehensive validation analysis for {data.period}
            </p>
          </div>

          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
              <CardDescription>
                Key findings and overall validation conclusion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-6">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Overall Accuracy Score
                  </p>
                  <p className="text-4xl font-bold text-blue-600">
                    {data.executiveSummary.accuracyScore.toFixed(1)}%
                  </p>
                </div>

                <div className="border rounded-lg p-6">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Validation Status
                  </p>
                  <div>
                    <Badge
                      className={getConclusionColor(
                        data.executiveSummary.conclusion,
                      )}
                    >
                      {data.executiveSummary.conclusion}
                    </Badge>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <p className="text-sm font-medium text-gray-600 mb-2">
                    Average Variance
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {(
                      data.executiveSummary.keyVariances.reduce(
                        (sum, v) => sum + Math.abs(v.variance),
                        0,
                      ) / data.executiveSummary.keyVariances.length
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Key Variances
                </h3>
                <div className="space-y-2">
                  {data.executiveSummary.keyVariances.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-700">
                        {item.metric}
                      </span>
                      <span
                        className={`font-medium ${item.variance >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {formatPercent(item.variance)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forecast vs Actual Table */}
          <Card>
            <CardHeader>
              <CardTitle>Forecast vs Actual Performance</CardTitle>
              <CardDescription>
                Detailed comparison of forecasted vs actual financial metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium">
                        Period
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        Forecasted Revenue
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        Actual Revenue
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        Variance
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        Forecasted NI
                      </th>
                      <th className="text-right py-3 px-4 font-medium">
                        Actual NI
                      </th>
                      <th className="text-center py-3 px-4 font-medium">
                        Accuracy
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.forecastVsActual.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{row.period}</td>
                        <td className="text-center py-3 px-4">
                          <Badge className={getStatusColor(row.status)}>
                            {row.status}
                          </Badge>
                        </td>
                        <td className="text-right py-3 px-4">
                          {formatCurrency(row.forecastedRevenue)}
                        </td>
                        <td className="text-right py-3 px-4">
                          {formatCurrency(row.actualRevenue)}
                        </td>
                        <td className="text-right py-3 px-4">
                          <span
                            className={
                              row.revenueVariance >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {formatPercent(row.revenueVariance)}
                          </span>
                        </td>
                        <td className="text-right py-3 px-4">
                          {formatCurrency(row.forecastedNetIncome)}
                        </td>
                        <td className="text-right py-3 px-4">
                          {formatCurrency(row.actualNetIncome)}
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Progress
                              value={row.accuracyScore}
                              className="w-16 h-2"
                            />
                            <span className="text-sm font-medium">
                              {row.accuracyScore}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Budget Alignment Scorecard */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Alignment Scorecard</CardTitle>
              <CardDescription>
                How well your budgets align with forecasts and actuals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    name: "Revenue Alignment",
                    value: data.budgetAlignment.revenueAlignment,
                  },
                  {
                    name: "Expense Alignment",
                    value: data.budgetAlignment.expenseAlignment,
                  },
                  {
                    name: "Cash Flow Alignment",
                    value: data.budgetAlignment.cashFlowAlignment,
                  },
                  {
                    name: "Market Alignment",
                    value: data.budgetAlignment.marketAlignment,
                  },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm font-bold text-blue-600">
                        {item.value}%
                      </span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Forecast Accuracy Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                1. Overall Forecast Accuracy Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Current Forecast Accuracy
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-blue-600">
                        {data.executiveSummary.accuracyScore.toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-600">
                        (Acceptable performance with improvement opportunities)
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <p className="text-sm text-gray-700">
                      Your organization's forecast accuracy stands at{" "}
                      <span className="font-semibold">
                        {data.executiveSummary.accuracyScore.toFixed(1)}%
                      </span>
                      , indicating that most projections are directionally
                      correct but require refinement in certain areas. The
                      average variance across all periods is{" "}
                      <span className="font-semibold">
                        {(
                          data.executiveSummary.keyVariances.reduce(
                            (sum, v) => sum + Math.abs(v.variance),
                            0,
                          ) / data.executiveSummary.keyVariances.length
                        ).toFixed(2)}
                        %
                      </span>
                      , which demonstrates acceptable forecasting discipline but
                      signals that strategic refinements can unlock
                      significantly greater accuracy.
                    </p>

                    <p className="text-sm text-gray-700">
                      Budget alignment is strong at{" "}
                      <span className="font-semibold">92%</span>, showing that
                      your budget planning process is consistent with actual
                      performance conditions. This indicates disciplined
                      financial governance and realistic planning assumptions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forecast Performance Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                2. Forecast vs Actual Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {data.forecastVsActual.map((row, index) => (
                <div key={index} className="border rounded-lg p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {row.period}
                      </h4>
                      <Badge className={cn(getStatusColor(row.status), "mt-2")}>
                        {row.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">
                        Accuracy Score
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {row.accuracyScore}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">
                        Revenue
                      </p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500">
                            Forecast:
                          </span>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(row.forecastedRevenue)}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Actual:</span>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(row.actualRevenue)}
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded px-2 py-1">
                          <span className="text-xs text-gray-600">
                            Variance:{" "}
                          </span>
                          <span
                            className={`font-semibold ${row.revenueVariance >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {formatPercent(row.revenueVariance)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">
                        Net Income
                      </p>
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs text-gray-500">
                            Forecast:
                          </span>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(row.forecastedNetIncome)}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Actual:</span>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(row.actualNetIncome)}
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded px-2 py-1">
                          <span className="text-xs text-gray-600">Var: </span>
                          <span className="font-semibold text-green-600">
                            {formatPercent(
                              ((row.actualNetIncome - row.forecastedNetIncome) /
                                row.forecastedNetIncome) *
                                100,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">
                        Interpretation
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {row.revenueVariance >= 0 &&
                        row.actualNetIncome > row.forecastedNetIncome
                          ? "Both revenue and net income exceeded forecasts, indicating conservative estimation or stronger-than-expected seasonal demand."
                          : row.revenueVariance < 0 &&
                              row.actualNetIncome < row.forecastedNetIncome
                            ? "Both metrics underperformed, suggesting demand softness or unexpected cost pressures."
                            : "Mixed results warrant deeper analysis of underlying drivers and market conditions."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Budget Alignment Deep Dive */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                3. Budget Alignment Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">
                        Category
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">
                        Alignment Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        name: "Revenue Forecasting",
                        value: data.budgetAlignment.revenueAlignment,
                      },
                      {
                        name: "Expense Planning",
                        value: data.budgetAlignment.expenseAlignment,
                      },
                      {
                        name: "Cash Flow Prediction",
                        value: data.budgetAlignment.cashFlowAlignment,
                      },
                      {
                        name: "Market Condition Factors",
                        value: data.budgetAlignment.marketAlignment,
                      },
                    ].map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">
                          <p className="font-medium text-gray-900">
                            {item.name}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-3">
                            <Progress value={item.value} className="w-32 h-2" />
                            <span className="font-bold text-gray-900 min-w-12 text-right">
                              {item.value}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h4 className="font-semibold text-gray-900">
                  Interpretation by Category:
                </h4>

                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-green-900 mb-2">
                      Expense Planning ({data.budgetAlignment.expenseAlignment}
                      %)
                    </p>
                    <p className="text-sm text-gray-700">
                      Excellent control and predictability. Your organization
                      demonstrates strong cost discipline with tight variance
                      management. This is a significant strength and indicates
                      disciplined procurement and resource allocation practices.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      Revenue Forecasting (
                      {data.budgetAlignment.revenueAlignment}%)
                    </p>
                    <p className="text-sm text-gray-700">
                      Strong performance, though slightly under-sensitive to
                      high-growth periods. Revenue forecasts are generally
                      reliable but may not fully capture upside potential during
                      strong market cycles. Consider incorporating leading sales
                      indicators for improved sensitivity.
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-yellow-900 mb-2">
                      Cash Flow Prediction (
                      {data.budgetAlignment.cashFlowAlignment}%)
                    </p>
                    <p className="text-sm text-gray-700">
                      The lowest alignment score, indicating inconsistent
                      inflows/outflows or timing mismatches. This is the primary
                      area for improvement and suggests that payment cycles,
                      receivables collection, and payables management need
                      refinement. Weekly forecasting may yield better
                      visibility.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      Market Condition Factors (
                      {data.budgetAlignment.marketAlignment}%)
                    </p>
                    <p className="text-sm text-gray-700">
                      Good integration of external factors, but external demand
                      shocks may not be fully accounted for. Consider deeper
                      integration of real-time economic indicators, competitive
                      intelligence, and market sentiment data.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Accuracy Patterns & Signals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                4. Accuracy Patterns & Performance Signals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-transparent">
                  <div className="flex gap-4">
                    <TrendingUp className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Revenue Forecasting Strength
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Revenues are consistently outperforming projections by
                        an average of{" "}
                        <span className="font-semibold">+3.2%</span>, signaling
                        a positive and predictable pattern rather than random
                        variance.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <span className="font-semibold">Root Cause:</span> This
                        pattern suggests conservative sales forecasting, robust
                        market demand, or execution excellence outpacing
                        expectations.
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Implication:</span> You
                        may be leaving strategic growth opportunities on the
                        table. More aggressive revenue targets could unlock
                        better scaling and resource allocation decisions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-gradient-to-r from-yellow-50 to-transparent">
                  <div className="flex gap-4">
                    <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Expense Volatility Challenge
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Operating expenses show noticeable volatility,
                        particularly in weeks 1–2, increasing the complexity of
                        accurate net income forecasting.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <span className="font-semibold">Impact Areas:</span>{" "}
                        Procurement patterns, staffing costs, and discretionary
                        spending appear to fluctuate more than expected.
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">
                          Strategic Concern:
                        </span>{" "}
                        This volatility weakens the stability of cash-flow
                        predictions and complicates budgeting discipline.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-gradient-to-r from-blue-50 to-transparent">
                  <div className="flex gap-4">
                    <TrendingUp className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Seasonal Pattern Recognition
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Q1 and Q4 consistently show recurring seasonal uplift in
                        revenue, indicating predictable patterns driven by
                        market cycles or business seasonality.
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        <span className="font-semibold">Current State:</span>{" "}
                        These patterns are partially captured but not weighted
                        heavily enough in forecast models.
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Opportunity:</span>{" "}
                        Incorporating stronger seasonal adjustments could
                        improve accuracy by 3–5 percentage points.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">5. Key Insights Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    Forecast accuracy is solid at{" "}
                    {data.executiveSummary.accuracyScore.toFixed(1)}% but
                    improvable, especially in cash flow timing and
                    predictability.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    Budget alignment is very strong at 92%, indicating
                    disciplined financial planning and realistic forecasting
                    assumptions.
                  </span>
                </li>
                <li className="flex gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    Revenue consistently exceeds forecasts (+3.2% average),
                    creating an opportunity for more aggressive sales
                    forecasting and strategic scaling.
                  </span>
                </li>
                <li className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    Expense fluctuations are the primary source of forecasting
                    noise and should be prioritized for control and
                    predictability improvements.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                6. Recommendations for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  number: 1,
                  title: "Adjust Forecast Models for Seasonal Demand",
                  description:
                    "Q1 and Q4 uplift should be incorporated directly into forecast assumptions through increased seasonal weighting. Implementation of dynamic seasonal factors could improve accuracy by 3–5%.",
                  timeline: "30 days",
                  impact: "High",
                },
                {
                  number: 2,
                  title: "Improve Expense Categorization & Predictability",
                  description:
                    "Introduce more granular tracking for high-variance expense categories (procurement, staffing, discretionary). Integrate sub-category forecasts into rolling monthly and quarterly projections.",
                  timeline: "45 days",
                  impact: "High",
                },
                {
                  number: 3,
                  title: "Strengthen Cash Flow Timing Models",
                  description:
                    "Transition from monthly to weekly cash flow forecasting to reduce timing variance in inflows and outflows. Incorporate payment cycle analysis and receivables aging data.",
                  timeline: "60 days",
                  impact: "High",
                },
                {
                  number: 4,
                  title: "Increase Forecast Sensitivity to Market Indicators",
                  description:
                    "Integrate real-time economic indicators more deeply into forecasts, especially demand-side signals affecting revenue. Monitor competitor activity and market sentiment.",
                  timeline: "90 days",
                  impact: "Medium",
                },
              ].map((rec) => (
                <div
                  key={rec.number}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {rec.number}. {rec.title}
                      </h4>
                      <p className="text-sm text-gray-700 mt-2">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <span className="text-gray-600">Timeline:</span>
                      <p className="font-semibold text-gray-900">
                        {rec.timeline}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Impact:</span>
                      <p
                        className={`font-semibold ${rec.impact === "High" ? "text-green-600" : "text-blue-600"}`}
                      >
                        {rec.impact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Overall Verdict */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-xl">
                7. Overall Verdict & Strategic Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  Your organization demonstrates{" "}
                  <span className="font-semibold">
                    strong financial discipline
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold">
                    well-aligned budgeting processes
                  </span>
                  . The 92% budget alignment score reflects maturity in
                  financial planning and realistic forecasting assumptions.
                </p>

                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  However, forecast accuracy can be{" "}
                  <span className="font-semibold">significantly enhanced</span>{" "}
                  by:
                </p>

                <ul className="space-y-2 mb-4">
                  <li className="text-sm text-gray-700 flex gap-2">
                    <span className="font-semibold">•</span> Refining seasonal
                    patterns in quarterly forecasts
                  </li>
                  <li className="text-sm text-gray-700 flex gap-2">
                    <span className="font-semibold">•</span> Tightening controls
                    on expense volatility
                  </li>
                  <li className="text-sm text-gray-700 flex gap-2">
                    <span className="font-semibold">•</span> Improving cash flow
                    timing predictions through weekly analysis
                  </li>
                </ul>

                <p className="text-sm text-gray-700 leading-relaxed border-t pt-4">
                  This validation demonstrates that your business operates with{" "}
                  <span className="font-semibold">
                    strong financial predictability
                  </span>
                  . By implementing the six recommendations outlined above, you
                  can unlock even greater accuracy, improve strategic
                  decision-making, and unlock new opportunities for profitable
                  growth and operational optimization.
                </p>
              </div>

              <div className="bg-white border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-xs text-gray-600 mb-2 uppercase tracking-wide font-semibold">
                  Validation Status
                </p>
                <Badge className="bg-green-100 text-green-800 text-base py-2 px-4">
                  PASS – Proceed with current strategy while implementing
                  improvements
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="border-t pt-6 text-center text-sm text-gray-600">
            <p>
              Report generated on{" "}
              {format(data.generatedAt, "MMMM dd, yyyy 'at' HH:mm")}
            </p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-3 justify-end mt-6 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Close
          </Button>
          <Button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
