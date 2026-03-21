import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomerProfiles,
  getRevenueProjections,
  getCostStructures,
  getCashFlowForecasts,
  getKPIs,
  getScenarioPlannings,
  getKeyAssumptions,
  getKeyRisks,
  getCompetitiveMetrics,
  getForecastActionItems,
  getForecastNextSteps,
  getGrowthTrajectory,
  getRevenueTargets,
  getBusinessMetrics,
  getRevenueProductServiceForecasts,
  getRevenueRegionalForecasts,
  getRevenueHistoricalComparisons,
  getRevenueForecastMethods,
  getRevenueScenarioSnapshots,
  getRevenueSegmentBreakdowns,
  getCostOverviewMetrics,
  getCostBudgetScenarios,
  getCostMonthlyComparisons,
  getOperationalExpenseCategories,
  getOperationalExpenseItems,
  getCostTrendAnalyses,
  getOverviewProfitLossSnapshots,
  getOverviewKpiSummaries,
  getOverviewAlerts,
  createCustomerProfile,
  updateCustomerProfile,
  deleteCustomerProfile,
  createRevenueProjection,
  updateRevenueProjection,
  deleteRevenueProjection,
  createCostStructure,
  updateCostStructure,
  deleteCostStructure,
  createCashFlowForecast,
  updateCashFlowForecast,
  deleteCashFlowForecast,
  createKPI,
  updateKPI,
  deleteKPI,
  createScenarioPlanning,
  updateScenarioPlanning,
  deleteScenarioPlanning,
  createRevenueTarget,
  updateRevenueTarget,
  type CustomerProfile as ApiCustomerProfile,
  type RevenueProjection as ApiRevenueProjection,
  type CostStructure as ApiCostStructure,
  type CashFlowForecast as ApiCashFlowForecast,
  type KPI as ApiKPI,
  type ScenarioPlanning as ApiScenarioPlanning,
  type KeyAssumption as ApiKeyAssumption,
  type KeyRisk as ApiKeyRisk,
  type CompetitiveMetricApi,
  type ForecastActionItemApi,
  type ForecastNextStepApi,
  type GrowthTrajectoryApi,
  type RevenueTargetApi,
  type RevenueProductServiceForecastApi,
  type RevenueRegionalForecastApi,
  type RevenueHistoricalComparisonApi,
  type RevenueForecastMethodApi,
  type RevenueScenarioSnapshotApi,
  type RevenueSegmentBreakdownApi,
  type CostOverviewMetricApi,
  type CostBudgetScenarioApi,
  type CostMonthlyComparisonApi,
  type OperationalExpenseCategoryApi,
  type OperationalExpenseItemApi,
  type CostTrendAnalysisApi,
  type OverviewProfitLossSnapshotApi,
  type OverviewKpiSummaryApi,
  type OverviewAlertApi,
} from "@/lib/api/business-forecasting-service";
import {
  CustomerProfile,
  RevenueProjection,
  KPI,
  ScenarioPlanning,
  CostStructure,
  CashFlowForecast,
} from "@/lib/business-forecast-data";

// Import calculation functions
import {
  // Revenue calculations
  calculateProgress,
  calculateVariance,
  calculateTotalProjectedRevenue,
  calculateTotalActualToDate,
  calculateAverageConfidence,
  calculatePotentialUpside,
  calculateAchievement,
  getConfidenceLevel,
  getConfidenceColor,
  // KPI calculations
  calculateKPIProgress,
  determineKPIStatus,
  determineSimpleStatus,
  calculateKPISummary,
  groupKPIsByCategory,
  // Customer calculations
  calculateTotalMarketOpportunity,
  calculateWeightedAvgGrowth,
  calculateOverallRetention,
  calculateRevenuePotential,
  // Alert generation
  generateAllAlerts,
  generateRevenueAlerts,
  generateCashFlowAlerts,
  generateKPIAlerts,
  type Alert,
  // Summary generation
  generateBusinessSummary,
  generateRecommendations,
  generateSummaryMetrics,
  generateActionItems,
  generateNextSteps,
  generateDemandSummary,
  type SummaryMetrics,
  type ActionItem,
  type NextStep,
} from "@/lib/calculations";

// Import profit/loss calculations
import {
  calculateProfitProjection,
  calculateGrossProfit,
  calculateNetProfit,
  calculateGrossMargin,
  calculateNetMargin,
  calculateTotalCOGS,
  calculateTotalOperatingExpenses,
} from "@/lib/calculations/profitloss-calculation";

