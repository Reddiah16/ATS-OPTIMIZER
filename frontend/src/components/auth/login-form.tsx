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

export function LoginForm() {

  const { login } = useAuth();

  const router = useRouter();

  const searchParams =
    useSearchParams();

  const [apiError, setApiError] =
    useState<string | null>(null);

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