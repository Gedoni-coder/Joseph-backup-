/**
 * Pricing Strategy Service
 * Connected to Django REST API
 */

import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "./django-client";

export interface PricingStrategyData {
  id: number;
  created_at: string;
  account_id: number;
  average_selling_price: number;
  price_elasticity: number;
  competitive_position_score: number;
  price_acceptance_rate: number;
  active_pricing_strategies: string[];
  running_price_tests: string[];
  pricing_strategy_summary: string;
  key_metrics_insights: string[];
  pricing_recommendations: string[];
  action_items: string[];
  next_steps: string[];
  pricing_strategies_details: string[];
  competitive_analysis: string[];
  price_testing_optimization: string[];
  dynamic_pricing: string[];
}

export type PricingStrategyCreateData = Omit<PricingStrategyData, "id" | "created_at">;
export type PricingStrategyUpdateData = Partial<PricingStrategyCreateData>;

/**
 * Get all pricing strategies
 */
export async function getPricingStrategies(): Promise<PricingStrategyData[]> {
  try {
    return await djangoGet<PricingStrategyData[]>("/api/pricing/settings/");
  } catch (error) {
    console.error("[Django API] Error fetching pricing strategies:", error);
    return [];
  }
}

/**
 * Get a specific pricing strategy by ID
 */
export async function getPricingStrategy(id: number): Promise<PricingStrategyData | null> {
  try {
    return await djangoGet<PricingStrategyData>(`/api/pricing/settings/${id}/`);
  } catch (error) {
    console.error(`[Django API] Error fetching pricing strategy ${id}:`, error);
    return null;
  }
}

/**
 * Create a new pricing strategy
 */
export async function createPricingStrategy(data: PricingStrategyCreateData): Promise<PricingStrategyData | null> {
  try {
    return await djangoPost<PricingStrategyData>("/api/pricing/settings/", data);
  } catch (error) {
    console.error("[Django API] Error creating pricing strategy:", error);
    return null;
  }
}

/**
 * Update an existing pricing strategy
 */
export async function updatePricingStrategy(id: number, data: PricingStrategyUpdateData): Promise<PricingStrategyData | null> {
  try {
    return await djangoPatch<PricingStrategyData>(`/api/pricing/settings/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating pricing strategy ${id}:`, error);
    return null;
  }
}

/**
 * Delete a pricing strategy
 */
export async function deletePricingStrategy(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/pricing/settings/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting pricing strategy ${id}:`, error);
    return false;
  }
}
