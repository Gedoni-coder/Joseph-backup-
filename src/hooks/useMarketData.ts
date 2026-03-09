import { useState, useEffect, useCallback } from "react";
import {
  marketSizes,
  customerSegments,
  marketTrends,
  demandForecasts,
  industryInsights,
  reportNotes,
  type MarketSize,
  type CustomerSegment,
  type MarketTrend,
  type DemandForecast,
  type IndustryInsight,
  type ReportNote,
} from "@/lib/market-data";

export interface UseMarketDataReturn {
  marketSizes: MarketSize[];
  customerSegments: CustomerSegment[];
  marketTrends: MarketTrend[];
  demandForecasts: DemandForecast[];
  industryInsights: IndustryInsight[];
  reportNotes: ReportNote[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
}

export function useMarketData(): UseMarketDataReturn {
  const [data, setData] = useState({
    marketSizes,
    customerSegments,
    marketTrends,
    demandForecasts,
    industryInsights,
    reportNotes,
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
          // Simulate market size updates
          const updatedMarketSizes = data.marketSizes.map((market) => ({
            ...market,
            tam: market.tam * (1 + (Math.random() - 0.5) * 0.02),
            sam: market.sam * (1 + (Math.random() - 0.5) * 0.03),
            som: market.som * (1 + (Math.random() - 0.5) * 0.05),
            growthRate: Math.max(
              0,
              market.growthRate + (Math.random() - 0.5) * 2,
            ),
          }));

          // Simulate customer segment updates
          const updatedCustomerSegments = data.customerSegments.map(
            (segment) => ({
              ...segment,
              size: segment.size + Math.floor((Math.random() - 0.5) * 1000),
              avgSpending:
                segment.avgSpending * (1 + (Math.random() - 0.5) * 0.03),
              growthRate: Math.max(
                0,
                segment.growthRate + (Math.random() - 0.5) * 3,
              ),
            }),
          );

          // Simulate market trends confidence updates
          const updatedMarketTrends = data.marketTrends.map((trend) => ({
            ...trend,
            confidence: Math.max(
              50,
              Math.min(100, trend.confidence + (Math.random() - 0.5) * 5),
            ),
          }));

          // Simulate demand forecast updates
          const updatedDemandForecasts = data.demandForecasts.map(
            (forecast) => ({
              ...forecast,
              currentDemand:
                forecast.currentDemand +
                Math.floor((Math.random() - 0.5) * 1000),
              forecastDemand:
                forecast.forecastDemand * (1 + (Math.random() - 0.5) * 0.04),
              confidence: Math.max(
                60,
                Math.min(95, forecast.confidence + (Math.random() - 0.5) * 3),
              ),
              factors: forecast.factors.map((factor) => ({
                ...factor,
                impact: factor.impact + (Math.random() - 0.5) * 2,
              })),
            }),
          );

          // Simulate industry insights probability updates
          const updatedIndustryInsights = data.industryInsights.map(
            (insight) => ({
              ...insight,
              probability: Math.max(
                20,
                Math.min(100, insight.probability + (Math.random() - 0.5) * 4),
              ),
            }),
          );

          setData({
            marketSizes: updatedMarketSizes,
            customerSegments: updatedCustomerSegments,
            marketTrends: updatedMarketTrends,
            demandForecasts: updatedDemandForecasts,
            industryInsights: updatedIndustryInsights,
            reportNotes: data.reportNotes, // Reports don't change frequently
          });

          setLastUpdated(new Date());
          setIsConnected(true);
          setIsLoading(false);
        } catch (err) {
          setError("Failed to update market data");
          setIsLoading(false);
        }
      },
      1200 + Math.random() * 2000,
    );
  }, [data]);

  useEffect(() => {
    // Initial load
    refreshData();

    // Set up auto-refresh interval
    const interval = setInterval(refreshData, 45000); // Refresh every 45 seconds

    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setIsConnected(true);
      // Simulate occasional disconnections
      const disconnectTimeout = setTimeout(
        () => {
          setIsConnected(false);
          setTimeout(connectWebSocket, 4000);
        },
        75000 + Math.random() * 150000,
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
    marketSizes: data.marketSizes,
    customerSegments: data.customerSegments,
    marketTrends: data.marketTrends,
    demandForecasts: data.demandForecasts,
    industryInsights: data.industryInsights,
    reportNotes: data.reportNotes,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
  };
}
