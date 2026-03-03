import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { KPI } from "@/lib/business-forecast-data";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Minus,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/currency-context";

interface KPIDashboardProps {
  kpis: KPI[];
  title?: string;
}

export function KPIDashboard({
  kpis,
  title = "Performance Metrics & KPIs",
}: KPIDashboardProps) {
  const { formatCurrency, getCurrencySymbol } = useCurrency();

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() => {
    // Initialize all categories as expanded by default
    const grouped = kpis.reduce(
      (acc, kpi) => {
        if (!acc[kpi.category]) {
          acc[kpi.category] = true; // All expanded by default
        }
        return acc;
      },
      {} as Record<string, boolean>,
    );
    return grouped;
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === "USD") {
      return formatCurrency(value);
    }
    if (unit === "USD/employee") {
      const symbol = getCurrencySymbol();
      return `${symbol}${(value / 1000).toFixed(0)}K/emp`;
    }
    if (unit === "%") {
      return `${value}%`;
    }
    if (unit === "days") {
      return `${value} days`;
    }
    return `${value.toLocaleString()} ${unit}`;
  };

  const getTrendIcon = (trend: KPI["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-economic-positive" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-economic-negative" />;
      default:
        return <Minus className="h-4 w-4 text-economic-neutral" />;
    }
  };

  const getPerformanceStatus = (
    current: number,
    target: number,
    trend: string,
  ) => {
    const isGoodTrend = (metric: string, trend: string) => {
      // For metrics where lower is better
      if (metric.includes("Cost") || metric.includes("Cycle")) {
        return trend === "down";
      }
      // For most metrics, higher is better
      return trend === "up";
    };

    const performance = (current / target) * 100;
    const trendIsGood = isGoodTrend(
      kpis.find((k) => k.current === current)?.name || "",
      trend,
    );

    if (performance >= 100 && trendIsGood) return "excellent";
    if (performance >= 90 && trendIsGood) return "good";
    if (performance >= 80) return "fair";
    return "needs-attention";
  };

  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "excellent":
        return "Excellent";
      case "good":
        return "Good";
      case "fair":
        return "Fair";
      default:
        return "Needs Attention";
    }
  };

  const getCategoryIcon = (category: string) => {
    // Return bullseye emoji for all categories
    return "🎯";
  };

  const groupedKPIs = kpis.reduce(
    (acc, kpi) => {
      if (!acc[kpi.category]) {
        acc[kpi.category] = [];
      }
      acc[kpi.category].push(kpi);
      return acc;
    },
    {} as Record<string, KPI[]>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </h3>
        <Badge variant="outline" className="text-xs">
          {kpis.length} metrics tracked
        </Badge>
      </div>

      {/* KPI Categories */}
      {Object.entries(groupedKPIs).map(([category, categoryKPIs]) => (
        <div key={category} className="space-y-4">
          <button
            onClick={() => toggleCategory(category)}
            className="w-full flex items-center justify-between p-3 bg-muted hover:bg-muted/80 rounded-lg border border-muted-foreground/20 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{getCategoryIcon(category)}</span>
              <h4 className="font-medium text-base">{category}</h4>
              <Badge variant="secondary" className="text-xs">
                {categoryKPIs.length}
              </Badge>
            </div>
            <div>
              {expandedCategories[category] ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </button>

          {expandedCategories[category] && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryKPIs.map((kpi) => {
                const performance = (kpi.current / kpi.target) * 100;
                const status = getPerformanceStatus(
                  kpi.current,
                  kpi.target,
                  kpi.trend,
                );

                return (
                  <Card
                    key={kpi.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium leading-tight">
                          {kpi.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(kpi.trend)}
                          <Badge
                            className={cn("text-xs", getStatusColor(status))}
                          >
                            {getStatusLabel(status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Current
                          </span>
                          <span className="text-lg font-bold">
                            {formatValue(kpi.current, kpi.unit)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Target
                          </span>
                          <span className="text-sm font-medium">
                            {formatValue(kpi.target, kpi.unit)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span
                            className={cn(
                              "font-medium",
                              performance >= 100
                                ? "text-economic-positive"
                                : performance >= 90
                                  ? "text-economic-warning"
                                  : "text-economic-negative",
                            )}
                          >
                            {performance.toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={Math.min(performance, 100)}
                          className="h-2"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>{kpi.frequency}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Summary Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">KPI Summary Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-economic-positive">
                {
                  kpis.filter(
                    (k) =>
                      getPerformanceStatus(k.current, k.target, k.trend) ===
                      "excellent",
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">Excellent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-economic-positive">
                {
                  kpis.filter(
                    (k) =>
                      getPerformanceStatus(k.current, k.target, k.trend) ===
                      "good",
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">Good</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-economic-warning">
                {
                  kpis.filter(
                    (k) =>
                      getPerformanceStatus(k.current, k.target, k.trend) ===
                      "fair",
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">Fair</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-economic-negative">
                {
                  kpis.filter(
                    (k) =>
                      getPerformanceStatus(k.current, k.target, k.trend) ===
                      "needs-attention",
                  ).length
                }
              </div>
              <div className="text-sm text-muted-foreground">
                Needs Attention
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
