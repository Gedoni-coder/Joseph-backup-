import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBudgetAlignmentMetrics,
  createBudgetForecastRecord,
  createCashFlowProjectionRecord,
  createKpiRecord,
  createRiskAssessmentRecord,
  createScenarioTestRecord,
  getAdvisoryInsights,
  getBudgetValidationSummaries,
  getBudgetForecasts,
  getCashFlowProjections,
  getFinancialLineItems,
  getForecastImprovementAreas,
  getForecastValidationRecords,
  getKpis,
  getLiquidityMetrics,
  getRecommendedStressTests,
  getRiskAssessments,
  getScenarioResilienceMetrics,
  getScenarioTests,
  type AdvisoryInsightRecord,
  type BudgetAlignmentMetricRecord,
  type BudgetValidationSummaryRecord,
  type BudgetForecastRecord,
  type CashFlowProjectionRecord,
  type FinancialLineItemRecord,
  type ForecastImprovementAreaRecord,
  type ForecastValidationRecordRecord,
  type KPIRecord,
  type LiquidityMetricRecord,
  type RecommendedStressTestRecord,
  type RiskAssessmentRecord,
  type ScenarioResilienceMetricRecord,
  type ScenarioTestRecord,
  updateAdvisoryInsightRecord,
  updateFinancialLineItemRecord,
  updateRiskAssessmentRecord,
} from "@/lib/api/financial-advisory-service";
import {
  type AdvisoryInsight,
  type BudgetAlignmentItem,
  type BudgetValidationSummary,
  type BudgetAssumption,
  type BudgetForecast,
  type CashFlowProjection,
  type ForecastImprovementArea,
  type ForecastValidationRecord,
  type LiquidityMetric,
  type PerformanceDriver,
  type RecommendedStressTest,
  type RiskAssessment,
  type ScenarioResilienceMetric,
  type ScenarioSummaryCard,
  type RiskSummaryCard,
  type RiskCategoryDistribution,
  type RiskMitigationStrategy,
  type ScenarioTest,
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
  budgetValidationSummary: BudgetValidationSummary | null;
  forecastValidationRecords: ForecastValidationRecord[];
  budgetAlignmentMetrics: BudgetAlignmentItem[];
  forecastImprovementAreas: ForecastImprovementArea[];
  scenarioResilienceMetrics: ScenarioResilienceMetric[];
  recommendedStressTests: RecommendedStressTest[];
  scenarioSummaryCards: ScenarioSummaryCard[];
  riskSummaryCards: RiskSummaryCard[];
  riskCategoryDistributions: RiskCategoryDistribution[];
  riskMitigationStrategies: RiskMitigationStrategy[];
  isLoading: boolean;
  isConnected: boolean;
  lastUpdated: Date;
  error: string | null;
  refreshData: () => void;
  createBudgetForecast: (
    forecast: Omit<BudgetForecast, "id" | "lastUpdated">,
  ) => void;
  updateBudgetAssumption: (id: string, data: Partial<BudgetAssumption>) => void;
  runScenarioTest: (test: Omit<ScenarioTest, "id" | "createdAt">) => void;
  updateRiskStatus: (id: string, status: RiskAssessment["status"]) => void;
  updateInsightStatus: (id: string, status: AdvisoryInsight["status"]) => void;
  addCashFlowProjection: (projection: Record<string, unknown>) => void;
  addRisk: (risk: Omit<RiskAssessment, "id" | "lastReviewed">) => void;
  addPerformanceDriver: (
    driver: Omit<PerformanceDriver, "id" | "createdAt" | "lastUpdated" | "kpiHistory">,
  ) => void;
}

const QUERY_KEY = ["financial-advisory", "datasets"];

const parseAmountFromText = (text: string): number => {
  const matches = text.match(/[\$]?([0-9]+(?:\.[0-9]+)?)([kKmM]?)/g);
  if (!matches || matches.length === 0) return 0;
  const raw = matches[0].replace("$", "");
  const suffix = raw.slice(-1).toLowerCase();
  const amount = parseFloat(raw);
  if (Number.isNaN(amount)) return 0;
  if (suffix === "m") return amount * 1_000_000;
  if (suffix === "k") return amount * 1_000;
  return amount;
};

const mapPriority = (
  priority: AdvisoryInsightRecord["priority"],
): AdvisoryInsight["priority"] => {
  if (priority === "critical") return "high";
  return priority;
};

const mapScenarioType = (
  source: ScenarioTestRecord["type"],
): ScenarioTest["type"] => {
  if (source === "what_if") return "monte_carlo";
  return source;
};

