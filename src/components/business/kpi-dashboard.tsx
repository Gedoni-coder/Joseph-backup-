import { useState, useMemo } from "react";
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
// Import calculation functions
import {
  calculateKPIProgress,
  determineKPIStatus,
  determineSimpleStatus,
  getStatusColor,
  getStatusBadgeVariant,
  calculateKPISummary,
  groupKPIsByCategory,
  formatKPIValue,
} from "@/lib/calculations/kpi-calculation";

interface KPIDashboardProps {
  kpis: KPI[];
  title?: string;
}

export function KPIDashboard({
  kpis,
  title = "Performance Metrics & KPIs",
}: KPIDashboardProps) {
  const { formatCurrency, getCurrencySymbol } = useCurrency();

  // Memoized calculations
  const kpiSummary = useMemo(() => calculateKPISummary(kpis), [kpis]);
  const groupedKPIs = useMemo(() => groupKPIsByCategory(kpis), [kpis]);

  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() => {
    // Initialize all categories as expanded by default
    return kpis.reduce(
      (acc, kpi) => {
        const category = kpi.category || "Other";
        if (!acc[category]) {
          acc[category] = true; // All expanded by default
        }
        return acc;
      },
      {} as Record<string, boolean>,
    );
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
    // Use the centralized format function
    return formatKPIValue(value, unit);
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

  const getCategoryIcon = (category: string) => {
    // Return bullseye emoji for all categories
    return "🎯";
  };

  // Get status badge variant
  const getBadgeVariant = (status: string) => {
    const variant = getStatusBadgeVariant(status);
    return variant;
  };

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
                const progress = calculateKPIProgress(kpi.current, kpi.target);
                const status = determineKPIStatus(progress);
                const simpleStatus = determineSimpleStatus(progress);

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
                            variant={getBadgeVariant(simpleStatus)}
                            className={cn("text-xs")}
                          >
                            {simpleStatus}
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
                              progress >= 100
                                ? "text-economic-positive"
                                : progress >= 80
                                  ? "text-economic-warning"
                                  : "text-economic-negative",
                            )}
                          >
                            {progress}%
                          </span>
                        </div>
                        <Progress
                          value={Math.min(progress, 100)}
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
                {kpiSummary.excellent}
              </div>
              <div className="text-sm text-muted-foreground">Excellent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-economic-positive">
                {kpiSummary.good}
              </div>
              <div className="text-sm text-muted-foreground">Good</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-economic-warning">
                {kpiSummary.fair}
              </div>
              <div className="text-sm text-muted-foreground">Fair</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-economic-negative">
                {kpiSummary.needsAttention}
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

