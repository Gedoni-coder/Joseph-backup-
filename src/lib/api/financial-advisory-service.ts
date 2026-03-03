/**
 * Financial Advisory Service
 * Connected to Django REST API
 */

import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "./django-client";

export interface FinancialAdvisoryData {
  id: number;
  created_at: string;
  account_id: number;
  total_financial_health_score: number;
  profitability_trend: string;
  liquidity_score: number;
  debt_to_equity_ratio: number;
  cash_flow_health: string;
  financial_forecasts: string[];
  budget_recommendations: string[];
  cost_optimization_opportunities: string[];
  investment_opportunities: string[];
  financial_risk_assessment: string[];
  tax_optimization_strategies: string[];
  working_capital_management: string[];
  financial_planning_roadmap: string[];
}

export type FinancialAdvisoryCreateData = Omit<FinancialAdvisoryData, "id" | "created_at">;
export type FinancialAdvisoryUpdateData = Partial<FinancialAdvisoryCreateData>;

/**
 * Get all financial advisory records
 */
export async function getFinancialAdvisoryRecords(): Promise<FinancialAdvisoryData[]> {
  try {
    return await djangoGet<FinancialAdvisoryData[]>("/api/financial/budget/");
  } catch (error) {
    console.error("[Django API] Error fetching financial advisory records:", error);
    return [];
  }
}

/**
 * Get a specific financial advisory record by ID
 */
export async function getFinancialAdvisory(id: number): Promise<FinancialAdvisoryData | null> {
  try {
    return await djangoGet<FinancialAdvisoryData>(`/api/financial/budget/${id}/`);
  } catch (error) {
    console.error(`[Django API] Error fetching financial advisory ${id}:`, error);
    return null;
  }
}

/**
 * Create a new financial advisory record
 */
export async function createFinancialAdvisory(data: FinancialAdvisoryCreateData): Promise<FinancialAdvisoryData | null> {
  try {
    return await djangoPost<FinancialAdvisoryData>("/api/financial/budget/", data);
  } catch (error) {
    console.error("[Django API] Error creating financial advisory:", error);
    return null;
  }
}

/**
 * Update an existing financial advisory record
 */
export async function updateFinancialAdvisory(id: number, data: FinancialAdvisoryUpdateData): Promise<FinancialAdvisoryData | null> {
  try {
    return await djangoPatch<FinancialAdvisoryData>(`/api/financial/budget/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating financial advisory ${id}:`, error);
    return null;
  }
}

/**
 * Delete a financial advisory record
 */
export async function deleteFinancialAdvisory(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/financial/budget/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting financial advisory ${id}:`, error);
    return false;
  }
}