const mapRiskCategory = (category: string): RiskAssessment["category"] => {
  const normalized = category.toLowerCase();
  if (normalized.includes("liquid")) return "liquidity";
  if (normalized.includes("credit")) return "credit";
  if (normalized.includes("market")) return "market";
  if (normalized.includes("reg")) return "regulatory";
  return "operational";
};

const mapRiskProbability = (level: RiskAssessmentRecord["level"]): number => {
  if (level === "high") return 80;
  if (level === "medium") return 55;
  return 25;
};

const mapRiskImpact = (impact: RiskAssessmentRecord["impact"]): number => {
  if (impact === "high") return 85;
  if (impact === "medium") return 55;
  return 25;
};

const toIso = (value?: string): string => {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

const mapBudgetType = (period: string): BudgetForecast["type"] => {
  const normalized = period.toLowerCase();
  if (normalized.includes("q") || normalized.includes("quarter")) return "quarterly";
  if (normalized.includes("w") || normalized.includes("week")) return "weekly";
  return "monthly";
};

const buildBudgetForecasts = (rows: BudgetForecastRecord[]): BudgetForecast[] => {
  const grouped = new Map<
    string,
    {
      ids: number[];
      revenue: number;
      expenses: number;
      actualRevenue: number;
      actualExpenses: number;
      hasActual: boolean;
      varianceSum: number;
      varianceCount: number;
      assumptions: string[];
      createdAt: string;
    }
  >();

  rows.forEach((row) => {
    const key = row.period || "unknown";
    const aggregate = grouped.get(key) || {
      ids: [],
      revenue: 0,
      expenses: 0,
      actualRevenue: 0,
      actualExpenses: 0,
      hasActual: false,
      varianceSum: 0,
      varianceCount: 0,
      assumptions: [],
      createdAt: row.created_at,
    };

    const category = row.category.toLowerCase();
    const isExpense = /expense|cost|cogs|opex|overhead|payroll|rent|tax/.test(category);
    const isRevenue = /revenue|sales|income|profit|earning/.test(category);

    if (isExpense) {
      aggregate.expenses += Math.abs(row.amount || 0);
      if (row.actual_amount !== null && row.actual_amount !== undefined) {
        aggregate.actualExpenses += Math.abs(row.actual_amount);
      }
    } else if (isRevenue || row.amount >= 0) {
      aggregate.revenue += Math.abs(row.amount || 0);
      if (row.actual_amount !== null && row.actual_amount !== undefined) {
        aggregate.actualRevenue += Math.abs(row.actual_amount);
      }
    } else {
      aggregate.expenses += Math.abs(row.amount || 0);
      if (row.actual_amount !== null && row.actual_amount !== undefined) {
        aggregate.actualExpenses += Math.abs(row.actual_amount);
      }
    }

    if (row.actual_amount !== null && row.actual_amount !== undefined) {
      aggregate.hasActual = true;
    }

    aggregate.ids.push(row.id);
    aggregate.varianceSum += row.variance || 0;
    aggregate.varianceCount += 1;
    aggregate.assumptions.push(`Based on ${row.category}`);
    aggregate.createdAt = row.created_at;
    grouped.set(key, aggregate);
  });

  return Array.from(grouped.entries())
    .sort((a, b) => new Date(b[1].createdAt).getTime() - new Date(a[1].createdAt).getTime())
    .map(([period, aggregate], index) => {
      const avgVariance =
        aggregate.varianceCount > 0 ? aggregate.varianceSum / aggregate.varianceCount : 0;
      const confidence = Math.max(50, Math.min(95, Math.round(100 - Math.abs(avgVariance) * 3)));
      const netIncome = aggregate.revenue - aggregate.expenses;
      const actualNetIncome = aggregate.actualRevenue - aggregate.actualExpenses;

      return {
        id: String(aggregate.ids[0] ?? index + 1),
        period,
        type: mapBudgetType(period),
        revenue: aggregate.revenue,
        expenses: aggregate.expenses,
        netIncome,
        confidence,
        assumptions: Array.from(new Set(aggregate.assumptions)).slice(0, 4),
        lastUpdated: toIso(aggregate.createdAt),
        variance: avgVariance,
        actualVsForecasted: aggregate.hasActual
          ? {
              actualRevenue: aggregate.actualRevenue,
              actualExpenses: aggregate.actualExpenses,
              actualNetIncome,
            }
          : undefined,
      };
    });
};

const buildScenarioTests = (rows: ScenarioTestRecord[]): ScenarioTest[] => {
  return rows
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((row) => {
      const impact = (row.impact || {}) as Record<string, unknown>;
      const rawParameters = Array.isArray(impact.parameters)
        ? (impact.parameters as Array<Record<string, unknown>>)
        : [];

      const parameters = rawParameters.length
        ? rawParameters.map((parameter) => ({
            variable: String(parameter.variable ?? "Revenue"),
            baseValue: Number(parameter.baseValue ?? 0),
            testValue: Number(parameter.testValue ?? 0),
            changePercent: Number(parameter.changePercent ?? 0),
          }))
        : [
            {
              variable: String(impact.variable ?? "Revenue"),
              baseValue: Number(impact.baseValue ?? 0),
              testValue: Number(impact.testValue ?? 0),
              changePercent: Number(impact.changePercent ?? 0),
            },
          ];

      const revenue = Number(impact.revenue ?? impact.projectedRevenue ?? 0);
      const expenses = Number(impact.expenses ?? impact.projectedExpenses ?? 0);
      const netIncome = Number(impact.netIncome ?? revenue - expenses);
      const cashFlow = Number(impact.cashFlow ?? netIncome * 0.8);
      const severity = String(impact.impactSeverity ?? impact.severity ?? "medium");
      const impactSeverity: ScenarioTest["results"]["impactSeverity"] =
        severity === "low" || severity === "medium" || severity === "high" || severity === "critical"
          ? severity
          : "medium";

      return {
        id: String(row.id),
        name: row.name,
        description: row.description,
        type: mapScenarioType(row.type),
        parameters,
        results: {
          revenue,
          expenses,
          netIncome,
          cashFlow,
          impactSeverity,
        },
        probability: row.probability,
        createdAt: toIso(row.created_at),
      };
    });
};

const buildRiskAssessments = (rows: RiskAssessmentRecord[]): RiskAssessment[] => {
  return rows
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((row) => {
      const probability = mapRiskProbability(row.level);
      const impact = mapRiskImpact(row.impact);
      const currentMitigation = row.mitigation
        ? row.mitigation
            .split(/\n|;/)
            .map((entry) => entry.trim())
            .filter(Boolean)
        : [];

      const status: RiskAssessment["status"] =
        row.level === "high" ? "mitigating" : row.level === "medium" ? "monitoring" : "identified";

      return {
        id: String(row.id),
        category: mapRiskCategory(row.category),
        riskName: `${row.category} Risk`,
        description: row.description,
        probability,
        impact,
        riskScore: Math.round((probability * impact) / 100),
        currentMitigation,
        recommendedActions:
          currentMitigation.length > 0
            ? currentMitigation
            : ["Review mitigation plan", "Define contingency response"],
        status,
        lastReviewed: toIso(row.created_at),
      };
    });
};

const buildAdvisoryInsights = (rows: AdvisoryInsightRecord[]): AdvisoryInsight[] => {
  return rows
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((row) => {
      const type: AdvisoryInsight["type"] =
        row.category === "risk_management"
          ? "risk"
          : row.category === "revenue_growth"
            ? "opportunity"
            : "recommendation";

      const category: AdvisoryInsight["category"] =
        row.category === "risk_management"
          ? "risk_management"
          : row.category === "revenue_growth"
            ? "revenue_growth"
            : row.category === "cost_optimization"
              ? "cost_optimization"
              : row.category === "investment"
                ? "investment"
                : "investment";

      return {
        id: String(row.id),
        type,
        title: row.title,
        description: row.description,
        priority: mapPriority(row.priority),
        category,
        financialImpact: {
          estimated: Number(row.financial_impact || 0),
          timeframe: row.timeframe || "90 days",
          confidence: row.confidence_score || 70,
        },
        actionItems:
          row.recommendations.length > 0
            ? row.recommendations
            : ["Review and prioritize this recommendation"],
        relatedMetrics: [
          category === "risk_management" ? "Risk Score" : "Financial Impact",
          category === "cost_optimization" ? "Operating Expenses" : "Revenue",
        ],
        createdAt: toIso(row.created_at),
        status: row.status || "new",
      };
    });
};

const buildLiquidityMetrics = (rows: LiquidityMetricRecord[]): LiquidityMetric[] => {
  return rows
    .slice()
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((row) => {
      const target = row.benchmark ?? row.value;
      const delta = target === 0 ? 0 : (row.value - target) / target;
      const status: LiquidityMetric["status"] =
        delta >= 0 ? "healthy" : delta >= -0.1 ? "warning" : "critical";
      const trend: LiquidityMetric["trend"] =
        delta > 0.05 ? "improving" : delta < -0.05 ? "declining" : "stable";

      return {
        metric: row.name,
        current: row.value,
        target,
        status,
        trend,
      };
    });
};

const buildCashFlowProjections = (
  rows: CashFlowProjectionRecord[],
  liquidityRows: LiquidityMetricRecord[],
): CashFlowProjection[] => {
  const grouped = new Map<
    string,
    {
      date: string;
      inflow: number;
      outflow: number;
      inflows: {
        operatingCash: number;
        accountsReceivable: number;
        otherIncome: number;
      };
      outflows: {
        operatingExpenses: number;
        accountsPayable: number;
        capitalExpenditure: number;
        debtService: number;
      };
    }
  >();

  const normalizeAmount = (amount: number): number => Math.abs(Number(amount) || 0);

  const mapInflowCategory = (name: string): keyof CashFlowProjection["inflows"] => {
    const normalized = name.toLowerCase();
    if (normalized.includes("receivable") || normalized.includes("a/r")) {
      return "accountsReceivable";
    }
    if (normalized.includes("other")) {
      return "otherIncome";
    }
    return "operatingCash";
  };

  const mapOutflowCategory = (name: string): keyof CashFlowProjection["outflows"] => {
    const normalized = name.toLowerCase();
    if (normalized.includes("payable") || normalized.includes("a/p")) {
      return "accountsPayable";
    }
    if (normalized.includes("capital") || normalized.includes("capex")) {
      return "capitalExpenditure";
    }
    if (normalized.includes("debt") || normalized.includes("interest") || normalized.includes("loan")) {
      return "debtService";
    }
    return "operatingExpenses";
  };

  rows.forEach((row) => {
    const aggregate = grouped.get(row.period) || {
      date: row.created_at,
      inflow: 0,
      outflow: 0,
      inflows: {
        operatingCash: 0,
        accountsReceivable: 0,
        otherIncome: 0,
      },
      outflows: {
        operatingExpenses: 0,
        accountsPayable: 0,
        capitalExpenditure: 0,
        debtService: 0,
      },
    };

    const amount = normalizeAmount(row.amount);

    if (row.type === "inflow") {
      aggregate.inflow += amount;
      const bucket = mapInflowCategory(row.name);
      aggregate.inflows[bucket] += amount;
    } else {
      aggregate.outflow += amount;
      const bucket = mapOutflowCategory(row.name);
      aggregate.outflows[bucket] += amount;
    }
    aggregate.date = row.created_at;
    grouped.set(row.period, aggregate);
  });

  let runningBalance = 0;
  return Array.from(grouped.entries())
    .sort((a, b) => new Date(a[1].date).getTime() - new Date(b[1].date).getTime())
    .map(([period, aggregate], index) => {
      const openingBalance = runningBalance;
      const netCashFlow = aggregate.inflow - aggregate.outflow;
      const closingBalance = openingBalance + netCashFlow;
      runningBalance = closingBalance;

      const matchingLiquidity = liquidityRows.find((metric) => metric.period === period);
      const liquidityRatio = matchingLiquidity?.value ??
        (aggregate.outflow > 0 ? aggregate.inflow / aggregate.outflow : 2);
      const daysOfCash =
        aggregate.outflow > 0 ? Math.max(1, Math.round((Math.max(closingBalance, 0) / aggregate.outflow) * 30)) : 90;

      return {
        id: `cf-${period}-${index + 1}`,
        date: toIso(aggregate.date),
        openingBalance,
        inflows: aggregate.inflows,
        outflows: aggregate.outflows,
        netCashFlow,
        closingBalance,
        liquidityRatio,
        daysOfCash,
      };
    });
};

const buildPerformanceDrivers = (rows: KPIRecord[]): PerformanceDriver[] => {
  return rows
    .slice()
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .map((row) => ({
      id: String(row.id),
      name: row.name,
      description: row.description || undefined,
      category: row.category,
      currentValue: row.current_value,
      targetValue: row.target_value,
      unit: row.unit,
      trend: row.trend,
      impact: row.impact,
      linkedBudgetItems: Array.isArray(row.linked_budget_items) ? row.linked_budget_items : [],
      kpiHistory:
        Array.isArray(row.kpi_history) && row.kpi_history.length > 0
          ? row.kpi_history
          : [
              {
                date: row.created_at,
                value: row.current_value,
              },
            ],
      driverType: row.driver_type,
      unitOfMeasure: row.unit_of_measure,
      warningThreshold: row.warning_threshold,
      criticalThreshold: row.critical_threshold,
      dataSource: row.data_source,
      status: row.status === "off_track" ? "critical" : row.status,
      driverLink: Array.isArray(row.driver_link) ? row.driver_link : [],
      createdAt: toIso(row.created_at),
      lastUpdated: toIso(row.updated_at),
    }));
};

const buildBudgetAssumptions = (rows: FinancialLineItemRecord[]): BudgetAssumption[] => {
  return rows
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => {
      const currentAmount = row.current_amount || 0;
      const value =
        currentAmount === 0
          ? 0
          : ((row.budget_amount - currentAmount) / Math.abs(currentAmount)) * 100;

      return {
        id: String(row.id),
        category: row.category,
        assumption: row.item,
        value: Number(value.toFixed(1)),
        unit: "%",
        confidence: Math.max(50, Math.min(95, 90 - Math.round(Math.abs(value)))),
        source: "Financial line item baseline",
        impact: Math.abs(value) > 12 ? "high" : Math.abs(value) > 5 ? "medium" : "low",
        lastValidated: toIso(row.updated_at),
      };
    });
};

