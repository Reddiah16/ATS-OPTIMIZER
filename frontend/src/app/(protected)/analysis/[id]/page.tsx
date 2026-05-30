"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

import { motion, Variants } from "framer-motion";

import { analysisApi, getErrorMessage } from "@/lib/api";
import { notify } from "@/lib/toast";

import { DashboardSkeleton } from "@/components/loading";
import { ErrorState } from "@/components/error";

import Navbar from "@/components/Navbar";

import { ScoreBar } from "@/components/ATSScoreGauge";
import ReadinessBadge from "@/components/ReadinessBadge";
import CategoryScoreCard from "@/components/CategoryScoreCard";
import TopFixesPanel from "@/components/TopFixesPanel";
import SectionDiagnosticsCard from "@/components/SectionDiagnosticsCard";
import FormattingCheckCard from "@/components/FormattingCheckCard";
import BulletAnalysisCard from "@/components/BulletAnalysisCard";
import KeywordGroupCards from "@/components/KeywordGroupCards";

import { Analysis } from "@/types";

import {
  ArrowLeft,
  Calendar,
  Briefcase,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

// =========================
// DYNAMIC IMPORTS
// =========================

const ATSScoreGauge = dynamic(
  () => import("@/components/ATSScoreGauge"),
  {
    ssr: false,
  }
);

const ScoreRadarChart = dynamic(
  () => import("@/components/ScoreRadarChart"),
  {
    ssr: false,
  }
);

const KeywordAnalysis = dynamic(
  () => import("@/components/KeywordAnalysis"),
  {
    ssr: false,
  }
);

const AISuggestions = dynamic(
  () => import("@/components/AISuggestions"),
  {
    ssr: false,
  }
);

const ExportReport = dynamic(
  () => import("@/components/ExportReport"),
  {
    ssr: false,
  }
);

// =========================
// ANIMATION VARIANTS
// =========================

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      type: "spring",
      stiffness: 80,
      damping: 14,
    },
  },
};

// =========================
// PAGE
// =========================

