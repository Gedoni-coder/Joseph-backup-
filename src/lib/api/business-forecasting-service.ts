/**
 * Business Forecasting Service
 * Connected to Django REST API
 * 
 * API Endpoints:
 * - /api/business/customer-profiles/
 * - /api/business/revenue-projections/
 * - /api/business/cost-structures/
 * - /api/business/cash-flow-forecasts/
 * - /api/business/kpis/
 * - /api/business/scenario-plannings/
 */

import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "./django-client";

// ==================== CUSTOMER PROFILES ====================

export interface CustomerProfile {
  id: number;
  name: string;
  email: string;
  segment: 'retail' | 'wholesale' | 'enterprise' | 'smb';
  lifetime_value: number;
  average_order_value: number;
  order_frequency: number;
  risk_score: 'low' | 'medium' | 'high';
  preferences: Record<string, unknown>;
  created_at: string;
}

export async function getCustomerProfiles(): Promise<CustomerProfile[]> {
  try {
    return await djangoGet<CustomerProfile[]>("/api/business/customer-profiles/");
  } catch (error) {
    console.error("[Django API] Error fetching customer profiles:", error);
    return [];
  }
}

export async function createCustomerProfile(data: Partial<CustomerProfile>): Promise<CustomerProfile | null> {
  try {
    return await djangoPost<CustomerProfile>("/api/business/customer-profiles/", data);
  } catch (error) {
    console.error("[Django API] Error creating customer profile:", error);
    return null;
  }
}

export async function updateCustomerProfile(id: number, data: Partial<CustomerProfile>): Promise<CustomerProfile | null> {
  try {
    return await djangoPatch<CustomerProfile>(`/api/business/customer-profiles/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating customer profile ${id}:`, error);
    return null;
  }
}

export async function deleteCustomerProfile(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/business/customer-profiles/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting customer profile ${id}:`, error);
    return false;
  }
}

// ==================== REVENUE PROJECTIONS ====================

export interface RevenueProjection {
  id: number;
  name: string;
  period: '1m' | '3m' | '6m' | '1y';
  projected_revenue: number;
  confidence: number;
  assumptions: string;
  created_at: string;
}

export async function getRevenueProjections(): Promise<RevenueProjection[]> {
  try {
    return await djangoGet<RevenueProjection[]>("/api/business/revenue-projections/");
  } catch (error) {
    console.error("[Django API] Error fetching revenue projections:", error);
    return [];
  }
}

export async function createRevenueProjection(data: Partial<RevenueProjection>): Promise<RevenueProjection | null> {
  try {
    return await djangoPost<RevenueProjection>("/api/business/revenue-projections/", data);
  } catch (error) {
    console.error("[Django API] Error creating revenue projection:", error);
    return null;
  }
}

export async function updateRevenueProjection(id: number, data: Partial<RevenueProjection>): Promise<RevenueProjection | null> {
  try {
    return await djangoPatch<RevenueProjection>(`/api/business/revenue-projections/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating revenue projection ${id}:`, error);
    return null;
  }
}

export async function deleteRevenueProjection(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/business/revenue-projections/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting revenue projection ${id}:`, error);
    return false;
  }
}

// ==================== COST STRUCTURES ====================

export interface CostStructure {
  id: number;
  name: string;
  category: 'fixed' | 'variable' | 'semi_variable';
  amount: number;
  period: string;
  description: string;
  created_at: string;
}

export async function getCostStructures(): Promise<CostStructure[]> {
  try {
    return await djangoGet<CostStructure[]>("/api/business/cost-structures/");
  } catch (error) {
    console.error("[Django API] Error fetching cost structures:", error);
    return [];
  }
}

export async function createCostStructure(data: Partial<CostStructure>): Promise<CostStructure | null> {
  try {
    return await djangoPost<CostStructure>("/api/business/cost-structures/", data);
  } catch (error) {
    console.error("[Django API] Error creating cost structure:", error);
    return null;
  }
}

