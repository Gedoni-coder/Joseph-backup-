import { useState, useEffect, useCallback } from "react";
import {
  loanEligibility,
  fundingOptions,
  loanComparisons,
  applicationDocuments,
  businessPlan,
  fundingStrategy,
  investorMatches,
  loanUpdates,
  type LoanEligibility,
  type FundingOption,
  type LoanComparison,
  type ApplicationDocument,
  type BusinessPlan,
  type FundingStrategy,
  type InvestorMatch,
  type LoanUpdate,
} from "@/lib/loan-data";
import { type AlertPreferences } from "@/components/loan/manage-alerts-modal";

export interface UseLoanDataReturn {
  eligibility: LoanEligibility;
  fundingOptions: FundingOption[];
  loanComparisons: LoanComparison[];
  applicationDocuments: ApplicationDocument[];
  businessPlan: BusinessPlan;
  fundingStrategy: FundingStrategy;
  investorMatches: InvestorMatch[];
  loanUpdates: LoanUpdate[];
  watchlistPrograms: string[];
  alertPreferences: AlertPreferences;
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
  updateEligibility: (updates: Partial<LoanEligibility>) => void;
  updateDocumentStatus: (
    docId: string,
    status: ApplicationDocument["status"],
  ) => void;
  addToWatchlist: (programs: string[]) => void;
  removeFromWatchlist: (program: string) => void;
  updateAlertPreferences: (preferences: AlertPreferences) => void;
}

export function useLoanData(): UseLoanDataReturn {
  const [data, setData] = useState({
    eligibility: loanEligibility,
    fundingOptions,
    loanComparisons,
    applicationDocuments,
    businessPlan,
    fundingStrategy,
    investorMatches,
    loanUpdates,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    setIsLoading(true);
    setError(null);

    // Simulate API call with realistic delay
    setTimeout(
      () => {
        try {
          // Simulate funding options updates (interest rates, availability)
          const updatedFundingOptions = data.fundingOptions.map((option) => ({
            ...option,
            interestRate: Math.max(
              3.0,
              option.interestRate + (Math.random() - 0.5) * 0.5,
            ),
            maxAmount: option.maxAmount * (1 + (Math.random() - 0.5) * 0.1),
            processingTime: Math.max(
              7,
              option.processingTime + Math.floor((Math.random() - 0.5) * 10),
            ),
          }));

          // Simulate loan comparison updates
          const updatedLoanComparisons = data.loanComparisons.map((loan) => {
            const newRate = Math.max(
              4.0,
              loan.interestRate + (Math.random() - 0.5) * 0.3,
            );
            const newMonthlyPayment =
              (loan.amount *
                (newRate / 100 / 12) *
                Math.pow(1 + newRate / 100 / 12, loan.termMonths)) /
              (Math.pow(1 + newRate / 100 / 12, loan.termMonths) - 1);
            const newTotalInterest =
              newMonthlyPayment * loan.termMonths - loan.amount;

            return {
              ...loan,
              interestRate: newRate,
              monthlyPayment: Math.round(newMonthlyPayment),
              totalInterest: Math.round(newTotalInterest),
              approvalOdds: Math.max(
                40,
                Math.min(95, loan.approvalOdds + (Math.random() - 0.5) * 5),
              ),
            };
          });

          // Simulate eligibility score updates
          const updatedEligibility = {
            ...data.eligibility,
            eligibilityScore: Math.max(
              50,
              Math.min(
                100,
                data.eligibility.eligibilityScore + (Math.random() - 0.5) * 3,
              ),
            ),
            creditScore: Math.max(
              600,
              Math.min(
                850,
                data.eligibility.creditScore +
                  Math.floor((Math.random() - 0.5) * 10),
              ),
            ),
            monthlyRevenue:
              data.eligibility.monthlyRevenue *
              (1 + (Math.random() - 0.5) * 0.05),
          };

          // Simulate investor match score updates
          const updatedInvestorMatches = data.investorMatches.map((match) => ({
            ...match,
            matchScore: Math.max(
              60,
              Math.min(100, match.matchScore + (Math.random() - 0.5) * 2),
            ),
            trustScore: Math.max(
              70,
              Math.min(100, match.trustScore + (Math.random() - 0.5) * 2),
            ),
          }));

          // Simulate business plan completion
          const updatedBusinessPlan = {
            ...data.businessPlan,
            completionPercentage: Math.min(
              100,
              data.businessPlan.completionPercentage +
                Math.floor(Math.random() * 5),
            ),
            lastUpdated: new Date(),
          };

          setData({
            eligibility: updatedEligibility,
            fundingOptions: updatedFundingOptions,
            loanComparisons: updatedLoanComparisons,
            applicationDocuments: data.applicationDocuments,
            businessPlan: updatedBusinessPlan,
            fundingStrategy: data.fundingStrategy,
            investorMatches: updatedInvestorMatches,
            loanUpdates: data.loanUpdates,
          });

          setLastUpdated(new Date());
          setIsConnected(true);
          setIsLoading(false);
        } catch (err) {
          setError("Failed to update loan data");
          setIsLoading(false);
        }
      },
      1000 + Math.random() * 2000,
    );
  }, [data]);

  const updateEligibility = useCallback((updates: Partial<LoanEligibility>) => {
    setData((prev) => ({
      ...prev,
      eligibility: { ...prev.eligibility, ...updates },
    }));
  }, []);

  const updateDocumentStatus = useCallback(
    (docId: string, status: ApplicationDocument["status"]) => {
      setData((prev) => ({
        ...prev,
        applicationDocuments: prev.applicationDocuments.map((doc) =>
          doc.id === docId ? { ...doc, status, lastUpdated: new Date() } : doc,
        ),
      }));
    },
    [],
  );

  useEffect(() => {
    // Initial load
    refreshData();

    // Set up auto-refresh interval
    const interval = setInterval(refreshData, 40000); // Refresh every 40 seconds

    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setIsConnected(true);
      // Simulate occasional disconnections
      const disconnectTimeout = setTimeout(
        () => {
          setIsConnected(false);
          setTimeout(connectWebSocket, 4000);
        },
        80000 + Math.random() * 120000,
      );

      return () => clearTimeout(disconnectTimeout);
    };

    const cleanup = connectWebSocket();

    return () => {
      clearInterval(interval);
      cleanup();
    };
  }, [refreshData]);

  return {
    eligibility: data.eligibility,
    fundingOptions: data.fundingOptions,
    loanComparisons: data.loanComparisons,
    applicationDocuments: data.applicationDocuments,
    businessPlan: data.businessPlan,
    fundingStrategy: data.fundingStrategy,
    investorMatches: data.investorMatches,
    loanUpdates: data.loanUpdates,
    isLoading,
    isConnected,
    lastUpdated,
    error,
    refreshData,
    updateEligibility,
    updateDocumentStatus,
  };
}
