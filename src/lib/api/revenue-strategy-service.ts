import { apiClient } from "./api-client";

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

function unwrapList<T>(payload: T[] | Paginated<T>): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload.results ?? [];
}

async function getList<T>(url: string): Promise<T[]> {
  const response = await apiClient.get<T[] | Paginated<T>>(url);
  return unwrapList(response.data);
}

export interface RevenueOverviewMetricApi {
  id: number;
  name: string;
  value: number;
  unit: "USD" | "%";
  change_percent: number;
  trend: "up" | "down" | "stable";
  period_label: string;
  sort_order: number;
}

export interface RevenueOverviewTopStreamApi {
  id: number;
  name: string;
  stream_type: "subscription" | "one-time" | "usage-based" | "commission" | "advertising";
  revenue: number;
  growth_percent: number;
  sort_order: number;
}

export interface RevenueOverviewChurnRiskApi {
  id: number;
  segment: string;
  customers: number;
  churn_rate: number;
  revenue_at_risk: number;
  sort_order: number;
}

export interface RevenueOverviewUpsellOpportunityApi {
  id: number;
  customer_name: string;
  current_plan: string;
  suggested_plan: string;
  current_mrr: number;
  potential_increase: number;
  likelihood_percent: number;
  time_to_upgrade_days: number;
  triggers: string[];
  sort_order: number;
}

export interface RevenueUpsellInsightApi {
  id: number;
  category: "high-priority" | "success-factor";
  text: string;
  sort_order: number;
}

export interface RevenueOverviewChannelPerformanceApi {
  id: number;
  channel: string;
  customers: number;
  revenue: number;
  margin_percent: number;
  sort_order: number;
}

export const getRevenueOverviewMetrics = () =>
  getList<RevenueOverviewMetricApi>("/api/revenue/overview-metrics/");

export const getRevenueOverviewTopStreams = () =>
  getList<RevenueOverviewTopStreamApi>("/api/revenue/overview-top-streams/");

export const getRevenueOverviewChurnRisks = () =>
  getList<RevenueOverviewChurnRiskApi>("/api/revenue/overview-churn-risks/");

export const getRevenueOverviewUpsellOpportunities = () =>
  getList<RevenueOverviewUpsellOpportunityApi>("/api/revenue/overview-upsell-opportunities/");

export const getRevenueUpsellInsights = () =>
  getList<RevenueUpsellInsightApi>("/api/revenue/upsell-insights/");

export const getRevenueOverviewChannelPerformances = () =>
  getList<RevenueOverviewChannelPerformanceApi>("/api/revenue/overview-channel-performances/");
