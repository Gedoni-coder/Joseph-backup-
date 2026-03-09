/**
 * Business Feasibility Service
 * XANO DISCONNECTED - All API calls have been disabled
 * Functions return empty data only
 */

export interface BusinessFeasibilityData {
  id: number;
  created_at: string;
  account_id: number;
  business_idea_name: string;
  feasibility_score: number;
  market_feasibility: number;
  technical_feasibility: number;
  financial_feasibility: number;
  operational_feasibility: number;
  feasibility_status: string;
  executive_summary: string;
  market_analysis: string;
  competitive_analysis: string;
  technical_requirements: string[];
  financial_requirements: string[];
  operational_requirements: string[];
  risk_assessment: string;
  recommendations: string[];
  next_steps: string[];
  supporting_documents: string[];
}

export type BusinessFeasibilityCreateData = Omit<BusinessFeasibilityData, "id" | "created_at">;
export type BusinessFeasibilityUpdateData = Partial<BusinessFeasibilityCreateData>;

/**
 * Get all business feasibility records
 * XANO DISCONNECTED - Returns empty array
 */
export async function getBusinessFeasibilities(): Promise<BusinessFeasibilityData[]> {
  console.debug("[XANO DISCONNECTED] getBusinessFeasibilities blocked");
  return [];
}

/**
 * Get a specific business feasibility record by ID
 * XANO DISCONNECTED - Returns empty object
 */
export async function getBusinessFeasibility(id: number): Promise<BusinessFeasibilityData> {
  console.debug(`[XANO DISCONNECTED] getBusinessFeasibility blocked for ID: ${id}`);
  return {} as BusinessFeasibilityData;
}

/**
 * Create a new business feasibility record
 * XANO DISCONNECTED - Returns empty object
 */
export async function createBusinessFeasibility(data: BusinessFeasibilityCreateData): Promise<BusinessFeasibilityData> {
  console.debug("[XANO DISCONNECTED] createBusinessFeasibility blocked");
  return {} as BusinessFeasibilityData;
}

/**
 * Update an existing business feasibility record
 * XANO DISCONNECTED - Returns empty object
 */
export async function updateBusinessFeasibility(id: number, data: BusinessFeasibilityUpdateData): Promise<BusinessFeasibilityData> {
  console.debug(`[XANO DISCONNECTED] updateBusinessFeasibility blocked for ID: ${id}`);
  return {} as BusinessFeasibilityData;
}

/**
 * Delete a business feasibility record
 * XANO DISCONNECTED - Does nothing
 */
export async function deleteBusinessFeasibility(id: number): Promise<void> {
  console.debug(`[XANO DISCONNECTED] deleteBusinessFeasibility blocked for ID: ${id}`);
}