const buildBudgetValidationSummary = (
  rows: BudgetValidationSummaryRecord[],
): BudgetValidationSummary | null => {
  if (!rows.length) return null;
  const latest = rows
    .slice()
    .sort((a, b) => new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime())[0];

  return {
    accuracyScore: latest.accuracy_score,
    avgVariance: latest.avg_variance,
    validatedForecasts: latest.validated_forecasts,
    budgetAlignment: latest.budget_alignment,
  };
};

const buildForecastValidationRecords = (
  rows: ForecastValidationRecordRecord[],
): ForecastValidationRecord[] => {
  return rows
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => ({
      id: String(row.id),
      period: row.period,
      validationStatus: row.validation_status,
      forecastedRevenue: row.forecasted_revenue,
      actualRevenue: row.actual_revenue ?? undefined,
      revenueVariance: row.revenue_variance,
      forecastedNetIncome: row.forecasted_net_income,
      actualNetIncome: row.actual_net_income ?? undefined,
      accuracyScore: row.accuracy_score,
    }));
};

const buildBudgetAlignmentMetrics = (
  rows: BudgetAlignmentMetricRecord[],
): BudgetAlignmentItem[] => {
  return rows
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => ({
      id: String(row.id),
      name: row.name,
      score: row.score,
    }));
};

