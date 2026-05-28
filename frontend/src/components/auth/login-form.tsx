"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowRight,
  Loader2,
  Mail,
} from "lucide-react";

import { motion } from "framer-motion";

import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/api";
import { notify } from "@/lib/toast";

import {
  loginSchema,
  type LoginFormValues,
} from "@/lib/validations/auth";

import { AuthCard } from "./auth-card";
import { AuthFormField } from "./auth-form-field";
import { FormErrorAlert } from "./form-error-alert";

import { Button } from "@/components/ui/button";

import { supabase } from "@/lib/supabase";

export function LoginForm() {

  const { login } = useAuth();

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const [apiError, setApiError] =
    useState<string | null>(null);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  const {
    control,
    handleSubmit,

    formState: {
      isSubmitting,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  // =========================
  // EMAIL LOGIN
  // =========================

  const onSubmit = async (
    data: LoginFormValues
  ) => {

    setApiError(null);

    try {

      await login(
        data.email,
        data.password
      );

      notify.success(
        "Welcome back! 👋"
      );

      const redirect =
        searchParams.get(
          "redirect"
        );

      router.push(
        redirect &&
        redirect.startsWith("/")
          ? redirect
          : "/dashboard"
      );

    } catch (err) {

      const message =
        getErrorMessage(err);

      setApiError(message);

      notify.error(message);
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================

  const handleGoogleLogin =
    async () => {

      try {

        setGoogleLoading(true);

        const { error } =
          await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
  },
});

        if (error) {

          console.error(error);

          notify.error(
            "Google login failed"
          );
        }

      } catch (err) {

        console.error(err);

        notify.error(
          "Something went wrong"
        );

      } finally {

        setGoogleLoading(false);
      }
    };

  return (
    <AuthCard className="w-full max-w-md">

      {/* HEADER */}

      <div className="mb-7">

        <h1 className="font-display text-2xl font-bold text-foreground">

          Welcome back
        </h1>

        <p className="mt-1.5 text-sm text-muted-foreground">

          Sign in to your ResumeIQ account
        </p>
      </div>

      {/* FORM */}

      <form
        id="login-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >

        <FormErrorAlert
          message={apiError}
        />

        <AuthFormField
          control={control}
          name="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          icon={Mail}
          autoComplete="email"
          disabled={isSubmitting}
        />

        <div className="space-y-1">

          <AuthFormField
            control={control}
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isSubmitting}
          />

          <div className="flex justify-end">

            <Link
              href="#"

              onClick={(e) => {

                e.preventDefault();

                notify.info(
                  "Password reset coming soon 🔜"
                );
              }}

              className="text-[11px] font-medium text-primary/80 hover:text-primary hover:underline transition-colors"
            >

              Forgot password?
            </Link>
          </div>
        </div>

        {/* EMAIL LOGIN BUTTON */}

        <Button
          type="submit"
          form="login-form"
          id="login-submit-btn"
          disabled={isSubmitting}

          className="mt-2 h-11 w-full gap-2 bg-gradient-to-r from-brand-600 to-violet-600 text-white font-semibold shadow-[0_4px_20px_hsl(243_75%_59%/0.35)] hover:shadow-[0_4px_28px_hsl(243_75%_59%/0.5)] hover:opacity-95 transition-all duration-200 active:scale-[0.99]"
        >

          {isSubmitting ? (
            <>

              <Loader2
                size={17}
                className="animate-spin"
              />

              Signing in…
            </>
          ) : (
            <>
              Sign In

              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>

      {/* DIVIDER */}

      <div className="relative my-6">

        <div className="absolute inset-0 flex items-center">

          <span className="w-full border-t border-border/60" />
        </div>

        <div className="relative flex justify-center">

          <span className="bg-transparent px-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/60">

            or continue with
          </span>
        </div>
      </div>

      {/* GOOGLE BUTTON */}

      <button
        onClick={handleGoogleLogin}
        disabled={googleLoading}

        className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white hover:bg-white/10 transition-all"
      >

        {googleLoading ? (
          <>

            <Loader2
              size={18}
              className="animate-spin"
            />

            Connecting...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 48 48"
            >

              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
              />

              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
              />

              <path
                fill="#4CAF50"
                d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
              />

              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.2-6.3 6.6l6.3 5.2C39.5 36.5 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"
              />
            </svg>

            Continue with Google
          </>
        )}
      </button>

      {/* FOOTER */}

      <motion.p
        initial={{ opacity: 0 }}

        animate={{ opacity: 1 }}

        transition={{ delay: 0.3 }}

        className="mt-6 text-center text-sm text-muted-foreground"
      >

        Don&apos;t have an account?{" "}

        <Link
          href="/register"

          className="font-semibold text-primary hover:underline underline-offset-2 transition-colors"
        >

          Create one free
        </Link>
      </motion.p>
    </AuthCard>
  );
}