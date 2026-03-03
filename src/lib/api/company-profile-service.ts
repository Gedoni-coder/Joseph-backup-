/**
 * Company Profile Service
 * XANO DISCONNECTED - All API calls have been disabled
 * Functions return empty data only
 */

export interface CompanyLogoFile {
  access: string;
  path: string;
  name: string;
  type: string;
  size: number;
  mime: string;
  meta: Record<string, unknown>;
  url?: string;
}

export interface CompanyProfileData {
  id: number;
  created_at: string;
  account_id: number;
  company_name: string;
  company_description: string;
  number_of_workers: number;
  sector: string;
  company_size: string;
  country: string;
  state_province: string;
  city: string;
  website_url: string;
  email_address: string;
  phone_number: string;
  fiscal_year_end_date: string;
  currency_preference: string;
  preferred_language: string;
  number_of_business_entities_subsidiaries: number;
  company_logo: CompanyLogoFile;
}

export type CompanyProfileCreateData = Omit<CompanyProfileData, "id" | "created_at">;
export type CompanyProfileUpdateData = Partial<CompanyProfileCreateData>;

/**
 * Get all company profiles
 * XANO DISCONNECTED - Returns empty array
 */
export async function getCompanyProfiles(): Promise<CompanyProfileData[]> {
  console.debug("[XANO DISCONNECTED] getCompanyProfiles blocked");
  return [];
}

/**
 * Get a specific company profile by ID
 * XANO DISCONNECTED - Returns empty object
 */
export async function getCompanyProfile(id: number): Promise<CompanyProfileData> {
  console.debug(`[XANO DISCONNECTED] getCompanyProfile blocked for ID: ${id}`);
  return {} as CompanyProfileData;
}

/**
 * Create a new company profile
 * XANO DISCONNECTED - Returns empty object
 */
export async function createCompanyProfile(data: CompanyProfileCreateData): Promise<CompanyProfileData> {
  console.debug("[XANO DISCONNECTED] createCompanyProfile blocked");
  return {} as CompanyProfileData;
}

/**
 * Update an existing company profile
 * XANO DISCONNECTED - Returns empty object
 */
export async function updateCompanyProfile(id: number, data: CompanyProfileUpdateData): Promise<CompanyProfileData> {
  console.debug(`[XANO DISCONNECTED] updateCompanyProfile blocked for ID: ${id}`);
  return {} as CompanyProfileData;
}

/**
 * Delete a company profile
 * XANO DISCONNECTED - Does nothing
 */
export async function deleteCompanyProfile(id: number): Promise<void> {
  console.debug(`[XANO DISCONNECTED] deleteCompanyProfile blocked for ID: ${id}`);
}
