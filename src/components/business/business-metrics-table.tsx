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

interface BusinessMetricsTableProps {
  metrics?: BusinessMetric[];
  title?: string;
}

export function BusinessMetricsTable({
  metrics,
  title = "Business Metrics & Performance Table",
}: BusinessMetricsTableProps) {
  const businessMetricsLocal = metrics ?? [];
  const { getCurrencySymbol } = useCurrency();

  const formatValue = (value: number, unit: string) => {
    if (unit === "USD") {
      const symbol = getCurrencySymbol();
      if (value >= 1000000) {
        return `${symbol}${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${symbol}${(value / 1000).toFixed(0)}K`;
      }
      return `${symbol}${value.toLocaleString()}`;
    }

    if (unit === "%") {
      return `${value}%`;
    }

    if (
      unit === "points" ||
      unit === "ratio" ||
      unit === "times" ||
      unit === "days" ||
      unit === "hours" ||
      unit === "months" ||
      unit === "count"
    ) {
      return unit === "count" ? value.toString() : `${value} ${unit}`;
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
    const colors: Record<string, string> = {
      Financial: "bg-blue-100 text-blue-800",
      Customer: "bg-purple-100 text-purple-800",
      "Sales & Marketing": "bg-green-100 text-green-800",
      Operational: "bg-orange-100 text-orange-800",
      "HR & Employee": "bg-pink-100 text-pink-800",
      "Project & Product": "bg-indigo-100 text-indigo-800",
      "Innovation & Growth": "bg-amber-100 text-amber-800",
      "Digital & IT": "bg-cyan-100 text-cyan-800",
    };

    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const groupedMetrics = businessMetricsLocal.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, BusinessMetric[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </h3>
        <Badge variant="outline" className="text-xs">
          {businessMetricsLocal.length} metrics
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Complete Business Metrics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Metric</TableHead>
                  <TableHead className="font-semibold text-right">Current</TableHead>
                  <TableHead className="font-semibold text-right">Target</TableHead>
                  <TableHead className="font-semibold text-right">Last Month</TableHead>
                  <TableHead className="font-semibold text-center">Trend</TableHead>
                  <TableHead className="font-semibold text-right">Change</TableHead>
                  <TableHead className="font-semibold text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessMetricsLocal.map((metric) => (
                  <TableRow key={metric.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-xs", getCategoryColor(metric.category))}>
                        {metric.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{metric.metric}</TableCell>
                    <TableCell className="text-right font-semibold">{formatValue(metric.current, metric.unit)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatValue(metric.target, metric.unit)}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatValue(metric.lastMonth, metric.unit)}</TableCell>
                    <TableCell className="text-center">{getTrendIcon(metric.trend)}</TableCell>
                    <TableCell className="text-right">
                      <span className={cn("font-medium", getVarianceColor(metric.variance))}>
                        {metric.variance > 0 ? "+" : ""}
                        {metric.variance.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn("text-xs", getStatusColor(metric.status))}>{metric.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Badge variant="secondary" className={cn("text-xs", getCategoryColor(category))}>
                  {category}
                </Badge>
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">{categoryMetrics.length} metrics tracked</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryMetrics.map((metric) => (
                  <div key={metric.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium truncate pr-2">{metric.metric}</span>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold">{formatValue(metric.current, metric.unit)}</span>
                      <Badge className={cn("text-xs", getStatusColor(metric.status))}>{metric.status}</Badge>
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
