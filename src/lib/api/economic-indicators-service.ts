/**
 * Economic Indicators Service
 * Connected to Django REST API
 */

import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "./django-client";

export interface EconomicIndicatorData {
  id: number;
  created_at: string;
  account_id: number;
  gdp_growth_rate: number;
  inflation_rate: number;
  unemployment_rate: number;
  interest_rates: number;
  exchange_rates: number;
  consumer_confidence: number;
  stock_market_index: number;
  commodity_prices: number;
  housing_index: number;
  trade_balance: number;
  economic_news: string[];
  forecasts: string[];
  trends: string[];
  impact_analysis: string[];
  alerts: string[];
}

export type EconomicIndicatorCreateData = Omit<EconomicIndicatorData, "id" | "created_at">;
export type EconomicIndicatorUpdateData = Partial<EconomicIndicatorCreateData>;

/**
 * Get all economic indicator records
 */
export async function getEconomicIndicatorRecords(): Promise<EconomicIndicatorData[]> {
  try {
    return await djangoGet<EconomicIndicatorData[]>("/api/economic/metrics/");
  } catch (error) {
    console.error("[Django API] Error fetching economic indicator records:", error);
    return [];
  }
}

/**
 * Get a specific economic indicator record by ID
 */
export async function getEconomicIndicator(id: number): Promise<EconomicIndicatorData | null> {
  try {
    return await djangoGet<EconomicIndicatorData>(`/api/economic/metrics/${id}/`);
  } catch (error) {
    console.error(`[Django API] Error fetching economic indicator ${id}:`, error);
    return null;
  }
}

/**
 * Create a new economic indicator record
 */
export async function createEconomicIndicator(data: EconomicIndicatorCreateData): Promise<EconomicIndicatorData | null> {
  try {
    return await djangoPost<EconomicIndicatorData>("/api/economic/metrics/", data);
  } catch (error) {
    console.error("[Django API] Error creating economic indicator:", error);
    return null;
  }
}

/**
 * Update an existing economic indicator record
 */
export async function updateEconomicIndicator(id: number, data: EconomicIndicatorUpdateData): Promise<EconomicIndicatorData | null> {
  try {
    return await djangoPatch<EconomicIndicatorData>(`/api/economic/metrics/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating economic indicator ${id}:`, error);
    return null;
  }
}

/**
 * Delete an economic indicator record
 */
export async function deleteEconomicIndicator(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/economic/metrics/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting economic indicator ${id}:`, error);
    return false;
  }
}
