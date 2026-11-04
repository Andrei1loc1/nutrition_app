/**
 * Unified HTTP client for all internal API calls.
 * Automatically injects X-User-ID from localStorage if available.
 * Centralizes error handling and response parsing.
 */

async function getAuthHeaders(): Promise<Record<string, string>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("neurosnap_user");
    if (!raw) return {};
    const user = JSON.parse(raw);
    return user?.id ? { "X-User-ID": user.id } : {};
  } catch {
    return {};
  }
}

class ApiError extends Error {
  status: number;
  detail?: string;

  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const authHeaders = await getAuthHeaders();

  const headers: Record<string, string> = {
    ...(authHeaders ?? {}),
    ...(options.headers as Record<string, string> ?? {}),
  };

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let detail: string | undefined;
    try {
      const payload = await res.clone().json();
      detail = payload.detail ?? payload.error ?? payload.message ?? "";
    } catch {
      try {
        detail = await res.text();
      } catch {
        detail = undefined;
      }
    }
    throw new ApiError(
      `Request failed: ${res.status} ${res.statusText}`,
      res.status,
      detail
    );
  }

  return res.json();
}

export { apiFetch, ApiError };
