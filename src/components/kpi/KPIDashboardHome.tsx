import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
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
import { useCurrency } from "@/hooks/useCurrency";

export const KPIDashboardHome = () => {
  const { format, formatShort } = useCurrency();
  // Top-line KPIs data
  const topLineKPIs = [
    {
      label: "Monthly Revenue",
      value: format(245000),
      trend: "+12%",
      color: "text-green-600",
      bgColor: "bg-green-50",
      icon: "📈",
    },
    {
      label: "Sales Target",
      value: format(250000),
      trend: "-2%",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      icon: "🎯",
    },
    {
      label: "Revenue Gap",
      value: format(5000),
      trend: "-98%",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      icon: "⚠️",
    },
    {
      label: "Deals Closed",
      value: "12",
      trend: "+5",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      icon: "✅",
    },
    {
      label: "Leads Generated",
      value: "45",
      trend: "+8",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      icon: "👥",
    },
    {
      label: "Win Rate",
      value: "34%",
      trend: "+3%",
      color: "text-red-600",
      bgColor: "bg-red-50",
      icon: "🏆",
    },
  ];

  // Revenue Trend data (last 6 months)
  const revenueTrendData = [
    { month: "Aug", revenue: 182000, target: 200000 },
    { month: "Sep", revenue: 195000, target: 200000 },
    { month: "Oct", revenue: 212000, target: 220000 },
    { month: "Nov", revenue: 228000, target: 230000 },
    { month: "Dec", revenue: 235000, target: 240000 },
    { month: "Jan", revenue: 245000, target: 250000 },
  ];

  // Conversion Funnel data
  const conversionFunnelData = [
    { stage: "Leads", value: 450, percentage: 100 },
    { stage: "Qualified", value: 180, percentage: 40 },
    { stage: "Proposals", value: 72, percentage: 16 },
    { stage: "Closed", value: 35, percentage: 8 },
  ];

  // Sales Cycle Trend
  const salesCycleTrendData = [
    { month: "Aug", days: 35 },
    { month: "Sep", days: 34 },
    { month: "Oct", days: 32 },
    { month: "Nov", days: 30 },
    { month: "Dec", days: 28 },
    { month: "Jan", days: 25 },
  ];

  // Pipeline vs Target
  const pipelineVsTargetData = [
    { category: "Pipeline Value", current: 450000, target: 500000 },
    { category: "Qualified Deals", current: 125000, target: 150000 },
    { category: "Advanced Stage", current: 85000, target: 100000 },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-6">
      {/* Top-Line KPIs - Big Numbers Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4">At a Glance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topLineKPIs.map((kpi, idx) => (
            <Card key={idx} className={kpi.bgColor}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{kpi.label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {kpi.value}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      {kpi.trend.startsWith("-") ? (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      )}
                      <span className={`text-sm font-semibold ${kpi.color}`}>
                        {kpi.trend}
                      </span>
                    </div>
                  </div>
                  <span className="text-3xl">{kpi.icon}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>📈 Revenue Trend (Last 6 Months)</CardTitle>
            <CardDescription>
              Monthly revenue vs target comparison
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Actual Revenue"
                  dot={{ fill: "#10b981", r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target Revenue"
                  dot={{ fill: "#3b82f6", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Leads vs Deals Conversion Funnel</CardTitle>
              <CardDescription>
                Sales funnel performance overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnelData.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">{item.stage}</span>
                      <span className="text-sm text-gray-600">
                        {item.value} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          idx === 0
                            ? "bg-cyan-500"
                            : idx === 1
                              ? "bg-blue-500"
                              : idx === 2
                                ? "bg-purple-500"
                                : "bg-green-500"
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales Cycle Trend */}
          <Card>
            <CardHeader>
              <CardTitle>📉 Sales Cycle Trend</CardTitle>
              <CardDescription>
                Average days to close (decreasing is good)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesCycleTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} days`} />
                  <Bar dataKey="days" fill="#f59e0b" name="Days to Close" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Pipeline vs Target */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Pipeline vs Target Chart</CardTitle>
            <CardDescription>
              Current pipeline health and target alignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineVsTargetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Legend />
                <Bar dataKey="current" fill="#10b981" name="Current" />
                <Bar dataKey="target" fill="#3b82f6" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* KPI Summary Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base">KPI Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Overall Health</p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="font-semibold">Excellent (92%)</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">KPIs on Track</p>
              <span className="font-semibold">18 / 22</span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Requires Attention</p>
              <span className="font-semibold">4 KPIs</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
