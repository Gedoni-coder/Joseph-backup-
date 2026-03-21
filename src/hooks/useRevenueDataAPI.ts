import { useQuery } from "@tanstack/react-query";
import {
  type RevenueStream,
  type RevenueScenario,
  type ChurnAnalysis,
  type UpsellOpportunity,
  type RevenueMetric,
  type DiscountAnalysis,
  type ChannelPerformance,
} from "@/lib/revenue-data";
import {
  getRevenueOverviewMetrics,
  getRevenueOverviewTopStreams,
  getRevenueOverviewChurnRisks,
  getRevenueOverviewUpsellOpportunities,
  getRevenueOverviewChannelPerformances,
  getRevenueUpsellInsights,
} from "@/lib/api/revenue-strategy-service";

export interface UseRevenueDataReturn {
  streams: RevenueStream[];
  scenarios: RevenueScenario[];
  churn: ChurnAnalysis[];
  upsells: UpsellOpportunity[];
  metrics: RevenueMetric[];
  discounts: DiscountAnalysis[];
  channels: ChannelPerformance[];
  upsellInsights: {
    highPriorityActions: string[];
    successFactors: string[];
  };
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
}

/**
 * Adapter hook that converts the API response to the expected data structure
 * This allows existing components to work with real API data without refactoring
 */
export function useRevenueDataAPI(): UseRevenueDataReturn {
  const overviewMetricsQuery = useQuery({
    queryKey: ["revenue", "overview-metrics"],
    queryFn: getRevenueOverviewMetrics,
    staleTime: 5 * 60 * 1000,
  });

  const topStreamsQuery = useQuery({
    queryKey: ["revenue", "overview-top-streams"],
    queryFn: getRevenueOverviewTopStreams,
    staleTime: 5 * 60 * 1000,
  });

  const churnRisksQuery = useQuery({
    queryKey: ["revenue", "overview-churn-risks"],
    queryFn: getRevenueOverviewChurnRisks,
    staleTime: 5 * 60 * 1000,
  });

  const upsellsQuery = useQuery({
    queryKey: ["revenue", "overview-upsell-opportunities"],
    queryFn: getRevenueOverviewUpsellOpportunities,
    staleTime: 5 * 60 * 1000,
  });

  const channelsQuery = useQuery({
    queryKey: ["revenue", "overview-channel-performances"],
    queryFn: getRevenueOverviewChannelPerformances,
    staleTime: 5 * 60 * 1000,
  });

  const upsellInsightsQuery = useQuery({
    queryKey: ["revenue", "upsell-insights"],
    queryFn: getRevenueUpsellInsights,
    staleTime: 5 * 60 * 1000,
  });

  const metrics: RevenueMetric[] =
    overviewMetricsQuery.data?.map((metric) => ({
      id: String(metric.id),
      name: metric.name,
      value: metric.value,
      unit: metric.unit === "USD" ? "$" : metric.unit,
      change: metric.change_percent,
      trend: metric.trend,
      period: metric.period_label,
    })) ?? [];

  const streams: RevenueStream[] =
    topStreamsQuery.data?.map((stream) => ({
      id: String(stream.id),
      name: stream.name,
      type: stream.stream_type,
      currentRevenue: stream.revenue,
      forecastRevenue: stream.revenue,
      growth: stream.growth_percent,
      margin: 0,
      customers: 0,
      avgRevenuePerCustomer: 0,
    })) ?? [];

  const churn: ChurnAnalysis[] =
    churnRisksQuery.data?.map((risk) => ({
      id: String(risk.id),
      segment: risk.segment,
      churnRate: risk.churn_rate,
      customers: risk.customers,
      revenueAtRisk: risk.revenue_at_risk,
      averageLifetime: 0,
      retentionCost: 0,
      churnReasons: [],
    })) ?? [];

  const upsells: UpsellOpportunity[] =
    upsellsQuery.data?.map((upsell) => ({
      id: String(upsell.id),
      customer: upsell.customer_name,
      currentPlan: upsell.current_plan,
      suggestedPlan: upsell.suggested_plan,
      currentMRR: upsell.current_mrr,
      potentialMRR: upsell.potential_increase,
      probabilityScore: upsell.likelihood_percent,
      timeToUpgrade: upsell.time_to_upgrade_days,
      triggers: Array.isArray(upsell.triggers) ? upsell.triggers : [],
    })) ?? [];

  const upsellInsights = {
    highPriorityActions:
      upsellInsightsQuery.data
        ?.filter((item) => item.category === "high-priority")
        .map((item) => item.text) ?? [],
    successFactors:
      upsellInsightsQuery.data
        ?.filter((item) => item.category === "success-factor")
        .map((item) => item.text) ?? [],
  };

  const channels: ChannelPerformance[] =
    channelsQuery.data?.map((channel) => ({
      id: String(channel.id),
      channel: channel.channel,
      revenue: channel.revenue,
      customers: channel.customers,
      avgOrderValue: 0,
      acquisitionCost: 0,
      profitability: channel.margin_percent,
      growth: 0,
    })) ?? [];

  const scenarios: RevenueScenario[] = [];
  const discounts: DiscountAnalysis[] = [];

  const isLoading =
    overviewMetricsQuery.isLoading ||
    topStreamsQuery.isLoading ||
    churnRisksQuery.isLoading ||
    upsellsQuery.isLoading ||
    channelsQuery.isLoading ||
    upsellInsightsQuery.isLoading;

  const firstError =
    overviewMetricsQuery.error ||
    topStreamsQuery.error ||
    churnRisksQuery.error ||
    upsellsQuery.error ||
    channelsQuery.error ||
    upsellInsightsQuery.error;

  const error = firstError ? (firstError as Error).message : null;
  const isConnected = !error;

  return {
    streams,
    scenarios,
    churn,
    upsells,
    metrics,
    discounts,
    channels,
    upsellInsights,
    isLoading,
    isConnected,
    lastUpdated: new Date(),
    error,
    refreshData: () => {
      overviewMetricsQuery.refetch();
      topStreamsQuery.refetch();
      churnRisksQuery.refetch();
      upsellsQuery.refetch();
      channelsQuery.refetch();
      upsellInsightsQuery.refetch();
    },
  };
}
