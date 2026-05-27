export {
  api,
  authApi,
  resumeApi,
  analysisApi,
  getErrorMessage,
  API_URL,
} from "./api";

export {
  AUTH_TOKEN_KEY,
  // Cookie-based (SSR-safe)
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  hasAccessToken,
  // localStorage-only utilities
  getStoredToken,
  storeToken,
  removeStoredToken,
  // JWT decode helpers
  decodeJwtPayload,
  isTokenValid,
  getTokenExpiry,
} from "./auth";

export { notify } from "./toast";
export { cn } from "./utils";
