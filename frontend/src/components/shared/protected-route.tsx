"use client";

import { useEffect, type ComponentType } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { PageLoader } from "@/components/loading/page-loader";

// ─── ProtectedRoute wrapper ───────────────────────────────────────────────────
type ProtectedRouteProps = {
  children: React.ReactNode;
  /** Custom fallback URL when not authenticated (default: /login). */
  redirectTo?: string;
};

/**
 * Renders children only when authenticated.
 * Shows a full-page loader while the session is being hydrated.
 * Redirects to /login (with `redirect` param) when unauthenticated.
 */
export function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      const redirect = encodeURIComponent(pathname);
      router.replace(`${redirectTo}?redirect=${redirect}`);
    }
  }, [user, isLoading, router, pathname, redirectTo]);

  if (isLoading) {
    return <PageLoader label="Loading your workspace…" />;
  }

  if (!user) {
    // Render loading state while redirect fires
    return <PageLoader label="Redirecting to login…" />;
  }

  return <>{children}</>;
}

// ─── withAuth HOC ─────────────────────────────────────────────────────────────
/**
 * Higher-order component that wraps a page/component with auth protection.
 *
 * ```tsx
 * export default withAuth(DashboardPage);
 * ```
 */
export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  redirectTo?: string
): ComponentType<P> {
  const AuthGuard = (props: P) => (
    <ProtectedRoute redirectTo={redirectTo}>
      <WrappedComponent {...props} />
    </ProtectedRoute>
  );
  AuthGuard.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"})`;
  return AuthGuard;
}
