import { useState, useEffect } from "react";
import {
  BudgetForecast,
  CashFlowProjection,
  ScenarioTest,
  RiskAssessment,
  PerformanceDriver,
  AdvisoryInsight,
  BudgetAssumption,
  LiquidityMetric,
  mockBudgetForecasts,
  mockCashFlowProjections,
  mockCurrentCashFlows,
  mockScenarioTests,
  mockRiskAssessments,
  mockPerformanceDrivers,
  mockAdvisoryInsights,
  mockBudgetAssumptions,
  mockLiquidityMetrics,
} from "../lib/financial-advisory-data";

export function useFinancialAdvisoryData() {
  const [budgetForecasts, setBudgetForecasts] =
    useState<BudgetForecast[]>(mockBudgetForecasts);
  const [cashFlowProjections, setCashFlowProjections] = useState<
    CashFlowProjection[]
  >(mockCashFlowProjections);
  const [currentCashFlows, setCurrentCashFlows] =
    useState<CashFlowProjection[]>(mockCurrentCashFlows);
  const [scenarioTests, setScenarioTests] =
    useState<ScenarioTest[]>(mockScenarioTests);
  const [riskAssessments, setRiskAssessments] =
    useState<RiskAssessment[]>(mockRiskAssessments);
  const [performanceDrivers, setPerformanceDrivers] = useState<
    PerformanceDriver[]
  >(mockPerformanceDrivers);
  const [advisoryInsights, setAdvisoryInsights] =
    useState<AdvisoryInsight[]>(mockAdvisoryInsights);
  const [budgetAssumptions, setBudgetAssumptions] = useState<
    BudgetAssumption[]
  >(mockBudgetAssumptions);
  const [liquidityMetrics, setLiquidityMetrics] =
    useState<LiquidityMetric[]>(mockLiquidityMetrics);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setLastUpdated(now);

      // Update budget forecasts with new variance data
      setBudgetForecasts((prev) =>
        prev.map((forecast) => ({
          ...forecast,
          variance: forecast.variance + (Math.random() - 0.5) * 0.5,
          confidence: Math.max(
            60,
            Math.min(95, forecast.confidence + (Math.random() - 0.5) * 2),
          ),
          lastUpdated: now.toISOString(),
        })),
      );

      // Update cash flow projections
      setCashFlowProjections((prev) =>
        prev.map((projection) => ({
          ...projection,
          liquidityRatio: Math.max(
            1.5,
            projection.liquidityRatio + (Math.random() - 0.5) * 0.1,
          ),
          daysOfCash: Math.max(
            30,
            projection.daysOfCash + Math.floor((Math.random() - 0.5) * 3),
          ),
        })),
      );

      // Update performance drivers
      setPerformanceDrivers((prev) =>
        prev.map((driver) => ({
          ...driver,
          currentValue: Math.max(
            0,
            driver.currentValue + (Math.random() - 0.5) * 0.5,
          ),
          kpiHistory: [
            ...driver.kpiHistory.slice(-6),
            {
              date: new Date().toISOString().split("T")[0],
              value: Math.max(
                0,
                driver.currentValue + (Math.random() - 0.5) * 1,
              ),
            },
          ],
        })),
      );

      // Update liquidity metrics
      setLiquidityMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          current: Math.max(0, metric.current + (Math.random() - 0.5) * 0.05),
        })),
      );
    }, 5000);

    // Initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const createBudgetForecast = (
    forecast: Omit<BudgetForecast, "id" | "lastUpdated">,
  ) => {
    const newForecast: BudgetForecast = {
      ...forecast,
      id: `forecast-${Date.now()}`,
      lastUpdated: new Date().toISOString(),
    };
    setBudgetForecasts((prev) => [newForecast, ...prev]);
    return newForecast;
  };

  const updateBudgetAssumption = (
    id: string,
    updates: Partial<BudgetAssumption>,
  ) => {
    setBudgetAssumptions((prev) =>
      prev.map((assumption) =>
        assumption.id === id
          ? {
              ...assumption,
              ...updates,
              lastValidated: new Date().toISOString(),
            }
          : assumption,
      ),
    );
  };

  const runScenarioTest = (
    scenario: Omit<ScenarioTest, "id" | "createdAt">,
  ) => {
    const newScenario: ScenarioTest = {
      ...scenario,
      id: `scenario-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setScenarioTests((prev) => [newScenario, ...prev]);
    return newScenario;
  };

  const updateRiskStatus = (id: string, status: RiskAssessment["status"]) => {
    setRiskAssessments((prev) =>
      prev.map((risk) =>
        risk.id === id
          ? { ...risk, status, lastReviewed: new Date().toISOString() }
          : risk,
      ),
    );
  };

  const updateInsightStatus = (
    id: string,
    status: AdvisoryInsight["status"],
  ) => {
    setAdvisoryInsights((prev) =>
      prev.map((insight) =>
        insight.id === id ? { ...insight, status } : insight,
      ),
    );
  };

  const addCashFlowProjection = (
    projection: Omit<CashFlowProjection, "id">,
  ) => {
    const newProjection: CashFlowProjection = {
      ...projection,
      id: `cf-${Date.now()}`,
    };
    setCashFlowProjections((prev) => [newProjection, ...prev]);
    return newProjection;
  };

  const addRisk = (risk: Omit<RiskAssessment, "id" | "lastReviewed">) => {
    const newRisk: RiskAssessment = {
      ...risk,
      id: `risk-${Date.now()}`,
      lastReviewed: new Date().toISOString(),
    };
    setRiskAssessments((prev) => [newRisk, ...prev]);
    return newRisk;
  };

  const addPerformanceDriver = (
    driver: Omit<
      PerformanceDriver,
      "id" | "createdAt" | "lastUpdated" | "kpiHistory"
    >,
  ) => {
    const newDriver: PerformanceDriver = {
      ...driver,
      id: `driver-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      kpiHistory: [
        {
          date: new Date().toISOString().split("T")[0],
          value: driver.currentValue,
        },
      ],
    };
    setPerformanceDrivers((prev) => [newDriver, ...prev]);
    return newDriver;
  };

  const generateInsights = () => {
    // Generate insights based on current data
    const insights: AdvisoryInsight[] = [
      {
        id: `insight-${Date.now()}-1`,
        type: "recommendation",
        title: "KPI Performance Analysis",
        description:
          "Analysis of current KPI performance against targets and thresholds",
        priority: "high",
        category: "cost_optimization",
        financialImpact: {
          estimated: 250000,
          timeframe: "90 days",
          confidence: 82,
        },
        actionItems: [
          "Review underperforming KPIs in detail",
          "Adjust resource allocation to support at-risk metrics",
          "Implement daily monitoring for critical thresholds",
        ],
        relatedMetrics: performanceDrivers.map((d) => d.name),
        createdAt: new Date().toISOString(),
        status: "new",
      },
      {
        id: `insight-${Date.now()}-2`,
        type: "opportunity",
        title: "Budget-KPI Alignment Improvement",
        description:
          "Opportunities to strengthen alignment between budgets and performance drivers",
        priority: "medium",
        category: "investment",
        financialImpact: {
          estimated: 180000,
          timeframe: "60 days",
          confidence: 75,
        },
        actionItems: [
          "Link additional budget categories to key performance drivers",
          "Establish automated variance reporting between budgets and KPIs",
          "Create feedback loops for budget reforecasting based on KPI changes",
        ],
        relatedMetrics: [
          "Budget Variance",
          "KPI Variance",
          "Forecast Accuracy",
        ],
        createdAt: new Date().toISOString(),
        status: "new",
      },
      {
        id: `insight-${Date.now()}-3`,
        type: "alert",
        title: "Risk Threshold Exposure",
        description:
          "Several KPIs approaching critical thresholds requiring immediate attention",
        priority: "high",
        category: "risk_management",
        financialImpact: {
          estimated: -150000,
          timeframe: "30 days",
          confidence: 88,
        },
        actionItems: [
          "Increase monitoring frequency for at-risk KPIs",
          "Prepare contingency budget adjustments",
          "Communicate risks to leadership immediately",
        ],
        relatedMetrics: performanceDrivers
          .filter((d) => d.status === "at_risk" || d.status === "critical")
          .map((d) => d.name),
        createdAt: new Date().toISOString(),
        status: "new",
      },
    ];
    return insights;
  };

  return {
    // Data
    budgetForecasts,
    cashFlowProjections,
    currentCashFlows,
    scenarioTests,
    riskAssessments,
    performanceDrivers,
    advisoryInsights,
    budgetAssumptions,
    liquidityMetrics,

    // State
    isLoading,
    error,
    lastUpdated,

    // Actions
    createBudgetForecast,
    updateBudgetAssumption,
    runScenarioTest,
    updateRiskStatus,
    updateInsightStatus,
    addCashFlowProjection,
    addRisk,
    addPerformanceDriver,
    generateInsights,
  };
}
