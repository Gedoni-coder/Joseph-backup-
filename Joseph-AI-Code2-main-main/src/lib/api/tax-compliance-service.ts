/**
 * Tax Compliance Service
 * Connected to Django REST API
 */

import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "./django-client";

export interface TaxComplianceData {
  id: number;
  created_at: string;
  account_id: number;
  total_tax_liability: number;
  potential_savings: number;
  compliance_updates_count: number;
  active_entities_count: number;
  smart_tax_calculator: string;
  tax_avoidance_recommendations: string[];
  automated_compliance_updates_guidance: string[];
  compliance_obligations_calendar: string[];
  tax_planning_advisory_support: string[];
  document_management_compliance_reporting: string[];
  audit_trail: string[];
}

export type TaxComplianceCreateData = Omit<TaxComplianceData, "id" | "created_at">;
export type TaxComplianceUpdateData = Partial<TaxComplianceCreateData>;

/**
 * Get all tax compliance records
 */
export async function getTaxComplianceRecords(): Promise<TaxComplianceData[]> {
  try {
    return await djangoGet<TaxComplianceData[]>("/api/tax/records/");
  } catch (error) {
    console.error("[Django API] Error fetching tax compliance records:", error);
    return [];
  }
}

/**
 * Get a specific tax compliance record by ID
 */
export async function getTaxCompliance(id: number): Promise<TaxComplianceData | null> {
  try {
    return await djangoGet<TaxComplianceData>(`/api/tax/records/${id}/`);
  } catch (error) {
    console.error(`[Django API] Error fetching tax compliance ${id}:`, error);
    return null;
  }
}

/**
 * Create a new tax compliance record
 */
export async function createTaxCompliance(data: TaxComplianceCreateData): Promise<TaxComplianceData | null> {
  try {
    return await djangoPost<TaxComplianceData>("/api/tax/records/", data);
  } catch (error) {
    console.error("[Django API] Error creating tax compliance:", error);
    return null;
  }
}

/**
 * Update an existing tax compliance record
 */
export async function updateTaxCompliance(id: number, data: TaxComplianceUpdateData): Promise<TaxComplianceData | null> {
  try {
    return await djangoPatch<TaxComplianceData>(`/api/tax/records/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating tax compliance ${id}:`, error);
    return null;
  }
}

/**
 * Delete a tax compliance record
 */
export async function deleteTaxCompliance(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/tax/records/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting tax compliance ${id}:`, error);
    return false;
  }
}
