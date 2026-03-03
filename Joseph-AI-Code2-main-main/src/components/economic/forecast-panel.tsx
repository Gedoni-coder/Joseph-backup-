import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

// Type alias to match hook data structure
interface EconomicForecast {
  id: number;
  context: string;
  indicator: string;
  period: string;
  forecast: number;
  confidence: number;
  range_low: number;
  range_high: number;
}

interface ForecastPanelProps {
  forecasts: EconomicForecast[];
  title?: string;
}

export function ForecastPanel({
  forecasts,
  title = "Economic Forecasts",
}: ForecastPanelProps) {
  const getForecastTrend = (forecast: number, range_low: number, range_high: number) => {
    if (forecast > range_high) return "up";
    if (forecast < range_low) return "down";
    return "stable";
  };

  const getForecastChange = (forecast: number, range_low: number, range_high: number) => {
    const change = forecast - ((range_low + range_high) / 2);
    const changePercent = change / ((range_low + range_high) / 2) * 100;
    return { change, changePercent };
  };

  const formatValue = (value: number, indicator: string) => {
    if (indicator.includes("Rate") || indicator.includes("Growth")) {
      return `${value.toFixed(1)}%`;
    }
    if (indicator.includes("Index")) {
      return value.toFixed(1);
    }
    return value.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          {title}
        </h3>
        <Badge variant="outline" className="text-xs">
          {forecasts.length} indicators
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forecasts.map((forecast) => {
          const trend = getForecastTrend(
            forecast.forecast,
            forecast.range_low,
            forecast.range_high,
          );
          const { change, changePercent } = getForecastChange(
            forecast.forecast,
            forecast.range_low,
            forecast.range_high,
          );

          return (
            <Card key={forecast.id} className="p-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {forecast.indicator}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xs text-muted-foreground">Range</p>
                    <p className="text-lg font-semibold">
                      {formatValue(forecast.range_low, forecast.indicator)} - {formatValue(forecast.range_high, forecast.indicator)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-economic-positive mr-1" />
                    ) : trend === "down" ? (
                      <TrendingDown className="h-4 w-4 text-economic-negative mr-1" />
                    ) : null}
                    <div className="text-right">
                      <p className="text-2xs text-muted-foreground">
                        Forecast ({forecast.period})
                      </p>
                      <p className="text-lg font-semibold">
                        {formatValue(
                          forecast.forecast,
                          forecast.indicator,
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={cn(
                        "font-medium",
                        trend === "up"
                          ? "text-economic-positive"
                          : trend === "down"
                            ? "text-economic-negative"
                            : "text-economic-neutral",
                      )}
                    >
                      {change >= 0 ? "+" : ""}
                      {change.toFixed(1)} ({changePercent >= 0 ? "+" : ""}
                      {changePercent.toFixed(1)}%)
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {forecast.confidence}% confidence
                    </Badge>
                  </div>
                  <Progress value={forecast.confidence} className="h-2" />
                </div>

                <div className="text-xs text-muted-foreground">
                  Range: {formatValue(forecast.range_low, forecast.indicator)} - {formatValue(forecast.range_high, forecast.indicator)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
