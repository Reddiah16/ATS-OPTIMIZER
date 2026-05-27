import { Suspense } from "react";
import { type Metadata } from "next";
import { AuthLayout, RegisterForm } from "@/components/auth";
import { Spinner } from "@/components/loading";

export const metadata: Metadata = {
  title: "Create Account — ResumeIQ",
  description:
    "Create your free ResumeIQ account and start optimizing your resume with AI-powered ATS scoring and keyword analysis.",
  keywords: ["resume", "register", "ATS optimizer", "job search", "ResumeIQ"],
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <AuthLayout variant="register">
      <Suspense
        fallback={
          <div className="flex w-full max-w-md items-center justify-center py-16">
            <Spinner size="lg" label="Loading…" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}
