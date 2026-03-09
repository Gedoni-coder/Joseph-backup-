/**
 * Loan & Funding Service
 * Connected to Django REST API
 */

import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "./django-client";

export interface LoanFundingData {
  id: number;
  created_at: string;
  account_id: number;
  funding_required: number;
  total_opportunities: number;
  qualified_opportunities: number;
  approval_probability: number;
  average_interest_rate: number;
  funding_sources: string[];
  loan_options: string[];
  grant_opportunities: string[];
  investor_match_scores: string[];
  application_requirements: string[];
  success_factors: string[];
  risk_assessment: string[];
  recommended_strategy: string[];
}

export type LoanFundingCreateData = Omit<LoanFundingData, "id" | "created_at">;
export type LoanFundingUpdateData = Partial<LoanFundingCreateData>;

/**
 * Get all loan and funding records
 */
export async function getLoanFundingRecords(): Promise<LoanFundingData[]> {
  try {
    return await djangoGet<LoanFundingData[]>("/api/loan/eligibility/");
  } catch (error) {
    console.error("[Django API] Error fetching loan funding records:", error);
    return [];
  }
}

/**
 * Get a specific loan and funding record by ID
 */
export async function getLoanFunding(id: number): Promise<LoanFundingData | null> {
  try {
    return await djangoGet<LoanFundingData>(`/api/loan/eligibility/${id}/`);
  } catch (error) {
    console.error(`[Django API] Error fetching loan funding ${id}:`, error);
    return null;
  }
}

/**
 * Create a new loan and funding record
 */
export async function createLoanFunding(data: LoanFundingCreateData): Promise<LoanFundingData | null> {
  try {
    return await djangoPost<LoanFundingData>("/api/loan/eligibility/", data);
  } catch (error) {
    console.error("[Django API] Error creating loan funding:", error);
    return null;
  }
}

/**
 * Update an existing loan and funding record
 */
export async function updateLoanFunding(id: number, data: LoanFundingUpdateData): Promise<LoanFundingData | null> {
  try {
    return await djangoPatch<LoanFundingData>(`/api/loan/eligibility/${id}/`, data);
  } catch (error) {
    console.error(`[Django API] Error updating loan funding ${id}:`, error);
    return null;
  }
}

/**
 * Delete a loan and funding record
 */
export async function deleteLoanFunding(id: number): Promise<boolean> {
  try {
    await djangoDelete(`/api/loan/eligibility/${id}/`);
    return true;
  } catch (error) {
    console.error(`[Django API] Error deleting loan funding ${id}:`, error);
    return false;
  }
}
