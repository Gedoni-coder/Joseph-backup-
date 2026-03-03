import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  LoadingOverlay,
  MetricCardSkeleton,
} from "@/components/ui/loading-spinner";
import {
  ConnectionStatus,
  DataFreshness,
} from "@/components/ui/connection-status";
import ModuleHeader from "@/components/ui/module-header";
import { NotificationsIdeasPopovers } from "@/components/ui/notifications-ideas-popovers";
import { ContextSwitcher } from "@/components/economic/context-switcher";
import { MetricsDashboard } from "@/components/economic/metrics-dashboard";
import { EconomicTable } from "@/components/economic/economic-table";
import { ForecastPanel } from "@/components/economic/forecast-panel";
import { UpcomingEvents } from "@/components/economic/upcoming-events";
import { useEconomicData } from "@/hooks/useEconomicData";
import { useCompanyInfo } from "@/lib/company-context";
import { EconomicContext } from "@/lib/economic-data";
import { COMPANY_NAME } from "@/lib/company-config";
import { getCompanyName } from "@/lib/get-company-name";
import {
  MARKET_ALERTS,
  KEY_TAKEAWAYS,
  ECONOMIC_OUTLOOK,
  ECONOMIC_FOOTER,
  SENTIMENT_COLOR_MAP,
  ALERT_STYLE_MAP,
} from "@/lib/economic-content";
import {
  ECONOMIC_CONTEXT_CONFIG,
  ECONOMIC_REFRESH_ALERT,
  UPDATE_TYPES,
  STREAM_UPDATE_INTERVAL,
  STREAM_JITTER,
  ACTIVE_UPDATE_TIMEOUT,
} from "@/mocks/economic-indicators";

// Type aliases to match component expectations
type EconomicNews = {
  id: number;
  context: string;
  title: string;
  summary: string;
  source: string;
  timestamp: string;
  impact: string;
  category: string;
};

type EconomicForecast = {
  id: number;
  context: string;
  indicator: string;
  period: string;
  forecast: number;
  confidence: number;
  range_low: number;
  range_high: number;
};

type EconomicEvent = {
  id: number;
  context: string;
  title: string;
  date: string;
  description: string;
  impact: string;
  category: string;
};
import { cn } from "@/lib/utils";
import {
  Activity,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Calendar,
  BarChart3,
  Calculator,
  Wifi,
  Globe,
  Bell,
  Lightbulb,
  X,
} from "lucide-react";