// Transform API CustomerProfile to UI format
function transformCustomerProfile(apiProfile: ApiCustomerProfile): CustomerProfile {
  return {
    id: String(apiProfile.id),
    segment: apiProfile.segment.charAt(0).toUpperCase() + apiProfile.segment.slice(1),
    demandAssumption: apiProfile.demand_assumption || apiProfile.lifetime_value / 10000,
    growthRate: apiProfile.growth_rate || apiProfile.order_frequency * 5,
    retention: apiProfile.retention || (85 - (apiProfile.risk_score === 'high' ? 20 : apiProfile.risk_score === 'medium' ? 10 : 0)),
    avgOrderValue: apiProfile.average_order_value,
    seasonality: apiProfile.seasonality || 10,
  };
}

// Transform API RevenueProjection to UI format
function transformRevenueProjection(apiProjection: ApiRevenueProjection): RevenueProjection {
  const periodMap: Record<string, string> = {
    '1m': 'Month 1',
    '3m': 'Q1 2025',
    '6m': 'H1 2025',
    '1y': '2025',
  };
  return {
    id: String(apiProjection.id),
    period: periodMap[apiProjection.period] || apiProjection.period,
    projected: apiProjection.projected_revenue,
    conservative: apiProjection.conservative || apiProjection.projected_revenue * 0.8,
    optimistic: apiProjection.optimistic || apiProjection.projected_revenue * 1.2,
    actualToDate: apiProjection.actual_to_date,
    confidence: apiProjection.confidence,
  };
}

// Transform API KPI to UI format
function transformKPI(apiKPI: ApiKPI): KPI {
  const trend = apiKPI.current_value > apiKPI.target_value * 0.9 ? 'up' : 
                apiKPI.current_value < apiKPI.target_value * 0.7 ? 'down' : 'stable';
  const categoryMap: Record<string, string> = {
    'on_track': 'Financial',
    'at_risk': 'Customer',
    'off_track': 'Operational',
  };
  return {
    id: String(apiKPI.id),
    name: apiKPI.name,
    current: apiKPI.current_value,
    target: apiKPI.target_value,
    unit: apiKPI.unit,
    trend: trend as 'up' | 'down' | 'stable',
    category: categoryMap[apiKPI.status] || 'Financial',
    frequency: 'Monthly',
  };
}

// Transform API ScenarioPlanning to UI format
function transformScenarioPlanning(apiScenario: ApiScenarioPlanning): ScenarioPlanning {
  const scenarioMap: Record<string, 'Best Case' | 'Base Case' | 'Worst Case'> = {
    'optimistic': 'Best Case',
    'base': 'Base Case',
    'pessimistic': 'Worst Case',
  };
  return {
    id: String(apiScenario.id),
    scenario: scenarioMap[apiScenario.type] || 'Base Case',
    revenue: apiScenario.probability * 100000, // Approximate
    costs: apiScenario.probability * 70000, // Approximate
    profit: apiScenario.probability * 30000, // Approximate
    probability: apiScenario.probability,
    keyAssumptions: [apiScenario.description],
  };
}

// Transform API CostStructure to UI format
function transformCostStructure(apiCost: ApiCostStructure): CostStructure {
  return {
    id: String(apiCost.id),
    category: apiCost.name,
    type: apiCost.category === 'fixed' ? 'COGS' : 'Operating',
    amount: apiCost.amount,
    percentage: 0, // Calculate if needed
    variability: apiCost.category === 'fixed' ? 'Fixed' : 
                  apiCost.category === 'variable' ? 'Variable' : 'Semi-Variable',
    trend: 'stable' as const,
  };
}

// Transform API CashFlowForecast to UI format
function transformCashFlowForecast(apiCashFlow: ApiCashFlowForecast): CashFlowForecast {
  return {
    id: String(apiCashFlow.id),
    month: apiCashFlow.name || apiCashFlow.period,
    cashInflow: apiCashFlow.cash_inflow,
    cashOutflow: apiCashFlow.cash_outflow,
    netCashFlow: apiCashFlow.net_position,
    cumulativeCash: apiCashFlow.cash_inflow - apiCashFlow.cash_outflow,
    workingCapital: apiCashFlow.cash_inflow * 0.2,
  };
}

function transformCostOverviewMetric(metric: CostOverviewMetricApi) {
  return {
    id: String(metric.id),
    costType: metric.cost_type,
    description: metric.description,
    annualTotal: metric.annual_total,
    monthlyAverage: metric.monthly_average,
    percentOfRevenue: metric.percent_of_revenue,
    insight: metric.insight,
  };
}

function transformCostBudgetScenario(scenario: CostBudgetScenarioApi) {
  return {
    id: String(scenario.id),
    label: scenario.label,
    amount: scenario.amount,
    subtitle: scenario.subtitle,
    note: scenario.note,
  };
}

