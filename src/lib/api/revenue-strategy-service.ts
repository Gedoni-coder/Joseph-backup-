/**
 * Revenue Strategy Service
 * Connected to Django REST API
 */

import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "./django-client";

export interface RevenueStrategyData {
  id: number;
  created_at: string;
  account_id: number;
  monthly_recurring_revenue: number;
  annual_contract_value: number;
  customer_lifetime_value: number;
  revenue_per_customer: number;
  gross_revenue_retention: number;
  net_revenue_retention: number;
  top_revenue_streams: string[];
  churn_risk_summary: string[];
  top_upsell_opportunities: string[];
  channel_performance: string[];
  revenue_strategy_summary: string;
  key_metrics_insights: string[];
  revenue_strategy_recommendations: string[];
  action_items: string[];
  next_steps: string[];
  revenue_streams_details: string[];
  revenue_forecasting: string[];
  churn_analysis: string[];
  upsell_opportunities: string[];
}

export type RevenueStrategyCreateData = Omit<RevenueStrategyData, "id" | "created_at">;
export type RevenueStrategyUpdateData = Partial<RevenueStrategyCreateData>;

/**
 * Get all revenue strategies
 */
export async function getRevenueStrategies(): Promise<RevenueStrategyData[]> {
  try {
    return await djangoGet<RevenueStrategyData[]>("/api/revenue/streams/");
  } catch (error) {
    console.error("[Django API] Error fetching revenue strategies:", error);
    return [];
  }
}

/**
 * Get a specific revenue strategy by ID
 */
export async function getRevenueStrategy(id: number): Promise<RevenueStrategyData | null> {
  try {
    return await djangoGet<RevenueStrategyData>(`/api/revenue/streams/${id}/`);
  } catch (error) {
    console.error(`[Django API] Error fetching revenue strategy ${id}:`, error);
    return null;
  }
}

/**
 * Create a new revenue strategy
 */
export async function createRevenueStrategy(data: RevenueStrategyCreateData): Promise<RevenueStrategyData | null> {
  try {
    return await djangoPost<RevenueStrategyData>("/api/revenue/streams/", data);
  } catch (error) {
    console.error("[Django API] Error creating revenue strategy:", error);
    return null;
  }
}

/**
 * Update an existing revenue strategy
 */
export async function updateRevenueStrategy(id: number, data: RevenueStrategyUpdateData): Promise<RevenueStrategyData | null> {
  try {
    return await djangoPatch<RevenueStrategyData>(`/api/revenue/streams/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating revenue strategy ${id}:`, error);
    return null;
  }
}

/**
 * Delete a revenue strategy
 */
export async function deleteRevenueStrategy(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/revenue/streams/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting revenue strategy ${id}:`, error);
    return false;
  }
}