const Index = () => {
  const [activeContext, setActiveContext] =
    useState<EconomicContext>("national");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [ideasOpen, setIdeasOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(true);
  const [lastDataUpdate, setLastDataUpdate] = useState(new Date());
  const [activeUpdates, setActiveUpdates] = useState<string[]>([]);

  const { companyInfo } = useCompanyInfo();
  const companyName = getCompanyName(companyInfo?.companyName);

  const {
    metrics,
    news,
    forecasts,
    events,
    lastUpdated,
    isLoading,
    error,
    isConnected,
    refreshData,
    reconnect,
  } = useEconomicData(companyName);

  // Add null safety checks
  const currentMetrics = metrics[activeContext] || [];
  const currentNews = news[activeContext] || [];
  const currentForecasts = forecasts[activeContext] || [];
  const currentEvents = events[activeContext] || [];

  const handleRefresh = async () => {
    await refreshData(activeContext);
    // Show user feedback
    setTimeout(() => {
      alert(ECONOMIC_REFRESH_ALERT);
    }, 500);
  };

  // Real-time data streaming simulation
  useEffect(() => {
    if (!isStreaming) return;

    const streamInterval = setInterval(
      () => {
        // Simulate random data updates
        const randomUpdate =
          UPDATE_TYPES[Math.floor(Math.random() * UPDATE_TYPES.length)];

        setActiveUpdates((prev) => [...prev, randomUpdate]);
        setLastDataUpdate(new Date());

        // Clear update indicator after 3 seconds
        setTimeout(() => {
          setActiveUpdates((prev) =>
            prev.filter((update) => update !== randomUpdate),
          );
        }, ACTIVE_UPDATE_TIMEOUT);
      },
      STREAM_UPDATE_INTERVAL + Math.random() * STREAM_JITTER,
    );

    return () => clearInterval(streamInterval);
  }, [isStreaming]);

  const handleContextChange = async (newContext: EconomicContext) => {
    setActiveContext(newContext);
    // Fetch fresh data for the new context
    await refreshData(newContext);
    setLastDataUpdate(new Date());
  };

  const getContextTitle = (context: EconomicContext) => {
    const config = ECONOMIC_CONTEXT_CONFIG.find((c) => c.context === context);
    return config?.titleBase || "Economic Dashboard";
  };

  const getContextDescription = (context: EconomicContext) => {
    const config = ECONOMIC_CONTEXT_CONFIG.find((c) => c.context === context);
    if (!config) return "";
    return config.descriptionTemplate.replace("{companyName}", companyName);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <ModuleHeader
          icon={<Activity className="h-6 w-6" />}
          title={getContextTitle(activeContext)}
          description={getContextDescription(activeContext)}
          isConnected={isConnected}
          lastUpdated={lastUpdated}
          onReconnect={reconnect}
          error={error}
          connectionLabel={isStreaming ? "Live Streaming" : "Live"}
        />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Economic Indicators Note: Index.tsx doesn't have tab navigation like other modules */}
          {/* Context Switcher */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <ContextSwitcher
              activeContext={activeContext}
              onContextChange={handleContextChange}
              isLoading={isLoading}
            />

            <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
              <Badge
                variant={isConnected ? "default" : "destructive"}
                className={cn(
                  "flex items-center gap-1 transition-all",
                  isStreaming && "animate-pulse",
                )}
              >
                {isConnected ? (
                  <Wifi
                    className={cn("h-3 w-3", isStreaming && "animate-bounce")}
                  />
                ) : (
                  <Activity className="h-3 w-3" />
                )}
                {isConnected ? "Live Streaming" : "Offline Mode"}
              </Badge>

              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1 transition-all",
                  activeUpdates.includes("metrics") &&
                    "bg-green-100 border-green-300 animate-pulse",
                )}
              >
                <TrendingUp className="h-3 w-3" />
                {currentMetrics.filter((m) => m.trend === "up").length} Trending
                Up
              </Badge>

              <Badge
                variant="secondary"
                className={cn(
                  "flex items-center gap-1",
                  activeUpdates.length > 0 && "animate-pulse bg-blue-100",
                )}
              >
                <Activity className="h-3 w-3" />
                {activeUpdates.length} Active Updates
              </Badge>

              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Updated {lastDataUpdate.toLocaleTimeString()}
              </Badge>

              {error && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1 animate-pulse"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Connection Issue
                </Badge>
              )}

              <button
                onClick={() => setIsStreaming(!isStreaming)}
                className={cn(
                  "text-xs px-2 py-1 rounded-md transition-all hover:scale-105",
                  isStreaming
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                )}
              >
                {isStreaming ? "🟢 Streaming" : "⏸️ Paused"}
              </button>
            </div>
          </div>

          {/* Key Metrics Dashboard - First */}
          <section>
            <LoadingOverlay
              isLoading={isLoading}
              loadingText="Updating metrics..."
            >
              <MetricsDashboard metrics={currentMetrics} />
            </LoadingOverlay>
          </section>

          {/* Economic News Table - Second */}
          <section>
            <LoadingOverlay
              isLoading={isLoading}
              loadingText="Fetching latest news..."
            >
              <EconomicTable news={currentNews} />
            </LoadingOverlay>
          </section>

          {/* Economic Forecasts - Third */}
          <section>
            <LoadingOverlay
              isLoading={isLoading}
              loadingText="Calculating forecasts..."
            >
              <ForecastPanel forecasts={currentForecasts} />
            </LoadingOverlay>
          </section>

          {/* Economic Alerts - Fourth */}
          <section>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-economic-warning" />
                  Market Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {MARKET_ALERTS.map((alert, index) => {
                    const iconMap = {
                      positive: TrendingUp,
                      warning: AlertTriangle,
                      update: BarChart3,
                    };
                    const Icon = iconMap[alert.type];
                    const styles = ALERT_STYLE_MAP[alert.type];

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border border-${styles.borderColor} bg-${styles.backgroundColor}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon
                            className={`h-4 w-4 text-${styles.textColor}`}
                          />
                          <span
                            className={`text-sm font-medium text-${styles.textColor}`}
                          >
                            {alert.title}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {alert.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Additional Economic Insights - Fifth */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Economic Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Key Takeaways</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {KEY_TAKEAWAYS.map((takeaway) => (
                        <li
                          key={takeaway.id}
                          className="flex items-start gap-2"
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full bg-${SENTIMENT_COLOR_MAP[takeaway.sentiment]} mt-2 flex-shrink-0`}
                          />
                          {takeaway.text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Outlook</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {ECONOMIC_OUTLOOK.summary}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Badge variant="outline" className="text-xs">
                        Risk Assessment: {ECONOMIC_OUTLOOK.riskAssessment}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Confidence: {ECONOMIC_OUTLOOK.confidence}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Upcoming Economic Events - Sixth */}
          <section>
            <UpcomingEvents events={currentEvents} />
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t bg-muted/30 mt-12 sm:mt-16">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <span>{ECONOMIC_FOOTER.copyright}</span>
                <span className="hidden sm:inline">•</span>
                <span>{ECONOMIC_FOOTER.updateFrequency}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <span>Sources: {ECONOMIC_FOOTER.dataSources}</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default Index;
