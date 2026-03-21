import { apiClient } from './api-client';

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

function unwrapList<T>(payload: T[] | Paginated<T>): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload.results ?? [];
}

async function getList<T>(url: string): Promise<T[]> {
  const response = await apiClient.get<T[] | Paginated<T>>(url);
  return unwrapList(response.data);
}

export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  segment: 'enterprise' | 'smb' | 'retail' | 'wholesale' | 'startup';
  lifetime_value: number;
  average_order_value: number;
  order_frequency: number;
  risk_score: 'low' | 'medium' | 'high';
  preferences: Record<string, unknown>;
  demand_assumption: number;
  growth_rate: number;
  retention: number;
  seasonality: number;
}

export interface RevenueProjection {
  id: number;
  name: string;
  period: '1m' | '3m' | '6m' | '1y';
  projected_revenue: number;
  confidence: number;
  assumptions: string;
  conservative: number;
  optimistic: number;
  actual_to_date: number;
}

export interface CostStructure {
  id: number;
  name: string;
  category: 'fixed' | 'variable' | 'semi_variable';
  amount: number;
  period: string;
  description: string;
}

export interface CashFlowForecast {
  id: number;
  name: string;
  period: string;
  cash_inflow: number;
  cash_outflow: number;
  net_position: number;
  notes: string;
}

export interface KPI {
  id: number;
  name: string;
  current_value: number;
  target_value: number;
  unit: string;
  status: 'on_track' | 'at_risk' | 'off_track';
  description?: string;
}

export interface ScenarioPlanning {
  id: number;
  name: string;
  type: 'optimistic' | 'base' | 'pessimistic';
  probability: number;
  description: string;
  impact_analysis?: Record<string, unknown>;
}

export interface KeyAssumption {
  id: number;
  label: string;
  value: string;
}

export interface KeyRisk {
  id: number;
  label: string;
  level: 'low' | 'medium' | 'high';
}

export interface CompetitiveMetricApi {
  id: number;
  label: string;
  current_value: string;
  target_value: string;
  unit: string;
}

export interface ForecastActionItemApi {
  id: number;
  index: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  timeline: string;
}

export interface ForecastNextStepApi {
  id: number;
  index: number;
  step: string;
  owner: string;
  due_date: string;
}

export interface GrowthTrajectoryApi {
  id: number;
  quarter: string;
  description: string;
  revenue_target: number;
}

export interface RevenueTargetApi {
  id: number;
  annual_revenue: number;
  quarterly_target: number;
  monthly_target: number;
  growth_rate: number;
  q1_revenue: number;
  q2_revenue: number;
  q3_revenue: number;
  q4_revenue: number;
}

export interface BusinessMetricApi {
  id: number;
  category: string;
  metric: string;
  current: string;
  target: string;
  last_month: string;
  trend: 'up' | 'down' | 'stable';
  change: string;
  status: 'good' | 'fair' | 'excellent';
}

export interface RevenueProductServiceForecastApi {
  id: number;
  name: string;
  projection_year: number;
  projected_revenue: number;
  growth_rate: number;
  market_share: number;
  sort_order: number;
}

export interface RevenueRegionalForecastApi {
  id: number;
  region: string;
  projected_revenue: number;
  revenue_share: number;
  growth_rate: number;
  sort_order: number;
}

export interface RevenueHistoricalComparisonApi {
  id: number;
  label: string;
  total_revenue: number;
  growth_percent: number;
  growth_label: string;
  supporting_metric_label: string;
  supporting_metric_value: string;
  sort_order: number;
}

export interface RevenueForecastMethodApi {
  id: number;
  name: string;
  description: string;
  projected_revenue: number;
  metric_label: string;
  metric_value: string;
  sort_order: number;
}

export interface RevenueScenarioSnapshotApi {
  id: number;
  scenario: string;
  probability: number;
  annual_revenue: number;
  operating_costs: number;
  net_profit: number;
  key_assumptions: string[];
  sort_order: number;
}