export default function AnalysisPage() {

  const { id } =
    useParams<{ id: string }>();

  const [analysis, setAnalysis] =
    useState<Analysis | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const fetchAnalysis = () => {

    if (!id) return;

    setLoading(true);

    setError(null);

    analysisApi
      .getById(Number(id))

      .then((r) => setAnalysis(r.data))

      .catch((e) => {

        const message =
          getErrorMessage(e);

        setError(message);

        notify.error(message);
      })

      .finally(() =>
        setLoading(false)
      );
  };

  useEffect(() => {

    fetchAnalysis();

  }, [id]);

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="min-h-screen bg-surface-950">

        <Navbar />

        <DashboardSkeleton />
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error || !analysis) {

    return (
      <div className="min-h-screen bg-surface-950">

        <Navbar />

        <div className="mx-auto max-w-lg px-6 py-16">

          <ErrorState
            message={
              error ??
              "Analysis not found"
            }

            onRetry={
              error
                ? fetchAnalysis
                : undefined
            }
          />

          <Link
            href="/history"

            className="mt-4 block text-center text-sm text-primary hover:underline font-semibold"
          >

            Back to history
          </Link>
        </div>
      </div>
    );
  }

  const {
    score_breakdown: sb,
    keyword_analysis: ka,
    skill_analysis: sa,
  } = analysis;

  return (
    <div className="min-h-screen bg-surface-950 bg-grid relative overflow-x-hidden">

      {/* BACKGROUND BLOBS */}

      <div className="fixed inset-0 pointer-events-none z-0">

        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[140px]" />

        <div className="absolute top-[40%] left-[-20%] w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-[120px]" />

        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-emerald-500/3 rounded-full blur-[130px]" />
      </div>

      <Navbar />

      {/* PDF WRAPPER */}

      <div id="analysis-report">

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"

          className="relative z-10 max-w-7xl mx-auto px-6 py-10 space-y-6"
        >

          {/* HEADER */}

          <motion.div
            variants={itemVariants}

            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >

            <div>

              <Link
                href="/history"

                className="flex items-center gap-1 text-xs text-slate-500 hover:text-white mb-2.5 transition-colors font-semibold tracking-wide uppercase"
              >

                <ArrowLeft size={12} />

                Back to Reports
              </Link>

              <div className="flex flex-wrap items-center gap-3">

                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">

                  {analysis.job_title ||
                    "ATS Analysis Report"}
                </h1>

                <span className="text-[10px] font-bold tracking-widest bg-brand-500/10 text-brand-400 border border-brand-500/20 px-2.5 py-0.5 rounded-lg uppercase">

                  REPORT
                </span>

                {analysis.readiness_label && (
                  <ReadinessBadge label={analysis.readiness_label} />
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 font-medium">

                <span className="flex items-center gap-1.5">

                  <Calendar
                    size={13}
                    className="text-slate-600"
                  />

                  {new Date(
                    analysis.created_at
                  ).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </span>

                {analysis.job_title && (

                  <span className="flex items-center gap-1.5">

                    <Briefcase
                      size={13}
                      className="text-slate-600"
                    />

                    Target:
                    {analysis.job_title}
                  </span>
                )}
              </div>
            </div>

            {/* BUTTONS */}

            <div className="flex items-center gap-2 flex-wrap">

              <ExportReport
                analysisId={String(id)}
              />

              <Link
                href="/upload"

                className="btn-secondary flex items-center gap-2 text-xs font-semibold px-4 py-2.5"
              >

                <RefreshCw size={13} />

                Optimise Another
              </Link>
            </div>
          </motion.div>

          {/* MAIN CONTENT */}

          <div className="grid lg:grid-cols-3 gap-6">

            {/* SCORE */}

            <motion.div
              variants={itemVariants}

              className="card p-6 flex flex-col items-center justify-center"
            >

              <ATSScoreGauge
                score={analysis.ats_score}
                size="lg"
                animate
              />
              
              {analysis.score_explanation && (
                <p className="mt-6 text-sm text-center text-slate-300 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                  {analysis.score_explanation}
                </p>
              )}
            </motion.div>

            {/* RADAR CHART */}

            <motion.div
              variants={itemVariants}

              className="card p-6"
            >

              <ScoreRadarChart
                scoreBreakdown={sb}
              />
            </motion.div>

            {/* SKILLS */}

            <motion.div
              variants={itemVariants}

              className="card p-6"
            >

              <div className="space-y-4">

                <h3 className="text-sm font-bold text-emerald-400">

                  Matched Skills
                </h3>

                <div className="flex flex-wrap gap-2">

                  {sa.matched_skills.map(
                    (skill) => (

                      <span
                        key={skill}

                        className="text-xs px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      >

                        {skill}
                      </span>
                    )
                  )}
                </div>

                <h3 className="text-sm font-bold text-red-400 pt-4">

                  Missing Skills
                </h3>

                <div className="flex flex-wrap gap-2">

                  {sa.missing_skills.map(
                    (skill) => (

                      <span
                        key={skill}

                        className="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20"
                      >

                        {skill}
                      </span>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* CATEGORY SCORES */}

          {analysis.category_scores && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CategoryScoreCard title="Keyword Match" detail={analysis.category_scores.keyword_match} delay={0.1} />
              <CategoryScoreCard title="Skill Match" detail={analysis.category_scores.skill_match} delay={0.2} />
              <CategoryScoreCard title="Experience Quality" detail={analysis.category_scores.experience_quality} delay={0.3} />
              <CategoryScoreCard title="Formatting" detail={analysis.category_scores.formatting} delay={0.4} />
            </div>
          )}

          {/* TOP FIXES */}

          {analysis.top_fixes && analysis.top_fixes.length > 0 && (
            <motion.div variants={itemVariants}>
              <TopFixesPanel fixes={analysis.top_fixes} />
            </motion.div>
          )}

          {/* SECTION DIAGNOSTICS */}
          {analysis.section_diagnostics && analysis.section_diagnostics.length > 0 && (
            <motion.div variants={itemVariants}>
              <SectionDiagnosticsCard diagnostics={analysis.section_diagnostics} />
            </motion.div>
          )}

          {/* BULLET ANALYSIS */}
          {analysis.bullet_analysis && analysis.bullet_analysis.length > 0 && (
            <motion.div variants={itemVariants}>
              <BulletAnalysisCard bullets={analysis.bullet_analysis} />
            </motion.div>
          )}

          {/* FORMATTING CHECKS */}
          {analysis.formatting_checks && (
            <motion.div variants={itemVariants}>
              <FormattingCheckCard checks={analysis.formatting_checks} />
            </motion.div>
          )}

          {/* KEYWORD ANALYSIS / GROUPING */}
          <motion.div variants={itemVariants}>
            {analysis.keyword_grouping ? (
              <KeywordGroupCards grouping={analysis.keyword_grouping} />
            ) : (
              <div className="card p-6">
                <KeywordAnalysis
                  matchedKeywords={ka.matched_keywords}
                  missingKeywords={ka.missing_keywords}
                  matchPercentage={ka.match_percentage}
                />
              </div>
            )}
          </motion.div>

          {/* AI SUGGESTIONS */}

          <motion.div
            variants={itemVariants}

            className="card p-6"
          >

            <AISuggestions
              suggestions={
                analysis.ai_feedback
              }

              improvedBullets={
                analysis.improved_bullets
              }

              strengths={
                analysis.strengths
              }

              weaknesses={
                analysis.weaknesses
              }
            />
          </motion.div>

          {/* FOOTER */}

          <motion.p
            variants={itemVariants}

            className="text-center text-[10px] text-slate-600 font-mono pb-4"
          >

            <MessageSquare
              size={10}
              className="inline mr-1"
            />

            ResumeIQ · AI-Powered ATS Optimization
          </motion.p>
        </motion.main>
      </div>
    </div>
  );
}