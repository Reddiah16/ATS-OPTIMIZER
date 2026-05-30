"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { resumeApi, analysisApi, getErrorMessage } from "@/lib/api";
import { notify } from "@/lib/toast";
import Navbar from "@/components/Navbar";
import { DashboardSkeleton } from "@/components/loading";
import { ErrorState } from "@/components/error";
import ATSScoreGauge from "@/components/ATSScoreGauge";
import { Resume, AnalysisSummary } from "@/types";
import {
  Upload,
  TrendingUp,
  FileText,
  Clock,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Stagger container ────────────────────────────────────────────────────────
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.45 } },
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  trend?: string;
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/60 p-5",
        "bg-card/60 backdrop-blur-sm",
        "transition-shadow hover:shadow-elevated",
        "group"
      )}
    >
      {/* Gradient hover highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500/0 to-violet-500/0 transition-all duration-300 group-hover:from-brand-500/[0.03] group-hover:to-violet-500/[0.04]" />

      <div className="relative">
        <div className="mb-4 flex items-start justify-between">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl border",
              iconBg
            )}
          >
            <Icon size={18} className={iconColor} />
          </div>
          {trend && (
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              {trend}
            </span>
          )}
        </div>
        <p className="font-display text-2xl font-bold text-foreground">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}

// ─── ScoreBadge ───────────────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 75
      ? "text-emerald-400 border-emerald-500/25 bg-emerald-500/10"
      : score >= 50
      ? "text-brand-400 border-brand-500/25 bg-brand-500/10"
      : "text-amber-400 border-amber-500/25 bg-amber-500/10";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-bold",
        color
      )}
    >
      {score}%
    </span>
  );
}

// ─── EmptyCTA ─────────────────────────────────────────────────────────────────
function EmptyCTA({
  icon: Icon,
  title,
  description,
  href,
  cta,
  variant = "primary",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  cta: string;
  variant?: "primary" | "secondary";
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/50 bg-brand-500/8">
        <Icon size={24} className="text-brand-400" />
      </div>
      <p className="mb-1 font-semibold text-foreground">{title}</p>
      <p className="mb-5 max-w-xs text-sm text-muted-foreground">{description}</p>
      <Link
        href={href}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
          variant === "primary"
            ? "bg-gradient-to-r from-brand-600 to-violet-600 text-white shadow-[0_4px_16px_hsl(243_75%_59%/0.35)] hover:shadow-[0_4px_24px_hsl(243_75%_59%/0.5)] hover:opacity-95"
            : "border border-border bg-muted/60 text-foreground hover:bg-muted"
        )}
      >
        <Upload size={14} />
        {cta}
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [history, setHistory] = useState<AnalysisSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    Promise.all([resumeApi.list(), analysisApi.getHistory(0, 5)])
      .then(([rRes, aRes]) => {
        setResumes(rRes.data.resumes ?? []);
        setHistory(aRes.data.history ?? []);
      })
      .catch((e) => {
        const message = getErrorMessage(e);
        setError(message);
        notify.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <DashboardSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-lg px-6 py-16">
          <ErrorState message={error} onRetry={fetchData} />
        </div>
      </div>
    );
  }

  const bestScore =
    history.length > 0 ? Math.max(...history.map((a) => a.ats_score)) : null;
  const avgScore =
    history.length > 0
      ? Math.round(
          history.reduce((s, a) => s + a.ats_score, 0) / history.length
        )
      : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full opacity-20 dark:opacity-10"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(243 75% 59%) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-15" />
      </div>

      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex items-start justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Hey, {user?.username} 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Here&apos;s your resume optimization overview
            </p>
          </div>
          <Link
            href="/upload"
            id="analyze-resume-btn"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_hsl(243_75%_59%/0.35)] transition-all hover:shadow-[0_4px_24px_hsl(243_75%_59%/0.5)] hover:opacity-95"
          >
            <Zap size={15} />
            Analyze Resume
          </Link>
        </motion.div>

        {/* ── Stat cards ──────────────────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          <StatCard
            label="Resumes Uploaded"
            value={resumes.length}
            icon={FileText}
            iconBg="border-brand-500/20 bg-brand-500/8"
            iconColor="text-brand-400"
          />
          <StatCard
            label="Analyses Run"
            value={history.length}
            icon={BarChart3}
            iconBg="border-violet-500/20 bg-violet-500/8"
            iconColor="text-violet-400"
          />
          <StatCard
            label="Best ATS Score"
            value={bestScore !== null ? `${bestScore}%` : "—"}
            icon={Target}
            iconBg="border-emerald-500/20 bg-emerald-500/8"
            iconColor="text-emerald-400"
            trend={bestScore !== null && bestScore >= 70 ? "Great" : undefined}
          />
          <StatCard
            label="Average Score"
            value={avgScore !== null ? `${avgScore}%` : "—"}
            icon={TrendingUp}
            iconBg="border-amber-500/20 bg-amber-500/8"
            iconColor="text-amber-400"
          />
        </motion.div>

        {/* ── Main grid ───────────────────────────────────────────────────── */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 lg:grid-cols-5"
        >
          {/* Recent Analyses */}
          <motion.div
            variants={item}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-border/60 p-6",
              "bg-card/60 backdrop-blur-sm",
              "lg:col-span-3"
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/[0.03] to-transparent"
              aria-hidden
            />
            <div className="relative">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Recent Analyses
                </h2>
                <Link
                  href="/history"
                  className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
                >
                  View all <ChevronRight size={12} />
                </Link>
              </div>

              {history.length === 0 ? (
                <EmptyCTA
                  icon={Target}
                  title="No analyses yet"
                  description="Upload a resume and paste a job description to get your first ATS score"
                  href="/upload"
                  cta="Analyze My Resume"
                  variant="primary"
                />
              ) : (
                <div className="space-y-2">
                  {history.map((analysis, idx) => (
                    <motion.div
                      key={analysis.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                    >
                      <Link
                        href={`/analysis/${analysis.id}`}
                        className="group flex items-center gap-4 rounded-xl border border-border/40 p-4 transition-all hover:border-brand-500/25 hover:bg-brand-500/[0.03]"
                      >
                        <ATSScoreGauge
                          score={analysis.ats_score}
                          size="sm"
                          showLabel={false}
                          animate={false}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {analysis.job_title || "Untitled Position"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {analysis.resume_filename}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground/60">
                            {new Date(analysis.created_at).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric", year: "numeric" }
                            )}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <ScoreBadge score={analysis.ats_score} />
                          <div className="mt-1 flex flex-col items-end gap-0.5">
                            <span className="text-[10px] text-emerald-500">
                              {analysis.matched_keywords_count} matched
                            </span>
                            <span className="text-[10px] text-red-400">
                              {analysis.missing_keywords_count} missing
                            </span>
                          </div>
                        </div>
                        <ArrowRight
                          size={14}
                          className="shrink-0 text-muted-foreground/30 transition-colors group-hover:text-brand-400"
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Resumes sidebar */}
          <motion.div
            variants={item}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-border/60 p-6",
              "bg-card/60 backdrop-blur-sm",
              "lg:col-span-2"
            )}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] to-transparent"
              aria-hidden
            />
            <div className="relative">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Your Resumes
                </h2>
                <Link
                  href="/upload"
                  className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors"
                >
                  Upload <ChevronRight size={12} />
                </Link>
              </div>

              {resumes.length === 0 ? (
                <EmptyCTA
                  icon={FileText}
                  title="No resumes yet"
                  description="Upload your first resume to get started"
                  href="/upload"
                  cta="Upload Resume"
                  variant="secondary"
                />
              ) : (
                <div className="space-y-2">
                  {resumes.slice(0, 6).map((resume, idx) => (
                    <motion.div
                      key={resume.id}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 rounded-xl border border-border/40 p-3 hover:bg-muted/30 transition-colors"
                    >
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                          resume.file_type === "pdf"
                            ? "border-red-500/20 bg-red-500/8"
                            : "border-blue-500/20 bg-blue-500/8"
                        )}
                      >
                        <FileText
                          size={14}
                          className={
                            resume.file_type === "pdf"
                              ? "text-red-400"
                              : "text-blue-400"
                          }
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {resume.original_filename}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
                            {resume.file_type}
                          </span>
                          {resume.has_text ? (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-500">
                              <CheckCircle2 size={9} /> parsed
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] text-amber-500">
                              <AlertCircle size={9} /> pending
                            </span>
                          )}
                        </div>
                      </div>
                      <Clock size={11} className="shrink-0 text-muted-foreground/30" />
                    </motion.div>
                  ))}
                  {resumes.length > 6 && (
                    <p className="pt-1 text-center text-xs text-muted-foreground">
                      +{resumes.length - 6} more
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* ── Full empty CTA (first-time user) ──────────────────────────── */}
        {history.length === 0 && resumes.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={cn(
              "relative mt-6 overflow-hidden rounded-2xl border border-dashed border-brand-500/25 p-8 text-center",
              "bg-brand-500/[0.03]"
            )}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/[0.04] to-violet-500/[0.06]" aria-hidden />
            <div className="relative">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-500/20 bg-brand-500/10">
                <Sparkles size={28} className="text-brand-400" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Ready to optimize your resume?
              </h3>
              <p className="mx-auto mb-6 max-w-sm text-sm text-muted-foreground">
                Upload your resume, paste a job description, and get your ATS
                score + AI suggestions in under 30 seconds.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_hsl(243_75%_59%/0.4)] hover:shadow-[0_4px_28px_hsl(243_75%_59%/0.55)] hover:opacity-95 transition-all"
              >
                <Upload size={16} /> Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
