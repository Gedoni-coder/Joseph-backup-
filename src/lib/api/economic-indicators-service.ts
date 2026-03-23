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
  return await djangoGet<EconomicIndicatorData[]>("/api/economic/metrics/");
}

/**
 * Get a specific economic indicator record by ID
 */
export async function getEconomicIndicator(id: number): Promise<EconomicIndicatorData | null> {
  return await djangoGet<EconomicIndicatorData>(`/api/economic/metrics/${id}/`);
}

/**
 * Create a new economic indicator record
 */
export async function createEconomicIndicator(data: EconomicIndicatorCreateData): Promise<EconomicIndicatorData | null> {
  return await djangoPost<EconomicIndicatorData>("/api/economic/metrics/", data);
}

/**
 * Update an existing economic indicator record
 */
export async function updateEconomicIndicator(id: number, data: EconomicIndicatorUpdateData): Promise<EconomicIndicatorData | null> {
  return await djangoPatch<EconomicIndicatorData>(`/api/economic/metrics/${id}/`, data);
}

/**
 * Delete an economic indicator record
 */
export async function deleteEconomicIndicator(id: number): Promise<boolean> {
  await djangoDelete(`/api/economic/metrics/${id}/`);
  return true;
}
