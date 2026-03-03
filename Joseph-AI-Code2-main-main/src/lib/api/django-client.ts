/**
 * Django API Client
 * Base client for making requests to the Django REST API
 */

const DJANGO_API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * Make a request to the Django API
 */
export async function djangoRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const url = `${DJANGO_API_BASE}${endpoint}`;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[Django API] Error making ${method} request to ${endpoint}:`, error);
    throw error;
  }
}

/**
 * GET request
 */
export async function djangoGet<T>(endpoint: string): Promise<T> {
  return djangoRequest<T>(endpoint, { method: "GET" });
}

/**
 * POST request
 */
export async function djangoPost<T>(endpoint: string, body: unknown): Promise<T> {
  return djangoRequest<T>(endpoint, { method: "POST", body });
}

/**
 * PUT request
 */
export async function djangoPut<T>(endpoint: string, body: unknown): Promise<T> {
  return djangoRequest<T>(endpoint, { method: "PUT", body });
}

/**
 * PATCH request
 */
export async function djangoPatch<T>(endpoint: string, body: unknown): Promise<T> {
  return djangoRequest<T>(endpoint, { method: "PATCH", body });
}

/**
 * DELETE request
 */
export async function djangoDelete<T>(endpoint: string): Promise<T> {
  return djangoRequest<T>(endpoint, { method: "DELETE" });
}
