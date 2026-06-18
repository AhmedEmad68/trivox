// ═══════════════════════════════════════════════════════════════════
// TRIVOX — API Service Layer
// ═══════════════════════════════════════════════════════════════════

// Server-side code (SSR / `next build`) runs inside the container and must
// reach the backend over the internal Docker network (e.g. http://backend:8000);
// `localhost` there points at the frontend container itself. Browser code uses
// the public URL baked in at build time. Both fall back to localhost for plain
// `npm run dev`.
const API_BASE_URL =
  typeof window === "undefined"
    ? process.env.INTERNAL_API_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:8000/api/v1"
    : process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ─── TYPES ────────────────────────────────────────────────────────
interface RequestOptions extends RequestInit {
  params?:  Record<string, string | number | boolean | undefined>;
  noAuth?:  boolean;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Thrown when the server is unreachable (no internet / server down) */
export class NetworkError extends Error {
  constructor(public originalError: unknown) {
    super(
      "Cannot reach the server. " +
      "Make sure your Django backend is running on " +
      API_BASE_URL.replace("/api/v1", "") +
      "."
    );
    this.name = "NetworkError";
  }
}

// ─── TOKEN HELPERS ────────────────────────────────────────────────
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("trivox_access_token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("trivox_refresh_token");
}

export function setTokens(access: string, refresh: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("trivox_access_token", access);
  localStorage.setItem("trivox_refresh_token", refresh);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("trivox_access_token");
  localStorage.removeItem("trivox_refresh_token");
}

// ─── CHECK IF API IS REACHABLE ────────────────────────────────────
/**
 * Quick connectivity check — used by auth to decide whether to fall
 * back to mock mode. Returns true if the server responds at all.
 */
export async function isApiReachable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    await fetch(`${API_BASE_URL}/trips/`, {
      method: "HEAD",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return true;
  } catch {
    return false;
  }
}

// ─── TOKEN REFRESH ────────────────────────────────────────────────
async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      clearTokens();
      return null;
    }

    const data = await res.json();
    setTokens(data.access, refresh);
    return data.access;
  } catch {
    clearTokens();
    return null;
  }
}

// ─── CORE FETCH WRAPPER ───────────────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, noAuth = false, ...fetchOptions } = options;

  // Build URL
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const filtered = Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== ""
    );
    if (filtered.length > 0) {
      const qs = new URLSearchParams(
        filtered.map(([k, v]) => [k, String(v)])
      ).toString();
      url = `${url}?${qs}`;
    }
  }

  // Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (!noAuth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  // On the server (SSR / `next build` static generation) the backend may be
  // unreachable — and an unreachable host can *hang* rather than refuse fast,
  // which would stall `next build` until Next's 60s page-generation timeout
  // and fail the build. Bound server-side requests with a short timeout so the
  // caller's try/catch fallback (mock / FALLBACK data) kicks in quickly.
  const isServer = typeof window === "undefined";
  const timeoutMs = Number(process.env.SSR_FETCH_TIMEOUT_MS ?? 5000);
  const controller = isServer && !fetchOptions.signal ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  // Execute request — catch network-level failures separately
  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
      ...(controller ? { signal: controller.signal } : {}),
    });
  } catch (networkErr) {
    // ERR_CONNECTION_REFUSED, DNS failure, timeout/abort, etc.
    throw new NetworkError(networkErr);
  } finally {
    if (timer) clearTimeout(timer);
  }

  // Auto-refresh on 401
  if (response.status === 401 && !noAuth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      try {
        response = await fetch(url, { ...fetchOptions, headers });
      } catch (networkErr) {
        throw new NetworkError(networkErr);
      }
    } else {
      if (typeof window !== "undefined") {
        window.location.href =
          "/login?redirect=" + encodeURIComponent(window.location.pathname);
      }
      throw new ApiError(401, "Authentication required");
    }
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.detail ??
      data?.message ??
      data?.error ??
      `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message, data);
  }

  return data as T;
}

// ─── HTTP METHOD HELPERS ─────────────────────────────────────────
export const api = {
  get<T>(endpoint: string, options?: RequestOptions) {
    return apiFetch<T>(endpoint, { method: "GET", ...options, next: { revalidate: 60 } });
  },
  post<T>(endpoint: string, body: unknown, options?: RequestOptions) {
    return apiFetch<T>(endpoint, { method: "POST", body: JSON.stringify(body), ...options, cache: "no-store" });
  },
  put<T>(endpoint: string, body: unknown, options?: RequestOptions) {
    return apiFetch<T>(endpoint, { method: "PUT", body: JSON.stringify(body), ...options, cache: "no-store" });
  },
  patch<T>(endpoint: string, body: unknown, options?: RequestOptions) {
    return apiFetch<T>(endpoint, { method: "PATCH", body: JSON.stringify(body), ...options, cache: "no-store" });
  },
  delete<T>(endpoint: string, options?: RequestOptions) {
    return apiFetch<T>(endpoint, { method: "DELETE", ...options, cache: "no-store" });
  },
};
