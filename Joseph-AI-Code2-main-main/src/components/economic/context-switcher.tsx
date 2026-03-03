import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EconomicContext } from "@/lib/economic-data";
import { Globe, MapPin, Building2, Flag, Zap, TrendingUp } from "lucide-react";
import { useState } from "react";

interface ContextSwitcherProps {
  activeContext: EconomicContext;
  onContextChange: (context: EconomicContext) => void;
  isLoading?: boolean;
}

interface ContextData {
  label: string;
  icon: any;
  description: string;
  status: "stable" | "volatile" | "trending";
  changePercent: number;
}

const contextConfig: Record<EconomicContext, ContextData> = {
  local: {
    label: "Local",
    icon: MapPin,
    description: "City & Regional",
    status: "stable",
    changePercent: 2.1,
  },
  state: {
    label: "State",
    icon: Building2,
    description: "State Level",
    status: "trending",
    changePercent: 5.7,
  },
  national: {
    label: "National",
    icon: Flag,
    description: "United States",
    status: "volatile",
    changePercent: -1.2,
  },
  international: {
    label: "International",
    icon: Globe,
    description: "Global Markets",
    status: "trending",
    changePercent: 8.3,
  },
} as const;

export function ContextSwitcher({
  activeContext,
  onContextChange,
  isLoading = false,
}: ContextSwitcherProps) {
  const [hoveredContext, setHoveredContext] = useState<EconomicContext | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleContextChange = async (context: EconomicContext) => {
    if (context === activeContext || isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      onContextChange(context);
      setIsTransitioning(false);
    }, 150);
  };

  const getStatusColor = (status: ContextData["status"]) => {
    switch (status) {
      case "stable": return "bg-green-500";
      case "volatile": return "bg-red-500";
      case "trending": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: ContextData["status"]) => {
    switch (status) {
      case "stable": return "Stable";
      case "volatile": return "Volatile";
      case "trending": return "Trending";
      default: return "Unknown";
    }
  };
  return (
    <div className="flex flex-wrap gap-3 p-2 bg-muted/50 rounded-xl backdrop-blur-sm border">
      {(Object.keys(contextConfig) as EconomicContext[]).map((context) => {
        const config = contextConfig[context];
        const Icon = config.icon;
        const isActive = activeContext === context;
        const isHovered = hoveredContext === context;

        return (
          <Button
            key={context}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            disabled={isLoading || isTransitioning}
            onClick={() => handleContextChange(context)}
            onMouseEnter={() => setHoveredContext(context)}
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
                  getStatusColor(config.status),
                  isActive && "animate-pulse"
                )} />
              </div>

              <div className="flex flex-col items-start min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-medium transition-colors",
                    isActive && "text-primary"
                  )}>
                    {config.label}
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
                    {config.description}
                  </span>

                  {/* Change indicator */}
                  <div className={cn(
                    "hidden md:flex items-center gap-1 text-xs",
                    config.changePercent > 0 ? "text-green-600" : "text-red-600"
                  )}>
                    <TrendingUp className={cn(
                      "h-3 w-3",
                      config.changePercent < 0 && "rotate-180"
                    )} />
                    {Math.abs(config.changePercent)}%
                  </div>
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
