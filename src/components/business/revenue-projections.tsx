import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RevenueProjection } from "@/lib/business-forecast-data";
import { TrendingUp, Target, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { useCurrency } from "@/lib/currency-context";
// Import calculation functions
import {
  calculateProgress,
  calculateVariance,
  getVarianceColor,
  getConfidenceLevel,
  getConfidenceColor,
  calculateScenarioRangePosition,
  calculateTotalProjectedRevenue,
  calculateAverageConfidence,
  calculatePotentialUpside,
  generateMonthlyProjections,
  generateYearlyProjection,
} from "@/lib/calculations/revenue-calculation";

interface RevenueProjectionsProps {
  projections: RevenueProjection[];
  title?: string;
}

type ViewType = "monthly" | "quarterly" | "yearly";

export function RevenueProjections({
  projections,
  title = "Revenue Projections",
}: RevenueProjectionsProps) {
  const [viewType, setViewType] = useState<ViewType>("quarterly");
  const { formatCurrency } = useCurrency();

  // Memoized calculations
  const totalProjectedRevenue = useMemo(
    () => calculateTotalProjectedRevenue(projections),
    [projections]
  );

  const averageConfidence = useMemo(
    () => calculateAverageConfidence(projections),
    [projections]
  );

  const potentialUpside = useMemo(
    () => calculatePotentialUpside(projections),
    [projections]
  );

  // Generate view data based on view type
  const displayData = useMemo(() => {
    if (viewType === "monthly") {
      return generateMonthlyProjections(projections);
    }
    if (viewType === "yearly") {
      return [generateYearlyProjection(projections)];
    }
    return projections;
  }, [projections, viewType]);

  const displayTotal = useMemo(
    () => displayData.reduce((sum, p) => sum + p.projected, 0),
    [displayData]
  );

  // Calculate variance for display
  const getVariance = (actual?: number, projected?: number) => {
    return calculateVariance(actual, projected);
  };

  // Calculate progress for display
  const getProgress = (actual?: number, projected?: number) => {
    return calculateProgress(actual, projected);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex gap-2 border rounded-lg p-1">
            <Button
              size="sm"
              variant={viewType === "monthly" ? "default" : "ghost"}
              onClick={() => setViewType("monthly")}
              className="text-xs"
            >
              Monthly
            </Button>
            <Button
              size="sm"
              variant={viewType === "quarterly" ? "default" : "ghost"}
              onClick={() => setViewType("quarterly")}
              className="text-xs"
            >
              Quarterly
            </Button>
            <Button
              size="sm"
              variant={viewType === "yearly" ? "default" : "ghost"}
              onClick={() => setViewType("yearly")}
              className="text-xs"
            >
              Yearly
            </Button>
          </div>
          <Badge variant="outline" className="text-xs">
            Total: {formatCurrency(displayTotal)}
          </Badge>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4",
          viewType === "yearly"
            ? "grid-cols-1"
            : viewType === "monthly"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {displayData.map((projection) => {
          const variance = getVariance(projection.actualToDate, projection.projected);
          const progress = getProgress(projection.actualToDate, projection.projected);
          const scenarioRangePosition = calculateScenarioRangePosition(
            projection.projected,
            projection.conservative,
            projection.optimistic
          );

          return (
            <Card
              key={projection.id}
              className={cn(
                "hover:shadow-md transition-shadow",
                projection.actualToDate && "ring-1 ring-primary/20",
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {projection.period}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    {projection.actualToDate ? (
                      <CheckCircle className="h-4 w-4 text-economic-positive" />
                    ) : (
                      <Target className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs",
                        getConfidenceColor(projection.confidence),
                      )}
                    >
                      {projection.confidence}%
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      Projected
                    </div>
                    <div className="text-xl font-bold">
                      {formatCurrency(projection.projected)}
                    </div>
                  </div>

                  {projection.actualToDate && (
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          Actual to Date
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            getVarianceColor(variance),
                          )}
                        >
                          {variance !== null && (
                            <>
                              {variance > 0 ? "+" : ""}
                              {variance.toFixed(1)}%
                            </>
                          )}
                        </span>
                      </div>
                      <div className="text-lg font-semibold mb-3">
                        {formatCurrency(projection.actualToDate)}
                      </div>

                      {/* Volume Level Progress Indicator */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-bold text-primary">
                            {progress}%
                          </span>
                        </div>
                        <div className="flex gap-1 h-12 items-end">
                          {[...Array(10)].map((_, i) => {
                            const segmentThreshold = (i + 1) * 10;
                            const isFilled = progress >= segmentThreshold;

                            return (
                              <div
                                key={i}
                                className={cn(
                                  "flex-1 rounded-sm transition-all duration-300",
                                  isFilled
                                    ? "bg-gradient-to-t from-primary to-primary/80 h-full shadow-sm"
                                    : "bg-muted h-1",
                                )}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      Scenario Range
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-economic-negative">
                        {formatCurrency(projection.conservative)}
                      </span>
                      <span className="text-economic-positive">
                        {formatCurrency(projection.optimistic)}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress
                        value={scenarioRangePosition}
                        className="h-2"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1 h-4 bg-primary rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Confidence</span>
                      <span
                        className={getConfidenceColor(projection.confidence)}
                      >
                        {getConfidenceLevel(projection.confidence)}
                      </span>
                    </div>
                    <Progress
                      value={projection.confidence}
                      className="h-1 mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-economic-positive/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-economic-positive" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Total Revenue Target
                </div>
                <div className="text-lg font-bold">
                  {formatCurrency(displayTotal)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Avg Confidence
                </div>
                <div className="text-lg font-bold">
                  {averageConfidence}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-economic-warning/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-economic-warning" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Potential Upside
                </div>
                <div className="text-lg font-bold">
                  {formatCurrency(potentialUpside)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

