import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-context";

interface BusinessMetric {
  id: string;
  category: string;
  metric: string;
  current: number;
  target: number;
  lastMonth: number;
  unit: string;
  trend: "up" | "down" | "stable";
  variance: number;
  status: "excellent" | "good" | "fair" | "poor";
}

const businessMetrics: BusinessMetric[] = [
  // ==================== FINANCIAL KPIs ====================
  {
    id: "f1",
    category: "Financial",
    metric: "Revenue / Sales Growth",
    current: 22.5,
    target: 25.0,
    lastMonth: 18.3,
    unit: "%",
    trend: "up",
    variance: 23.0,
    status: "good",
  },
  {
    id: "f2",
    category: "Financial",
    metric: "Net Profit Margin",
    current: 18.5,
    target: 20.0,
    lastMonth: 17.2,
    unit: "%",
    trend: "up",
    variance: 7.6,
    status: "good",
  },
  {
    id: "f3",
    category: "Financial",
    metric: "Gross Profit Margin",
    current: 62.0,
    target: 65.0,
    lastMonth: 60.5,
    unit: "%",
    trend: "up",
    variance: 2.5,
    status: "good",
  },
  {
    id: "f4",
    category: "Financial",
    metric: "Operating Cash Flow",
    current: 2840000,
    target: 3200000,
    lastMonth: 2650000,
    unit: "USD",
    trend: "up",
    variance: 7.2,
    status: "good",
  },
  {
    id: "f5",
    category: "Financial",
    metric: "Return on Investment (ROI)",
    current: 35.8,
    target: 40.0,
    lastMonth: 32.1,
    unit: "%",
    trend: "up",
    variance: 11.5,
    status: "good",
  },
  {
    id: "f6",
    category: "Financial",
    metric: "Accounts Receivable Turnover",
    current: 8.2,
    target: 9.0,
    lastMonth: 7.8,
    unit: "times",
    trend: "up",
    variance: 5.1,
    status: "good",
  },
  {
    id: "f7",
    category: "Financial",
    metric: "Accounts Payable Turnover",
    current: 6.5,
    target: 7.0,
    lastMonth: 6.1,
    unit: "times",
    trend: "up",
    variance: 6.6,
    status: "good",
  },
  {
    id: "f8",
    category: "Financial",
    metric: "Budget Variance",
    current: 2.8,
    target: 2.0,
    lastMonth: 3.5,
    unit: "%",
    trend: "down",
    variance: -20.0,
    status: "fair",
  },

  // ==================== CUSTOMER KPIs ====================
  {
    id: "c1",
    category: "Customer",
    metric: "Customer Acquisition Cost (CAC)",
    current: 285,
    target: 250,
    lastMonth: 295,
    unit: "USD",
    trend: "down",
    variance: -3.4,
    status: "fair",
  },
  {
    id: "c2",
    category: "Customer",
    metric: "Customer Lifetime Value (CLV)",
    current: 4200,
    target: 4800,
    lastMonth: 4050,
    unit: "USD",
    trend: "up",
    variance: 3.7,
    status: "good",
  },
  {
    id: "c3",
    category: "Customer",
    metric: "Net Promoter Score (NPS)",
    current: 52,
    target: 60,
    lastMonth: 48,
    unit: "points",
    trend: "up",
    variance: 8.3,
    status: "good",
  },
  {
    id: "c4",
    category: "Customer",
    metric: "Customer Retention Rate",
    current: 91.5,
    target: 95.0,
    lastMonth: 89.8,
    unit: "%",
    trend: "up",
    variance: 1.9,
    status: "good",
  },
  {
    id: "c5",
    category: "Customer",
    metric: "Churn Rate",
    current: 2.1,
    target: 1.5,
    lastMonth: 2.3,
    unit: "%",
    trend: "down",
    variance: -8.7,
    status: "fair",
  },
  {
    id: "c6",
    category: "Customer",
    metric: "Average Response Time",
    current: 4.2,
    target: 2.0,
    lastMonth: 4.8,
    unit: "hours",
    trend: "down",
    variance: -12.5,
    status: "fair",
  },

  // ==================== SALES & MARKETING KPIs ====================
  {
    id: "sm1",
    category: "Sales & Marketing",
    metric: "Leads Generated",
    current: 1240,
    target: 1500,
    lastMonth: 1085,
    unit: "count",
    trend: "up",
    variance: 14.3,
    status: "good",
  },
  {
    id: "sm2",
    category: "Sales & Marketing",
    metric: "Lead Conversion Rate",
    current: 8.5,
    target: 10.0,
    lastMonth: 7.8,
    unit: "%",
    trend: "up",
    variance: 9.0,
    status: "good",
  },
  {
    id: "sm3",
    category: "Sales & Marketing",
    metric: "Sales Growth Rate",
    current: 22.5,
    target: 25.0,
    lastMonth: 18.3,
    unit: "%",
    trend: "up",
    variance: 23.0,
    status: "good",
  },
  {
    id: "sm4",
    category: "Sales & Marketing",
    metric: "Marketing ROI",
    current: 380,
    target: 450,
    lastMonth: 340,
    unit: "%",
    trend: "up",
    variance: 11.8,
    status: "good",
  },
  {
    id: "sm5",
    category: "Sales & Marketing",
    metric: "Website Traffic",
    current: 48500,
    target: 60000,
    lastMonth: 42300,
    unit: "visits",
    trend: "up",
    variance: 14.6,
    status: "good",
  },
  {
    id: "sm6",
    category: "Sales & Marketing",
    metric: "Website Conversion Rate",
    current: 3.2,
    target: 4.0,
    lastMonth: 2.9,
    unit: "%",
    trend: "up",
    variance: 10.3,
    status: "good",
  },
  {
    id: "sm7",
    category: "Sales & Marketing",
    metric: "Cost Per Lead",
    current: 85,
    target: 75,
    lastMonth: 92,
    unit: "USD",
    trend: "down",
    variance: -7.6,
    status: "fair",
  },
  {
    id: "sm8",
    category: "Sales & Marketing",
    metric: "Sales Pipeline Coverage",
    current: 3.8,
    target: 4.0,
    lastMonth: 3.5,
    unit: "ratio",
    trend: "up",
    variance: 8.6,
    status: "good",
  },

  // ==================== OPERATIONAL / PROCESS KPIs ====================
  {
    id: "op1",
    category: "Operational",
    metric: "Cycle Time",
    current: 6.2,
    target: 5.0,
    lastMonth: 6.8,
    unit: "days",
    trend: "down",
    variance: -8.8,
    status: "fair",
  },
  {
    id: "op2",
    category: "Operational",
    metric: "Order Fulfillment Time",
    current: 3.5,
    target: 2.5,
    lastMonth: 3.8,
    unit: "days",
    trend: "down",
    variance: -7.9,
    status: "fair",
  },
  {
    id: "op3",
    category: "Operational",
    metric: "Inventory Turnover Rate",
    current: 4.2,
    target: 5.0,
    lastMonth: 3.9,
    unit: "times",
    trend: "up",
    variance: 7.7,
    status: "good",
  },
  {
    id: "op4",
    category: "Operational",
    metric: "Manufacturing Defect Rate",
    current: 1.2,
    target: 0.8,
    lastMonth: 1.5,
    unit: "%",
    trend: "down",
    variance: -20.0,
    status: "fair",
  },
  {
    id: "op5",
    category: "Operational",
    metric: "On-Time Delivery Rate",
    current: 94.5,
    target: 98.0,
    lastMonth: 92.1,
    unit: "%",
    trend: "up",
    variance: 2.6,
    status: "good",
  },
  {
    id: "op6",
    category: "Operational",
    metric: "Process Downtime",
    current: 1.8,
    target: 0.5,
    lastMonth: 2.1,
    unit: "%",
    trend: "down",
    variance: -14.3,
    status: "fair",
  },
  {
    id: "op7",
    category: "Operational",
    metric: "Quality Score",
    current: 94.2,
    target: 97.0,
    lastMonth: 92.8,
    unit: "%",
    trend: "up",
    variance: 1.5,
    status: "good",
  },

  // ==================== EMPLOYEE / HR KPIs ====================
  {
    id: "hr1",
    category: "HR & Employee",
    metric: "Employee Turnover Rate",
    current: 8.5,
    target: 5.0,
    lastMonth: 9.2,
    unit: "%",
    trend: "down",
    variance: -7.6,
    status: "fair",
  },
  {
    id: "hr2",
    category: "HR & Employee",
    metric: "Employee Engagement Score",
    current: 72,
    target: 80,
    lastMonth: 68,
    unit: "points",
    trend: "up",
    variance: 5.9,
    status: "good",
  },
  {
    id: "hr3",
    category: "HR & Employee",
    metric: "Average Time to Hire",
    current: 32,
    target: 25,
    lastMonth: 35,
    unit: "days",
    trend: "down",
    variance: -8.6,
    status: "fair",
  },
  {
    id: "hr4",
    category: "HR & Employee",
    metric: "Training Completion Rate",
    current: 82.5,
    target: 95.0,
    lastMonth: 78.3,
    unit: "%",
    trend: "up",
    variance: 5.4,
    status: "good",
  },
  {
    id: "hr5",
    category: "HR & Employee",
    metric: "Absenteeism Rate",
    current: 3.2,
    target: 2.0,
    lastMonth: 3.5,
    unit: "%",
    trend: "down",
    variance: -8.6,
    status: "fair",
  },
  {
    id: "hr6",
    category: "HR & Employee",
    metric: "Revenue per Employee",
    current: 385000,
    target: 420000,
    lastMonth: 370000,
    unit: "USD",
    trend: "up",
    variance: 4.1,
    status: "good",
  },

  // ==================== PROJECT / PRODUCT KPIs ====================
  {
    id: "pp1",
    category: "Project & Product",
    metric: "Project Completion Rate",
    current: 88.5,
    target: 95.0,
    lastMonth: 85.2,
    unit: "%",
    trend: "up",
    variance: 3.9,
    status: "good",
  },
  {
    id: "pp2",
    category: "Project & Product",
    metric: "On-Time Project Delivery",
    current: 82.0,
    target: 90.0,
    lastMonth: 78.5,
    unit: "%",
    trend: "up",
    variance: 4.5,
    status: "good",
  },
  {
    id: "pp3",
    category: "Project & Product",
    metric: "Product Defect Rate",
    current: 0.8,
    target: 0.5,
    lastMonth: 1.0,
    unit: "%",
    trend: "down",
    variance: -20.0,
    status: "fair",
  },
  {
    id: "pp4",
    category: "Project & Product",
    metric: "Feature Adoption Rate",
    current: 68.5,
    target: 75.0,
    lastMonth: 64.2,
    unit: "%",
    trend: "up",
    variance: 6.7,
    status: "good",
  },
  {
    id: "pp5",
    category: "Project & Product",
    metric: "Time to Market",
    current: 5.2,
    target: 4.0,
    lastMonth: 5.8,
    unit: "months",
    trend: "down",
    variance: -10.3,
    status: "fair",
  },
  {
    id: "pp6",
    category: "Project & Product",
    metric: "Budget vs Actual (Project)",
    current: 2.5,
    target: 2.0,
    lastMonth: 3.2,
    unit: "%",
    trend: "down",
    variance: -21.9,
    status: "good",
  },

  // ==================== INNOVATION / GROWTH KPIs ====================
  {
    id: "ig1",
    category: "Innovation & Growth",
    metric: "New Product Revenue %",
    current: 18.5,
    target: 22.0,
    lastMonth: 16.2,
    unit: "%",
    trend: "up",
    variance: 14.2,
    status: "good",
  },
  {
    id: "ig2",
    category: "Innovation & Growth",
    metric: "R&D Spending vs Revenue",
    current: 8.5,
    target: 10.0,
    lastMonth: 7.9,
    unit: "%",
    trend: "up",
    variance: 7.6,
    status: "good",
  },
  {
    id: "ig3",
    category: "Innovation & Growth",
    metric: "Market Share Growth",
    current: 3.8,
    target: 5.0,
    lastMonth: 3.2,
    unit: "%",
    trend: "up",
    variance: 18.8,
    status: "good",
  },
  {
    id: "ig4",
    category: "Innovation & Growth",
    metric: "Patents / Innovations",
    current: 7,
    target: 10,
    lastMonth: 6,
    unit: "count",
    trend: "up",
    variance: 16.7,
    status: "good",
  },
  {
    id: "ig5",
    category: "Innovation & Growth",
    metric: "Expansion into New Markets",
    current: 2,
    target: 3,
    lastMonth: 1,
    unit: "count",
    trend: "up",
    variance: 100.0,
    status: "excellent",
  },
  {
    id: "ig6",
    category: "Innovation & Growth",
    metric: "Year-over-Year Growth Rate",
    current: 22.5,
    target: 25.0,
    lastMonth: 18.3,
    unit: "%",
    trend: "up",
    variance: 23.0,
    status: "good",
  },

  // ==================== DIGITAL / IT KPIs ====================
  {
    id: "di1",
    category: "Digital & IT",
    metric: "Website / App Traffic",
    current: 48500,
    target: 60000,
    lastMonth: 42300,
    unit: "visits",
    trend: "up",
    variance: 14.6,
    status: "good",
  },
  {
    id: "di2",
    category: "Digital & IT",
    metric: "System Uptime",
    current: 99.85,
    target: 99.95,
    lastMonth: 99.72,
    unit: "%",
    trend: "up",
    variance: 0.13,
    status: "good",
  },
  {
    id: "di3",
    category: "Digital & IT",
    metric: "Cybersecurity Incidents",
    current: 2,
    target: 0,
    lastMonth: 3,
    unit: "count",
    trend: "down",
    variance: -33.3,
    status: "fair",
  },
  {
    id: "di4",
    category: "Digital & IT",
    metric: "Data Accuracy / Quality",
    current: 97.2,
    target: 99.0,
    lastMonth: 96.5,
    unit: "%",
    trend: "up",
    variance: 0.7,
    status: "good",
  },
  {
    id: "di5",
    category: "Digital & IT",
    metric: "IT Cost per User",
    current: 125,
    target: 110,
    lastMonth: 132,
    unit: "USD",
    trend: "down",
    variance: -5.3,
    status: "fair",
  },
  {
    id: "di6",
    category: "Digital & IT",
    metric: "Mobile App Engagement",
    current: 62.5,
    target: 70.0,
    lastMonth: 58.3,
    unit: "%",
    trend: "up",
    variance: 7.2,
    status: "good",
  },
];

