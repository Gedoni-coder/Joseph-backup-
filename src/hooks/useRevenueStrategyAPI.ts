import { useQuery } from "@tanstack/react-query";
import { getRevenueOverviewMetrics } from "@/lib/api/revenue-strategy-service";

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

function transformMetricsToLegacyShape(data: Awaited<ReturnType<typeof getRevenueOverviewMetrics>>): TransformedRevenueData {
  const getValue = (name: string) => data.find((item) => item.name === name)?.value ?? 0;

  return {
    monthlyRecurringRevenue: getValue("Monthly Recurring Revenue"),
    annualContractValue: getValue("Annual Contract Value"),
    customerLifetimeValue: getValue("Customer Lifetime Value"),
    revenuePerCustomer: getValue("Revenue per Customer"),
    netRevenueRetention: getValue("Net Revenue Retention"),
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

export function useRevenueStrategyAPI() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["revenue", "legacy-overview"],
    queryFn: getRevenueOverviewMetrics,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const transformed = transformMetricsToLegacyShape(data ?? []);

  return {
    ...transformed,
    isLoading,
    error: error ? (error as Error).message : null,
    refreshData: () => refetch(),
    reconnect: () => refetch(),
  };
}
