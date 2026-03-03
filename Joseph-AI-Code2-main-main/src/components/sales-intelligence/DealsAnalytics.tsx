import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
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
  LineChart,
  Line,
} from "recharts";
import { TrendingUp, Target, AlertCircle, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCurrency } from "@/lib/currency-context";

interface RevenueData {
  category: string;
  revenue: number;
  percentage: number;
}

interface ForecastData {
  month: string;
  forecast: number;
  bestCase: number;
  baseCase: number;
  worstCase: number;
}

interface DealsAnalyticsProps {
  revenueByProduct?: RevenueData[];
  revenueByRegion?: RevenueData[];
  revenueBySalesRep?: RevenueData[];
  revenueByIndustry?: RevenueData[];
  revenueBySegment?: RevenueData[];
  forecastData?: ForecastData[];
  totalRevenue?: number;
  repeatRevenueRate?: number;
  repeatRevenueTrend?: number;
  pipelineRisk?: number;
  dealVelocityRisk?: number;
  repPerformanceRisk?: number;
}

// Default empty data for when no data is available
const DEFAULT_REVENUE_DATA: RevenueData[] = [
  { category: "No Data", revenue: 0, percentage: 0 },
];

const DEFAULT_FORECAST_DATA: ForecastData[] = [
  {
    month: "Jan",
    forecast: 0,
    bestCase: 0,
    baseCase: 0,
    worstCase: 0,
  },
];