interface BusinessMetricsTableProps {
  title?: string;
}

export function BusinessMetricsTable({
  title = "Business Metrics & Performance Table",
}: BusinessMetricsTableProps) {
  const { getCurrencySymbol } = useCurrency();

  const formatValue = (value: number, unit: string) => {
    if (unit === "USD") {
      const symbol = getCurrencySymbol();
      if (value >= 1000000) {
        return `${symbol}${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${symbol}${(value / 1000).toFixed(0)}K`;
      }
      return `${symbol}${value.toLocaleString()}`;
    }
    if (unit === "%") {
      return `${value}%`;
    }
    if (unit === "points" || unit === "ratio" || unit === "times" || unit === "days" || unit === "hours" || unit === "months" || unit === "count") {
      return unit === "count" ? value.toString() : `${value}${unit === "count" ? "" : " " + unit}`;
    }
    return `${value.toLocaleString()} ${unit}`;
  };

  const getTrendIcon = (trend: BusinessMetric["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-economic-positive" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-economic-negative" />;
      default:
        return <Minus className="h-4 w-4 text-economic-neutral" />;
    }
  };

  const getStatusColor = (status: BusinessMetric["status"]) => {
    switch (status) {
      case "excellent":
        return "bg-economic-positive text-economic-positive-foreground";
      case "good":
        return "bg-economic-positive/80 text-economic-positive-foreground";
      case "fair":
        return "bg-economic-warning text-economic-warning-foreground";
      default:
        return "bg-economic-negative text-economic-negative-foreground";
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 5) return "text-economic-positive";
    if (variance < -5) return "text-economic-negative";
    return "text-economic-neutral";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Financial: "bg-blue-100 text-blue-800",
      Customer: "bg-purple-100 text-purple-800",
      "Sales & Marketing": "bg-green-100 text-green-800",
      Operational: "bg-orange-100 text-orange-800",
      "HR & Employee": "bg-pink-100 text-pink-800",
      "Project & Product": "bg-indigo-100 text-indigo-800",
      "Innovation & Growth": "bg-amber-100 text-amber-800",
      "Digital & IT": "bg-cyan-100 text-cyan-800",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const groupedMetrics = businessMetrics.reduce(
    (acc, metric) => {
      if (!acc[metric.category]) {
        acc[metric.category] = [];
      }
      acc[metric.category].push(metric);
      return acc;
    },
    {} as Record<string, BusinessMetric[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </h3>
        <Badge variant="outline" className="text-xs">
          {businessMetrics.length} metrics
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Complete Business Metrics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Metric</TableHead>
                  <TableHead className="font-semibold text-right">
                    Current
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Target
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Last Month
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Trend
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Change
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessMetrics.map((metric) => (
                  <TableRow
                    key={metric.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs",
                          getCategoryColor(metric.category),
                        )}
                      >
                        {metric.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {metric.metric}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatValue(metric.current, metric.unit)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatValue(metric.target, metric.unit)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatValue(metric.lastMonth, metric.unit)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getTrendIcon(metric.trend)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "font-medium",
                          getVarianceColor(metric.variance),
                        )}
                      >
                        {metric.variance > 0 ? "+" : ""}
                        {metric.variance.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn("text-xs", getStatusColor(metric.status))}
                      >
                        {metric.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Category Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(groupedMetrics).map(([category, metrics]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn("text-xs", getCategoryColor(category))}
                >
                  {category}
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.length} metrics tracked
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium truncate pr-2">
                        {metric.metric}
                      </span>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">
                        {formatValue(metric.current, metric.unit)}
                      </span>
                      <Badge
                        className={cn("text-xs", getStatusColor(metric.status))}
                      >
                        {metric.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