function transformCostMonthlyComparison(comparison: CostMonthlyComparisonApi) {
  return {
    id: String(comparison.id),
    month: comparison.month,
    budgetAmount: comparison.budget_amount,
    forecastAmount: comparison.forecast_amount,
    actualAmount: comparison.actual_amount,
  };
}

function transformOperationalExpenseCategory(category: OperationalExpenseCategoryApi) {
  return {
    id: String(category.id),
    name: category.name,
    totalAmount: category.total_amount,
  };
}

function transformOperationalExpenseItem(item: OperationalExpenseItemApi) {
  return {
    id: String(item.id),
    categoryId: String(item.category),
    name: item.name,
    amount: item.amount,
  };
}

function transformCostTrendAnalysis(trend: CostTrendAnalysisApi) {
  return {
    id: String(trend.id),
    title: trend.title,
    value: trend.value,
    description: trend.description,
    benchmark: trend.benchmark,
    bulletPoints: Array.isArray(trend.bullet_points) ? trend.bullet_points : [],
  };
}

function transformOverviewProfitLossSnapshot(snapshot: OverviewProfitLossSnapshotApi) {
  return {
    id: String(snapshot.id),
    grossProfit: snapshot.gross_profit,
    grossMargin: snapshot.gross_margin,
    operatingExpense: snapshot.operating_expense,
    netProfit: snapshot.net_profit,
    netMargin: snapshot.net_margin,
    periodLabel: snapshot.period_label,
  };
}

function transformOverviewKpiSummary(summary: OverviewKpiSummaryApi) {
  return {
    id: String(summary.id),
    metricsTracked: summary.metrics_tracked,
    excellentCount: summary.excellent_count,
    goodCount: summary.good_count,
    fairCount: summary.fair_count,
    needsAttentionCount: summary.needs_attention_count,
  };
}

function transformOverviewAlert(alert: OverviewAlertApi) {
  return {
    id: String(alert.id),
    type: alert.alert_type,
    title: alert.title,
    description: alert.description,
  };
}

interface BusinessForecastingData {
  customerProfiles: CustomerProfile[];
  revenueProjections: RevenueProjection[];
  kpis: KPI[];
  scenarios: ScenarioPlanning[];
  costStructure: CostStructure[];
  cashFlowForecast: CashFlowForecast[];
  lastUpdated: Date;
  isLoading: boolean;
  error: string | null;
  isConnected: boolean;
}

/**
 * Hook to fetch and transform business forecasting data from Django API
 */
