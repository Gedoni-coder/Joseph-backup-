import { useMarketAnalysisAPI } from "./useMarketAnalysisAPI";
import {
  marketSizes as mockSizes,
  customerSegments as mockSegments,
  marketTrends as mockTrends,
  demandForecasts as mockForecasts,
  industryInsights as mockInsights,
  reportNotes as mockNotes,
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

/**
 * Adapter hook that converts the API response to the expected data structure
 * This allows existing components to work with real API data without refactoring
 */
export function useMarketDataAPI(): UseMarketDataReturn {
  const {
    totalAddressableMarket,
    serviceableAddressableMarket,
    marketGrowthRate,
    marketSegmentsCount,
    trends,
    opportunities,
    isLoading,
    error,
    isConnected,
    lastUpdated,
    refreshData,
    reconnect,
  } = useMarketAnalysisAPI();

  // Transform API data to match expected component structure
  const marketSizes: MarketSize[] =
    totalAddressableMarket > 0
      ? [
          {
            id: "1",
            name: "Total Market",
            tam: totalAddressableMarket,
            sam: serviceableAddressableMarket,
            som: serviceableAddressableMarket * 0.2,
            growthRate: marketGrowthRate,
            timeframe: "2025",
            currency: "USD",
            region: "Global",
          },
        ]
      : mockSizes;

  const customerSegments: CustomerSegment[] =
    marketSegmentsCount > 0
      ? Array.from({ length: Math.min(marketSegmentsCount, 5) }, (_, i) => ({
          id: String(i + 1),
          name: `Segment ${i + 1}`,
          size: totalAddressableMarket / marketSegmentsCount,
          percentage: 100 / marketSegmentsCount,
          avgSpending: (serviceableAddressableMarket / marketSegmentsCount) / 1000,
          growthRate: marketGrowthRate,
          characteristics: [`Growth tier ${i + 1}`, "Key market segment"],
          region: "Global",
          priority: i === 0 ? "high" : i === 1 ? "medium" : "low",
        }))
      : mockSegments;

  const marketTrends: MarketTrend[] =
    trends.length > 0
      ? trends.map((trend, idx) => ({
          id: String(idx + 1),
          category: "Market",
          trend,
          impact: idx % 3 === 0 ? "high" : idx % 3 === 1 ? "medium" : "low",
          direction: idx % 2 === 0 ? "positive" : "negative",
          timeframe: "2025",
          description: trend,
          sources: ["Market Research", "Industry Analysis"],
          confidence: 80 + idx * 5,
        }))
      : mockTrends;

  const demandForecasts: DemandForecast[] = mockForecasts;
  const industryInsights: IndustryInsight[] =
    opportunities.length > 0
      ? opportunities.map((opp, idx) => ({
          id: String(idx + 1),
          type: "opportunity",
          title: opp,
          description: opp,
          impact: idx % 2 === 0 ? "high" : "medium",
          timeframe: "short-term",
          probability: 70 + idx * 5,
          actionItems: [`Evaluate ${opp}`, `Develop strategy for ${opp}`],
          relatedTrends: marketTrends.slice(0, 2).map((t) => t.trend),
        }))
      : mockInsights;

  const reportNotes: ReportNote[] = mockNotes;

  return {
    marketSizes,
    customerSegments,
    marketTrends,
    demandForecasts,
    industryInsights,
    reportNotes,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
  };
}
