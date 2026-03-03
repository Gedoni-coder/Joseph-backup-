/**
 * Market Analysis Service
 * Connected to Django REST API
 */

import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "./django-client";

export interface MarketAnalysisData {
  id: number;
  created_at: string;
  account_id: number;
  total_addressable_market: number;
  serviceable_addressable_market: number;
  market_growth_rate: number;
  market_segments_count: number;
  competitors_tracked: number;
  competitive_position_score: number;
  market_share_estimate: number;
  market_trends: string[];
  competitive_threats: string[];
  market_opportunities: string[];
  competitor_analysis: string[];
  swot_analysis: string[];
  market_dynamics: string[];
  regulatory_environment: string[];
  customer_preferences: string[];
}

export type MarketAnalysisCreateData = Omit<MarketAnalysisData, "id" | "created_at">;
export type MarketAnalysisUpdateData = Partial<MarketAnalysisCreateData>;

/**
 * Get all market analysis records
 */
export async function getMarketAnalyses(): Promise<MarketAnalysisData[]> {
  try {
    return await djangoGet<MarketAnalysisData[]>("/api/market/segments/");
  } catch (error) {
    console.error("[Django API] Error fetching market analyses:", error);
    return [];
  }
}

/**
 * Get a specific market analysis record by ID
 */
export async function getMarketAnalysis(id: number): Promise<MarketAnalysisData | null> {
  try {
    return await djangoGet<MarketAnalysisData>(`/api/market/segments/${id}/`);
  } catch (error) {
    console.error(`[Django API] Error fetching market analysis ${id}:`, error);
    return null;
  }
}

/**
 * Create a new market analysis record
 */
export async function createMarketAnalysis(data: MarketAnalysisCreateData): Promise<MarketAnalysisData | null> {
  try {
    return await djangoPost<MarketAnalysisData>("/api/market/segments/", data);
  } catch (error) {
    console.error("[Django API] Error creating market analysis:", error);
    return null;
  }
}

/**
 * Update an existing market analysis record
 */
export async function updateMarketAnalysis(id: number, data: MarketAnalysisUpdateData): Promise<MarketAnalysisData | null> {
  try {
    return await djangoPatch<MarketAnalysisData>(`/api/market/segments/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating market analysis ${id}:`, error);
    return null;
  }
}

/**
 * Delete a market analysis record
 */
export async function deleteMarketAnalysis(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/market/segments/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting market analysis ${id}:`, error);
    return false;
  }
}
