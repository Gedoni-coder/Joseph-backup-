const AUTH_API_BASE = "/api/auth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  company?: {
    company_name: string;
    description: string;
    number_of_workers: number;
    sector: string;
    company_size: string;
    country: string;
    state: string;
    city: string;
    website_url: string;
    phone: string;
  };
}

export interface LoginSignupResponse {
  user_id: string;
  email: string;
  name: string;
  message: string;
  has_company_profile: boolean;
  company_profile_id: number | null;
  company_name?: string;
}

export interface UserRecord {
  id: number;
  user_id: string;
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
  has_company_profile?: boolean;
  company_profile_id?: number | null;
}

export interface ResetPasswordRequest {
  password: string;
  passwordResetToken: string;
}

/**
 * Login with email and password - uses Django backend
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_BASE}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  // Create a simple token based on user ID
  const authToken = `django-token-${data.user_id}`;

  const user: UserRecord = {
    id: parseInt(data.user_id),
    user_id: data.user_id,
    created_at: new Date().toISOString(),
    name: data.name,
    email: data.email,
    is_authenticated: true,
    has_company_profile: data.has_company_profile || false,
    company_profile_id: data.company_profile_id || null,
  };

  return {
    authToken,
    user,
    has_company_profile: data.has_company_profile || false,
    company_profile_id: data.company_profile_id || null,
  };
}

/**
 * Signup with email and password - uses Django backend
 */
export async function signup(data: SignupRequest): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_BASE}/signup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      name: data.name,
      company: data.company,
    }),
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Signup failed");
  }

  // Create a simple token based on user ID
  const authToken = `django-token-${result.user_id}`;

  const user: UserRecord = {
    id: parseInt(result.user_id),
    user_id: result.user_id,
    created_at: new Date().toISOString(),
    name: result.name,
    email: result.email,
    is_authenticated: true,
    has_company_profile: result.has_company_profile || false,
    company_profile_id: null,
  };

  return {
    authToken,
    user,
    has_company_profile: result.has_company_profile || false,
  };
}

/**
 * Get the current user record
 */
export async function getMe(token: string): Promise<UserRecord> {
  const response = await fetch(`${AUTH_API_BASE}/me/`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to get user");
  }

  const data = await response.json();

  if (data.is_authenticated) {
    return {
      id: parseInt(data.user_id),
      user_id: data.user_id,
      created_at: new Date().toISOString(),
      name: data.name,
      email: data.email,
      is_authenticated: true,
      has_company_profile: data.has_company_profile || false,
      company_profile_id: data.company_profile_id || null,
      company_name: data.company_name || undefined,
    };
  }

  throw new Error("Not authenticated");
}

/**
 * Request password reset link
 */
export async function requestResetLink(email: string): Promise<void> {
  const response = await fetch(
    `${AUTH_API_BASE}/reset/request-reset-link?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.message || "Failed to request reset link");
    } catch (e) {
      throw new Error("Failed to request reset link");
    }
  }
}

/**
 * Update password using reset token
 */
export async function updatePassword(
  password: string,
  confirmPassword: string,
  token: string,
): Promise<void> {
  const response = await fetch(`${AUTH_API_BASE}/reset/update_password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      password,
      confirm_password: confirmPassword,
    }),
  });

  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.message || "Failed to update password");
    } catch (e) {
      throw new Error("Failed to update password");
    }
  }
}

/**
 * Login with magic token (password reset flow)
 */
export async function loginWithMagicToken(
  magicToken: string,
  email: string,
): Promise<AuthResponse> {
  const response = await fetch(`${AUTH_API_BASE}/reset/magic-link-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      magic_token: magicToken,
      email,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Magic link login failed");
  }

  const { authToken } = data;

  // Fetch full user details using the token
  const userDetails = await getMe(authToken);

  return {
    authToken,
    user: userDetails,
  };
}

/**
 * Logout (clear session)
 */
export function logout(): Promise<void> {
  return fetch(`${AUTH_API_BASE}/logout/`, {
    method: "POST",
    credentials: "include",
  }).then(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authTokenExpiry");
  });
}
