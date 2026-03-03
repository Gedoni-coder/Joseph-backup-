import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
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

interface KPIMetric {
  label: string;
  value: string | number;
  change: number;
  isPositive: boolean;
  color: string;
}

interface KPIDashboardProps {
  totalRevenue?: number;
  totalTarget?: number;
  leadsGenerated?: number;
  winRate?: number;
  avgDealSize?: number;
  salesCycle?: number;
  revenueTrend?: number;
  winRateTrend?: number;
  dealSizeTrend?: number;
  salesCycleTrend?: number;
  revenueTrendData?: Array<{ month: string; revenue: number }>;
  leadsVsDealsData?: Array<{ stage: string; count: number }>;
  salesCycleTrendData?: Array<{ month: string; days: number }>;
  pipelineVsTargetData?: Array<{ name: string; value: number }>;
}

const KPIDashboard = ({
  totalRevenue = 0,
  totalTarget = 0,
  leadsGenerated = 0,
  winRate = 0,
  avgDealSize = 0,
  salesCycle = 0,
  revenueTrend = 0,
  winRateTrend = 0,
  dealSizeTrend = 0,
  salesCycleTrend = 0,
  revenueTrendData = [],
  leadsVsDealsData = [],
  salesCycleTrendData = [],
  pipelineVsTargetData = [],
}: KPIDashboardProps) => {
  const { format } = useCurrency();

  // Calculate revenue gap
  const revenueGap = totalRevenue - totalTarget;

  // Calculate deal closed (estimate based on revenue and average deal size)
  const dealsClosed =
    avgDealSize > 0 ? Math.round(totalRevenue / avgDealSize) : 0;

  const topLineKPIs: KPIMetric[] = [
    {
      label: "Total Revenue",
      value: totalRevenue > 0 ? format(totalRevenue) : format(0),
      change: revenueTrend,
      isPositive: revenueTrend >= 0,
      color: "text-green-600",
    },
    {
      label: "Sales Target",
      value: totalTarget > 0 ? format(totalTarget) : format(0),
      change: 0,
      isPositive: true,
      color: "text-blue-600",
    },
    {
      label: "Revenue Gap",
      value: revenueGap > 0 ? format(revenueGap) : format(revenueGap),
      change:
        totalTarget > 0
          ? parseFloat(((revenueGap / totalTarget) * 100).toFixed(1))
          : 0,
      isPositive: revenueGap >= 0,
      color: revenueGap >= 0 ? "text-green-600" : "text-orange-600",
    },
    {
      label: "Deals Closed",
      value: dealsClosed,
      change: dealSizeTrend,
      isPositive: dealSizeTrend >= 0,
      color: "text-purple-600",
    },
    {
      label: "Leads Generated",
      value: leadsGenerated,
      change: winRateTrend,
      isPositive: winRateTrend >= 0,
      color: "text-indigo-600",
    },
    {
      label: "Win Rate",
      value: `${Math.round(winRate)}%`,
      change: winRateTrend,
      isPositive: winRateTrend >= 0,
      color: "text-pink-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top-Line KPIs */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Top-Line Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topLineKPIs.map((metric, idx) => (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                    <p className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </p>
                    <div className="flex items-center gap-1 mt-3">
                      {metric.isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          metric.isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {metric.isPositive ? "+" : ""}
                        {metric.change.toFixed(1)}% vs last month
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Visual Charts Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Revenue Trend (Last 6 Months)
              </CardTitle>
              <CardDescription>Monthly revenue performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    name="Revenue"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Leads vs Deals Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Leads vs Deals Conversion
              </CardTitle>
              <CardDescription>Conversion funnel analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leadsVsDealsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sales Cycle Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sales Cycle Trend</CardTitle>
              <CardDescription>Average days to close over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesCycleTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} days`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="days"
                    stroke="#f59e0b"
                    name="Days to Close"
                    strokeWidth={2}
                    dot={{ fill: "#f59e0b", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pipeline vs Target */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pipeline vs Target</CardTitle>
              <CardDescription>
                Current pipeline vs sales targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pipelineVsTargetData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(2)}M`} />
                  <Bar dataKey="value" fill="#8b5cf6" name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;
