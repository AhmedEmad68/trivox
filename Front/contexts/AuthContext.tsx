"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types";

// ─── We import only what we need — no NetworkError class dependency ──
import { setTokens, clearTokens, getAccessToken } from "@/services/api/client";
import { authService } from "@/services/api/auth";

/* ─── Types ──────────────────────────────────────────────────────── */
export interface RegisterData {
  email:      string;
  password:   string;
  first_name: string;
  last_name:  string;
  phone?:     string;
}

interface AuthState {
  user:       User | null;
  loading:    boolean;
  error:      string | null;
  isMockMode: boolean; // true = running without Django backend
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login:           (email: string, password: string) => Promise<void>;
  register:        (data: RegisterData) => Promise<void>;
  logout:          () => void;
  clearError:      () => void;
  refreshUser:     () => Promise<void>;
}

/* ─── Mock helpers ───────────────────────────────────────────────── */
// These let the app work fully without a Django backend running.
// When the API returns ERR_CONNECTION_REFUSED we fall into mock mode.
const MOCK_ACCESS  = "__trivox_mock_access__";
const MOCK_REFRESH = "__trivox_mock_refresh__";
const MOCK_USER_LS = "trivox_mock_user";

function makeMockUser(first: string, last: string, email: string): User {
  return {
    id:             999,
    email,
    first_name:     first,
    last_name:      last,
    date_joined:    new Date().toISOString(),
    bookings_count: 0,
  };
}

function persistMockUser(u: User)  {
  try { localStorage.setItem(MOCK_USER_LS, JSON.stringify(u)); } catch { /* ignore */ }
}

function restoreMockUser(): User | null {
  try {
    const raw = localStorage.getItem(MOCK_USER_LS);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch { return null; }
}

function removeMockUser() {
  try { localStorage.removeItem(MOCK_USER_LS); } catch { /* ignore */ }
}

/** Returns true when the current access token is a mock one */
function isMockToken() {
  return getAccessToken() === MOCK_ACCESS;
}

/**
 * Detect whether a fetch error is a network connectivity issue
 * (server down, ERR_CONNECTION_REFUSED, DNS failure, etc.)
 * We check the error message because different browsers word it differently.
 */
function isNetworkFailure(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes("failed to fetch")       || // Chrome
    msg.includes("networkerror")           || // Firefox
    msg.includes("network request failed") || // React Native / some envs
    msg.includes("err_connection_refused") ||
    msg.includes("cannot reach")          ||
    msg.includes("load failed")            // Safari
  );
}

