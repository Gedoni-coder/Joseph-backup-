/**
 * Business Forecasting Service
 * Connected to Django REST API
 */

import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "./django-client";

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

export type BusinessForecastingCreateData = Omit<
  BusinessForecastingData,
  "id" | "created_at"
>;
export type BusinessForecastingUpdateData =
  Partial<BusinessForecastingCreateData>;

/**
 * Get all business forecasting records
 */
export async function getBusinessForecasts(): Promise<BusinessForecastingData[]> {
  try {
    return await djangoGet<BusinessForecastingData[]>("/api/business/forecasts/");
  } catch (error) {
    console.error("[Django API] Error fetching business forecasts:", error);
    return [];
  }
}

/**
 * Get a specific business forecasting record by ID
 */
export async function getBusinessForecast(id: number): Promise<BusinessForecastingData | null> {
  try {
    return await djangoGet<BusinessForecastingData>(`/api/business/forecasts/${id}/`);
  } catch (error) {
    console.error(`[Django API] Error fetching business forecast ${id}:`, error);
    return null;
  }
}

/**
 * Create a new business forecasting record
 */
export async function createBusinessForecast(data: BusinessForecastingCreateData): Promise<BusinessForecastingData | null> {
  try {
    return await djangoPost<BusinessForecastingData>("/api/business/forecasts/", data);
  } catch (error) {
    console.error("[Django API] Error creating business forecast:", error);
    return null;
  }
}

/**
 * Update an existing business forecasting record
 */
export async function updateBusinessForecast(id: number, data: BusinessForecastingUpdateData): Promise<BusinessForecastingData | null> {
  try {
    return await djangoPatch<BusinessForecastingData>(`/api/business/forecasts/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating business forecast ${id}:`, error);
    return null;
  }
}

/**
 * Delete a business forecasting record
 */
export async function deleteBusinessForecast(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/business/forecasts/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting business forecast ${id}:`, error);
    return false;
  }
}