const buildForecastImprovementAreas = (
  rows: ForecastImprovementAreaRecord[],
): ForecastImprovementArea[] => {
  return rows
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => ({
      id: String(row.id),
      title: row.title,
      summary: row.summary,
      icon: row.icon,
      theme: row.theme,
      sections: Array.isArray(row.sections) ? row.sections : [],
      recommendedAction: row.recommended_action,
    }));
};

const buildScenarioResilienceMetrics = (
  rows: ScenarioResilienceMetricRecord[],
): ScenarioResilienceMetric[] => {
  return rows
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => ({
      id: String(row.id),
      name: row.name,
      value: row.value,
      valueTone: row.value_tone,
      description: row.description,
    }));
};

const buildRecommendedStressTests = (
  rows: RecommendedStressTestRecord[],
): RecommendedStressTest[] => {
  return rows
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => ({
      id: String(row.id),
      title: row.title,
      description: row.description,
      icon: row.icon,
      scenarioTemplate: {
        testVariable: row.scenario_template?.testVariable,
        changePercent: row.scenario_template?.changePercent,
        testType:
          row.scenario_template?.testType === "what_if"
            ? "monte_carlo"
            : row.scenario_template?.testType,
      },
    }));
};

const buildScenarioSummaryCards = (scenarios: ScenarioTest[]): ScenarioSummaryCard[] => {
  const total = scenarios.length;
  const critical = scenarios.filter((scenario) => scenario.results.impactSeverity === "critical").length;
  const averageProbability =
    total > 0
      ? Math.round(scenarios.reduce((sum, scenario) => sum + scenario.probability, 0) / total)
      : 0;

  // Resilience score is derived from scenario severity mix and average probability.
  const severityPenalty = total > 0 ? (critical / total) * 40 : 0;
  const probabilityPenalty = (averageProbability / 100) * 30;
  const resilienceScore = Math.max(0, Math.min(100, Math.round(100 - severityPenalty - probabilityPenalty)));

  return [
    {
      id: "scenario-summary-total",
      key: "total_scenarios",
      label: "Total Scenarios",
      value: String(total),
    },
    {
      id: "scenario-summary-critical",
      key: "critical_scenarios",
      label: "Critical Scenarios",
      value: String(critical),
    },
    {
      id: "scenario-summary-average-probability",
      key: "average_probability",
      label: "Avg Probability",
      value: `${averageProbability}%`,
    },
    {
      id: "scenario-summary-resilience",
      key: "resilience_score",
      label: "Resilience Score",
      value: String(resilienceScore),
    },
  ];
};