export interface RevenueSegmentBreakdownApi {
  id: number;
  segment: string;
  revenue: number;
  percentage_of_total: number;
  growth_rate: number;
  customer_count: number;
  sort_order: number;
}

export interface CostOverviewMetricApi {
  id: number;
  cost_type: 'fixed' | 'variable';
  description: string;
  annual_total: number;
  monthly_average: number;
  percent_of_revenue: number;
  insight: string;
  sort_order: number;
}

export interface CostBudgetScenarioApi {
  id: number;
  label: string;
  amount: number;
  subtitle: string;
  note: string;
  sort_order: number;
}

export interface CostMonthlyComparisonApi {
  id: number;
  month: string;
  budget_amount: number;
  forecast_amount: number;
  actual_amount: number | null;
  sort_order: number;
}

export interface OperationalExpenseCategoryApi {
  id: number;
  name: string;
  total_amount: number;
  sort_order: number;
}

export interface OperationalExpenseItemApi {
  id: number;
  category: number;
  name: string;
  amount: number;
  sort_order: number;
}

export interface CostTrendAnalysisApi {
  id: number;
  title: string;
  value: string;
  description: string;
  benchmark: string;
  bullet_points: string[];
  sort_order: number;
}

export interface OverviewProfitLossSnapshotApi {
  id: number;
  gross_profit: number;
  gross_margin: number;
  operating_expense: number;
  net_profit: number;
  net_margin: number;
  period_label: string;
  sort_order: number;
}

export interface OverviewKpiSummaryApi {
  id: number;
  metrics_tracked: number;
  excellent_count: number;
  good_count: number;
  fair_count: number;
  needs_attention_count: number;
  sort_order: number;
}

export interface OverviewAlertApi {
  id: number;
  alert_type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  description: string;
  sort_order: number;
}

export const getCustomerProfiles = () => getList<CustomerProfile>('/api/business/customer-profiles/');
export const getRevenueProjections = () => getList<RevenueProjection>('/api/business/revenue-projections/');
export const getCostStructures = () => getList<CostStructure>('/api/business/cost-structures/');
export const getCashFlowForecasts = () => getList<CashFlowForecast>('/api/business/cash-flow-forecasts/');
export const getKPIs = () => getList<KPI>('/api/business/kpis/');
export const getScenarioPlannings = () => getList<ScenarioPlanning>('/api/business/scenario-plannings/');
export const getKeyAssumptions = () => getList<KeyAssumption>('/api/business/key-assumptions/');
export const getKeyRisks = () => getList<KeyRisk>('/api/business/key-risks/');
export const getCompetitiveMetrics = () => getList<CompetitiveMetricApi>('/api/business/competitive-metrics/');
export const getForecastActionItems = () => getList<ForecastActionItemApi>('/api/business/forecast-action-items/');
export const getForecastNextSteps = () => getList<ForecastNextStepApi>('/api/business/forecast-next-steps/');
export const getGrowthTrajectory = () => getList<GrowthTrajectoryApi>('/api/business/growth-trajectories/');
export const getRevenueTargets = () => getList<RevenueTargetApi>('/api/business/revenue-targets/');
export const getBusinessMetrics = () => getList<BusinessMetricApi>('/api/business/business-metrics/');

export const getRevenueProductServiceForecasts = () =>
  getList<RevenueProductServiceForecastApi>('/api/business/revenue-product-service-forecasts/');
export const getRevenueRegionalForecasts = () =>
  getList<RevenueRegionalForecastApi>('/api/business/revenue-regional-forecasts/');
export const getRevenueHistoricalComparisons = () =>
  getList<RevenueHistoricalComparisonApi>('/api/business/revenue-historical-comparisons/');
export const getRevenueForecastMethods = () =>
  getList<RevenueForecastMethodApi>('/api/business/revenue-forecast-methods/');
export const getRevenueScenarioSnapshots = () =>
  getList<RevenueScenarioSnapshotApi>('/api/business/revenue-scenario-snapshots/');
export const getRevenueSegmentBreakdowns = () =>
  getList<RevenueSegmentBreakdownApi>('/api/business/revenue-segment-breakdowns/');
