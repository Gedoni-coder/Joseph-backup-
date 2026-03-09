import { useQuery } from "@tanstack/react-query";
import {
  getPricingStrategies,
  PricingStrategyData,
} from "@/lib/api/pricing-strategy-service";

interface TransformedPricingData {
  averageSellingPrice: number;
  priceElasticity: number;
  competitivePositionScore: number;
  priceAcceptanceRate: number;
  strategies: string[];
  priceTests: string[];
  recommendations: string[];
  competitiveAnalysis: string[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdated: Date;
}

/**
 * Transform Xano API response to component-ready data structures
 */
function transformPricingStrategyData(
  data: PricingStrategyData[]
): TransformedPricingData {
  if (!data || data.length === 0) {
    return {
      averageSellingPrice: 0,
      priceElasticity: 0,
      competitivePositionScore: 0,
      priceAcceptanceRate: 0,
      strategies: [],
      priceTests: [],
      recommendations: [],
      competitiveAnalysis: [],
      isLoading: false,
      error: null,
      isConnected: true,
      lastUpdated: new Date(),
    };
  }

  const record = data[0];

  return {
    averageSellingPrice: record.average_selling_price,
    priceElasticity: record.price_elasticity,
    competitivePositionScore: record.competitive_position_score,
    priceAcceptanceRate: record.price_acceptance_rate,
    strategies: record.active_pricing_strategies || [],
    priceTests: record.running_price_tests || [],
    recommendations: record.pricing_recommendations || [],
    competitiveAnalysis: record.competitive_analysis || [],
    isLoading: false,
    error: null,
    isConnected: true,
    lastUpdated: new Date(),
  };
}

/**
 * Hook to fetch and transform pricing strategy data with fallback
 */
export function usePricingStrategyAPI() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["pricing-strategy"],
    queryFn: () => getPricingStrategies(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    retryDelay: 2000,
  });

  const transformed = transformPricingStrategyData(data || []);
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
