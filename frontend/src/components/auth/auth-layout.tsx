"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  Target,
  Brain,
  BarChart3,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Shield,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

// ─── Content data ─────────────────────────────────────────────────────────────
const LOGIN_HIGHLIGHTS = [
  {
    icon: Target,
    title: "Instant ATS Scoring",
    text: "Get a full breakdown with keyword density analysis",
    color: "from-brand-500/20 to-brand-600/10",
    iconColor: "text-brand-400",
  },
  {
    icon: Brain,
    title: "AI-Powered Rewrites",
    text: "Smart bullet point improvements tailored to each role",
    color: "from-violet-500/20 to-violet-600/10",
    iconColor: "text-violet-400",
  },
  {
    icon: BarChart3,
    title: "Keyword Gap Analysis",
    text: "See exactly what's missing vs. the job description",
    color: "from-indigo-500/20 to-indigo-600/10",
    iconColor: "text-indigo-400",
  },
];

const REGISTER_PERKS = [
  { icon: TrendingUp, text: "Instant ATS score with full breakdown" },
  { icon: Brain, text: "AI-powered bullet point rewrites" },
  { icon: Target, text: "Keyword gap analysis for any job" },
  { icon: Shield, text: "Resume & analysis history, forever free" },
];

const STATS = [
  { value: "78", label: "avg ATS score after optimization" },
  { value: "3×", label: "more interviews reported by users" },
];

// ─── Component ────────────────────────────────────────────────────────────────
type AuthLayoutProps = {
  children: React.ReactNode;
  variant: "login" | "register";
};

export function AuthLayout({ children, variant }: AuthLayoutProps) {
  const isRegister = variant === "register";

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* ── Ambient orbs ──────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden">
        {/* Primary orb */}
        <div
          className="absolute -top-32 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full opacity-40 dark:opacity-25"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(243 75% 59%) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Secondary orb — violet */}
        <div
          className="absolute -bottom-24 -right-24 h-[500px] w-[500px] rounded-full opacity-30 dark:opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(262 65% 60%) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        {/* Tertiary orb — indigo */}
        <div
          className="absolute top-1/2 -left-32 h-[400px] w-[400px] -translate-y-1/2 rounded-full opacity-20 dark:opacity-15"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(230 70% 60%) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid opacity-40 dark:opacity-20" />
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-[0_0_16px_hsl(243_75%_59%/0.45)] transition-all group-hover:shadow-[0_0_28px_hsl(243_75%_59%/0.6)] group-hover:scale-105">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            ResumeIQ
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex min-h-[calc(100dvh-4.5rem)] items-center justify-center px-4 pb-10 sm:px-8">
        <div
          className={cn(
            "grid w-full gap-8 lg:gap-0 lg:items-stretch",
            isRegister
              ? "max-w-5xl lg:grid-cols-2"
              : "max-w-4xl lg:grid-cols-[1fr_1.1fr]"
          )}
        >
          {/* ── Branding panel ──────────────────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "hidden flex-col justify-center rounded-2xl lg:flex",
              "border border-white/10 dark:border-white/8",
              "bg-white/60 dark:bg-white/[0.04]",
              "backdrop-blur-2xl",
              "p-8 xl:p-10",
              isRegister ? "" : "pr-6 xl:pr-8"
            )}
          >
            {/* Gradient overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/10 via-transparent to-violet-500/10" />

            <div className="relative">
              {isRegister ? (
                <RegisterPanel />
              ) : (
                <LoginPanel />
              )}
            </div>
          </motion.aside>

          {/* ── Form column ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full items-center justify-center lg:pl-8"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// ─── Branding sub-panels ──────────────────────────────────────────────────────
function LoginPanel() {
  return (
    <>
      <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand-400 uppercase">
        <Target size={10} />
        Trusted by job seekers
      </span>

      <h2 className="font-display text-2xl font-bold leading-tight text-foreground xl:text-3xl">
        Beat the ATS.{" "}
        <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
          Land the interview.
        </span>
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Sign in to access your dashboard, resume history, and AI-powered
        optimization tools.
      </p>

      <ul className="mt-8 space-y-3">
        {LOGIN_HIGHLIGHTS.map(({ icon: Icon, title, text, color, iconColor }) => (
          <li
            key={title}
            className="flex items-start gap-3 group"
          >
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                "bg-gradient-to-br",
                color,
                "border border-white/10",
                "transition-transform duration-200 group-hover:scale-110"
              )}
            >
              <Icon size={16} className={iconColor} />
            </div>
            <div className="pt-0.5">
              <p className="text-sm font-medium text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{text}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        {STATS.map(({ value, label }) => (
          <div
            key={value}
            className="rounded-xl border border-white/8 bg-white/5 p-3"
          >
            <div className="font-display text-2xl font-bold text-brand-400">
              {value}
            </div>
            <div className="mt-0.5 text-[11px] leading-tight text-muted-foreground">
              {label}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function RegisterPanel() {
  return (
    <>
      <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand-400 uppercase">
        <Sparkles size={10} />
        Free forever to start
      </span>

      <h2 className="font-display text-2xl font-bold leading-tight text-foreground xl:text-3xl">
        Start landing more{" "}
        <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
          interviews today
        </span>
      </h2>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        No credit card required. Analyze your first resume in under 2 minutes.
      </p>

      <ul className="mt-8 space-y-3.5">
        {REGISTER_PERKS.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-center gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/15">
              <CheckCircle2 size={14} className="text-brand-400" />
            </div>
            <span className="text-sm text-foreground/85">{text}</span>
          </li>
        ))}
      </ul>

      {/* Social proof */}
      <div className="mt-10 flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 p-4">
        <div className="flex -space-x-2">
          {["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"].map((color, i) => (
            <div
              key={i}
              className="h-7 w-7 rounded-full border-2 border-background"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">2,400+</span> resumes
          optimized this week
        </p>
      </div>
    </>
  );
}
