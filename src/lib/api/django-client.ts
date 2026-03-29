/**
 * Django API Client
 * Base client for making requests to the Django REST API
 *
 * Uses relative URLs so Vite's dev-server proxy (/api → Django) works
 * automatically. In production set VITE_API_BASE_URL to the real origin.
 */

const DJANGO_API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/** Pull the DRF auth token from localStorage (same key used by auth-context). */
function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Token ${token}` } : {};
}

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
      ...authHeaders(),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const rawBody = await response.text();
    let parsedBody: unknown = null;

    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        parsedBody = rawBody;
      }
    }

    if (!response.ok) {
      const errorMessage =
        (typeof parsedBody === "object" && parsedBody && "detail" in parsedBody && typeof parsedBody.detail === "string"
          ? parsedBody.detail
          : "") ||
        (typeof parsedBody === "object" && parsedBody && "message" in parsedBody && typeof parsedBody.message === "string"
          ? parsedBody.message
          : "") ||
        (typeof parsedBody === "object" && parsedBody
          ? Object.entries(parsedBody)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : String(value)}`)
              .join(" | ")
          : typeof parsedBody === "string"
            ? parsedBody
            : "") ||
        `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return (parsedBody ?? undefined) as T;
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
