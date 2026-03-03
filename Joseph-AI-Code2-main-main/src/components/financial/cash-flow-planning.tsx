import React, { useState, useMemo } from "react";
import {
  CashFlowProjection,
  LiquidityMetric,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Calendar,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
} from "lucide-react";
import { CreateProjectionDialog } from "./create-projection-dialog";

interface CashFlowPlanningProps {
  currentCashFlows: CashFlowProjection[];
  cashFlowProjections: CashFlowProjection[];
  liquidityMetrics: LiquidityMetric[];
  onAddProjection: (projection: Omit<CashFlowProjection, "id">) => void;
}

type TimeScope = "weekly" | "monthly" | "yearly";

const aggregateCashFlowsByMonth = (
  cashFlows: CashFlowProjection[],
): CashFlowProjection[] => {
  const grouped: { [key: string]: CashFlowProjection[] } = {};

  cashFlows.forEach((cf) => {
    const date = new Date(cf.date);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!grouped[yearMonth]) {
      grouped[yearMonth] = [];
    }
    grouped[yearMonth].push(cf);
  });

  return Object.entries(grouped).map(([yearMonth, flows]) => {
    const firstFlow = flows[0];
    const lastFlow = flows[flows.length - 1];

    const totalInflows = flows.reduce(
      (sum, flow) =>
        sum +
        flow.inflows.operatingCash +
        flow.inflows.accountsReceivable +
        flow.inflows.otherIncome,
      0,
    );

    const totalOutflows = flows.reduce(
      (sum, flow) =>
        sum +
        flow.outflows.operatingExpenses +
        flow.outflows.accountsPayable +
        flow.outflows.capitalExpenditure +
        flow.outflows.debtService,
      0,
    );

    const avgLiquidityRatio =
      flows.reduce((sum, flow) => sum + flow.liquidityRatio, 0) / flows.length;
    const avgDaysOfCash =
      flows.reduce((sum, flow) => sum + flow.daysOfCash, 0) / flows.length;

    return {
      id: `monthly-${yearMonth}`,
      date: flows[Math.floor(flows.length / 2)].date,
      openingBalance: firstFlow.openingBalance,
      inflows: {
        operatingCash: totalInflows * 0.65,
        accountsReceivable: totalInflows * 0.25,
        otherIncome: totalInflows * 0.1,
      },
      outflows: {
        operatingExpenses: totalOutflows * 0.5,
        accountsPayable: totalOutflows * 0.3,
        capitalExpenditure: totalOutflows * 0.15,
        debtService: totalOutflows * 0.05,
      },
      netCashFlow: totalInflows - totalOutflows,
      closingBalance: lastFlow.closingBalance,
      liquidityRatio: avgLiquidityRatio,
      daysOfCash: Math.round(avgDaysOfCash),
    };
  });
};

const aggregateCashFlowsByYear = (
  cashFlows: CashFlowProjection[],
): CashFlowProjection[] => {
  const grouped: { [key: string]: CashFlowProjection[] } = {};

  cashFlows.forEach((cf) => {
    const date = new Date(cf.date);
    const year = date.getFullYear().toString();

    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(cf);
  });

  return Object.entries(grouped).map(([year, flows]) => {
    const firstFlow = flows[0];
    const lastFlow = flows[flows.length - 1];

    const totalInflows = flows.reduce(
      (sum, flow) =>
        sum +
        flow.inflows.operatingCash +
        flow.inflows.accountsReceivable +
        flow.inflows.otherIncome,
      0,
    );

    const totalOutflows = flows.reduce(
      (sum, flow) =>
        sum +
        flow.outflows.operatingExpenses +
        flow.outflows.accountsPayable +
        flow.outflows.capitalExpenditure +
        flow.outflows.debtService,
      0,
    );

    const avgLiquidityRatio =
      flows.reduce((sum, flow) => sum + flow.liquidityRatio, 0) / flows.length;
    const avgDaysOfCash =
      flows.reduce((sum, flow) => sum + flow.daysOfCash, 0) / flows.length;

    return {
      id: `yearly-${year}`,
      date: flows[Math.floor(flows.length / 2)].date,
      openingBalance: firstFlow.openingBalance,
      inflows: {
        operatingCash: totalInflows * 0.65,
        accountsReceivable: totalInflows * 0.25,
        otherIncome: totalInflows * 0.1,
      },
      outflows: {
        operatingExpenses: totalOutflows * 0.5,
        accountsPayable: totalOutflows * 0.3,
        capitalExpenditure: totalOutflows * 0.15,
        debtService: totalOutflows * 0.05,
      },
      netCashFlow: totalInflows - totalOutflows,
      closingBalance: lastFlow.closingBalance,
      liquidityRatio: avgLiquidityRatio,
      daysOfCash: Math.round(avgDaysOfCash),
    };
  });
};

