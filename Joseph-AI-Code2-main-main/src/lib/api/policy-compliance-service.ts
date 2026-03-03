/**
 * Policy & Compliance Service
 * Connected to Django REST API
 */

import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "./django-client";

export interface PolicyComplianceData {
  id: number;
  created_at: string;
  account_id: number;
  external_policies_count: number;
  internal_policies_count: number;
  compliance_score: number;
  gap_analysis_score: number;
  impact_assessment_score: number;
  external_policies: string[];
  internal_policies: string[];
  compliance_reports: string[];
  gap_analyses: string[];
  impact_assessments: string[];
  recommendations: string[];
  action_items: string[];
  next_steps: string[];
  risk_assessment: string[];
}

export type PolicyComplianceCreateData = Omit<PolicyComplianceData, "id" | "created_at">;
export type PolicyComplianceUpdateData = Partial<PolicyComplianceCreateData>;

/**
 * Get all policy compliance records
 */
export async function getPolicyComplianceRecords(): Promise<PolicyComplianceData[]> {
  try {
    return await djangoGet<PolicyComplianceData[]>("/api/policy/external/");
  } catch (error) {
    console.error("[Django API] Error fetching policy compliance records:", error);
    return [];
  }
}

/**
 * Get a specific policy compliance record by ID
 */
export async function getPolicyCompliance(id: number): Promise<PolicyComplianceData | null> {
  try {
    return await djangoGet<PolicyComplianceData>(`/api/policy/external/${id}/`);
  } catch (error) {
    console.error(`[Django API] Error fetching policy compliance ${id}:`, error);
    return null;
  }
}

/**
 * Create a new policy compliance record
 */
export async function createPolicyCompliance(data: PolicyComplianceCreateData): Promise<PolicyComplianceData | null> {
  try {
    return await djangoPost<PolicyComplianceData>("/api/policy/external/", data);
  } catch (error) {
    console.error("[Django API] Error creating policy compliance:", error);
    return null;
  }
}

/**
 * Update an existing policy compliance record
 */
export async function updatePolicyCompliance(id: number, data: PolicyComplianceUpdateData): Promise<PolicyComplianceData | null> {
  try {
    return await djangoPatch<PolicyComplianceData>(`/api/policy/external/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating policy compliance ${id}:`, error);
    return null;
  }
}

/**
 * Delete a policy compliance record
 */
export async function deletePolicyCompliance(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/policy/external/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting policy compliance ${id}:`, error);
    return false;
  }
}
