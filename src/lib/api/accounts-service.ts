const ACCOUNTS_API_BASE = import.meta.env.VITE_ACCOUNTS_API_BASE || "";

export interface CreateAccountRequest {
  companyName: string;
  description: string;
  numberOfWorkers: number;
  sector: string;
  companySize: "small" | "medium" | "enterprise";
  address: string;
  websiteUrl: string;
  email?: string;
  phone?: string;
  fiscalYearEndDate?: string;
  currencyPreference?: string;
  language?: string;
  numberOfEntities?: number;
  logo?: string;
}

export interface AccountDetails {
  id: string;
  companyName: string;
  description: string;
  numberOfWorkers: number;
  sector: string;
  companySize: "small" | "medium" | "enterprise";
  address: string;
  websiteUrl: string;
  email?: string;
  phone?: string;
  fiscalYearEndDate?: string;
  currencyPreference?: string;
  language?: string;
  numberOfEntities?: number;
  logo?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

export interface JoinAccountRequest {
  accountCode: string;
}

/**
 * Create a new account
 * The authenticated user becomes the admin/owner
 */
export async function createAccount(
  token: string,
  data: CreateAccountRequest,
): Promise<AccountDetails> {
  const response = await fetch(`${ACCOUNTS_API_BASE}/account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create account");
  }

  return response.json();
}

/**
 * Get account details
 */
export async function getAccountDetails(
  token: string,
): Promise<AccountDetails> {
  const response = await fetch(`${ACCOUNTS_API_BASE}/account/details`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch account details");
  }

  return response.json();
}

/**
 * Get team members of the same account
 */
export async function getTeamMembers(token: string): Promise<TeamMember[]> {
  const response = await fetch(`${ACCOUNTS_API_BASE}/account/my_team_members`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch team members");
  }

  return response.json();
}

/**
 * Join an existing account using account code
 */
export async function joinAccount(
  token: string,
  data: JoinAccountRequest,
): Promise<AccountDetails> {
  const response = await fetch(`${ACCOUNTS_API_BASE}/user/join_account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to join account");
  }

  return response.json();
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  token: string,
  data: { name?: string; email?: string },
): Promise<void> {
  const response = await fetch(`${ACCOUNTS_API_BASE}/user/edit_profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update profile");
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(
  token: string,
  userId: string,
  role: string,
): Promise<void> {
  const response = await fetch(`${ACCOUNTS_API_BASE}/admin/user_role`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ userId, role }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update user role");
  }
}
