/**
 * Financial Advisory Service
 * Endpoint-specific access to Django REST API resources.
 */

import { djangoDelete, djangoGet, djangoPatch, djangoPost } from "./django-client";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

type ListResponse<T> = T[] | PaginatedResponse<T>;

export interface BudgetForecastRecord {
  id: number;
  category: string;
  amount: number;
  actual_amount: number | null;
  variance: number;
  period: string;
  created_at: string;
}

export interface CashFlowProjectionRecord {
  id: number;
  name: string;
  type: "inflow" | "outflow";
  amount: number;
  period: string;
  description: string;
  created_at: string;
}

export interface ScenarioTestRecord {
  id: number;
  name: string;
  type: "stress" | "sensitivity" | "what_if";
  description: string;
  impact: Record<string, unknown>;
  probability: number;
  created_at: string;
}

export interface RiskAssessmentRecord {
  id: number;
  category: string;
  description: string;
  level: "low" | "medium" | "high";
  impact: "low" | "medium" | "high";
  mitigation: string;
  created_at: string;
}

export interface KPIRecord {
  id: number;
  name: string;
  category:
    | "revenue"
    | "cost"
    | "efficiency"
    | "growth"
    | "financial"
    | "operational"
    | "sales"
    | "productivity"
    | "risk";
  impact: "low" | "medium" | "high";
  current_value: number;
  target_value: number;
  unit: string;
  trend: "improving" | "stable" | "declining";
  status: "on_track" | "at_risk" | "critical" | "exceeding_target" | "off_track";
  driver_type: "leading" | "lagging";
  unit_of_measure: "%" | "$" | "ratio" | "count" | "days" | "hours" | "score";
  warning_threshold: number;
  critical_threshold: number;
  data_source: "manual" | "upload" | "auto_sync";
  linked_budget_items: string[];
  driver_link: string[];
  kpi_history: Array<{ date: string; value: number }>;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface AdvisoryInsightRecord {
  id: number;
  title: string;
  description: string;
  category: "cost_optimization" | "revenue_growth" | "risk_management" | "operational" | "investment";
  priority: "low" | "medium" | "high" | "critical";
  status: "new" | "reviewed" | "implemented" | "dismissed";
  recommendations: string[];
  financial_impact: number;
  timeframe: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
}

export interface LiquidityMetricRecord {
  id: number;
  name: string;
  value: number;
  benchmark: number | null;
  period: string;
  created_at: string;
}

export interface BudgetValidationSummaryRecord {
  id: number;
  accuracy_score: number;
  avg_variance: number;
  validated_forecasts: number;
  budget_alignment: number;
  generated_at: string;
}

export interface ForecastValidationRecordRecord {
  id: number;
  period: string;
  validation_status: "accurate" | "acceptable" | "concerning" | "pending";
  forecasted_revenue: number;
  actual_revenue: number | null;
  revenue_variance: number;
  forecasted_net_income: number;
  actual_net_income: number | null;
  accuracy_score: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BudgetAlignmentMetricRecord {
  id: number;
  name: string;
  score: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ForecastImprovementAreaRecord {
  id: number;
  title: string;
  summary: string;
  icon: "trending-up" | "alert-circle" | "calendar";
  theme: "green" | "yellow" | "blue";
  sections: Array<{
    heading: string;
    body?: string;
    bullets?: string[];
  }>;
  recommended_action: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ScenarioResilienceMetricRecord {
  id: number;
  name: string;
  value: string;
  value_tone: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RecommendedStressTestRecord {
  id: number;
  title: string;
  description: string;
  icon: "alert-triangle" | "trending-down" | "activity";
  scenario_template: {
    testVariable?: string;
    changePercent?: number;
    testType?: "stress" | "sensitivity" | "what_if";
  };
  sort_order: number;
  created_at: string;
  updated_at: string;
}


export interface FinancialLineItemRecord {
  id: number;
  category: "Revenue" | "Expenses" | "Assets" | "Liabilities" | "Equity";
  item: string;
  current_amount: number;
  budget_amount: number;
  last_year_amount: number;
  unit: string;
  period: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function normalizeListResponse<T>(payload: ListResponse<T>): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload.results;
}

async function fetchAllPages<T>(endpoint: string): Promise<T[]> {
  const firstPage = await djangoGet<ListResponse<T>>(endpoint);
  if (Array.isArray(firstPage) || !firstPage.next) {
    return normalizeListResponse(firstPage);
  }

  const aggregated = [...firstPage.results];
  let page = 2;
  while (true) {
    const nextPage = await djangoGet<ListResponse<T>>(`${endpoint}?page=${page}`);
    const rows = normalizeListResponse(nextPage);
    if (!rows.length) {
      break;
    }
    aggregated.push(...rows);

    if (Array.isArray(nextPage) || !nextPage.next) {
      break;
    }
    page += 1;
  }

  return aggregated;
}

export async function getBudgetForecasts(): Promise<BudgetForecastRecord[]> {
  return fetchAllPages<BudgetForecastRecord>("/api/financial/budget-forecasts/");
}

export async function createBudgetForecastRecord(
  payload: Omit<BudgetForecastRecord, "id" | "created_at">,
): Promise<BudgetForecastRecord> {
  return djangoPost<BudgetForecastRecord>("/api/financial/budget-forecasts/", payload);
}

export async function getCashFlowProjections(): Promise<CashFlowProjectionRecord[]> {
  return fetchAllPages<CashFlowProjectionRecord>("/api/financial/cash-flow-projections/");
}

export async function createCashFlowProjectionRecord(
  payload: Omit<CashFlowProjectionRecord, "id" | "created_at">,
): Promise<CashFlowProjectionRecord> {
  return djangoPost<CashFlowProjectionRecord>("/api/financial/cash-flow-projections/", payload);
}

export async function getScenarioTests(): Promise<ScenarioTestRecord[]> {
  return fetchAllPages<ScenarioTestRecord>("/api/financial/scenario-tests/");
}

export async function createScenarioTestRecord(
  payload: Omit<ScenarioTestRecord, "id" | "created_at">,
): Promise<ScenarioTestRecord> {
  return djangoPost<ScenarioTestRecord>("/api/financial/scenario-tests/", payload);
}

export async function getRiskAssessments(): Promise<RiskAssessmentRecord[]> {
  return fetchAllPages<RiskAssessmentRecord>("/api/financial/risk-assessments/");
}

export async function getKpis(): Promise<KPIRecord[]> {
  return fetchAllPages<KPIRecord>("/api/financial/performance-drivers/");
}

export async function createKpiRecord(
  payload: Omit<KPIRecord, "id" | "created_at" | "updated_at">,
): Promise<KPIRecord> {
  return djangoPost<KPIRecord>("/api/financial/performance-drivers/", payload);
}

export async function updateKpiRecord(
  id: number,
  payload: Partial<Omit<KPIRecord, "id" | "created_at" | "updated_at">>,
): Promise<KPIRecord> {
  return djangoPatch<KPIRecord>(`/api/financial/performance-drivers/${id}/`, payload);
}

export async function createRiskAssessmentRecord(
  payload: Omit<RiskAssessmentRecord, "id" | "created_at">,
): Promise<RiskAssessmentRecord> {
  return djangoPost<RiskAssessmentRecord>("/api/financial/risk-assessments/", payload);
}

export async function updateRiskAssessmentRecord(
  id: number,
  payload: Partial<Omit<RiskAssessmentRecord, "id" | "created_at">>,
): Promise<RiskAssessmentRecord> {
  return djangoPatch<RiskAssessmentRecord>(`/api/financial/risk-assessments/${id}/`, payload);
}

export async function getAdvisoryInsights(): Promise<AdvisoryInsightRecord[]> {
  return fetchAllPages<AdvisoryInsightRecord>("/api/financial/advisory-insights/");
}

export async function updateAdvisoryInsightRecord(
  id: number,
  payload: Partial<Omit<AdvisoryInsightRecord, "id" | "created_at">>,
): Promise<AdvisoryInsightRecord> {
  return djangoPatch<AdvisoryInsightRecord>(`/api/financial/advisory-insights/${id}/`, payload);
}

export async function getLiquidityMetrics(): Promise<LiquidityMetricRecord[]> {
  return fetchAllPages<LiquidityMetricRecord>("/api/financial/liquidity-metrics/");
}

export async function getFinancialLineItems(): Promise<FinancialLineItemRecord[]> {
  return fetchAllPages<FinancialLineItemRecord>("/api/financial/financial-line-items/");
}

export async function getBudgetValidationSummaries(): Promise<BudgetValidationSummaryRecord[]> {
  return fetchAllPages<BudgetValidationSummaryRecord>("/api/financial/budget-validation-summaries/");
}

export async function getForecastValidationRecords(): Promise<ForecastValidationRecordRecord[]> {
  return fetchAllPages<ForecastValidationRecordRecord>("/api/financial/forecast-validation-records/");
}

export async function getBudgetAlignmentMetrics(): Promise<BudgetAlignmentMetricRecord[]> {
  return fetchAllPages<BudgetAlignmentMetricRecord>("/api/financial/budget-alignment-metrics/");
}

export async function getForecastImprovementAreas(): Promise<ForecastImprovementAreaRecord[]> {
  return fetchAllPages<ForecastImprovementAreaRecord>("/api/financial/forecast-improvement-areas/");
}

export async function getScenarioResilienceMetrics(): Promise<ScenarioResilienceMetricRecord[]> {
  return fetchAllPages<ScenarioResilienceMetricRecord>("/api/financial/scenario-resilience-metrics/");
}

export async function getRecommendedStressTests(): Promise<RecommendedStressTestRecord[]> {
  return fetchAllPages<RecommendedStressTestRecord>("/api/financial/recommended-stress-tests/");
}

export async function updateFinancialLineItemRecord(
  id: number,
  payload: Partial<Omit<FinancialLineItemRecord, "id" | "created_at" | "updated_at">>,
): Promise<FinancialLineItemRecord> {
  return djangoPatch<FinancialLineItemRecord>(`/api/financial/financial-line-items/${id}/`, payload);
}

export async function deleteFinancialLineItemRecord(id: number): Promise<void> {
  await djangoDelete(`/api/financial/financial-line-items/${id}/`);
}
