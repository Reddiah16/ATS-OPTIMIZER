"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "./useAuth";

/**
 * Resolves the post-auth redirect destination.
 * Falls back to `/dashboard` when no `redirect` param is present or when
 * the value points outside the app (external URL).
 */
function useRedirectTarget(fallback = "/dashboard"): string {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "";
  return redirect.startsWith("/") ? redirect : fallback;
}

// ─── useLoginRedirect ─────────────────────────────────────────────────────────
/**
 * Wraps the auth context `login` call and automatically redirects on success.
 *
 * ```tsx
 * const { submit, isLoading, error } = useLoginRedirect();
 * await submit(email, password);
 * ```
 */
export function useLoginRedirect(fallback = "/dashboard") {
  const { login } = useAuth();
  const router = useRouter();
  const redirectTo = useRedirectTarget(fallback);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await login(email, password);
        router.push(redirectTo);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An error occurred";
        setError(message);
        throw err; // re-throw so form can also handle it
      } finally {
        setIsLoading(false);
      }
    },
    [login, router, redirectTo]
  );

  return { submit, isLoading, error, setError };
}

// ─── useRegisterRedirect ──────────────────────────────────────────────────────
/**
 * Wraps the auth context `register` call and automatically redirects on success.
 */
export function useRegisterRedirect(fallback = "/dashboard") {
  const { register } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (username: string, email: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await register(username, email, password);
        router.push(fallback);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An error occurred";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [register, router, fallback]
  );

  return { submit, isLoading, error, setError };
}