export function useBusinessForecastingData() {
  const queryClient = useQueryClient();

  // Fetch all data in parallel
  const customerProfilesQuery = useQuery({
    queryKey: ['business', 'customer-profiles'],
    queryFn: getCustomerProfiles,
    staleTime: 5 * 60 * 1000,
  });

  const revenueProjectionsQuery = useQuery({
    queryKey: ['business', 'revenue-projections'],
    queryFn: getRevenueProjections,
    staleTime: 5 * 60 * 1000,
  });

  const costStructuresQuery = useQuery({
    queryKey: ['business', 'cost-structures'],
    queryFn: getCostStructures,
    staleTime: 5 * 60 * 1000,
  });

  const cashFlowForecastsQuery = useQuery({
    queryKey: ['business', 'cash-flow-forecasts'],
    queryFn: getCashFlowForecasts,
    staleTime: 5 * 60 * 1000,
  });

  const kpisQuery = useQuery({
    queryKey: ['business', 'kpis'],
    queryFn: getKPIs,
    staleTime: 5 * 60 * 1000,
  });

  const scenarioPlanningsQuery = useQuery({
    queryKey: ['business', 'scenario-plannings'],
    queryFn: getScenarioPlannings,
    staleTime: 5 * 60 * 1000,
  });

  const keyAssumptionsQuery = useQuery({
    queryKey: ['business', 'key-assumptions'],
    queryFn: getKeyAssumptions,
    staleTime: 5 * 60 * 1000,
  });

  const keyRisksQuery = useQuery({
    queryKey: ['business', 'key-risks'],
    queryFn: getKeyRisks,
    staleTime: 5 * 60 * 1000,
  });

  const competitiveMetricsQuery = useQuery({
    queryKey: ['business', 'competitive-metrics'],
    queryFn: getCompetitiveMetrics,
    staleTime: 5 * 60 * 1000,
  });

  const actionItemsQuery = useQuery({
    queryKey: ['business', 'action-items'],
    queryFn: getForecastActionItems,
    staleTime: 5 * 60 * 1000,
  });

  const nextStepsQuery = useQuery({
    queryKey: ['business', 'next-steps'],
    queryFn: getForecastNextSteps,
    staleTime: 5 * 60 * 1000,
  });

  const growthTrajectoryQuery = useQuery({
    queryKey: ['business', 'growth-trajectory'],
    queryFn: getGrowthTrajectory,
    staleTime: 5 * 60 * 1000,
  });

  const revenueTargetsQuery = useQuery({
    queryKey: ['business', 'revenue-targets'],
    queryFn: getRevenueTargets,
    staleTime: 5 * 60 * 1000,
  });

  const businessMetricsQuery = useQuery({
    queryKey: ['business', 'business-metrics'],
    queryFn: getBusinessMetrics,
    staleTime: 5 * 60 * 1000,
  });

  const revenueProductServiceForecastsQuery = useQuery({
    queryKey: ['business', 'revenue-product-service-forecasts'],
    queryFn: getRevenueProductServiceForecasts,
    staleTime: 5 * 60 * 1000,
  });

  const revenueRegionalForecastsQuery = useQuery({
    queryKey: ['business', 'revenue-regional-forecasts'],
    queryFn: getRevenueRegionalForecasts,
    staleTime: 5 * 60 * 1000,
  });

  const revenueHistoricalComparisonsQuery = useQuery({
    queryKey: ['business', 'revenue-historical-comparisons'],
    queryFn: getRevenueHistoricalComparisons,
    staleTime: 5 * 60 * 1000,
  });

  const revenueForecastMethodsQuery = useQuery({
    queryKey: ['business', 'revenue-forecast-methods'],
    queryFn: getRevenueForecastMethods,
    staleTime: 5 * 60 * 1000,
  });

  const revenueScenarioSnapshotsQuery = useQuery({
    queryKey: ['business', 'revenue-scenario-snapshots'],
    queryFn: getRevenueScenarioSnapshots,
    staleTime: 5 * 60 * 1000,
  });

  const revenueSegmentBreakdownsQuery = useQuery({
    queryKey: ['business', 'revenue-segment-breakdowns'],
    queryFn: getRevenueSegmentBreakdowns,
    staleTime: 5 * 60 * 1000,
  });

  const costOverviewMetricsQuery = useQuery({
    queryKey: ['business', 'cost-overview-metrics'],
    queryFn: getCostOverviewMetrics,
    staleTime: 5 * 60 * 1000,
  });

  const costBudgetScenariosQuery = useQuery({
    queryKey: ['business', 'cost-budget-scenarios'],
    queryFn: getCostBudgetScenarios,
    staleTime: 5 * 60 * 1000,
  });

  const costMonthlyComparisonsQuery = useQuery({
    queryKey: ['business', 'cost-monthly-comparisons'],
    queryFn: getCostMonthlyComparisons,
    staleTime: 5 * 60 * 1000,
  });

  const operationalExpenseCategoriesQuery = useQuery({
    queryKey: ['business', 'operational-expense-categories'],
    queryFn: getOperationalExpenseCategories,
    staleTime: 5 * 60 * 1000,
  });

  const operationalExpenseItemsQuery = useQuery({
    queryKey: ['business', 'operational-expense-items'],
    queryFn: getOperationalExpenseItems,
    staleTime: 5 * 60 * 1000,
  });

  const costTrendAnalysesQuery = useQuery({
    queryKey: ['business', 'cost-trend-analyses'],
    queryFn: getCostTrendAnalyses,
    staleTime: 5 * 60 * 1000,
  });

  const overviewProfitLossSnapshotsQuery = useQuery({
    queryKey: ['business', 'overview-profit-loss-snapshots'],
    queryFn: getOverviewProfitLossSnapshots,
    staleTime: 5 * 60 * 1000,
  });

  const overviewKpiSummariesQuery = useQuery({
    queryKey: ['business', 'overview-kpi-summaries'],
    queryFn: getOverviewKpiSummaries,
    staleTime: 5 * 60 * 1000,
  });

  const overviewAlertsQuery = useQuery({
    queryKey: ['business', 'overview-alerts'],
    queryFn: getOverviewAlerts,
    staleTime: 5 * 60 * 1000,
  });

  // Check if any query has error
  const hasError = customerProfilesQuery.isError || 
                   revenueProjectionsQuery.isError || 
                   costStructuresQuery.isError ||
                   cashFlowForecastsQuery.isError ||
                   kpisQuery.isError ||
                   scenarioPlanningsQuery.isError;

  const isConnected = !hasError;

  // Transform API data only (no hardcoded fallback)
  const customerProfiles = customerProfilesQuery.data?.length > 0 
    ? customerProfilesQuery.data.map(transformCustomerProfile) 
    : [];

  const revenueProjections = revenueProjectionsQuery.data?.length > 0 
    ? revenueProjectionsQuery.data.map(transformRevenueProjection) 
    : [];

  const costStructure = costStructuresQuery.data?.length > 0 
    ? costStructuresQuery.data.map(transformCostStructure) 
    : [];


  const cashFlowForecast = cashFlowForecastsQuery.data?.length > 0 
    ? cashFlowForecastsQuery.data.map(transformCashFlowForecast) 
    : [];

  const kpis = kpisQuery.data?.length > 0 
    ? kpisQuery.data.map(transformKPI) 
    : [];

  const scenarios = scenarioPlanningsQuery.data?.length > 0 
    ? scenarioPlanningsQuery.data.map(transformScenarioPlanning) 
    : [];

  // New entity data (API-only, no hardcoded fallback)
  const keyAssumptions = keyAssumptionsQuery.data && keyAssumptionsQuery.data.length > 0
    ? keyAssumptionsQuery.data.map(a => ({ label: a.label, value: a.value }))
    : [];

  const keyRisks = keyRisksQuery.data && keyRisksQuery.data.length > 0
    ? keyRisksQuery.data.map(r => ({ label: r.label, level: r.level as 'high' | 'medium' | 'low' }))
    : [];

  const competitiveMetrics = competitiveMetricsQuery.data && competitiveMetricsQuery.data.length > 0
    ? competitiveMetricsQuery.data.map(m => ({
        label: m.label,
        currentValue: isNaN(Number(m.current_value)) ? m.current_value : Number(m.current_value),
        targetValue: m.target_value ? (isNaN(Number(m.target_value)) ? m.target_value : Number(m.target_value)) : undefined,
        unit: m.unit,
      }))
    : [];

  const actionItems = actionItemsQuery.data && actionItemsQuery.data.length > 0
    ? actionItemsQuery.data.map(item => ({
        index: item.index,
        title: item.title,
        description: item.description,
        priority: item.priority as 'high' | 'medium' | 'low',
        timeline: item.timeline,
      }))
    : [];

  const nextSteps = nextStepsQuery.data && nextStepsQuery.data.length > 0
    ? nextStepsQuery.data.map(s => ({
        index: s.index,
        step: s.step,
        owner: s.owner,
        dueDate: s.due_date,
      }))
    : [];

  const growthTrajectory = growthTrajectoryQuery.data && growthTrajectoryQuery.data.length > 0
    ? growthTrajectoryQuery.data.map(g => ({
        quarter: g.quarter,
        description: g.description,
        revenueTarget: g.revenue_target,
      }))
    : [];

  const revenueTargetData = revenueTargetsQuery.data && revenueTargetsQuery.data.length > 0
    ? {
        annualRevenue: revenueTargetsQuery.data[0].annual_revenue,
        quarterlyTarget: revenueTargetsQuery.data[0].quarterly_target,
        monthlyTarget: revenueTargetsQuery.data[0].monthly_target,
        growthRate: revenueTargetsQuery.data[0].growth_rate,
        q1Revenue: revenueTargetsQuery.data[0].q1_revenue,
        q2Revenue: revenueTargetsQuery.data[0].q2_revenue,
        q3Revenue: revenueTargetsQuery.data[0].q3_revenue,
        q4Revenue: revenueTargetsQuery.data[0].q4_revenue,
        id: revenueTargetsQuery.data[0].id,
      }
    : null;

  const parseMetricNumber = (value: string): number => {
    const normalized = value.replace(/,/g, "").trim();
    const matched = normalized.match(/-?\d+(?:\.\d+)?/);
    return matched ? Number(matched[0]) : 0;
  };

  const inferMetricUnit = (value: string): string => {
    const normalized = value.toLowerCase();
    if (normalized.includes("$")) return "USD";
    if (normalized.includes("%")) return "%";
    if (normalized.includes("times")) return "times";
    if (normalized.includes("days")) return "days";
    if (normalized.includes("hours")) return "hours";
    if (normalized.includes("months")) return "months";
    if (normalized.includes("points")) return "points";
    if (normalized.includes("ratio")) return "ratio";
    return "count";
  };

  const businessMetrics = businessMetricsQuery.data?.length > 0
    ? businessMetricsQuery.data.map((metric) => {
        const current = parseMetricNumber(metric.current);
        const target = parseMetricNumber(metric.target);
        const lastMonth = parseMetricNumber(metric.last_month);

        return {
          id: String(metric.id),
          category: metric.category,
          metric: metric.metric,
          current,
          target,
          lastMonth,
          unit: inferMetricUnit(metric.current),
          trend: metric.trend,
          variance: calculateVariance(current, target),
          status: metric.status,
        };
      })
    : [];

  const revenueProductServiceForecasts = revenueProductServiceForecastsQuery.data?.length > 0
    ? revenueProductServiceForecastsQuery.data
    : [];

  const revenueRegionalForecasts = revenueRegionalForecastsQuery.data?.length > 0
    ? revenueRegionalForecastsQuery.data
    : [];

  const revenueHistoricalComparisons = revenueHistoricalComparisonsQuery.data?.length > 0
    ? revenueHistoricalComparisonsQuery.data
    : [];

  const revenueForecastMethods = revenueForecastMethodsQuery.data?.length > 0
    ? revenueForecastMethodsQuery.data
    : [];

  const revenueScenarioSnapshots = revenueScenarioSnapshotsQuery.data?.length > 0
    ? revenueScenarioSnapshotsQuery.data
    : [];

  const revenueSegmentBreakdowns = revenueSegmentBreakdownsQuery.data?.length > 0
    ? revenueSegmentBreakdownsQuery.data
    : [];

  const costOverviewMetrics = costOverviewMetricsQuery.data?.length
    ? costOverviewMetricsQuery.data.map(transformCostOverviewMetric)
    : [];

  const costBudgetScenarios = costBudgetScenariosQuery.data?.length
    ? costBudgetScenariosQuery.data.map(transformCostBudgetScenario)
    : [];

  const costMonthlyComparisons = costMonthlyComparisonsQuery.data?.length
    ? costMonthlyComparisonsQuery.data.map(transformCostMonthlyComparison)
    : [];

  const operationalExpenseCategories = operationalExpenseCategoriesQuery.data?.length
    ? operationalExpenseCategoriesQuery.data.map(transformOperationalExpenseCategory)
    : [];

  const operationalExpenseItems = operationalExpenseItemsQuery.data?.length
    ? operationalExpenseItemsQuery.data.map(transformOperationalExpenseItem)
    : [];

  const costTrendAnalyses = costTrendAnalysesQuery.data?.length
    ? costTrendAnalysesQuery.data.map(transformCostTrendAnalysis)
    : [];

  const overviewProfitLossSnapshots = overviewProfitLossSnapshotsQuery.data?.length
    ? overviewProfitLossSnapshotsQuery.data.map(transformOverviewProfitLossSnapshot)
    : [];

  const overviewKpiSummaries = overviewKpiSummariesQuery.data?.length
    ? overviewKpiSummariesQuery.data.map(transformOverviewKpiSummary)
    : [];

  const overviewAlerts = overviewAlertsQuery.data?.length
    ? overviewAlertsQuery.data.map(transformOverviewAlert)
    : [];

  const isLoading = customerProfilesQuery.isLoading || 
                    revenueProjectionsQuery.isLoading || 
                    costStructuresQuery.isLoading ||
                    cashFlowForecastsQuery.isLoading ||
                    kpisQuery.isLoading ||
                    scenarioPlanningsQuery.isLoading;

  const error = hasError ? 'Failed to fetch some data from API' : null;

  // Refresh all queries
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['business'] });
  };

  // ==================== MUTATIONS ====================

  // Customer Profile mutations
  const createCustomerProfileMutation = useMutation({
    mutationFn: createCustomerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'customer-profiles'] });
    },
  });

  const updateCustomerProfileMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ApiCustomerProfile> }) => 
      updateCustomerProfile(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'customer-profiles'] });
    },
  });

  const deleteCustomerProfileMutation = useMutation({
    mutationFn: deleteCustomerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'customer-profiles'] });
    },
  });

  // Revenue Projection mutations
  const createRevenueProjectionMutation = useMutation({
    mutationFn: createRevenueProjection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'revenue-projections'] });
    },
  });

  const updateRevenueProjectionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ApiRevenueProjection> }) => 
      updateRevenueProjection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'revenue-projections'] });
    },
  });

  const deleteRevenueProjectionMutation = useMutation({
    mutationFn: deleteRevenueProjection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'revenue-projections'] });
    },
  });

  // Cost Structure mutations
  const createCostStructureMutation = useMutation({
    mutationFn: createCostStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'cost-structures'] });
    },
  });

  const updateCostStructureMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ApiCostStructure> }) => 
      updateCostStructure(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'cost-structures'] });
    },
  });

  const deleteCostStructureMutation = useMutation({
    mutationFn: deleteCostStructure,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'cost-structures'] });
    },
  });

  // Cash Flow Forecast mutations
  const createCashFlowForecastMutation = useMutation({
    mutationFn: createCashFlowForecast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'cash-flow-forecasts'] });
    },
  });

  const updateCashFlowForecastMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ApiCashFlowForecast> }) => 
      updateCashFlowForecast(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'cash-flow-forecasts'] });
    },
  });

  const deleteCashFlowForecastMutation = useMutation({
    mutationFn: deleteCashFlowForecast,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'cash-flow-forecasts'] });
    },
  });

  // KPI mutations
  const createKPIMutation = useMutation({
    mutationFn: createKPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'kpis'] });
    },
  });

  const updateKPIMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ApiKPI> }) => 
      updateKPI(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'kpis'] });
    },
  });

  const deleteKPIMutation = useMutation({
    mutationFn: deleteKPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'kpis'] });
    },
  });

  // Scenario Planning mutations
  const createScenarioPlanningMutation = useMutation({
    mutationFn: createScenarioPlanning,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'scenario-plannings'] });
    },
  });

  const updateScenarioPlanningMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ApiScenarioPlanning> }) => 
      updateScenarioPlanning(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'scenario-plannings'] });
    },
  });

  const deleteScenarioPlanningMutation = useMutation({
    mutationFn: deleteScenarioPlanning,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'scenario-plannings'] });
    },
  });

  const saveRevenueTargetMutation = useMutation({
    mutationFn: async (data: {
      id?: number;
      annualRevenue: number;
      monthlyRevenue: number;
      q1Revenue: number;
      q2Revenue: number;
      q3Revenue: number;
      q4Revenue: number;
    }) => {
      const payload = {
        annual_revenue: data.annualRevenue,
        monthly_target: data.monthlyRevenue,
        quarterly_target: (data.q1Revenue + data.q2Revenue + data.q3Revenue + data.q4Revenue) / 4,
        growth_rate: 0,
        q1_revenue: data.q1Revenue,
        q2_revenue: data.q2Revenue,
        q3_revenue: data.q3Revenue,
        q4_revenue: data.q4Revenue,
      };

      if (data.id) {
        return updateRevenueTarget(data.id, payload);
      }
      return createRevenueTarget(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business', 'revenue-targets'] });
    },
  });

  // ==================== COMPUTED CALCULATIONS ====================
  
  // Revenue calculations
  const totalProjectedRevenue = calculateTotalProjectedRevenue(revenueProjections);
  const totalActualToDate = calculateTotalActualToDate(revenueProjections);
  const averageConfidence = calculateAverageConfidence(revenueProjections);
  const potentialUpside = calculatePotentialUpside(revenueProjections);
  
  // KPI calculations
  const kpiSummary = calculateKPISummary(kpis);
  const kpisByCategory = groupKPIsByCategory(kpis);
  
  // Customer calculations
  const totalMarketOpportunity = calculateTotalMarketOpportunity(customerProfiles);
  const weightedAvgGrowth = calculateWeightedAvgGrowth(customerProfiles);
  const overallRetention = calculateOverallRetention(customerProfiles);
  
  // Profit/Loss calculations
  const profitProjection = calculateProfitProjection(revenueProjections, costStructure);
  
  // Generate alerts
  const alerts = generateAllAlerts(
    revenueProjections,
    cashFlowForecast,
    costStructure,
    kpis
  );
  
  // Summary generation (requires annualTarget - will be passed externally)
  const getSummaryMetrics = (annualTarget?: number) => 
    generateSummaryMetrics(revenueProjections, customerProfiles, scenarios, kpis, annualTarget);
  
  const getBusinessSummary = (annualTarget?: number) => 
    generateBusinessSummary(revenueProjections, customerProfiles, scenarios, kpis, annualTarget);
  
  const getRecommendations = () => 
    generateRecommendations(revenueProjections, customerProfiles, kpis, costStructure);
  
  const getActionItems = () => 
    generateActionItems(revenueProjections, kpis, cashFlowForecast);
  
  const getNextSteps = () => 
    generateNextSteps(revenueProjections, kpis);
  
  const getDemandSummary = () => 
    generateDemandSummary(customerProfiles);

  return {
    // Data
    customerProfiles,
    revenueProjections,
    kpis,
    scenarios,
    costStructure,
    cashFlowForecast,
    keyAssumptions,
    keyRisks,
    competitiveMetrics,
    actionItems,
    nextSteps,
    growthTrajectory,
    revenueTargetData,
    businessMetrics,
    revenueProductServiceForecasts,
    revenueRegionalForecasts,
    revenueHistoricalComparisons,
    revenueForecastMethods,
    revenueScenarioSnapshots,
    revenueSegmentBreakdowns,
    costOverviewMetrics,
    costBudgetScenarios,
    costMonthlyComparisons,
    operationalExpenseCategories,
    operationalExpenseItems,
    costTrendAnalyses,
    overviewProfitLossSnapshots,
    overviewKpiSummaries,
    overviewAlerts,
    
    // Status
    lastUpdated: new Date(),
    isLoading,
    error,
    isConnected,
    
    // Computed Revenue Data
    totalProjectedRevenue,
    totalActualToDate,
    averageConfidence,
    potentialUpside,
    
    // Computed KPI Data
    kpiSummary,
    kpisByCategory,
    
    // Computed Customer Data
    totalMarketOpportunity,
    weightedAvgGrowth,
    overallRetention,
    
    // Computed Profit/Loss Data
    profitProjection,
    
    // Generated Alerts
    alerts,
    
    // Summary Generators
    getSummaryMetrics,
    getBusinessSummary,
    getRecommendations,
    getActionItems,
    getNextSteps,
    getDemandSummary,
    
    // Actions
    refreshData,
    reconnect: refreshData,
    
    // Calculation utilities (exposed for use in components)
    calculateProgress,
    calculateVariance,
    calculateKPIProgress,
    determineKPIStatus,
    determineSimpleStatus,
    calculateRevenuePotential,
    getConfidenceLevel,
    getConfidenceColor,
    
    // Update functions (for backward compatibility)
    updateKPI: async (id: string, newValue: number) => {
      // Find the KPI in the current data and update via API
      const kpi = kpis.find(k => k.id === id);
      if (kpi) {
        await updateKPIMutation.mutateAsync({ 
          id: parseInt(id), 
          data: { current_value: newValue } 
        });
      }
    },
    
    updateScenario: async (id: string, updates: Partial<ScenarioPlanning>) => {
      await updateScenarioPlanningMutation.mutateAsync({
        id: parseInt(id),
        data: {
          description: updates.keyAssumptions?.join(', ') || '',
          probability: updates.probability,
        },
      });
    },

    saveRevenueTargets: async (data: {
      id?: number;
      annualRevenue: number;
      monthlyRevenue: number;
      q1Revenue: number;
      q2Revenue: number;
      q3Revenue: number;
      q4Revenue: number;
    }) => {
      await saveRevenueTargetMutation.mutateAsync(data);
    },
    
    // CRUD operations for each entity type
// Customer Profiles
    addCustomerProfile: (data: Partial<CustomerProfile>) => {
      return createCustomerProfileMutation.mutateAsync({
        name: data.segment,
        email: 'info@example.com',
        segment: data.segment?.toLowerCase() as 'enterprise' | 'smb' | 'retail' | 'wholesale' | 'startup',
        lifetime_value: data.demandAssumption ? data.demandAssumption * 10000 : 0,
        average_order_value: data.avgOrderValue || 0,
        order_frequency: Math.round((data.growthRate || 0) / 5),
        risk_score: data.retention && data.retention > 80 ? 'low' : 
                    data.retention && data.retention > 60 ? 'medium' : 'high',
        preferences: {},
        // Extended fields
        demand_assumption: data.demandAssumption || 0,
        growth_rate: data.growthRate || 0,
        retention: data.retention || 0,
        seasonality: data.seasonality || 0,
      });
    },
    
// Revenue Projections
    addRevenueProjection: (data: Partial<RevenueProjection>) => {
      return createRevenueProjectionMutation.mutateAsync({
        name: data.period || 'New Projection',
        period: '1y',
        projected_revenue: data.projected || 0,
        confidence: data.confidence || 75,
        assumptions: '',
        // Extended fields
        conservative: data.conservative || data.projected * 0.8 || 0,
        optimistic: data.optimistic || data.projected * 1.2 || 0,
        actual_to_date: data.actualToDate || 0,
      });
    },
    
    // Cost Structures
    addCostStructure: (data: Partial<CostStructure>) => {
      return createCostStructureMutation.mutateAsync({
        name: data.category || 'New Cost',
        category: data.variability?.toLowerCase() as 'fixed' | 'variable' | 'semi_variable' || 'variable',
        amount: data.amount || 0,
        period: 'monthly',
        description: '',
      });
    },
    
    // Cash Flow Forecasts
    addCashFlowForecast: (data: Partial<CashFlowForecast>) => {
      return createCashFlowForecastMutation.mutateAsync({
        name: data.month || 'New Period',
        period: 'monthly',
        cash_inflow: data.cashInflow || 0,
        cash_outflow: data.cashOutflow || 0,
        net_position: data.netCashFlow || 0,
        notes: '',
      });
    },
    
    // KPIs
    addKPI: (data: Partial<KPI>) => {
      return createKPIMutation.mutateAsync({
        name: data.name || 'New KPI',
        current_value: data.current || 0,
        target_value: data.target || 100,
        unit: data.unit || '%',
        status: data.trend === 'up' ? 'on_track' : data.trend === 'down' ? 'off_track' : 'at_risk',
        description: '',
      });
    },
    
    // Scenario Planning
    addScenarioPlanning: (data: Partial<ScenarioPlanning>) => {
      return createScenarioPlanningMutation.mutateAsync({
        name: data.scenario || 'New Scenario',
        type: data.scenario === 'Best Case' ? 'optimistic' : 
              data.scenario === 'Worst Case' ? 'pessimistic' : 'base',
        probability: data.probability || 50,
        description: data.keyAssumptions?.join(', ') || '',
        impact_analysis: {},
      });
    },
  };
}
