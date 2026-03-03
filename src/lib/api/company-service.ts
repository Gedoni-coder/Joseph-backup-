const COMPANY_API_BASE = "/api/company";

export interface CompanyProfile {
  id?: number;
  company_name: string;
  description: string;
  number_of_workers: number;
  sector: string;
  company_size: "small" | "medium" | "enterprise";
  country: string;
  state: string;
  city: string;
  website_url?: string;
  email?: string;
  phone?: string;
  fiscal_year_end_date?: string;
  currency_format?: string;
  currency_preference?: string;
  logo?: string;
  language?: string;
  number_of_entities?: number;
  ai_summary?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get all company profiles for the current user
 */
export async function getCompanyProfiles(): Promise<CompanyProfile[]> {
  console.log("Fetching company profiles from:", `${COMPANY_API_BASE}/profiles/`);
  const response = await fetch(`${COMPANY_API_BASE}/profiles/`, {
    method: "GET",
    credentials: "include",
  });

  console.log("Response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response:", errorText);
    throw new Error(`Failed to fetch company profiles: ${response.status}`);
  }

  const data = await response.json();
  console.log("Company profiles data:", data);
  return data;
}

/**
 * Get a single company profile by ID
 */
export async function getCompanyProfile(id: number): Promise<CompanyProfile> {
  const response = await fetch(`${COMPANY_API_BASE}/profiles/${id}/`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch company profile");
  }

  return response.json();
}

/**
 * Create a new company profile
 */
export async function createCompanyProfile(
  data: CompanyProfile
): Promise<CompanyProfile> {
  const response = await fetch(`${COMPANY_API_BASE}/profiles/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create company profile");
  }

  return response.json();
}

/**
 * Update an existing company profile
 */
export async function updateCompanyProfile(
  id: number,
  data: Partial<CompanyProfile>
): Promise<CompanyProfile> {
  const response = await fetch(`${COMPANY_API_BASE}/profiles/${id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update company profile");
  }

  return response.json();
}

/**
 * Delete a company profile
 */
export async function deleteCompanyProfile(id: number): Promise<void> {
  const response = await fetch(`${COMPANY_API_BASE}/profiles/${id}/`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete company profile");
  }
}