const getFilteredCashFlows = (
  cashFlows: CashFlowProjection[],
  scope: TimeScope,
): CashFlowProjection[] => {
  switch (scope) {
    case "weekly":
      return cashFlows;
    case "monthly":
      return aggregateCashFlowsByMonth(cashFlows);
    case "yearly":
      return aggregateCashFlowsByYear(cashFlows);
    default:
      return cashFlows;
  }
};

export function CashFlowPlanning({
  currentCashFlows,
  cashFlowProjections,
  liquidityMetrics,
  onAddProjection,
}: CashFlowPlanningProps) {
  const [currentCashFlowScope, setCurrentCashFlowScope] =
    useState<TimeScope>("weekly");
  const [projectionScope, setProjectionScope] = useState<TimeScope>("weekly");
  const [createProjectionOpen, setCreateProjectionOpen] = useState(false);

  const filteredCurrentCashFlows = useMemo(
    () => getFilteredCashFlows(currentCashFlows, currentCashFlowScope),
    [currentCashFlows, currentCashFlowScope],
  );

  const filteredProjections = useMemo(
    () => getFilteredCashFlows(cashFlowProjections, projectionScope),
    [cashFlowProjections, projectionScope],
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <span className="h-4 w-4 text-gray-400">—</span>;
    }
  };

  const totalInflows = useMemo(() => {
    return filteredProjections.reduce(
      (sum, proj) =>
        sum +
        proj.inflows.operatingCash +
        proj.inflows.accountsReceivable +
        proj.inflows.otherIncome,
      0,
    );
  }, [filteredProjections]);

  const totalOutflows = useMemo(() => {
    return filteredProjections.reduce(
      (sum, proj) =>
        sum +
        proj.outflows.operatingExpenses +
        proj.outflows.accountsPayable +
        proj.outflows.capitalExpenditure +
        proj.outflows.debtService,
      0,
    );
  }, [filteredProjections]);

  const averageLiquidity = useMemo(() => {
    return filteredProjections.length > 0
      ? filteredProjections.reduce(
          (sum, proj) => sum + proj.liquidityRatio,
          0,
        ) / filteredProjections.length
      : 0;
  }, [filteredProjections]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Cash Flow Planning & Liquidity Management
          </h2>
          <p className="text-gray-600">
            Near-term cash forecasts and liquidity monitoring
          </p>
        </div>
        <Button
          onClick={() => setCreateProjectionOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Create Projection
        </Button>
      </div>

      {/* Create Projection Dialog */}
      <CreateProjectionDialog
        open={createProjectionOpen}
        onOpenChange={setCreateProjectionOpen}
        onSave={(projection) => {
          if (onAddProjection) {
            onAddProjection({
              period: "custom",
              startDate: new Date(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              inflows: {
                operatingCash: projection.inputs.expectedRevenues,
                accountsReceivable: 0,
                otherIncome: 0,
              },
              outflows: {
                operatingExpenses: projection.inputs.expectedExpenses,
                accountsPayable: 0,
                capitalExpenditure: 0,
                debtService: 0,
              },
              projectedBalance:
                projection.projection30[projection.projection30.length - 1]
                  ?.balance || 0,
              liquidityRatio: 1.5,
              status: "healthy",
              variance: 0,
            });
          }
        }}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Cash Inflows
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalInflows)}
                </p>
              </div>
              <ArrowUpCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Cash Outflows
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalOutflows)}
                </p>
              </div>
              <ArrowDownCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Liquidity Ratio
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {averageLiquidity.toFixed(1)}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Cash Reserves
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(filteredProjections[0]?.daysOfCash || 0)} days
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liquidity Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Liquidity Health Metrics</CardTitle>
          <CardDescription>
            Key liquidity ratios and cash reserve monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {liquidityMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">
                    {metric.metric}
                  </span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(metric.trend)}
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: {metric.current.toFixed(2)}</span>
                    <span>Target: {metric.target.toFixed(2)}</span>
                  </div>
                  <Progress
                    value={Math.min(
                      100,
                      (metric.current / metric.target) * 100,
                    )}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Cash Flow */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Current Cash Flow</CardTitle>
              <CardDescription>
                Existing cash flows with daily, weekly, monthly and yearly scope
              </CardDescription>
            </div>
            <Select
              value={currentCashFlowScope}
              onValueChange={(value) =>
                setCurrentCashFlowScope(value as TimeScope)
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Date
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Opening Balance
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Total Inflows
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Total Outflows
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Net Cash Flow
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Closing Balance
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Liquidity Ratio
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Days of Cash
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCurrentCashFlows.map((cashFlow) => {
                  const totalInflow =
                    cashFlow.inflows.operatingCash +
                    cashFlow.inflows.accountsReceivable +
                    cashFlow.inflows.otherIncome;
                  const totalOutflow =
                    cashFlow.outflows.operatingExpenses +
                    cashFlow.outflows.accountsPayable +
                    cashFlow.outflows.capitalExpenditure +
                    cashFlow.outflows.debtService;

                  return (
                    <tr key={cashFlow.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {new Date(cashFlow.date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {formatCurrency(cashFlow.openingBalance)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium text-green-600">
                        {formatCurrency(totalInflow)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium text-red-600">
                        {formatCurrency(totalOutflow)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        <span
                          className={
                            cashFlow.netCashFlow >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {formatCurrency(cashFlow.netCashFlow)}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 font-bold">
                        {formatCurrency(cashFlow.closingBalance)}
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge
                          className={
                            cashFlow.liquidityRatio >= 2.5
                              ? "bg-green-100 text-green-800"
                              : cashFlow.liquidityRatio >= 1.5
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {cashFlow.liquidityRatio.toFixed(1)}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-medium">
                            {cashFlow.daysOfCash}
                          </span>
                          {cashFlow.daysOfCash < 30 && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Projections */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Cash Flow Projections</CardTitle>
              <CardDescription>
                Weekly and daily cash flow forecasts with liquidity analysis
              </CardDescription>
            </div>
            <Select
              value={projectionScope}
              onValueChange={(value) => setProjectionScope(value as TimeScope)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Date
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Opening Balance
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Total Inflows
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Total Outflows
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Net Cash Flow
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900">
                    Closing Balance
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Liquidity Ratio
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">
                    Days of Cash
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProjections.map((projection) => {
                  const totalInflow =
                    projection.inflows.operatingCash +
                    projection.inflows.accountsReceivable +
                    projection.inflows.otherIncome;
                  const totalOutflow =
                    projection.outflows.operatingExpenses +
                    projection.outflows.accountsPayable +
                    projection.outflows.capitalExpenditure +
                    projection.outflows.debtService;

                  return (
                    <tr
                      key={projection.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">
                            {new Date(projection.date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        {formatCurrency(projection.openingBalance)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium text-green-600">
                        {formatCurrency(totalInflow)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium text-red-600">
                        {formatCurrency(totalOutflow)}
                      </td>
                      <td className="text-right py-3 px-4 font-medium">
                        <span
                          className={
                            projection.netCashFlow >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {formatCurrency(projection.netCashFlow)}
                        </span>
                      </td>
                      <td className="text-right py-3 px-4 font-bold">
                        {formatCurrency(projection.closingBalance)}
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge
                          className={
                            projection.liquidityRatio >= 2.5
                              ? "bg-green-100 text-green-800"
                              : projection.liquidityRatio >= 1.5
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {projection.liquidityRatio.toFixed(1)}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-1">
                          <span className="font-medium">
                            {projection.daysOfCash}
                          </span>
                          {projection.daysOfCash < 30 && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cash Inflows Breakdown</CardTitle>
            <CardDescription>Sources of cash generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cashFlowProjections.slice(0, 3).map((projection) => (
                <div key={projection.id} className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    {projection.date
                      ? new Date(projection.date).toLocaleDateString()
                      : "N/A"}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Operating Cash
                      </span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(projection.inflows.operatingCash)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Accounts Receivable
                      </span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(projection.inflows.accountsReceivable)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Other Income
                      </span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(projection.inflows.otherIncome)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Outflows Breakdown</CardTitle>
            <CardDescription>Cash utilization and commitments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cashFlowProjections.slice(0, 3).map((projection) => (
                <div key={projection.id} className="space-y-3">
                  <h4 className="font-medium text-gray-900">
                    {projection.date
                      ? new Date(projection.date).toLocaleDateString()
                      : "N/A"}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Operating Expenses
                      </span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(projection.outflows.operatingExpenses)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Accounts Payable
                      </span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(projection.outflows.accountsPayable)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Capital Expenditure
                      </span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(projection.outflows.capitalExpenditure)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Debt Service
                      </span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(projection.outflows.debtService)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