const buildRiskSummaryCards = (risks: RiskAssessment[]): RiskSummaryCard[] => {
  const totalRisks = risks.length;
  const highRiskItems = risks.filter((risk) => risk.riskScore >= 70).length;
  const averageRiskScore =
    totalRisks > 0
      ? Math.round(risks.reduce((sum, risk) => sum + risk.riskScore, 0) / totalRisks)
      : 0;
  const resolvedRisks = risks.filter((risk) => risk.status === "resolved").length;

  return [
    {
      id: "risk-summary-total",
      key: "total_risks",
      label: "Total Risks",
      value: String(totalRisks),
    },
    {
      id: "risk-summary-high",
      key: "high_risk_items",
      label: "High Risk Items",
      value: String(highRiskItems),
    },
    {
      id: "risk-summary-average",
      key: "average_risk_score",
      label: "Avg Risk Score",
      value: String(averageRiskScore),
    },
    {
      id: "risk-summary-resolved",
      key: "resolved_risks",
      label: "Resolved Risks",
      value: String(resolvedRisks),
    },
  ];
};

const buildRiskCategoryDistributions = (risks: RiskAssessment[]): RiskCategoryDistribution[] => {
  const categories: Array<RiskCategoryDistribution["category"]> = [
    "operational",
    "credit",
    "market",
    "liquidity",
    "regulatory",
  ];

  return categories
    .map((category) => ({
      id: `risk-distribution-${category}`,
      category,
      count: risks.filter((risk) => risk.category === category).length,
    }))
    .filter((row) => row.count > 0);
};

