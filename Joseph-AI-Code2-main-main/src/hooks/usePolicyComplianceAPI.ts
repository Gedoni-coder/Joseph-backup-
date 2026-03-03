import { useQuery } from "@tanstack/react-query";
import {
  getPolicyComplianceRecords,
  PolicyComplianceData,
} from "@/lib/api/policy-compliance-service";

interface TransformedPolicyData {
  externalPoliciesCount: number;
  internalPoliciesCount: number;
  complianceScore: number;
  gapAnalysisScore: number;
  impactAssessmentScore: number;
  externalPolicies: string[];
  internalPolicies: string[];
  complianceReports: string[];
  gapAnalyses: string[];
  impactAssessments: string[];
  recommendations: string[];
  actionItems: string[];
  nextSteps: string[];
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
  lastUpdated: Date;
}

/**
 * Transform Xano API response to component-ready data structures
 */
function transformPolicyComplianceData(
  data: PolicyComplianceData[]
): TransformedPolicyData {
  if (!data || data.length === 0) {
    return {
      externalPoliciesCount: 0,
      internalPoliciesCount: 0,
      complianceScore: 0,
      gapAnalysisScore: 0,
      impactAssessmentScore: 0,
      externalPolicies: [],
      internalPolicies: [],
      complianceReports: [],
      gapAnalyses: [],
      impactAssessments: [],
      recommendations: [],
      actionItems: [],
      nextSteps: [],
      isLoading: false,
      error: null,
      isConnected: true,
      lastUpdated: new Date(),
    };
  }

  const record = data[0];

  return {
    externalPoliciesCount: record.external_policies_count,
    internalPoliciesCount: record.internal_policies_count,
    complianceScore: record.compliance_score,
    gapAnalysisScore: record.gap_analysis_score,
    impactAssessmentScore: record.impact_assessment_score,
    externalPolicies: record.external_policies || [],
    internalPolicies: record.internal_policies || [],
    complianceReports: record.compliance_reports || [],
    gapAnalyses: record.gap_analyses || [],
    impactAssessments: record.impact_assessments || [],
    recommendations: record.recommendations || [],
    actionItems: record.action_items || [],
    nextSteps: record.next_steps || [],
    isLoading: false,
    error: null,
    isConnected: true,
    lastUpdated: new Date(),
  };
}

/**
 * Hook to fetch and transform policy compliance data
 */
export function usePolicyComplianceAPI() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["policy-compliance"],
    queryFn: () => getPolicyComplianceRecords(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  const transformed = transformPolicyComplianceData(data || []);

  return {
    ...transformed,
    isLoading,
    error: error ? (error as Error).message : null,
    refreshData: () => refetch(),
    reconnect: () => refetch(),
  };
}
