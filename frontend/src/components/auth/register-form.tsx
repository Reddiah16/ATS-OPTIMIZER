"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Mail, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/api";
import { notify } from "@/lib/toast";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validations/auth";
import { AuthCard } from "./auth-card";
import { AuthFormField } from "./auth-form-field";
import { FormErrorAlert } from "./form-error-alert";
import { PasswordStrengthMeter } from "./password-strength-meter";
import { SocialLoginButtons } from "./social-login-buttons";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
    mode: "onChange",
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    setApiError(null);
    try {
      await registerUser(data.username, data.email, data.password);
      notify.success("Account created! Let's optimize your resume. 🚀");
      router.push("/dashboard");
    } catch (err) {
      const message = getErrorMessage(err);
      setApiError(message);
      notify.error(message);
    }
  };

  return (
    <AuthCard className="w-full max-w-md lg:max-w-none" showLogo={false}>
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-display text-2xl font-bold text-foreground">
          Create your account
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Get started in under a minute — it&apos;s free
        </p>
      </div>

      {/* Form */}
      <form
        id="register-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormErrorAlert message={apiError} />

        <AuthFormField
          control={control}
          name="username"
          label="Username"
          placeholder="johndoe"
          icon={User}
          autoComplete="username"
          disabled={isSubmitting}
          hint="Letters, numbers, underscores"
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

        <div className="space-y-2">
          <AuthFormField
            control={control}
            name="password"
            label="Password"
            type="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            disabled={isSubmitting}
          />
          <PasswordStrengthMeter password={password} />
        </div>

        {/* Terms */}
        <p className="text-xs leading-relaxed text-muted-foreground/80">
          By creating an account you agree to our{" "}
          <Link href="#" className="text-primary/80 hover:text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary/80 hover:text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>

        <Button
          type="submit"
          form="register-form"
          id="register-submit-btn"
          disabled={isSubmitting}
          className="h-11 w-full gap-2 bg-gradient-to-r from-brand-600 to-violet-600 text-white font-semibold shadow-[0_4px_20px_hsl(243_75%_59%/0.35)] hover:shadow-[0_4px_28px_hsl(243_75%_59%/0.5)] hover:opacity-95 transition-all duration-200 active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Creating account…
            </>
          ) : (
            <>
              Create Account
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-5 text-center text-sm text-muted-foreground"
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline underline-offset-2 transition-colors"
        >
          Sign in
        </Link>
      </motion.p>
    </AuthCard>
  );
}
