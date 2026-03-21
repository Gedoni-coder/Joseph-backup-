import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LoadingOverlay } from "@/components/ui/loading-spinner";
import ModuleHeader from "@/components/ui/module-header";
import { ContextSwitcher } from "@/components/economic/context-switcher";
import { MetricsDashboard } from "@/components/economic/metrics-dashboard";
import { EconomicTable } from "@/components/economic/economic-table";
import { ForecastPanel } from "@/components/economic/forecast-panel";
import { UpcomingEvents } from "@/components/economic/upcoming-events";
import { useEconomicData } from "@/hooks/useEconomicData";
import { useCompanyInfo } from "@/lib/company-context";
import { getCompanyName } from "@/lib/get-company-name";
import { Activity, AlertTriangle, Calendar, RefreshCw, Wifi } from "lucide-react";

type TrendType = "stable" | "volatile" | "trending";

type RiskLevel = "Low" | "Moderate" | "High";

const CONTEXT_ORDER = ["local", "state", "national", "international"] as const;

const CONTEXT_LABELS: Record<string, string> = {
  local: "Local",
  state: "State",
  national: "National",
  international: "International",
};

const prettifyContextLabel = (context: string) => {
  const key = context.toLowerCase();
  if (CONTEXT_LABELS[key]) return CONTEXT_LABELS[key];
  return context
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getContextDescription = (context: string, metricCount: number) => {
  if (context.toLowerCase() === "national") {
    return "National market indicators";
  }
  if (context.toLowerCase().includes("local")) {
    return "Local market indicators";
  }
  if (context.toLowerCase().includes("state")) {
    return "State-level indicators";
  }
  if (context.toLowerCase().includes("international") || context.toLowerCase().includes("global")) {
    return "Global market indicators";
  }
  return `${metricCount} tracked indicators`;
};

const getTrendStatus = (avgAbsoluteChange: number): TrendType => {
  if (avgAbsoluteChange >= 5) return "volatile";
  if (avgAbsoluteChange >= 1) return "trending";
  return "stable";
};

const Index = () => {
  const [activeContext, setActiveContext] = useState<string>("");

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

  const contextKeys = useMemo(() => {
    const all = new Set<string>();
    Object.keys(metrics).forEach((key) => all.add(key));
    Object.keys(news).forEach((key) => all.add(key));
    Object.keys(forecasts).forEach((key) => all.add(key));
    Object.keys(events).forEach((key) => all.add(key));

    // Always keep the four economic contexts visible in UI.
    CONTEXT_ORDER.forEach((key) => all.add(key));

    return Array.from(all).sort((a, b) => {
      const aIndex = CONTEXT_ORDER.indexOf(a as (typeof CONTEXT_ORDER)[number]);
      const bIndex = CONTEXT_ORDER.indexOf(b as (typeof CONTEXT_ORDER)[number]);
      const aOrder = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
      const bOrder = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.localeCompare(b);
    });
  }, [metrics, news, forecasts, events]);

  useEffect(() => {
    if (!activeContext && contextKeys.length > 0) {
      setActiveContext(contextKeys.includes("national") ? "national" : contextKeys[0]);
    }
    if (activeContext && contextKeys.length > 0 && !contextKeys.includes(activeContext)) {
      setActiveContext(contextKeys[0]);
    }
  }, [activeContext, contextKeys]);

  const contextSummaries = useMemo(() => {
    return contextKeys.map((context) => {
      const metricsForContext = metrics[context] || [];
      const avgChange =
        metricsForContext.length > 0
          ? metricsForContext.reduce((sum, item) => sum + item.change, 0) / metricsForContext.length
          : 0;

      const avgAbsoluteChange =
        metricsForContext.length > 0
          ? metricsForContext.reduce((sum, item) => sum + Math.abs(item.change), 0) / metricsForContext.length
          : 0;

      return {
        key: context,
        label: prettifyContextLabel(context),
        description: getContextDescription(context, metricsForContext.length),
        status: getTrendStatus(avgAbsoluteChange),
        changePercent: avgChange,
        metricCount: metricsForContext.length,
      };
    });
  }, [contextKeys, metrics]);

  const currentMetrics = activeContext ? metrics[activeContext] || [] : [];
  const currentNews = activeContext ? news[activeContext] || [] : [];
  const currentForecasts = activeContext ? forecasts[activeContext] || [] : [];
  const currentEvents = activeContext ? events[activeContext] || [] : [];

  const marketAlerts = useMemo(() => {
    const alerts: Array<{ title: string; level: "positive" | "watch" | "update"; message: string }> = [];

    const strongestPositiveMetric = [...currentMetrics]
      .filter((metric) => metric.change > 0)
      .sort((a, b) => b.change - a.change)[0];

    if (strongestPositiveMetric) {
      alerts.push({
        title: "Positive Signal",
        level: "positive",
        message: `${strongestPositiveMetric.name} is trending up (${strongestPositiveMetric.change.toFixed(1)} ${strongestPositiveMetric.unit === "%" ? "pp" : strongestPositiveMetric.unit}).`,
      });
    }

    const riskMetric = [...currentMetrics]
      .filter((metric) => metric.trend === "down" || metric.change < 0)
      .sort((a, b) => a.change - b.change)[0];

    if (riskMetric) {
      alerts.push({
        title: "Watch Signal",
        level: "watch",
        message: `${riskMetric.name} is weakening (${riskMetric.change.toFixed(1)} ${riskMetric.unit === "%" ? "pp" : riskMetric.unit}).`,
      });
    }

    const latestNews = [...currentNews]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    if (latestNews) {
      alerts.push({
        title: "Market Update",
        level: "update",
        message: latestNews.title,
      });
    }

    return alerts.slice(0, 3);
  }, [currentMetrics, currentNews]);

  const analysisSummary = useMemo(() => {
    const avgAbsChange =
      currentMetrics.length > 0
        ? currentMetrics.reduce((sum, metric) => sum + Math.abs(metric.change), 0) / currentMetrics.length
        : 0;

    const avgConfidence =
      currentForecasts.length > 0
        ? currentForecasts.reduce((sum, forecast) => sum + forecast.confidence, 0) / currentForecasts.length
        : 0;

    const highImpactNewsCount = currentNews.filter(
      (item) => String(item.impact).toLowerCase() === "high" || String(item.impact).toLowerCase() === "negative",
    ).length;

    const riskAssessment: RiskLevel = avgAbsChange >= 5 ? "High" : avgAbsChange >= 2 ? "Moderate" : "Low";
    const confidenceLabel = avgConfidence >= 75 ? "High" : avgConfidence >= 55 ? "Medium" : "Low";

    const improvingCount = currentMetrics.filter((metric) => metric.change > 0).length;
    const weakeningCount = currentMetrics.filter((metric) => metric.change < 0).length;

    const takeaways = [
      `${improvingCount} indicators are improving while ${weakeningCount} are weakening in the selected context.`,
      `${currentForecasts.length} forecast models are active with average confidence of ${avgConfidence.toFixed(0)}%.`,
      `${highImpactNewsCount} high-impact headlines require attention for near-term planning.`,
    ];

    const outlook =
      riskAssessment === "High"
        ? "Market conditions are volatile. Tight monitoring and shorter planning cycles are recommended."
        : riskAssessment === "Moderate"
          ? "The market is mixed but manageable. Use scenario-based planning and monitor leading indicators closely."
          : "The current trend is relatively stable. Continue execution with periodic validation against incoming data.";

    return {
      takeaways,
      outlook,
      riskAssessment,
      confidenceLabel,
    };
  }, [currentMetrics, currentForecasts, currentNews]);

  const handleRefresh = async () => {
    await refreshData(activeContext);
  };

  const activeContextLabel = activeContext ? prettifyContextLabel(activeContext) : "Economic";
  const activeContextSummary = contextSummaries.find((ctx) => ctx.key === activeContext);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <ModuleHeader
          icon={<Activity className="h-6 w-6" />}
          title="Economic Indicators"
          description={`${activeContextSummary?.description || "Key economic indicators and market insights."} for ${companyName}`}
          isConnected={isConnected}
          lastUpdated={lastUpdated}
          onReconnect={reconnect}
          error={error}
          connectionLabel="Database"
        />

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <ContextSwitcher
              activeContext={activeContext}
              onContextChange={setActiveContext}
              contexts={contextSummaries}
              isLoading={isLoading}
            />

            <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm">
              <Badge
                variant={isConnected ? "default" : "destructive"}
                className="flex items-center gap-1"
              >
                {isConnected ? <Wifi className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                {isConnected ? "Database Connected" : "Database Unavailable"}
              </Badge>

              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Updated {lastUpdated ? lastUpdated.toLocaleTimeString() : "-"}
              </Badge>

              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border hover:bg-muted"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Unable to load economic data from Django
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
            </Card>
          )}

          <section>
            <LoadingOverlay isLoading={isLoading} loadingText="Loading metrics from database...">
              <MetricsDashboard metrics={currentMetrics} />
            </LoadingOverlay>
          </section>

          <section>
            <LoadingOverlay isLoading={isLoading} loadingText="Loading news from database...">
              <EconomicTable news={currentNews} />
            </LoadingOverlay>
          </section>

          <section>
            <LoadingOverlay isLoading={isLoading} loadingText="Loading forecasts from database...">
              <ForecastPanel forecasts={currentForecasts} />
            </LoadingOverlay>
          </section>

          <section>
            <LoadingOverlay isLoading={isLoading} loadingText="Loading events from database...">
              <UpcomingEvents events={currentEvents} />
            </LoadingOverlay>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>Market Alerts & Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {marketAlerts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No market alerts available from database records for this context.
                  </p>
                ) : (
                  marketAlerts.map((alert, idx) => (
                    <div key={`${alert.title}-${idx}`} className="rounded-md border p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <Badge
                          variant={
                            alert.level === "positive"
                              ? "default"
                              : alert.level === "watch"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {alert.level === "positive"
                            ? "Positive"
                            : alert.level === "watch"
                              ? "Watch"
                              : "Update"}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>

          <section>
            <Card>
              <CardHeader>
                <CardTitle>Economic Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Key Takeaways</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {analysisSummary.takeaways.map((item, idx) => (
                      <li key={`${item}-${idx}`}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Outlook</h4>
                  <p className="text-sm text-muted-foreground">{analysisSummary.outlook}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Risk Assessment: {analysisSummary.riskAssessment}</Badge>
                  <Badge variant="outline">Confidence: {analysisSummary.confidenceLabel}</Badge>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Index;
