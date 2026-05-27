"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { SonnerToaster } from "./sonner-toaster";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        {children}
        <SonnerToaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
