import { useQuery } from "@tanstack/react-query";
import {
  getRevenueStrategies,
  RevenueStrategyData,
} from "@/lib/api/revenue-strategy-service";

interface TransformedRevenueData {
  monthlyRecurringRevenue: number;
  annualContractValue: number;
  customerLifetimeValue: number;
  revenuePerCustomer: number;
  netRevenueRetention: number;
  streams: string[];
  churnAnalysis: string[];
  upsellOpportunities: string[];
  recommendations: string[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdated: Date;
}

/**
 * Transform Xano API response to component-ready data structures
 */
function transformRevenueStrategyData(
  data: RevenueStrategyData[]
): TransformedRevenueData {
  if (!data || data.length === 0) {
    return {
      monthlyRecurringRevenue: 0,
      annualContractValue: 0,
      customerLifetimeValue: 0,
      revenuePerCustomer: 0,
      netRevenueRetention: 0,
      streams: [],
      churnAnalysis: [],
      upsellOpportunities: [],
      recommendations: [],
      isLoading: false,
      error: null,
      isConnected: true,
      lastUpdated: new Date(),
    };
  }

  const record = data[0];

  return {
    monthlyRecurringRevenue: record.monthly_recurring_revenue,
    annualContractValue: record.annual_contract_value,
    customerLifetimeValue: record.customer_lifetime_value,
    revenuePerCustomer: record.revenue_per_customer,
    netRevenueRetention: record.net_revenue_retention,
    streams: record.top_revenue_streams || [],
    churnAnalysis: record.churn_analysis || [],
    upsellOpportunities: record.top_upsell_opportunities || [],
    recommendations: record.revenue_strategy_recommendations || [],
    isLoading: false,
    error: null,
    isConnected: true,
    lastUpdated: new Date(),
  };
}

/**
 * Hook to fetch and transform revenue strategy data
 */
export function useRevenueStrategyAPI() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["revenue-strategy"],
    queryFn: () => getRevenueStrategies(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  const transformed = transformRevenueStrategyData(data || []);

  return {
    ...transformed,
    isLoading,
    error: error ? (error as Error).message : null,
    refreshData: () => refetch(),
    reconnect: () => refetch(),
  };
}
