"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/lib/api";
import {
  clearAccessToken,
  getAccessToken,
  isTokenValid,
  setAccessToken,
} from "@/lib/auth";
import type { AuthContextValue, AuthResponse, User } from "@/types/auth";

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  // ── Hydrate user from stored token on mount ───────────────────────────────
  const refreshUser = useCallback(async () => {
    if (!isTokenValid()) {
      if (mountedRef.current) {
        setUser(null);
      }
      return;
    }
    try {
      const { data } = await authApi.getMe();
      if (mountedRef.current) {
        setUser(data);
        setAuthError(null);
      }
    } catch {
      if (mountedRef.current) {
        clearAccessToken();
        setUser(null);
      }
      throw new Error("Session expired. Please sign in again.");
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    refreshUser()
      .catch((err: unknown) => {
        if (mountedRef.current) {
          setAuthError(err instanceof Error ? err.message : "Auth error");
        }
      })
      .finally(() => {
        if (mountedRef.current) setIsLoading(false);
      });

    return () => {
      mountedRef.current = false;
    };
  }, [refreshUser]);

  // ── Session helpers ───────────────────────────────────────────────────────
  const persistSession = useCallback((data: AuthResponse) => {
    setAccessToken(data.access_token);
    setUser(data.user);
    setAuthError(null);
  }, []);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setAuthError(null);
      const { data } = await authApi.login({ email, password });
      persistSession(data);
    },
    [persistSession]
  );

  const register = useCallback(
    async (username: string, email: string, password: string): Promise<void> => {
      setAuthError(null);
      const { data } = await authApi.register({ username, email, password });
      persistSession(data);
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
    setAuthError(null);
    // Hard navigate to flush any cached protected state
    window.location.href = "/login";
  }, []);

  // ── Memoised value ────────────────────────────────────────────────────────
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      authError,
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, authError, login, register, logout, refreshUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}

/** Expose raw context ref (for advanced consumers). */
export function AuthContextConsumer() {
  return AuthContext;
}
