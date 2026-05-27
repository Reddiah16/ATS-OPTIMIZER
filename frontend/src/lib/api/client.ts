import axios, { type AxiosError, type AxiosInstance } from "axios";
import {
  AUTH_TOKEN_KEY,
  clearAccessToken,
  getAccessToken,
} from "@/lib/auth";
import type { ApiErrorBody } from "@/types/api";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// ─── Axios instance ───────────────────────────────────────────────────────────
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60_000,
  withCredentials: false,
});

// ─── Request interceptor — attach Bearer token ────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — handle 401 globally ──────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.status === 401) {
      clearAccessToken();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login") &&
        !window.location.pathname.startsWith("/register")
      ) {
        const redirect = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?redirect=${redirect}`;
      }
    }
    return Promise.reject(error);
  }
);

// ─── Error message extractor ──────────────────────────────────────────────────
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorBody | undefined;

    // FastAPI-style string detail
    if (typeof data?.detail === "string") return data.detail;

    // FastAPI-style validation errors array (detail is an array)
    if (Array.isArray(data?.detail)) {
      const first = (data.detail as Array<{ msg?: string }>)[0];
      if (first?.msg) return first.msg;
    }

    // Custom errors array
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors[0]?.message ?? "Validation error";
    }

    // Network / timeout
    if (error.code === "ECONNABORTED") return "Request timed out. Please try again.";
    if (!error.response) return "Network error — please check your connection.";

    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export { AUTH_TOKEN_KEY };
