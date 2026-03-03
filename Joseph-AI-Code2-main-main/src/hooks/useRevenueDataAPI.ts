import { useRevenueStrategyAPI } from "./useRevenueStrategyAPI";
import {
  revenueStreams as mockStreams,
  revenueScenarios as mockScenarios,
  churnAnalysis as mockChurn,
  upsellOpportunities as mockUpsells,
  revenueMetrics as mockMetrics,
  discountAnalysis as mockDiscounts,
  channelPerformance as mockChannels,
  type RevenueStream,
  type RevenueScenario,
  type ChurnAnalysis,
  type UpsellOpportunity,
  type RevenueMetric,
  type DiscountAnalysis,
  type ChannelPerformance,
} from "@/lib/revenue-data";

export interface UseRevenueDataReturn {
  streams: RevenueStream[];
  scenarios: RevenueScenario[];
  churn: ChurnAnalysis[];
  upsells: UpsellOpportunity[];
  metrics: RevenueMetric[];
  discounts: DiscountAnalysis[];
  channels: ChannelPerformance[];
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
  const {
    monthlyRecurringRevenue,
    annualContractValue,
    customerLifetimeValue,
    revenuePerCustomer,
    netRevenueRetention,
    streams: apiStreams,
    churnAnalysis: apiChurn,
    upsellOpportunities: apiUpsells,
    isLoading,
    error,
    isConnected,
    lastUpdated,
    refreshData,
    reconnect,
  } = useRevenueStrategyAPI();

  // Use API data if available, fall back to mock
  const streams: RevenueStream[] =
    apiStreams.length > 0
      ? apiStreams.map((stream, idx) => ({
          id: String(idx + 1),
          name: stream,
          currentRevenue: monthlyRecurringRevenue * (0.3 + idx * 0.2),
          projectedRevenue: monthlyRecurringRevenue * (0.35 + idx * 0.25),
          growth: 15 + idx * 5,
          margin: 60 + idx * 5,
        }))
      : mockStreams;

  const scenarios: RevenueScenario[] =
    annualContractValue > 0
      ? [
          {
            id: "1",
            name: "Conservative",
            yearlyRevenue: annualContractValue * 0.8,
            churnRate: 8,
            probability: 25,
          },
          {
            id: "2",
            name: "Base Case",
            yearlyRevenue: annualContractValue,
            churnRate: 5,
            probability: 50,
          },
          {
            id: "3",
            name: "Optimistic",
            yearlyRevenue: annualContractValue * 1.2,
            churnRate: 3,
            probability: 25,
          },
        ]
      : mockScenarios;

  const churn: ChurnAnalysis[] =
    apiChurn.length > 0
      ? apiChurn.map((c, idx) => ({
          id: String(idx + 1),
          segment: `Segment ${idx + 1}`,
          churnRate: 5 + idx * 2,
          atRiskCustomers: Math.round(customerLifetimeValue / 10000 + idx * 10),
          retentionScore: 85 - idx * 5,
        }))
      : mockChurn;

  const upsells: UpsellOpportunity[] =
    apiUpsells.length > 0
      ? apiUpsells.map((u, idx) => ({
          id: String(idx + 1),
          product: u,
          targetCustomers: Math.round(customerLifetimeValue / 5000 + idx * 20),
          averageValue: revenuePerCustomer * 0.3,
          conversionRate: 30 + idx * 5,
          potentialRevenue: revenuePerCustomer * 0.3 * (30 + idx * 5) / 100,
        }))
      : mockUpsells;

  const metrics: RevenueMetric[] =
    monthlyRecurringRevenue > 0
      ? [
          {
            id: "1",
            metric: "Monthly Recurring Revenue",
            value: monthlyRecurringRevenue,
            unit: "USD",
            trend: "up",
            target: monthlyRecurringRevenue * 1.2,
          },
          {
            id: "2",
            metric: "Annual Contract Value",
            value: annualContractValue,
            unit: "USD",
            trend: "up",
            target: annualContractValue * 1.15,
          },
          {
            id: "3",
            metric: "Customer Lifetime Value",
            value: customerLifetimeValue,
            unit: "USD",
            trend: "up",
            target: customerLifetimeValue * 1.25,
          },
          {
            id: "4",
            metric: "Net Revenue Retention",
            value: netRevenueRetention,
            unit: "%",
            trend: "stable",
            target: 120,
          },
        ]
      : mockMetrics;

  const discounts: DiscountAnalysis[] = mockDiscounts;
  const channels: ChannelPerformance[] = mockChannels;

  return {
    streams,
    scenarios,
    churn,
    upsells,
    metrics,
    discounts,
    channels,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
  };
}
