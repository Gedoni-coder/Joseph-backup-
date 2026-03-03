/**
 * Xano API Client
 * DISCONNECTED - All APIs have been disabled to prevent any calls to xano
 * All functions now return empty data immediately
 */

interface XanoRequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * Make a request to the Xano API - DISABLED
 * Returns empty data without making any API calls
 */
export async function xanoRequest<T>(
  endpoint: string,
  options: XanoRequestOptions = {},
): Promise<T> {
  // ALL XANO API CALLS DISABLED - Return empty data immediately
  console.debug(`[XANO DISCONNECTED] Request blocked for endpoint: ${endpoint}`);
  return [] as unknown as T;
}

/**
 * GET request to Xano API
 */
export async function xanoGet<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
): Promise<T> {
  return xanoRequest<T>(endpoint, {
    method: "GET",
    params,
  });
}

/**
 * POST request to Xano API
 */
export async function xanoPost<T>(endpoint: string, data: unknown): Promise<T> {
  return xanoRequest<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * PATCH request to Xano API
 */
export async function xanoPatch<T>(
  endpoint: string,
  data: unknown,
): Promise<T> {
  return xanoRequest<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request to Xano API
 */
export async function xanoDelete(endpoint: string): Promise<void> {
  return xanoRequest(endpoint, {
    method: "DELETE",
  });
}
