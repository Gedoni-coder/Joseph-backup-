import { useState, useEffect, useCallback } from "react";
import {
  revenueStreams,
  revenueScenarios,
  churnAnalysis,
  upsellOpportunities,
  revenueMetrics,
  discountAnalysis,
  channelPerformance,
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

export function useRevenueData(): UseRevenueDataReturn {
  const [data, setData] = useState({
    streams: revenueStreams,
    scenarios: revenueScenarios,
    churn: churnAnalysis,
    upsells: upsellOpportunities,
    metrics: revenueMetrics,
    discounts: discountAnalysis,
    channels: channelPerformance,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    setError(null);

    // Simulate API call with realistic delay
    setTimeout(
      () => {
        try {
          // Simulate revenue stream updates
          const updatedStreams = data.streams.map((stream) => ({
            ...stream,
            currentRevenue:
              stream.currentRevenue * (1 + (Math.random() - 0.5) * 0.05),
            forecastRevenue:
              stream.forecastRevenue * (1 + (Math.random() - 0.5) * 0.08),
            growth: stream.growth + (Math.random() - 0.5) * 5,
            customers:
              stream.customers + Math.floor((Math.random() - 0.5) * 20),
            avgRevenuePerCustomer:
              stream.avgRevenuePerCustomer * (1 + (Math.random() - 0.5) * 0.03),
          }));

          // Simulate churn rate updates
          const updatedChurn = data.churn.map((churnData) => ({
            ...churnData,
            churnRate: Math.max(
              0,
              churnData.churnRate + (Math.random() - 0.5) * 0.5,
            ),
            revenueAtRisk:
              churnData.revenueAtRisk * (1 + (Math.random() - 0.5) * 0.1),
          }));

          // Simulate upsell opportunity updates
          const updatedUpsells = data.upsells.map((upsell) => ({
            ...upsell,
            probabilityScore: Math.max(
              0,
              Math.min(
                100,
                upsell.probabilityScore + (Math.random() - 0.5) * 10,
              ),
            ),
            timeToUpgrade: Math.max(
              7,
              upsell.timeToUpgrade + Math.floor((Math.random() - 0.5) * 10),
            ),
          }));

          // Simulate revenue metrics updates
          const updatedMetrics = data.metrics.map((metric) => ({
            ...metric,
            value: metric.value * (1 + (Math.random() - 0.5) * 0.03),
            change: (Math.random() - 0.5) * 8,
            trend:
              Math.random() > 0.6
                ? "up"
                : Math.random() > 0.3
                  ? "down"
                  : ("stable" as const),
          }));

          // Simulate channel performance updates
          const updatedChannels = data.channels.map((channel) => ({
            ...channel,
            revenue: channel.revenue * (1 + (Math.random() - 0.5) * 0.04),
            customers:
              channel.customers + Math.floor((Math.random() - 0.5) * 30),
            avgOrderValue:
              channel.avgOrderValue * (1 + (Math.random() - 0.5) * 0.02),
            acquisitionCost:
              channel.acquisitionCost * (1 + (Math.random() - 0.5) * 0.05),
            growth: channel.growth + (Math.random() - 0.5) * 3,
          }));

          // Simulate discount analysis updates
          const updatedDiscounts = data.discounts.map((discount) => ({
            ...discount,
            usage: Math.max(0, discount.usage + (Math.random() - 0.5) * 2),
            revenueImpact: discount.revenueImpact + (Math.random() - 0.5) * 3,
            conversionLift: Math.max(
              0,
              discount.conversionLift + (Math.random() - 0.5) * 5,
            ),
          }));

          setData({
            streams: updatedStreams,
            scenarios: data.scenarios, // Scenarios typically don't change frequently
            churn: updatedChurn,
            upsells: updatedUpsells,
            metrics: updatedMetrics,
            discounts: updatedDiscounts,
            channels: updatedChannels,
          });

          setLastUpdated(new Date());
          setIsConnected(true);
          setIsLoading(false);
        } catch (err) {
          setError("Failed to update revenue data");
          setIsLoading(false);
        }
      },
      800 + Math.random() * 1500,
    );
  }, [data]);

  useEffect(() => {
    // Initial load
    refreshData();

    // Set up auto-refresh interval
    const interval = setInterval(refreshData, 25000); // Refresh every 25 seconds

    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setIsConnected(true);
      // Simulate occasional disconnections
      const disconnectTimeout = setTimeout(
        () => {
          setIsConnected(false);
          setTimeout(connectWebSocket, 3000);
        },
        45000 + Math.random() * 90000,
      );

      return () => clearTimeout(disconnectTimeout);
    };

    const cleanup = connectWebSocket();

    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, [refreshData]);

  return {
    streams: data.streams,
    scenarios: data.scenarios,
    churn: data.churn,
    upsells: data.upsells,
    metrics: data.metrics,
    discounts: data.discounts,
    channels: data.channels,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
  };
}
