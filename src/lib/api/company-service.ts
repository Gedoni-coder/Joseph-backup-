const COMPANY_API_BASE = "/api/company";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("authToken");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Token ${token}`;
  }
  return headers;
}

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
  const response = await fetch(`${COMPANY_API_BASE}/profiles/`, {
    method: "GET",
    headers: { ...authHeaders() },
  });

  // Treat unauthenticated requests as "no profile yet" so pages can load.
  if (response.status === 401 || response.status === 403) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch company profiles: ${response.status}`);
  }

  const data = await response.json();
  // DRF may wrap results in { results: [...] } when paginated
  return Array.isArray(data) ? data : data.results ?? [];
}

/**
 * Get a single company profile by ID
 */
export async function getCompanyProfile(id: number): Promise<CompanyProfile> {
  const response = await fetch(`${COMPANY_API_BASE}/profiles/${id}/`, {
    method: "GET",
    headers: { ...authHeaders() },
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
      ...authHeaders(),
    },
    body: JSON.stringify(data),
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
      ...authHeaders(),
    },
    body: JSON.stringify(data),
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
    headers: { ...authHeaders() },
  });

  if (!response.ok) {
    throw new Error("Failed to delete company profile");
  }
}
