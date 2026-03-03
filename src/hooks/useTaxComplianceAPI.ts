import { useQuery } from "@tanstack/react-query";
import {
  getTaxComplianceRecords,
  TaxComplianceData,
} from "@/lib/api/tax-compliance-service";

interface TransformedTaxData {
  totalTaxLiability: number;
  potentialSavings: number;
  complianceUpdatesCount: number;
  activeEntitiesCount: number;
  recommendations: string[];
  complianceUpdates: string[];
  taxPlanning: string[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdated: Date;
}

/**
 * Transform Xano API response to component-ready data structures
 */
function transformTaxComplianceData(
  data: TaxComplianceData[]
): TransformedTaxData {
  if (!data || data.length === 0) {
    return {
      totalTaxLiability: 0,
      potentialSavings: 0,
      complianceUpdatesCount: 0,
      activeEntitiesCount: 0,
      recommendations: [],
      complianceUpdates: [],
      taxPlanning: [],
      isLoading: false,
      error: null,
      isConnected: true,
      lastUpdated: new Date(),
    };
  }

  const record = data[0];

  return {
    totalTaxLiability: record.total_tax_liability,
    potentialSavings: record.potential_savings,
    complianceUpdatesCount: record.compliance_updates_count,
    activeEntitiesCount: record.active_entities_count,
    recommendations: record.tax_avoidance_recommendations || [],
    complianceUpdates: record.automated_compliance_updates_guidance || [],
    taxPlanning: record.tax_planning_advisory_support || [],
    isLoading: false,
    error: null,
    isConnected: true,
    lastUpdated: new Date(),
  };
}

/**
 * Hook to fetch and transform tax compliance data
 */
export function useTaxComplianceAPI() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tax-compliance"],
    queryFn: () => getTaxComplianceRecords(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  const transformed = transformTaxComplianceData(data || []);

  return {
    ...transformed,
    isLoading,
    error: error ? (error as Error).message : null,
    refreshData: () => refetch(),
    reconnect: () => refetch(),
  };
}
