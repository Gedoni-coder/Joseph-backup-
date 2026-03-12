const AUTH_API_BASE = "/api/auth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface UserRecord {
  id: number;
  user_id: number;
  created_at: string;
  name: string;
  email: string;
  is_authenticated: boolean;
  has_company_profile: boolean;
  company_profile_id: number | null;
  company_name?: string;
}

export interface AuthResponse {
  authToken: string;
  user: UserRecord;
  has_company_profile: boolean;
  company_profile_id: number | null;
}

/**
 * Login with email and password — returns a real DRF token.
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_BASE}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  const user: UserRecord = {
    id: data.user_id,
    user_id: data.user_id,
    created_at: new Date().toISOString(),
    name: data.name,
    email: data.email,
    is_authenticated: true,
    has_company_profile: data.has_company_profile ?? false,
    company_profile_id: data.company_profile_id ?? null,
    company_name: data.company_name ?? undefined,
  };

  return {
    authToken: data.authToken,
    user,
    has_company_profile: data.has_company_profile ?? false,
    company_profile_id: data.company_profile_id ?? null,
  };
}

/**
 * Signup with email, password and name — returns a real DRF token.
 */
export async function signup(req: SignupRequest): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_BASE}/signup/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: req.email,
      password: req.password,
      name: req.name,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Signup failed");
  }

  const user: UserRecord = {
    id: data.user_id,
    user_id: data.user_id,
    created_at: new Date().toISOString(),
    name: data.name,
    email: data.email,
    is_authenticated: true,
    has_company_profile: data.has_company_profile ?? false,
    company_profile_id: data.company_profile_id ?? null,
    company_name: data.company_name ?? undefined,
  };

  return {
    authToken: data.authToken,
    user,
    has_company_profile: data.has_company_profile ?? false,
    company_profile_id: data.company_profile_id ?? null,
  };
}

/**
 * Fetch current user details using the stored token.
 */
export async function getMe(token: string): Promise<UserRecord> {
  const response = await fetch(`${AUTH_API_BASE}/me/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user");
  }

  const data = await response.json();

  if (!data.is_authenticated) {
    throw new Error("Not authenticated");
  }

  return {
    id: data.user_id,
    user_id: data.user_id,
    created_at: new Date().toISOString(),
    name: data.name,
    email: data.email,
    is_authenticated: true,
    has_company_profile: data.has_company_profile ?? false,
    company_profile_id: data.company_profile_id ?? null,
    company_name: data.company_name ?? undefined,
  };
}

/**
 * Logout — tells the backend to delete the token.
 */
export async function logout(): Promise<void> {
  const token = localStorage.getItem("authToken");
  try {
    await fetch(`${AUTH_API_BASE}/logout/`, {
      method: "POST",
      headers: token ? { Authorization: `Token ${token}` } : {},
    });
  } catch {
    // Swallow network errors — we still clear local storage below
  }
  localStorage.removeItem("authToken");
  localStorage.removeItem("authTokenExpiry");
}
