import { useQuery } from "@tanstack/react-query";
import {
  getEconomicIndicatorRecords,
  EconomicIndicatorData,
} from "@/lib/api/economic-indicators-service";

interface TransformedEconomicData {
  gdpGrowthRate: number;
  inflationRate: number;
  unemploymentRate: number;
  interestRates: number;
  exchangeRates: number;
  consumerConfidence: number;
  stockMarketIndex: number;
  commodityPrices: number;
  housingIndex: number;
  tradeBalance: number;
  news: string[];
  forecasts: string[];
  trends: string[];
  alerts: string[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdated: Date;
}

/**
 * Transform Xano API response to component-ready data structures
 */
function transformEconomicIndicatorData(
  data: EconomicIndicatorData[]
): TransformedEconomicData {
  if (!data || data.length === 0) {
    return {
      gdpGrowthRate: 0,
      inflationRate: 0,
      unemploymentRate: 0,
      interestRates: 0,
      exchangeRates: 0,
      consumerConfidence: 0,
      stockMarketIndex: 0,
      commodityPrices: 0,
      housingIndex: 0,
      tradeBalance: 0,
      news: [],
      forecasts: [],
      trends: [],
      alerts: [],
      isLoading: false,
      error: null,
      isConnected: true,
      lastUpdated: new Date(),
    };
  }

  const record = data[0];

  return {
    gdpGrowthRate: record.gdp_growth_rate,
    inflationRate: record.inflation_rate,
    unemploymentRate: record.unemployment_rate,
    interestRates: record.interest_rates,
    exchangeRates: record.exchange_rates,
    consumerConfidence: record.consumer_confidence,
    stockMarketIndex: record.stock_market_index,
    commodityPrices: record.commodity_prices,
    housingIndex: record.housing_index,
    tradeBalance: record.trade_balance,
    news: record.economic_news || [],
    forecasts: record.forecasts || [],
    trends: record.trends || [],
    alerts: record.alerts || [],
    isLoading: false,
    error: null,
    isConnected: true,
    lastUpdated: new Date(),
  };
}

/**
 * Hook to fetch and transform economic indicator data
 */
export function useEconomicIndicatorsAPI() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["economic-indicators"],
    queryFn: () => getEconomicIndicatorRecords(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  const transformed = transformEconomicIndicatorData(data || []);

  return {
    ...transformed,
    isLoading,
    error: error ? (error as Error).message : null,
    refreshData: () => refetch(),
    reconnect: () => refetch(),
  };
}
