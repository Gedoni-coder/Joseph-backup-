import { useQuery } from "@tanstack/react-query";
import {
  getFinancialAdvisory,
  FinancialAdvisoryData,
} from "@/lib/api/financial-advisory-service";
import {
  mockBudgetForecasts,
  mockCashFlowProjections,
  mockScenarioTests,
  mockRiskAssessments,
  mockPerformanceDrivers,
  mockAdvisoryInsights,
  mockBudgetAssumptions,
  mockLiquidityMetrics,
  mockCurrentCashFlows,
  type BudgetForecast,
  type CashFlowProjection,
  type ScenarioTest,
  type RiskAssessment,
  type PerformanceDriver,
  type AdvisoryInsight,
  type BudgetAssumption,
  type LiquidityMetric,
} from "@/lib/financial-advisory-data";

export interface UseFinancialAdvisoryReturn {
  budgetForecasts: BudgetForecast[];
  cashFlowProjections: CashFlowProjection[];
  currentCashFlows: CashFlowProjection[];
  scenarioTests: ScenarioTest[];
  riskAssessments: RiskAssessment[];
  performanceDrivers: PerformanceDriver[];
  advisoryInsights: AdvisoryInsight[];
  budgetAssumptions: BudgetAssumption[];
  liquidityMetrics: LiquidityMetric[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
  createBudgetForecast: (forecast: BudgetForecast) => void;
  updateBudgetAssumption: (id: string, data: Partial<BudgetAssumption>) => void;
  runScenarioTest: (test: ScenarioTest) => void;
  updateRiskStatus: (id: string, status: string) => void;
  updateInsightStatus: (id: string, status: string) => void;
  addCashFlowProjection: (projection: CashFlowProjection) => void;
  addRisk: (risk: RiskAssessment) => void;
  addPerformanceDriver: (driver: PerformanceDriver) => void;
}

/**
 * Hook to fetch and transform financial advisory data
 */
export function useFinancialAdvisoryAPI(): UseFinancialAdvisoryReturn {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["financial-advisory"],
    queryFn: () => getFinancialAdvisory(1),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  // Use API data if available, fall back to mock
  const budgetForecasts: BudgetForecast[] = data
    ? [
        {
          id: "1",
          period: "Q1 2025",
          type: "quarterly" as const,
          revenue: data.total_financial_health_score
            ? data.total_financial_health_score * 100000
            : 500000,
          expenses: data.total_financial_health_score
            ? data.total_financial_health_score * 100000 * 0.6
            : 300000,
          netIncome: data.total_financial_health_score
            ? data.total_financial_health_score * 100000 * 0.4
            : 200000,
          confidence: 85,
          assumptions: ["Conservative growth", "Current market conditions"],
          lastUpdated: new Date().toISOString(),
          variance: 5,
        },
      ]
    : mockBudgetForecasts;

  const cashFlowProjections: CashFlowProjection[] = mockCashFlowProjections;
  const currentCashFlows: CashFlowProjection[] = mockCurrentCashFlows;
  const scenarioTests: ScenarioTest[] = mockScenarioTests;
  const riskAssessments: RiskAssessment[] = mockRiskAssessments;
  const performanceDrivers: PerformanceDriver[] = mockPerformanceDrivers;
  const advisoryInsights: AdvisoryInsight[] = mockAdvisoryInsights;
  const budgetAssumptions: BudgetAssumption[] = mockBudgetAssumptions;
  const liquidityMetrics: LiquidityMetric[] = mockLiquidityMetrics;

  return {
    budgetForecasts,
    cashFlowProjections,
    currentCashFlows,
    scenarioTests,
    riskAssessments,
    performanceDrivers,
    advisoryInsights,
    budgetAssumptions,
    liquidityMetrics,
    isLoading,
    isConnected: !error,
    lastUpdated: new Date(),
    error: error ? (error as Error).message : null,
    refreshData: () => refetch(),
    createBudgetForecast: (forecast: BudgetForecast) => {
      console.log("Create budget forecast:", forecast);
    },
    updateBudgetAssumption: (id: string, data: Partial<BudgetAssumption>) => {
      console.log("Update budget assumption:", id, data);
    },
    runScenarioTest: (test: ScenarioTest) => {
      console.log("Run scenario test:", test);
    },
    updateRiskStatus: (id: string, status: string) => {
      console.log("Update risk status:", id, status);
    },
    updateInsightStatus: (id: string, status: string) => {
      console.log("Update insight status:", id, status);
    },
    addCashFlowProjection: (projection: CashFlowProjection) => {
      console.log("Add cash flow projection:", projection);
    },
    addRisk: (risk: RiskAssessment) => {
      console.log("Add risk:", risk);
    },
    addPerformanceDriver: (driver: PerformanceDriver) => {
      console.log("Add performance driver:", driver);
    },
  };
}
