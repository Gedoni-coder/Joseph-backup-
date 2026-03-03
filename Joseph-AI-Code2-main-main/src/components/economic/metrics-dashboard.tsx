import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
interface EconomicMetric {
  id: number;
  context: string;
  name: string;
  value: number;
  change: number;
  unit: string;
  trend: string;
  category: string;
}
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronLeft,
  ChevronRight,
  Activity,
  Zap,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface MetricsDashboardProps {
  metrics: EconomicMetric[];
}

export function MetricsDashboard({ metrics }: MetricsDashboardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Record<number, Date>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout>();

  const itemsToShow = 4;
  const maxIndex = Math.max(0, metrics.length - itemsToShow);

  // Track metric updates for visual feedback
  useEffect(() => {
    const updates: Record<string, Date> = {};
    metrics.forEach((metric) => {
      if (!lastUpdateTime[metric.id] || Math.random() > 0.8) {
        updates[metric.id] = new Date();
      }
    });
    if (Object.keys(updates).length > 0) {
      setLastUpdateTime((prev) => ({ ...prev, ...updates }));
    }
  }, [metrics]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoScrolling) return;

    const autoScroll = () => {
      setCurrentIndex((prev) => {
        const next = prev >= maxIndex ? 0 : prev + 1;
        scrollToIndex(next);
        return next;
      });
    };

    autoScrollTimeoutRef.current = setTimeout(autoScroll, 4000);
    return () => {
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
      }
    };
  }, [currentIndex, isAutoScrolling, maxIndex]);

  // Pause auto-scroll on user interaction
  const pauseAutoScroll = () => {
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const itemWidth = container.scrollWidth / metrics.length;
      container.scrollTo({
        left: itemWidth * index,
        behavior: "smooth",
      });
    }
  };

  const handlePrevious = () => {
    pauseAutoScroll();
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    pauseAutoScroll();
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  const handleCardClick = (metricId: number) => {
    setSelectedCard(selectedCard === metricId ? null : metricId);
  };

  const isCardUpdated = (metricId: number) => {
    const updateTime = lastUpdateTime[metricId];
    return updateTime && Date.now() - updateTime.getTime() < 3000;
  };
  const getTrendIcon = (trend: EconomicMetric["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-economic-positive" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-economic-negative" />;
      default:
        return <Minus className="h-4 w-4 text-economic-neutral" />;
    }
  };

  const getTrendColor = (trend: EconomicMetric["trend"]) => {
    switch (trend) {
      case "up":
        return "text-economic-positive";
      case "down":
        return "text-economic-negative";
      default:
        return "text-economic-neutral";
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === "%" || unit === "Index") {
      return `${value.toLocaleString()}${unit === "%" ? "%" : ""}`;
    }
    if (unit.includes("USD")) {
      return `$${value.toLocaleString()}`;
    }
    if (unit === "Points") {
      return value.toLocaleString();
    }
    if (unit.includes("B USD")) {
      return `$${value}B`;
    }
    return `${value.toLocaleString()} ${unit}`;
  };

  const formatChange = (
    change: number,
    value: number,
    unit: string,
  ) => {
    const changePercent = ((change / (value - change)) * 100);
    const sign = change >= 0 ? "+" : "";
    const unitSymbol = unit === "%" ? "pp" : unit.replace(/^.*\//, "");
    return `${sign}${change.toFixed(1)}${unitSymbol === "%" ? "pp" : ""} (${sign}${changePercent.toFixed(1)}%)`;
  };

  return (
    <div className="relative">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 transition-all hover:scale-105 active:scale-95 hover:shadow-md"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            variant={isAutoScrolling ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className="flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <Activity className={cn("h-4 w-4", isAutoScrolling && "animate-pulse")} />
            {isAutoScrolling ? "Auto" : "Manual"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Live Data
          </Badge>
          <div className="text-sm text-muted-foreground">
            {currentIndex + 1}-{Math.min(currentIndex + itemsToShow, metrics.length)} of {metrics.length}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
          className="flex items-center gap-2 transition-all hover:scale-105 active:scale-95 hover:shadow-md"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / itemsToShow}%)`,
            width: `${(metrics.length * 100) / itemsToShow}%`,
          }}
        >
          {metrics.map((metric) => (
            <Card
              key={metric.id}
              className={cn(
                "metric-card group flex-shrink-0 cursor-pointer transition-all duration-300",
                "hover:shadow-lg hover:scale-105 active:scale-95",
                "border-2 hover:border-primary/50",
                selectedCard === metric.id && "ring-2 ring-primary ring-offset-2 bg-primary/5",
                hoveredCard === metric.id && "shadow-xl transform-gpu",
                isCardUpdated(metric.id) && "animate-pulse border-green-500 bg-green-50/50"
              )}
              style={{ width: `${100 / metrics.length}%` }}
              onClick={() => handleCardClick(metric.id)}
              onMouseEnter={() => setHoveredCard(metric.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {metric.name}
                  </CardTitle>
                  {isCardUpdated(metric.id) && (
                    <Badge variant="secondary" className="text-xs animate-pulse bg-green-100 text-green-700">
                      Updated
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  <BarChart3 className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {formatValue(metric.value, metric.unit)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm font-medium transition-all",
                        getTrendColor(metric.trend),
                        hoveredCard === metric.id && "scale-110"
                      )}
                    >
                      {formatChange(
                        metric.change,
                        metric.value,
                        metric.unit,
                      )}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs transition-all",
                        hoveredCard === metric.id && "bg-primary text-primary-foreground"
                      )}
                    >
                      Latest
                    </Badge>
                  </div>

                  {selectedCard === metric.id && (
                    <div className="mt-3 pt-3 border-t border-border animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Previous:</span>
                          <div className="font-medium">
                            {formatValue(metric.value - metric.change, metric.unit)}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Update:</span>
                          <div className="font-medium">
                            {lastUpdateTime[metric.id]?.toLocaleTimeString() || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Enhanced Indicators */}
      <div className="flex justify-center items-center mt-6 gap-3">
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(metrics.length / itemsToShow) }).map(
            (_, index) => {
              const isActive = Math.floor(currentIndex / itemsToShow) === index;
              return (
                <button
                  key={index}
                  onClick={() => {
                    pauseAutoScroll();
                    scrollToIndex(index * itemsToShow);
                  }}
                  className={cn(
                    "transition-all duration-300 rounded-full hover:scale-125 active:scale-95",
                    isActive
                      ? "w-8 h-3 bg-primary shadow-lg"
                      : "w-3 h-3 bg-muted hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Go to page ${index + 1}`}
                />
              );
            }
          )}
        </div>

        <div className="flex items-center gap-2 ml-4">
          <div className={cn(
            "w-2 h-2 rounded-full transition-all",
            isAutoScrolling ? "bg-green-500 animate-pulse" : "bg-gray-400"
          )} />
          <span className="text-xs text-muted-foreground">
            {isAutoScrolling ? "Auto-scrolling" : "Manual control"}
          </span>
        </div>
      </div>
    </div>
  );
}
