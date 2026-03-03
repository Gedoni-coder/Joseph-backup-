import { useState, useEffect, useCallback } from "react";
import {
  pricingStrategies,
  competitorAnalysis,
  priceTests,
  pricingMetrics,
  dynamicPricing,
  type PricingStrategy,
  type CompetitorAnalysis,
  type PriceTest,
  type PricingMetric,
  type DynamicPricing,
} from "@/lib/pricing-data";

export interface UsePricingDataReturn {
  strategies: PricingStrategy[];
  competitors: CompetitorAnalysis[];
  tests: PriceTest[];
  metrics: PricingMetric[];
  dynamicPrices: DynamicPricing[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
}

export function usePricingData(): UsePricingDataReturn {
  const [data, setData] = useState({
    strategies: pricingStrategies,
    competitors: competitorAnalysis,
    tests: priceTests,
    metrics: pricingMetrics,
    dynamicPrices: dynamicPricing,
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
          // Simulate dynamic price updates
          const updatedDynamicPrices = data.dynamicPrices.map((dp) => ({
            ...dp,
            currentPrice: dp.basePrice * (1 + (Math.random() - 0.5) * 0.3),
            lastUpdate: new Date(),
            nextUpdate: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
            factors: dp.factors.map((factor) => ({
              ...factor,
              currentValue: Math.max(
                0,
                Math.min(1, factor.currentValue + (Math.random() - 0.5) * 0.1),
              ),
              impact: Math.round((Math.random() - 0.5) * 30),
            })),
          }));

          // Simulate competitor price updates
          const updatedCompetitors = data.competitors.map((comp) => ({
            ...comp,
            price: comp.price * (1 + (Math.random() - 0.5) * 0.1),
            marketShare: Math.max(
              0,
              comp.marketShare + (Math.random() - 0.5) * 2,
            ),
            lastUpdated: new Date(),
          }));

          // Simulate metrics updates
          const updatedMetrics = data.metrics.map((metric) => ({
            ...metric,
            value: metric.value * (1 + (Math.random() - 0.5) * 0.05),
            change: (Math.random() - 0.5) * 10,
            trend:
              Math.random() > 0.5
                ? "up"
                : Math.random() > 0.25
                  ? "down"
                  : ("stable" as const),
          }));

          // Simulate A/B test updates
          const updatedTests = data.tests.map((test) => {
            if (test.status === "running") {
              return {
                ...test,
                variants: test.variants.map((variant) => ({
                  ...variant,
                  conversions:
                    variant.conversions + Math.floor(Math.random() * 50),
                  visitors: variant.visitors + Math.floor(Math.random() * 500),
                  revenue: variant.revenue + Math.floor(Math.random() * 10000),
                  conversionRate:
                    Math.round(
                      (variant.conversions / variant.visitors) * 1000,
                    ) / 10,
                })),
                confidence: Math.min(95, test.confidence + Math.random() * 5),
              };
            }
            return test;
          });

          setData({
            strategies: data.strategies,
            competitors: updatedCompetitors,
            tests: updatedTests,
            metrics: updatedMetrics,
            dynamicPrices: updatedDynamicPrices,
          });

          setLastUpdated(new Date());
          setIsConnected(true);
          setIsLoading(false);
        } catch (err) {
          setError("Failed to update pricing data");
          setIsLoading(false);
        }
      },
      1000 + Math.random() * 2000,
    );
  }, [data]);

  useEffect(() => {
    // Initial load
    refreshData();

    // Set up auto-refresh interval
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds

    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setIsConnected(true);
      // Simulate occasional disconnections
      const disconnectTimeout = setTimeout(
        () => {
          setIsConnected(false);
          setTimeout(connectWebSocket, 5000);
        },
        60000 + Math.random() * 120000,
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
    strategies: data.strategies,
    competitors: data.competitors,
    tests: data.tests,
    metrics: data.metrics,
    dynamicPrices: data.dynamicPrices,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
  };
}
