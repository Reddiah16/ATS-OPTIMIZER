import Cookies from "js-cookie";

// ─── Constants ───────────────────────────────────────────────────────────────
export const AUTH_TOKEN_KEY = "access_token";
export const AUTH_TOKEN_EXPIRY_DAYS = 1;

// ─── Types ───────────────────────────────────────────────────────────────────
interface JwtPayload {
  sub?: string;
  exp?: number;
  iat?: number;
  email?: string;
  username?: string;
}

// ─── Cookie options ───────────────────────────────────────────────────────────
const cookieOptions = {
  expires: AUTH_TOKEN_EXPIRY_DAYS,
  sameSite: "lax" as const,
  secure: typeof window !== "undefined" ? window.location.protocol === "https:" : process.env.NODE_ENV === "production",
  path: "/",
};

// ─── Cookie-based storage (SSR-safe, used by middleware) ─────────────────────
export function getAccessToken(): string | undefined {
  return Cookies.get(AUTH_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  Cookies.set(AUTH_TOKEN_KEY, token, cookieOptions);
  // Mirror to localStorage for client-side convenience
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch {
      // localStorage unavailable (private mode, etc.) — silently continue
    }
  }
}

export function clearAccessToken(): void {
  Cookies.remove(AUTH_TOKEN_KEY);
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {
      // ignore
    }
  }
}

export function hasAccessToken(): boolean {
  return Boolean(getAccessToken());
}

// ─── localStorage utilities ───────────────────────────────────────────────────
/** Read the raw JWT string directly from localStorage (client-only). */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Persist token to localStorage only (does NOT set the cookie). */
export function storeToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // ignore
  }
}

/** Remove token from localStorage only. */
export function removeStoredToken(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore
  }
}

// ─── JWT decode helpers ───────────────────────────────────────────────────────
/**
 * Decode a JWT payload (no signature verification — client-side display only).
 * Returns null when the token is absent or malformed.
 */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Returns true when the JWT is present and not yet expired
 * (with a 30-second buffer to avoid race conditions).
 */
export function isTokenValid(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload) return false; // malformed token is invalid
  if (!payload.exp) return true; // no expiry claim → treat as valid
  const bufferSeconds = 30;
  return Date.now() / 1000 < payload.exp - bufferSeconds;
}

/** Extract the token expiration date (or null if unavailable). */
export function getTokenExpiry(): Date | null {
  const token = getAccessToken();
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return null;
  return new Date(payload.exp * 1000);
}
