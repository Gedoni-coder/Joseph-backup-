import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  isConnected: boolean;
  lastUpdated: Date | string;
  onReconnect?: () => void;
  error?: string | null;
  className?: string;
}

export function ConnectionStatus({
  isConnected,
  lastUpdated,
  onReconnect,
  error,
  className,
}: ConnectionStatusProps) {
  const formatLastUpdated = (date: Date | string) => {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if dateObj is valid
    if (isNaN(dateObj.getTime())) {
      return "Unknown";
    }

    const diffSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    if (diffSeconds < 60) {
      return "Just now";
    } else if (diffSeconds < 3600) {
      const minutes = Math.floor(diffSeconds / 60);
      return `${minutes}m ago`;
    } else {
      return dateObj.toLocaleTimeString();
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge
        variant={isConnected ? "default" : "destructive"}
        className={cn(
          "flex items-center gap-1 text-xs",
          isConnected
            ? "bg-economic-positive text-economic-positive-foreground"
            : "bg-economic-negative text-economic-negative-foreground",
        )}
      >
        {isConnected ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        {isConnected ? "Live" : "Offline"}
      </Badge>

      <span className="text-xs text-muted-foreground">
        Updated {formatLastUpdated(lastUpdated)}
      </span>

      {error && (
        <Badge
          variant="destructive"
          className="flex items-center gap-1 text-xs"
        >
          <AlertCircle className="h-3 w-3" />
          Error
        </Badge>
      )}

      {(!isConnected || error) && onReconnect && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReconnect}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Reconnect
        </Button>
      )}
    </div>
  );
}

interface DataFreshnessProps {
  lastUpdated: Date;
  isLoading?: boolean;
  autoRefresh?: boolean;
  className?: string;
}

export function DataFreshness({
  lastUpdated,
  isLoading = false,
  autoRefresh = true,
  className,
}: DataFreshnessProps) {
  const getTimeDiff = () => {
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    if (diffSeconds < 30) return { value: diffSeconds, unit: "s", fresh: true };
    if (diffSeconds < 3600)
      return {
        value: Math.floor(diffSeconds / 60),
        unit: "m",
        fresh: diffSeconds < 300,
      };
    return { value: Math.floor(diffSeconds / 3600), unit: "h", fresh: false };
  };

  const { value, unit, fresh } = getTimeDiff();

  return (
    <div className={cn("flex items-center gap-2 text-xs", className)}>
      {isLoading && (
        <div className="flex items-center gap-1">
          <RefreshCw className="h-3 w-3 animate-spin" />
          <span className="text-muted-foreground">Updating...</span>
        </div>
      )}

      {!isLoading && (
        <div className="flex items-center gap-1">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              fresh
                ? "bg-economic-positive animate-pulse-subtle"
                : "bg-economic-warning",
            )}
          />
          <span
            className={cn(
              "text-muted-foreground",
              fresh && "text-economic-positive",
            )}
          >
            {value}
            {unit} ago
          </span>
          {autoRefresh && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              Auto
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
