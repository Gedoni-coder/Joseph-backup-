/**
 * Risk Management Service
 * Connected to Django REST API
 */

import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "./django-client";

export interface RiskManagementData {
  id: number;
  created_at: string;
  account_id: number;
  total_risks_identified: number;
  critical_risks_count: number;
  risk_mitigation_coverage: number;
  overall_risk_score: number;
  risk_register: string[];
  risk_assessments: string[];
  mitigation_strategies: string[];
  contingency_plans: string[];
  risk_monitoring_metrics: string[];
  risk_tolerance_levels: string[];
  business_continuity_plans: string[];
  insurance_requirements: string[];
}

export type RiskManagementCreateData = Omit<RiskManagementData, "id" | "created_at">;
export type RiskManagementUpdateData = Partial<RiskManagementCreateData>;

/**
 * Get all risk management records
 */
export async function getRiskManagementRecords(): Promise<RiskManagementData[]> {
  try {
    return await djangoGet<RiskManagementData[]>("/api/financial/risks/");
  } catch (error) {
    console.error("[Django API] Error fetching risk management records:", error);
    return [];
  }
}

/**
 * Get a specific risk management record by ID
 */
export async function getRiskManagement(id: number): Promise<RiskManagementData | null> {
  try {
    return await djangoGet<RiskManagementData>(`/api/financial/risks/${id}/`);
  } catch (error) {
    console.error(`[Django API] Error fetching risk management ${id}:`, error);
    return null;
  }
}

/**
 * Create a new risk management record
 */
export async function createRiskManagement(data: RiskManagementCreateData): Promise<RiskManagementData | null> {
  try {
    return await djangoPost<RiskManagementData>("/api/financial/risks/", data);
  } catch (error) {
    console.error("[Django API] Error creating risk management:", error);
    return null;
  }
}

/**
 * Update an existing risk management record
 */
export async function updateRiskManagement(id: number, data: RiskManagementUpdateData): Promise<RiskManagementData | null> {
  try {
    return await djangoPatch<RiskManagementData>(`/api/financial/risks/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating risk management ${id}:`, error);
    return null;
  }
}

/**
 * Delete a risk management record
 */
export async function deleteRiskManagement(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/financial/risks/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting risk management ${id}:`, error);
    return false;
  }
}
