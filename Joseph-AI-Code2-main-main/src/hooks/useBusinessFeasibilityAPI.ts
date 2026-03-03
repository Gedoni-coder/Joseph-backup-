import { useQuery } from "@tanstack/react-query";
import { getBusinessFeasibility, BusinessFeasibilityData } from "@/lib/api/business-feasibility-service";
import {
  businessFeasibilities as mockFeasibilities,
  type BusinessFeasibility,
} from "@/lib/business-feasibility-data";

export interface UseBusinessFeasibilityReturn {
  feasibilities: BusinessFeasibility[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
}

/**
 * Hook to fetch and transform business feasibility data
 */
export function useBusinessFeasibilityAPI(): UseBusinessFeasibilityReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["business-feasibility"],
    queryFn: () => getBusinessFeasibility(1),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  // Transform API data to component structure
  const feasibilities: BusinessFeasibility[] =
    data
      ? [
          {
            id: String(data.id),
            businessIdeaName: data.business_idea_name,
            feasibilityScore: data.feasibility_score,
            marketFeasibility: data.market_feasibility,
            technicalFeasibility: data.technical_feasibility,
            financialFeasibility: data.financial_feasibility,
            operationalFeasibility: data.operational_feasibility,
            feasibilityStatus: data.feasibility_status,
            executiveSummary: data.executive_summary,
            marketAnalysis: data.market_analysis,
            competitiveAnalysis: data.competitive_analysis,
            technicalRequirements: data.technical_requirements || [],
            financialRequirements: data.financial_requirements || [],
            operationalRequirements: data.operational_requirements || [],
            riskAssessment: data.risk_assessment,
            recommendations: data.recommendations || [],
            nextSteps: data.next_steps || [],
            supportingDocuments: data.supporting_documents || [],
            createdAt: new Date(),
            lastUpdated: new Date(),
          },
        ]
      : mockFeasibilities;

  return {
    feasibilities,
    isLoading,
    isConnected: !error,
    lastUpdated: new Date(),
    error: error ? (error as Error).message : null,
    refreshData: () => refetch(),
  };
}

// Support for fetching all feasibilities
export function useAllBusinessFeasibilitiesAPI(): UseBusinessFeasibilityReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["business-feasibilities"],
    queryFn: async () => {
      // In a real scenario, this would fetch multiple records
      // For now, return the first feasibility
      const result = await getBusinessFeasibility(1);
      return result;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const feasibilities: BusinessFeasibility[] =
    data
      ? [
          {
            id: String(data.id),
            businessIdeaName: data.business_idea_name,
            feasibilityScore: data.feasibility_score,
            marketFeasibility: data.market_feasibility,
            technicalFeasibility: data.technical_feasibility,
            financialFeasibility: data.financial_feasibility,
            operationalFeasibility: data.operational_feasibility,
            feasibilityStatus: data.feasibility_status,
            executiveSummary: data.executive_summary,
            marketAnalysis: data.market_analysis,
            competitiveAnalysis: data.competitive_analysis,
            technicalRequirements: data.technical_requirements || [],
            financialRequirements: data.financial_requirements || [],
            operationalRequirements: data.operational_requirements || [],
            riskAssessment: data.risk_assessment,
            recommendations: data.recommendations || [],
            nextSteps: data.next_steps || [],
            supportingDocuments: data.supporting_documents || [],
            createdAt: new Date(),
            lastUpdated: new Date(),
          },
        ]
      : mockFeasibilities;

  return {
    feasibilities,
    isLoading,
    isConnected: !error,
    lastUpdated: new Date(),
    error: error ? (error as Error).message : null,
    refreshData: () => refetch(),
  };
}