const buildRiskMitigationStrategies = (risks: RiskAssessment[]): RiskMitigationStrategy[] => {
  return risks
    .slice()
    .filter((risk) => risk.riskScore >= 40)
    .sort((a, b) => b.riskScore - a.riskScore)
    .slice(0, 4)
    .map((risk) => ({
      id: risk.id,
      riskName: risk.riskName,
      riskScore: risk.riskScore,
      recommendedActions: risk.recommendedActions,
      lastReviewed: risk.lastReviewed,
    }));
};

/** Hook to fetch and transform financial advisory data from API records only. */
export function useFinancialAdvisoryAPI(): UseFinancialAdvisoryReturn {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const [
        budgetForecastRows,
        cashFlowRows,
        scenarioRows,
        riskRows,
        kpiRows,
        advisoryRows,
        liquidityRows,
        lineItemRows,
        validationSummaryRows,
        validationRecordRows,
        alignmentMetricRows,
        improvementAreaRows,
        resilienceMetricRows,
        recommendedStressTestRows,
      ] = await Promise.all([
        getBudgetForecasts(),
        getCashFlowProjections(),
        getScenarioTests(),
        getRiskAssessments(),
        getKpis(),
        getAdvisoryInsights(),
        getLiquidityMetrics(),
        getFinancialLineItems(),
        getBudgetValidationSummaries(),
        getForecastValidationRecords(),
        getBudgetAlignmentMetrics(),
        getForecastImprovementAreas(),
        getScenarioResilienceMetrics(),
        getRecommendedStressTests(),
      ]);

      return {
        budgetForecastRows,
        cashFlowRows,
        scenarioRows,
        riskRows,
        kpiRows,
        advisoryRows,
        liquidityRows,
        lineItemRows,
        validationSummaryRows,
        validationRecordRows,
        alignmentMetricRows,
        improvementAreaRows,
        resilienceMetricRows,
        recommendedStressTestRows,
      };
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const budgetForecastRows = data?.budgetForecastRows ?? [];
  const cashFlowRows = data?.cashFlowRows ?? [];
  const scenarioRows = data?.scenarioRows ?? [];
  const riskRows = data?.riskRows ?? [];
  const kpiRows = data?.kpiRows ?? [];
  const advisoryRows = data?.advisoryRows ?? [];
  const liquidityRows = data?.liquidityRows ?? [];
  const lineItemRows = data?.lineItemRows ?? [];
  const validationSummaryRows = data?.validationSummaryRows ?? [];
  const validationRecordRows = data?.validationRecordRows ?? [];
  const alignmentMetricRows = data?.alignmentMetricRows ?? [];
  const improvementAreaRows = data?.improvementAreaRows ?? [];
  const resilienceMetricRows = data?.resilienceMetricRows ?? [];
  const recommendedStressTestRows = data?.recommendedStressTestRows ?? [];

  const budgetForecasts = buildBudgetForecasts(budgetForecastRows);
  const cashFlowProjections = buildCashFlowProjections(cashFlowRows, liquidityRows);
  const currentCashFlows = [...cashFlowProjections]
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);
  const scenarioTests = buildScenarioTests(scenarioRows);
  const riskAssessments = buildRiskAssessments(riskRows);
  const performanceDrivers = buildPerformanceDrivers(kpiRows);
  const advisoryInsights = buildAdvisoryInsights(advisoryRows);
  const budgetAssumptions = buildBudgetAssumptions(lineItemRows);
  const liquidityMetrics = buildLiquidityMetrics(liquidityRows);
  const budgetValidationSummary = buildBudgetValidationSummary(validationSummaryRows);
  const forecastValidationRecords = buildForecastValidationRecords(validationRecordRows);
  const budgetAlignmentMetrics = buildBudgetAlignmentMetrics(alignmentMetricRows);
  const forecastImprovementAreas = buildForecastImprovementAreas(improvementAreaRows);
  const scenarioResilienceMetrics = buildScenarioResilienceMetrics(resilienceMetricRows);
  const recommendedStressTests = buildRecommendedStressTests(recommendedStressTestRows);
  const scenarioSummaryCards = buildScenarioSummaryCards(scenarioTests);
  const riskSummaryCards = buildRiskSummaryCards(riskAssessments);
  const riskCategoryDistributions = buildRiskCategoryDistributions(riskAssessments);
  const riskMitigationStrategies = buildRiskMitigationStrategies(riskAssessments);

  const refresh = () => {
    void refetch();
  };

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  };

  const createBudgetForecastMutation = useMutation({
    mutationFn: (forecast: Omit<BudgetForecast, "id" | "lastUpdated">) =>
      createBudgetForecastRecord({
        category: "Revenue Forecast",
        amount: forecast.revenue,
        actual_amount: null,
        variance: forecast.variance,
        period: forecast.period,
      }),
    onSuccess: invalidate,
  });

  const updateBudgetAssumptionMutation = useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: Partial<BudgetAssumption> }) => {
      const source = lineItemRows.find((item) => String(item.id) === id);
      if (!source) {
        throw new Error(`Unable to locate financial line item ${id}`);
      }

      const newBudgetAmount =
        typeof changes.value === "number"
          ? source.current_amount * (1 + changes.value / 100)
          : source.budget_amount;

      return updateFinancialLineItemRecord(source.id, {
        budget_amount: newBudgetAmount,
      });
    },
    onSuccess: invalidate,
  });

  const runScenarioMutation = useMutation({
    mutationFn: (scenario: Omit<ScenarioTest, "id" | "createdAt">) =>
      createScenarioTestRecord({
        name: scenario.name,
        description: scenario.description,
        type: scenario.type === "monte_carlo" ? "what_if" : scenario.type,
        impact: {
          parameters: scenario.parameters,
          revenue: scenario.results.revenue,
          expenses: scenario.results.expenses,
          netIncome: scenario.results.netIncome,
          cashFlow: scenario.results.cashFlow,
          impactSeverity: scenario.results.impactSeverity,
        },
        probability: scenario.probability,
      }),
    onSuccess: invalidate,
  });

  const updateRiskStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RiskAssessment["status"] }) => {
      const source = riskRows.find((risk) => String(risk.id) === id);
      if (!source) {
        throw new Error(`Unable to locate risk ${id}`);
      }

      const level: RiskAssessmentRecord["level"] =
        status === "mitigating" || status === "resolved"
          ? "high"
          : status === "monitoring"
            ? "medium"
            : "low";

      return updateRiskAssessmentRecord(source.id, { level });
    },
    onSuccess: invalidate,
  });

  const updateInsightStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdvisoryInsight["status"] }) => {
      const source = advisoryRows.find((insight) => String(insight.id) === id);
      if (!source) {
        throw new Error(`Unable to locate advisory insight ${id}`);
      }

      return updateAdvisoryInsightRecord(source.id, {
        status,
      });
    },
    onSuccess: invalidate,
  });

  const addCashFlowProjectionMutation = useMutation({
    mutationFn: (projection: Record<string, unknown>) => {
      const inflows = (projection.inflows || {}) as Record<string, number>;
      const outflows = (projection.outflows || {}) as Record<string, number>;
      const period = String(projection.period || "custom");

      const records: Array<ReturnType<typeof createCashFlowProjectionRecord>> = [];

      const inflowEntries: Array<[string, number]> = [
        ["Operating Cash", Number(inflows.operatingCash || 0)],
        ["Accounts Receivable", Number(inflows.accountsReceivable || 0)],
        ["Other Income", Number(inflows.otherIncome || 0)],
      ];

      const outflowEntries: Array<[string, number]> = [
        ["Operating Expenses", Number(outflows.operatingExpenses || 0)],
        ["Accounts Payable", Number(outflows.accountsPayable || 0)],
        ["Capital Expenditure", Number(outflows.capitalExpenditure || 0)],
        ["Debt Service", Number(outflows.debtService || 0)],
      ];

      inflowEntries.forEach(([name, amount]) => {
        if (Math.abs(amount) > 0) {
          records.push(
            createCashFlowProjectionRecord({
              name,
              type: "inflow",
              amount: Math.abs(amount),
              period,
              description: "Created from Cash Flow Planning dialog",
            }),
          );
        }
      });

      outflowEntries.forEach(([name, amount]) => {
        if (Math.abs(amount) > 0) {
          records.push(
            createCashFlowProjectionRecord({
              name,
              type: "outflow",
              amount: Math.abs(amount),
              period,
              description: "Created from Cash Flow Planning dialog",
            }),
          );
        }
      });

      return Promise.all(records);
    },
    onSuccess: invalidate,
  });

  const addRiskMutation = useMutation({
    mutationFn: (risk: Omit<RiskAssessment, "id" | "lastReviewed">) => {
      const level: RiskAssessmentRecord["level"] =
        risk.probability >= 70 ? "high" : risk.probability >= 40 ? "medium" : "low";
      const impact: RiskAssessmentRecord["impact"] =
        risk.impact >= 70 ? "high" : risk.impact >= 40 ? "medium" : "low";

      return createRiskAssessmentRecord({
        category: risk.category,
        description: risk.description,
        level,
        impact,
        mitigation:
          risk.currentMitigation.length > 0
            ? risk.currentMitigation.join("\n")
            : risk.recommendedActions.join("\n"),
      });
    },
    onSuccess: invalidate,
  });

  const addPerformanceDriverMutation = useMutation({
    mutationFn: (driver: Omit<PerformanceDriver, "id" | "createdAt" | "lastUpdated" | "kpiHistory">) =>
      createKpiRecord({
        name: driver.name,
        category: driver.category,
        impact: driver.impact,
        current_value: driver.currentValue,
        target_value: driver.targetValue,
        unit: driver.unit,
        trend: driver.trend,
        status: driver.status,
        driver_type: driver.driverType,
        unit_of_measure: driver.unitOfMeasure,
        warning_threshold: driver.warningThreshold,
        critical_threshold: driver.criticalThreshold,
        data_source: driver.dataSource,
        linked_budget_items: driver.linkedBudgetItems,
        driver_link: driver.driverLink,
        kpi_history: [
          {
            date: new Date().toISOString(),
            value: driver.currentValue,
          },
        ],
        description: driver.description || "",
      }),
    onSuccess: invalidate,
  });

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
    budgetValidationSummary,
    forecastValidationRecords,
    budgetAlignmentMetrics,
    forecastImprovementAreas,
    scenarioResilienceMetrics,
    recommendedStressTests,
    scenarioSummaryCards,
    riskSummaryCards,
    riskCategoryDistributions,
    riskMitigationStrategies,
    isLoading,
    isConnected: !error,
    lastUpdated: dataUpdatedAt ? new Date(dataUpdatedAt) : new Date(),
    error: error ? (error as Error).message : null,
    refreshData: refresh,
    createBudgetForecast: (forecast) => {
      void createBudgetForecastMutation.mutateAsync(forecast).catch(console.error);
    },
    updateBudgetAssumption: (id, assumptionData) => {
      void updateBudgetAssumptionMutation
        .mutateAsync({ id, changes: assumptionData })
        .catch(console.error);
    },
    runScenarioTest: (test) => {
      void runScenarioMutation.mutateAsync(test).catch(console.error);
    },
    updateRiskStatus: (id, status) => {
      void updateRiskStatusMutation.mutateAsync({ id, status }).catch(console.error);
    },
    updateInsightStatus: (id, status) => {
      void updateInsightStatusMutation
        .mutateAsync({ id, status })
        .catch(console.error);
    },
    addCashFlowProjection: (projection) => {
      void addCashFlowProjectionMutation.mutateAsync(projection).catch(console.error);
    },
    addRisk: (risk) => {
      void addRiskMutation.mutateAsync(risk).catch(console.error);
    },
    addPerformanceDriver: (driver) => {
      void addPerformanceDriverMutation.mutateAsync(driver).catch(console.error);
    },
  };
}