export const getCostOverviewMetrics = () =>
  getList<CostOverviewMetricApi>('/api/business/cost-overview-metrics/');
export const getCostBudgetScenarios = () =>
  getList<CostBudgetScenarioApi>('/api/business/cost-budget-scenarios/');
export const getCostMonthlyComparisons = () =>
  getList<CostMonthlyComparisonApi>('/api/business/cost-monthly-comparisons/');
export const getOperationalExpenseCategories = () =>
  getList<OperationalExpenseCategoryApi>('/api/business/operational-expense-categories/');
export const getOperationalExpenseItems = () =>
  getList<OperationalExpenseItemApi>('/api/business/operational-expense-items/');
export const getCostTrendAnalyses = () =>
  getList<CostTrendAnalysisApi>('/api/business/cost-trend-analyses/');
export const getOverviewProfitLossSnapshots = () =>
  getList<OverviewProfitLossSnapshotApi>('/api/business/overview-profit-loss-snapshots/');
export const getOverviewKpiSummaries = () =>
  getList<OverviewKpiSummaryApi>('/api/business/overview-kpi-summaries/');
export const getOverviewAlerts = () =>
  getList<OverviewAlertApi>('/api/business/overview-alerts/');

export const createCustomerProfile = (data: Partial<CustomerProfile>) => apiClient.post('/api/business/customer-profiles/', data);
export const updateCustomerProfile = (id: number, data: Partial<CustomerProfile>) => apiClient.patch(`/api/business/customer-profiles/${id}/`, data);
export const deleteCustomerProfile = (id: number) => apiClient.delete(`/api/business/customer-profiles/${id}/`);

export const createRevenueProjection = (data: Partial<RevenueProjection>) => apiClient.post('/api/business/revenue-projections/', data);
export const updateRevenueProjection = (id: number, data: Partial<RevenueProjection>) => apiClient.patch(`/api/business/revenue-projections/${id}/`, data);
export const deleteRevenueProjection = (id: number) => apiClient.delete(`/api/business/revenue-projections/${id}/`);

export const createCostStructure = (data: Partial<CostStructure>) => apiClient.post('/api/business/cost-structures/', data);
export const updateCostStructure = (id: number, data: Partial<CostStructure>) => apiClient.patch(`/api/business/cost-structures/${id}/`, data);
export const deleteCostStructure = (id: number) => apiClient.delete(`/api/business/cost-structures/${id}/`);

export const createCashFlowForecast = (data: Partial<CashFlowForecast>) => apiClient.post('/api/business/cash-flow-forecasts/', data);
export const updateCashFlowForecast = (id: number, data: Partial<CashFlowForecast>) => apiClient.patch(`/api/business/cash-flow-forecasts/${id}/`, data);
export const deleteCashFlowForecast = (id: number) => apiClient.delete(`/api/business/cash-flow-forecasts/${id}/`);

export const createKPI = (data: Partial<KPI>) => apiClient.post('/api/business/kpis/', data);
export const updateKPI = (id: number, data: Partial<KPI>) => apiClient.patch(`/api/business/kpis/${id}/`, data);
export const deleteKPI = (id: number) => apiClient.delete(`/api/business/kpis/${id}/`);

export const createScenarioPlanning = (data: Partial<ScenarioPlanning>) => apiClient.post('/api/business/scenario-plannings/', data);
export const updateScenarioPlanning = (id: number, data: Partial<ScenarioPlanning>) => apiClient.patch(`/api/business/scenario-plannings/${id}/`, data);
export const deleteScenarioPlanning = (id: number) => apiClient.delete(`/api/business/scenario-plannings/${id}/`);

export const createRevenueTarget = (data: Partial<RevenueTargetApi>) =>
  apiClient.post('/api/business/revenue-targets/', data);
export const updateRevenueTarget = (id: number, data: Partial<RevenueTargetApi>) =>
  apiClient.patch(`/api/business/revenue-targets/${id}/`, data);
