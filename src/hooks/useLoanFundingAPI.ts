import { useQuery } from "@tanstack/react-query";
import { getLoanFunding, LoanFundingData } from "@/lib/api/loan-funding-service";
import {
  loanEligibility as mockEligibility,
  fundingOptions as mockOptions,
  loanComparisons as mockComparisons,
  applicationDocuments as mockDocuments,
  type LoanEligibility,
  type FundingOption,
  type LoanComparison,
  type ApplicationDocument,
} from "@/lib/loan-data";

export interface UseLoanFundingReturn {
  eligibility: LoanEligibility[];
  options: FundingOption[];
  comparisons: LoanComparison[];
  documents: ApplicationDocument[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
}

/**
 * Hook to fetch and transform loan and funding data
 */
export function useLoanFundingAPI(): UseLoanFundingReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["loan-funding"],
    queryFn: () => getLoanFunding(1),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  // Use API data if available, fall back to mock
  const eligibility: LoanEligibility[] =
    data
      ? [
          {
            id: "1",
            businessName: "Your Business",
            businessStage: "growth" as const,
            creditScore: data.approval_probability ? Math.round(600 + (data.approval_probability * 150) / 100) : 750,
            monthlyRevenue: data.funding_required ? data.funding_required / 24 : 50000,
            yearlyRevenue: data.funding_required ? data.funding_required / 2 : 600000,
            collateralValue: data.funding_required ? data.funding_required * 1.5 : 300000,
            industry: "Technology",
            timeInBusiness: 24,
            eligibilityScore: data.approval_probability ? Math.round(data.approval_probability) : 85,
            qualifiedPrograms: data.funding_sources || [],
            recommendations: ["Apply for SBA loans", "Consider venture capital"],
          },
        ]
      : mockEligibility;

  const options: FundingOption[] =
    data && data.funding_sources && data.funding_sources.length > 0
      ? data.funding_sources.map((source: string, idx: number) => ({
          id: String(idx + 1),
          name: source,
          type: ["bank-loan", "government-grant", "microfinance", "angel-capital", "venture-capital"][idx % 5] as any,
          provider: `${source} Provider`,
          minAmount: 10000,
          maxAmount: data.funding_required ? data.funding_required : 500000,
          interestRate: 5 + idx * 0.5,
          termMonths: 60,
          eligibilityCriteria: ["Revenue requirement", "Credit score requirement"],
          processingTime: 30 + idx * 5,
          collateralRequired: idx % 2 === 0,
          personalGuarantee: idx % 3 === 0,
          description: `Funding option: ${source}`,
          website: `${source.toLowerCase()}.com`,
          tags: ["Startup", "Growth"],
        }))
      : mockOptions;

  const comparisons: LoanComparison[] = mockComparisons;
  const documents: ApplicationDocument[] = mockDocuments;

  return {
    eligibility,
    options,
    comparisons,
    documents,
    isLoading,
    isConnected: !error,
    lastUpdated: new Date(),
    error: error ? (error as Error).message : null,
    refreshData: () => refetch(),
  };
}
