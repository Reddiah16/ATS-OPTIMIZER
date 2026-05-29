import { api } from "./client";
import { supabase } from "@/lib/supabase";
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types/auth";

export const authApi = {
  register: (data: RegisterCredentials) =>
    api.post<AuthResponse>("/auth/register", data),

  login: (data: LoginCredentials) =>
    api.post<AuthResponse>("/auth/login", data),

  getMe: () => api.get<User>("/auth/me"),

  googleAuth: async (): Promise<{ data: AuthResponse }> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) throw new Error("No Supabase session");
    return api.post<AuthResponse>("/auth/google", {}, {
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
  },
};