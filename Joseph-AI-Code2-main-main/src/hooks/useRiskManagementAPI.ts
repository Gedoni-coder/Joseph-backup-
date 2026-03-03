import { useQuery } from "@tanstack/react-query";
import {
  getRiskManagementRecords,
  RiskManagementData,
} from "@/lib/api/risk-management-service";

interface TransformedRiskData {
  totalRisksIdentified: number;
  criticalRisksCount: number;
  riskMitigationCoverage: number;
  overallRiskScore: number;
  riskRegister: string[];
  riskAssessments: string[];
  mitigationStrategies: string[];
  contingencyPlans: string[];
  businessContinuityPlans: string[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdated: Date;
}

/**
 * Transform Xano API response to component-ready data structures
 */
function transformRiskManagementData(
  data: RiskManagementData[]
): TransformedRiskData {
  if (!data || data.length === 0) {
    return {
      totalRisksIdentified: 0,
      criticalRisksCount: 0,
      riskMitigationCoverage: 0,
      overallRiskScore: 0,
      riskRegister: [],
      riskAssessments: [],
      mitigationStrategies: [],
      contingencyPlans: [],
      businessContinuityPlans: [],
      isLoading: false,
      error: null,
      isConnected: true,
      lastUpdated: new Date(),
    };
  }

  const record = data[0];

  return {
    totalRisksIdentified: record.total_risks_identified,
    criticalRisksCount: record.critical_risks_count,
    riskMitigationCoverage: record.risk_mitigation_coverage,
    overallRiskScore: record.overall_risk_score,
    riskRegister: record.risk_register || [],
    riskAssessments: record.risk_assessments || [],
    mitigationStrategies: record.mitigation_strategies || [],
    contingencyPlans: record.contingency_plans || [],
    businessContinuityPlans: record.business_continuity_plans || [],
    isLoading: false,
    error: null,
    isConnected: true,
    lastUpdated: new Date(),
  };
}

/**
 * Hook to fetch and transform risk management data
 */
export function useRiskManagementAPI() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["risk-management"],
    queryFn: () => getRiskManagementRecords(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  const transformed = transformRiskManagementData(data || []);

  return {
    ...transformed,
    isLoading,
    error: error ? (error as Error).message : null,
    refreshData: () => refetch(),
    reconnect: () => refetch(),
  };
}
