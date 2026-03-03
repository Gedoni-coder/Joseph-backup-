import { useQuery } from "@tanstack/react-query";
import {
  getMarketAnalyses,
  MarketAnalysisData,
} from "@/lib/api/market-analysis-service";

interface TransformedMarketData {
  totalAddressableMarket: number;
  serviceableAddressableMarket: number;
  marketGrowthRate: number;
  marketSegmentsCount: number;
  competitorsTracked: number;
  competitivePositionScore: number;
  marketShareEstimate: number;
  trends: string[];
  threats: string[];
  opportunities: string[];
  swotAnalysis: string[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdated: Date;
}

/**
 * Transform Xano API response to component-ready data structures
 */
function transformMarketAnalysisData(
  data: MarketAnalysisData[]
): TransformedMarketData {
  if (!data || data.length === 0) {
    return {
      totalAddressableMarket: 0,
      serviceableAddressableMarket: 0,
      marketGrowthRate: 0,
      marketSegmentsCount: 0,
      competitorsTracked: 0,
      competitivePositionScore: 0,
      marketShareEstimate: 0,
      trends: [],
      threats: [],
      opportunities: [],
      swotAnalysis: [],
      isLoading: false,
      error: null,
      isConnected: true,
      lastUpdated: new Date(),
    };
  }

  const record = data[0];

  return {
    totalAddressableMarket: record.total_addressable_market,
    serviceableAddressableMarket: record.serviceable_addressable_market,
    marketGrowthRate: record.market_growth_rate,
    marketSegmentsCount: record.market_segments_count,
    competitorsTracked: record.competitors_tracked,
    competitivePositionScore: record.competitive_position_score,
    marketShareEstimate: record.market_share_estimate,
    trends: record.market_trends || [],
    threats: record.competitive_threats || [],
    opportunities: record.market_opportunities || [],
    swotAnalysis: record.swot_analysis || [],
    isLoading: false,
    error: null,
    isConnected: true,
    lastUpdated: new Date(),
  };
}

/**
 * Hook to fetch and transform market analysis data with fallback
 */
export function useMarketAnalysisAPI() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["market-analysis"],
    queryFn: () => getMarketAnalyses(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: 2000,
  });

  const transformed = transformMarketAnalysisData(data || []);
  const isConnected = !error && (data !== undefined && data !== null);

  return {
    ...transformed,
    isLoading: isLoading && !data, // Don't show loading if we have fallback data
    error: error ? (error as Error).message : null,
    isConnected,
    refreshData: () => refetch(),
    reconnect: () => refetch(),
  };
}
