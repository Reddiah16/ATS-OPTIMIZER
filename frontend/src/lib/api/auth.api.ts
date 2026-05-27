import { api } from "./client";
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types/auth";

export const authApi = {
  register: (data: RegisterCredentials) =>
    api.post<AuthResponse>("/auth/register", data),

  login: (data: LoginCredentials) =>
    api.post<AuthResponse>("/auth/login", data),

  getMe: () => api.get<User>("/auth/me"),
};