const DealsAnalytics = ({
  revenueByProduct = DEFAULT_REVENUE_DATA,
  revenueByRegion = DEFAULT_REVENUE_DATA,
  revenueBySalesRep = DEFAULT_REVENUE_DATA,
  revenueByIndustry = DEFAULT_REVENUE_DATA,
  revenueBySegment = DEFAULT_REVENUE_DATA,
  forecastData = DEFAULT_FORECAST_DATA,
  totalRevenue = 0,
  repeatRevenueRate = 0,
  repeatRevenueTrend = 0,
  pipelineRisk = 0,
  dealVelocityRisk = 0,
  repPerformanceRisk = 0,
}: DealsAnalyticsProps) => {
  const { getCurrencySymbol, formatCurrency } = useCurrency();
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];

  // Calculate key insights
  const topProduct =
    revenueByProduct && revenueByProduct.length > 0
      ? revenueByProduct[0]
      : DEFAULT_REVENUE_DATA[0];
  const topRegion =
    revenueByRegion && revenueByRegion.length > 0
      ? revenueByRegion[0]
      : DEFAULT_REVENUE_DATA[0];
  const topSalesRep =
    revenueBySalesRep && revenueBySalesRep.length > 0
      ? revenueBySalesRep[0]
      : DEFAULT_REVENUE_DATA[0];

  // Calculate forecast metrics
  const totalForecast = forecastData.reduce(
    (sum, item) => sum + item.forecast,
    0,
  );
  const totalBestCase = forecastData.reduce(
    (sum, item) => sum + item.bestCase,
    0,
  );
  const totalWorstCase = forecastData.reduce(
    (sum, item) => sum + item.worstCase,
    0,
  );
  const annualTarget = 4800000;
  const forecastToTargetRatio = ((totalForecast * 2) / annualTarget) * 100;

  return (
    <div className="space-y-6">
      {/* Header Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getCurrencySymbol()}{(totalRevenue / 1000000).toFixed(2)}M
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">
              ↑ 12% vs last 6 months
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Top Product</p>
                <p className="text-2xl font-bold text-gray-900">
                  {topProduct.category}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {getCurrencySymbol()}{(topProduct.revenue / 1000).toFixed(0)}K (
              {topProduct.percentage}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Most Profitable Region
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {topRegion.category.split(" ")[0]}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {getCurrencySymbol()}{(topRegion.revenue / 1000).toFixed(0)}K ({topRegion.percentage}
              %)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Repeat Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  {repeatRevenueRate}%
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-green-600 mt-2">
              {repeatRevenueTrend >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(repeatRevenueTrend)}% Healthy retention rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Deal & Revenue Analytics</CardTitle>
          <CardDescription>
            Analyze revenue performance across different dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="product" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="product">By Product</TabsTrigger>
              <TabsTrigger value="region">By Region</TabsTrigger>
              <TabsTrigger value="rep">By Sales Rep</TabsTrigger>
              <TabsTrigger value="industry">By Industry</TabsTrigger>
              <TabsTrigger value="segment">By Segment</TabsTrigger>
            </TabsList>

            <TabsContent value="product" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueByProduct}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value / 1000}K`} />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueByProduct}
                      dataKey="revenue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {revenueByProduct.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value / 1000}K`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {revenueByProduct.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[idx] }}
                      ></div>
                      <span className="font-medium text-sm">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        ${(item.revenue / 1000).toFixed(0)}K
                      </span>
                      <Badge variant="secondary">{item.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="region" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueByRegion}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value / 1000}K`} />
                    <Bar dataKey="revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueByRegion}
                      dataKey="revenue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {revenueByRegion.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value / 1000}K`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {revenueByRegion.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[idx] }}
                      ></div>
                      <span className="font-medium text-sm">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        ${(item.revenue / 1000).toFixed(0)}K
                      </span>
                      <Badge variant="secondary">{item.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rep" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueBySalesRep}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value / 1000}K`} />
                    <Bar dataKey="revenue" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueBySalesRep}
                      dataKey="revenue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {revenueBySalesRep.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value / 1000}K`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {revenueBySalesRep.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[idx] }}
                      ></div>
                      <span className="font-medium text-sm">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        ${(item.revenue / 1000).toFixed(0)}K
                      </span>
                      <Badge variant="secondary">{item.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="industry" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueByIndustry}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value / 1000}K`} />
                    <Bar dataKey="revenue" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueByIndustry}
                      dataKey="revenue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {revenueByIndustry.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value / 1000}K`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {revenueByIndustry.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[idx] }}
                      ></div>
                      <span className="font-medium text-sm">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        ${(item.revenue / 1000).toFixed(0)}K
                      </span>
                      <Badge variant="secondary">{item.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="segment" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueBySegment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value / 1000}K`} />
                    <Bar dataKey="revenue" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={revenueBySegment}
                      dataKey="revenue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {revenueBySegment.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value / 1000}K`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {revenueBySegment.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: colors[idx] }}
                      ></div>
                      <span className="font-medium text-sm">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        ${(item.revenue / 1000).toFixed(0)}K
                      </span>
                      <Badge variant="secondary">{item.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Forecasting & Scenario Planning Section */}
      <Card>
        <CardHeader>
          <CardTitle>Forecasting & Scenario Planning</CardTitle>
          <CardDescription>
            Predictive revenue analysis and what-if scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Forecast Chart */}
            <div>
              <h4 className="text-sm font-semibold mb-4">
                Revenue Forecast (Next 6 Months)
              </h4>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value / 1000}K`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="bestCase"
                    stroke="#10b981"
                    name="Best Case"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseCase"
                    stroke="#3b82f6"
                    name="Base Case"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="worstCase"
                    stroke="#ef4444"
                    name="Worst Case"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Forecast Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-2">Best Case (6m)</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${(totalBestCase / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    If all high-probability deals close
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-2">Base Case (6m)</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${(totalForecast / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Most likely scenario
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-red-50">
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600 mb-2">Worst Case (6m)</p>
                  <p className="text-2xl font-bold text-red-600">
                    ${(totalWorstCase / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Conservative estimate
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Key Questions Answered */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-base">
                  Key Questions Answered
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-green-600">
                        ✓
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        Will we hit our annual target?
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        At base case rate: {forecastToTargetRatio.toFixed(0)}%
                        probability of hitting $
                        {(annualTarget / 1000000).toFixed(1)}M target
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-blue-600">→</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        How many deals do we need per month?
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        ~3-4 enterprise deals or 8-10 mid-market deals to stay
                        on track
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-orange-600">
                        ⚠
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        How much pipeline do we need to be safe?
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Maintain $6.5M-$8M in active pipeline for 3x conversion
                        buffer
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-purple-600">
                        →
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        What if we increase marketing by 20%?
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Projected impact: +$180K additional revenue (6% increase
                        in pipeline)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-base">Risk Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Pipeline Risk
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${pipelineRisk}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {pipelineRisk}% healthy ({pipelineRisk}% above minimum
                      threshold)
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Deal Velocity Risk
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${dealVelocityRisk}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {dealVelocityRisk}% on track (deals closing on schedule)
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-lg">
                    <p className="text-sm font-semibold text-gray-900 mb-2">
                      Rep Performance Risk
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${repPerformanceRisk}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {repPerformanceRisk}% on track (quota achievement)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealsAnalytics;
