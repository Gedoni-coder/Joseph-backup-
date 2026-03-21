import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Globe, MapPin, Building2, Flag, Zap, TrendingUp } from "lucide-react";
import { useState } from "react";

interface ContextSwitcherProps {
  activeContext: string;
  onContextChange: (context: string) => void;
  contexts: ContextSummary[];
  isLoading?: boolean;
}

interface ContextSummary {
  key: string;
  label: string;
  description: string;
  status: "stable" | "volatile" | "trending";
  changePercent: number;
  metricCount: number;
}

const pickIcon = (contextKey: string) => {
  const key = contextKey.toLowerCase();
  if (key.includes("local") || key.includes("city") || key.includes("region")) return MapPin;
  if (key.includes("state")) return Building2;
  if (key.includes("national") || key === "us" || key.includes("country")) return Flag;
  return Globe;
};

export function ContextSwitcher({
  activeContext,
  onContextChange,
  contexts,
  isLoading = false,
}: ContextSwitcherProps) {
  const [hoveredContext, setHoveredContext] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleContextChange = async (context: string) => {
    if (context === activeContext || isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      onContextChange(context);
      setIsTransitioning(false);
    }, 150);
  };

  const getStatusColor = (status: ContextSummary["status"]) => {
    switch (status) {
      case "stable": return "bg-green-500";
      case "volatile": return "bg-red-500";
      case "trending": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: ContextSummary["status"]) => {
    switch (status) {
      case "stable": return "Stable";
      case "volatile": return "Volatile";
      case "trending": return "Trending";
      default: return "Unknown";
    }
  };
  return (
    <div className="flex flex-wrap gap-3 p-2 bg-muted/50 rounded-xl backdrop-blur-sm border">
      {contexts.map((context) => {
        const Icon = pickIcon(context.key);
        const isActive = activeContext === context.key;
        const isHovered = hoveredContext === context.key;

        return (
          <Button
            key={context.key}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            disabled={isLoading || isTransitioning}
            onClick={() => handleContextChange(context.key)}
            onMouseEnter={() => setHoveredContext(context.key)}
            onMouseLeave={() => setHoveredContext(null)}
            className={cn(
              "relative flex items-center gap-3 px-4 py-3 text-sm font-medium",
              "transition-all duration-300 hover:scale-105 active:scale-95",
              "hover:bg-background hover:shadow-lg border-2 border-transparent",
              isActive && "bg-background shadow-lg text-primary border-primary/20 scale-105",
              isHovered && !isActive && "shadow-md border-primary/10",
              isTransitioning && "opacity-50 cursor-not-allowed",
              "group overflow-hidden"
            )}
          >
            {/* Background gradient animation */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300",
              isActive
                ? "from-primary/10 to-primary/5 opacity-100"
                : "from-primary/5 to-transparent group-hover:opacity-100"
            )} />

            {/* Content */}
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive && "text-primary scale-110",
                  isHovered && "scale-110",
                  isLoading && "animate-pulse"
                )} />

                {/* Status indicator */}
                <div className={cn(
                  "absolute -top-1 -right-1 w-2 h-2 rounded-full",
                  getStatusColor(context.status),
                  isActive && "animate-pulse"
                )} />
              </div>

              <div className="flex flex-col items-start min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium transition-colors",
                    isActive && "text-primary"
                  )}>
                    {context.label}
                  </span>

                  {isActive && (
                    <Badge variant="secondary" className="text-xs animate-in fade-in-0 slide-in-from-left-2">
                      <Zap className="h-2 w-2 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {context.description}
                  </span>

                  {/* Change indicator */}
                  <div className={cn(
                    "hidden md:flex items-center gap-1 text-xs",
                    context.changePercent > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    <TrendingUp className={cn(
                      "h-3 w-3",
                      context.changePercent < 0 && "rotate-180"
                    )} />
                    {Math.abs(context.changePercent).toFixed(1)}%
                  </div>
                  <Badge variant="outline" className="hidden md:inline-flex text-[10px]">
                    {context.metricCount} metrics
                  </Badge>
                </div>
              </div>
            </div>

            {/* Loading overlay */}
            {(isLoading || isTransitioning) && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Hover effect */}
            <div className={cn(
              "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent",
              "translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700",
              "pointer-events-none"
            )} />
          </Button>
        );
      })}
    </div>
  );
}