export async function updateCostStructure(id: number, data: Partial<CostStructure>): Promise<CostStructure | null> {
  try {
    return await djangoPatch<CostStructure>(`/api/business/cost-structures/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating cost structure ${id}:`, error);
    return null;
  }
}

export async function deleteCostStructure(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/business/cost-structures/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting cost structure ${id}:`, error);
    return false;
  }
}

// ==================== CASH FLOW FORECASTS ====================

export interface CashFlowForecast {
  id: number;
  name: string;
  period: 'weekly' | 'monthly' | 'quarterly';
  cash_inflow: number;
  cash_outflow: number;
  net_position: number;
  notes: string;
  created_at: string;
}

export async function getCashFlowForecasts(): Promise<CashFlowForecast[]> {
  try {
    return await djangoGet<CashFlowForecast[]>("/api/business/cash-flow-forecasts/");
  } catch (error) {
    console.error("[Django API] Error fetching cash flow forecasts:", error);
    return [];
  }
}

export async function createCashFlowForecast(data: Partial<CashFlowForecast>): Promise<CashFlowForecast | null> {
  try {
    return await djangoPost<CashFlowForecast>("/api/business/cash-flow-forecasts/", data);
  } catch (error) {
    console.error("[Django API] Error creating cash flow forecast:", error);
    return null;
  }
}

export async function updateCashFlowForecast(id: number, data: Partial<CashFlowForecast>): Promise<CashFlowForecast | null> {
  try {
    return await djangoPatch<CashFlowForecast>(`/api/business/cash-flow-forecasts/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating cash flow forecast ${id}:`, error);
    return null;
  }
}

export async function deleteCashFlowForecast(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/business/cash-flow-forecasts/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting cash flow forecast ${id}:`, error);
    return false;
  }
}

// ==================== KPIs ====================

export interface KPI {
  id: number;
  name: string;
  current_value: number;
  target_value: number;
  unit: string;
  status: 'on_track' | 'at_risk' | 'off_track';
  description: string;
  created_at: string;
  updated_at: string;
}

export async function getKPIs(): Promise<KPI[]> {
  try {
    return await djangoGet<KPI[]>("/api/business/kpis/");
  } catch (error) {
    console.error("[Django API] Error fetching KPIs:", error);
    return [];
  }
}

export async function createKPI(data: Partial<KPI>): Promise<KPI | null> {
  try {
    return await djangoPost<KPI>("/api/business/kpis/", data);
  } catch (error) {
    console.error("[Django API] Error creating KPI:", error);
    return null;
  }
}

export async function updateKPI(id: number, data: Partial<KPI>): Promise<KPI | null> {
  try {
    return await djangoPatch<KPI>(`/api/business/kpis/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating KPI ${id}:`, error);
    return null;
  }
}

export async function deleteKPI(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/business/kpis/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting KPI ${id}:`, error);
    return false;
  }
}

// ==================== SCENARIO PLANNING ====================

export interface ScenarioPlanning {
  id: number;
  name: string;
  type: 'optimistic' | 'pessimistic' | 'base';
  probability: number;
  description: string;
  impact_analysis: Record<string, unknown>;
  created_at: string;
}

export async function getScenarioPlannings(): Promise<ScenarioPlanning[]> {
  try {
    return await djangoGet<ScenarioPlanning[]>("/api/business/scenario-plannings/");
  } catch (error) {
    console.error("[Django API] Error fetching scenario plannings:", error);
    return [];
  }
}

export async function createScenarioPlanning(data: Partial<ScenarioPlanning>): Promise<ScenarioPlanning | null> {
  try {
    return await djangoPost<ScenarioPlanning>("/api/business/scenario-plannings/", data);
  } catch (error) {
    console.error("[Django API] Error creating scenario planning:", error);
    return null;
  }
}

export async function updateScenarioPlanning(id: number, data: Partial<ScenarioPlanning>): Promise<ScenarioPlanning | null> {
  try {
    return await djangoPatch<ScenarioPlanning>(`/api/business/scenario-plannings/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating scenario planning ${id}:`, error);
    return null;
  }
}

export async function deleteScenarioPlanning(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/business/scenario-plannings/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting scenario planning ${id}:`, error);
    return false;
  }
}

