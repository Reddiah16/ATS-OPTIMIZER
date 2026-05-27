import { Suspense } from "react";
import { type Metadata } from "next";

import {
  AuthLayout,
  LoginForm,
} from "@/components/auth";

import { Spinner } from "@/components/loading";

export const metadata: Metadata = {
  title: "Sign In — ResumeIQ",

  description:
    "Sign in to your ResumeIQ account to access AI-powered resume optimization, ATS scoring, and keyword gap analysis.",

  keywords: [
    "resume",
    "login",
    "ATS optimizer",
    "job search",
    "ResumeIQ",
  ],

  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {

  return (
    <AuthLayout variant="login">

      <Suspense
        fallback={

          <div className="flex w-full max-w-md items-center justify-center py-16">

            <Spinner
              size="lg"
              label="Loading…"
            />
          </div>
        }
      >

        <LoginForm />

      </Suspense>
    </AuthLayout>
  );
}