/* ─── Context ────────────────────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue | null>(null);

/* ─── Provider ───────────────────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [state, setState] = useState<AuthState>({
    user:       null,
    loading:    true,
    error:      null,
    isMockMode: false,
  });

  /* ── Boot: check existing session ──────────────────────────────── */
  useEffect(() => {
    const init = async () => {
      const token = getAccessToken();

      // No token at all
      if (!token) {
        setState((s) => ({ ...s, loading: false }));
        return;
      }

      // Mock token from a previous offline session
      if (token === MOCK_ACCESS) {
        const mockUser = restoreMockUser();
        if (mockUser) {
          setState({ user: mockUser, loading: false, error: null, isMockMode: true });
        } else {
          clearTokens();
          setState((s) => ({ ...s, loading: false }));
        }
        return;
      }

      // Real token — try to fetch /auth/me/
      try {
        const user = await authService.me();
        setState({ user, loading: false, error: null, isMockMode: false });
      } catch (err) {
        if (isNetworkFailure(err)) {
          // API went down after login — keep user logged in with cached data
          const mockUser = restoreMockUser();
          if (mockUser) {
            setState({ user: mockUser, loading: false, error: null, isMockMode: true });
          } else {
            clearTokens();
            setState((s) => ({ ...s, loading: false }));
          }
        } else {
          // Token invalid / expired
          clearTokens();
          setState((s) => ({ ...s, loading: false }));
        }
      }
    };

    init();
  }, []);

  /* ── Login ──────────────────────────────────────────────────────── */
  const login = useCallback(
    async (email: string, password: string) => {
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        // Try real API first
        const tokens = await authService.login(email, password);
        setTokens(tokens.access, tokens.refresh);
        const user = await authService.me();
        setState({ user, loading: false, error: null, isMockMode: false });
        const redirect = new URLSearchParams(window.location.search).get("redirect") ?? "/dashboard";
        router.push(redirect);

      } catch (err) {
        if (isNetworkFailure(err)) {
          // ── Mock mode ─────────────────────────────────────────────
          // API is unreachable → accept any non-empty credentials
          if (!email.trim() || !password.trim()) {
            setState((s) => ({ ...s, loading: false, error: "Please enter your email and password." }));
            return;
          }
          // Build a demo user from the email address
          const parts    = email.split("@")[0].split(".");
          const mockUser = makeMockUser(
            capitalize(parts[0] ?? "Demo"),
            capitalize(parts[1] ?? "User"),
            email
          );
          setTokens(MOCK_ACCESS, MOCK_REFRESH);
          persistMockUser(mockUser);
          setState({ user: mockUser, loading: false, error: null, isMockMode: true });
          const redirect = new URLSearchParams(window.location.search).get("redirect") ?? "/dashboard";
          router.push(redirect);

        } else {
          const message = err instanceof Error ? err.message : "Invalid email or password.";
          setState((s) => ({ ...s, loading: false, error: message }));
        }
      }
    },
    [router]
  );

  /* ── Register ───────────────────────────────────────────────────── */
  const register = useCallback(
    async (data: RegisterData) => {
      setState((s) => ({ ...s, loading: true, error: null }));

      try {
        // Try real API first
        const { user, tokens } = await authService.register(data);
        setTokens(tokens.access, tokens.refresh);
        setState({ user, loading: false, error: null, isMockMode: false });
        const redirect = new URLSearchParams(window.location.search).get("redirect") ?? "/dashboard";
        router.push(redirect);

      } catch (err) {
        if (isNetworkFailure(err)) {
          // ── Mock mode ─────────────────────────────────────────────
          // No Django backend → create a local-only session
          const mockUser = makeMockUser(data.first_name, data.last_name, data.email);
          setTokens(MOCK_ACCESS, MOCK_REFRESH);
          persistMockUser(mockUser);
          setState({ user: mockUser, loading: false, error: null, isMockMode: true });
          const redirect = new URLSearchParams(window.location.search).get("redirect") ?? "/dashboard";
          router.push(redirect);

        } else {
          const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
          setState((s) => ({ ...s, loading: false, error: message }));
        }
      }
    },
    [router]
  );

  /* ── Logout ─────────────────────────────────────────────────────── */
  const logout = useCallback(() => {
    clearTokens();
    removeMockUser();
    setState({ user: null, loading: false, error: null, isMockMode: false });
    router.push("/");
  }, [router]);

  /* ── Refresh user from API ──────────────────────────────────────── */
  const refreshUser = useCallback(async () => {
    if (state.isMockMode) return; // nothing to refresh offline
    try {
      const user = await authService.me();
      setState((s) => ({ ...s, user }));
    } catch {
      // silent — non-critical
    }
  }, [state.isMockMode]);

  /* ── Clear error ────────────────────────────────────────────────── */
  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  const value: AuthContextValue = {
    ...state,
    isAuthenticated: !!state.user,
    login,
    register,
    logout,
    clearError,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ─── useAuth hook ───────────────────────────────────────────────── */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/* ─── withAuth HOC ───────────────────────────────────────────────── */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function Protected(props: P) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      }
    }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) return null;
    return <Component {...props} />;
  };
}

/* ─── Helpers ────────────────────────────────────────────────────── */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