// ==================== LEGACY TYPES (for backward compatibility) ====================

// Legacy Xano-style interface for existing components
export interface BusinessForecastingData {
  id: number;
  created_at: string;
  account_id: number;
  annual_revenue_target: number;
  customer_segments_count: number;
  kpis_tracked_count: number;
  scenarios_modeled_count: number;
  total_demand_units: number;
  average_order_value: number;
  enterprise_units: number;
  enterprise_growth_rate: number;
  enterprise_retention: number;
  enterprise_avg_order: number;
  enterprise_seasonality: number;
  enterprise_revenue_potential: number;
  smb_units: number;
  smb_growth_rate: number;
  smb_retention: number;
  smb_avg_order: number;
  smb_seasonality: number;
  smb_revenue_potential: number;
  total_market_opportunity: number;
  weighted_avg_growth: number;
  overall_retention: number;
  q1_2025_projected_revenue: number;
  q1_2025_actual_to_date: number;
  q1_2025_scenario_range_min: number;
  q1_2025_scenario_range_max: number;
  q1_2025_confidence: string;
  q2_2025_projected_revenue: number;
  q2_2025_actual_to_date?: number;
  q2_2025_scenario_range_min: number;
  q2_2025_scenario_range_max: number;
  q2_2025_confidence: string;
  q3_2025_projected_revenue?: number;
  q3_2025_actual_to_date?: number;
  q3_2025_scenario_range_min?: number;
  q3_2025_scenario_range_max?: number;
  q3_2025_confidence?: string;
  q4_2025_projected_revenue?: number;
  q4_2025_actual_to_date?: number;
  q4_2025_scenario_range_min?: number;
  q4_2025_scenario_range_max?: number;
  q4_2025_confidence?: string;
  total_revenue_target: number;
  avg_confidence: number;
  potential_upside: number;
  kpis: string[];
  forecast_scenarios: string[];
  documents: string[];
}

/**
 * Get all business forecasting records (legacy function)
 * @deprecated Use individual endpoint functions instead
 */
export async function getBusinessForecasts(): Promise<BusinessForecastingData[]> {
  try {
    // This endpoint doesn't exist - return empty to use new endpoints
    console.warn("[Django API] Using legacy endpoint - consider migrating to new endpoints");
    return [];
  } catch (error) {
    console.error("[Django API] Error fetching business forecasts:", error);
    return [];
  }
}

export type BusinessForecastingCreateData = Omit<BusinessForecastingData, "id" | "created_at">;
export type BusinessForecastingUpdateData = Partial<BusinessForecastingCreateData>;

/**
 * Create a new business forecasting record (legacy function)
 * @deprecated Use individual endpoint functions instead
 */
export async function createBusinessForecast(data: BusinessForecastingCreateData): Promise<BusinessForecastingData | null> {
  console.warn("[Django API] Using legacy endpoint - consider migrating to new endpoints");
  return null;
}

/**
 * Update an existing business forecasting record (legacy function)
 * @deprecated Use individual endpoint functions instead
 */
export async function updateBusinessForecast(id: number, data: BusinessForecastingUpdateData): Promise<BusinessForecastingData | null> {
  console.warn("[Django API] Using legacy endpoint - consider migrating to new endpoints");
  return null;
}

/**
 * Delete a business forecasting record (legacy function)
 * @deprecated Use individual endpoint functions instead
 */
export async function deleteBusinessForecast(id: number): Promise<boolean> {
  console.warn("[Django API] Using legacy endpoint - consider migrating to new endpoints");
  return false;
}
