"use client";

import { motion } from "framer-motion";
import {
  Target,
  Tag,
  Wrench,
  AlertTriangle,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  XCircle,
  FileText,
  Circle,
} from "lucide-react";
import ATSScoreGauge from "@/components/ATSScoreGauge";
import { cn } from "@/lib/utils";
import { DashboardPanel } from "./panel";
import { AnimatedProgressBar, CoverageBar } from "./animated-progress-bar";
import {
  PREVIEW_META,
  PREVIEW_SCORE,
  PREVIEW_KEYWORDS,
  PREVIEW_SKILLS,
  PREVIEW_SUGGESTIONS,
  PREVIEW_STRENGTHS,
  PREVIEW_WEAKNESSES,
} from "./data";

function Chip({
  label,
  variant,
}: {
  label: string;
  variant: "matched" | "missing" | "skill" | "warning";
}) {
  const styles = {
    matched:
      "bg-emerald-500/10 text-emerald-300 border-emerald-500/25",
    missing: "bg-red-500/10 text-red-300 border-red-500/25",
    skill: "bg-brand-500/10 text-brand-300 border-brand-500/25",
    warning: "bg-amber-500/10 text-amber-300 border-amber-500/25",
  };
  const icons = {
    matched: CheckCircle2,
    missing: XCircle,
    skill: CheckCircle2,
    warning: AlertTriangle,
  };
  const Icon = icons[variant];

  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25 }}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border px-2 py-1 font-mono text-[11px] font-medium",
        styles[variant]
      )}
    >
      <Icon size={10} className="shrink-0 opacity-80" />
      {label}
    </motion.span>
  );
}

function ScoreSection() {
  return (
    <DashboardPanel
      title="ATS Score"
      icon={Target}
      badge={PREVIEW_SCORE.label}
      badgeVariant="success"
      className="lg:row-span-2"
      delay={0.05}
    >
      <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col">
        <ATSScoreGauge score={PREVIEW_SCORE.overall} size="lg" animate />
        <div className="w-full space-y-3 flex-1">
          {PREVIEW_SCORE.breakdown.map((item, i) => (
            <AnimatedProgressBar
              key={item.label}
              label={item.label}
              value={item.score}
              max={item.max}
              color={item.color}
              delay={0.15 + i * 0.08}
            />
          ))}
        </div>
      </div>
    </DashboardPanel>
  );
}

function KeywordSection() {
  const total =
    PREVIEW_KEYWORDS.matched.length + PREVIEW_KEYWORDS.missing.length;

  return (
    <DashboardPanel
      title="Keyword Match"
      icon={Tag}
      badge={`${PREVIEW_KEYWORDS.matchPercentage}%`}
      badgeVariant="success"
      delay={0.1}
    >
      <CoverageBar
        label="Keyword coverage"
        percentage={PREVIEW_KEYWORDS.matchPercentage}
        matched={PREVIEW_KEYWORDS.matched.length}
        total={total}
        gradient="linear-gradient(90deg, #6172f5, #8b5cf6)"
        delay={0.2}
      />
      <div className="mt-4 flex flex-wrap gap-1.5">
        {PREVIEW_KEYWORDS.matched.slice(0, 8).map((kw) => (
          <Chip key={kw} label={kw} variant="matched" />
        ))}
        {PREVIEW_KEYWORDS.matched.length > 8 && (
          <span className="px-2 py-1 text-[11px] text-slate-500">
            +{PREVIEW_KEYWORDS.matched.length - 8} more
          </span>
        )}
      </div>
    </DashboardPanel>
  );
}

function SkillsSection() {
  const total = PREVIEW_SKILLS.matched.length + PREVIEW_SKILLS.missing.length;

  return (
    <DashboardPanel
      title="Skills Match"
      icon={Wrench}
      badge={`${PREVIEW_SKILLS.matchPercentage}%`}
      badgeVariant="success"
      delay={0.15}
    >
      <CoverageBar
        label="Skills alignment"
        percentage={PREVIEW_SKILLS.matchPercentage}
        matched={PREVIEW_SKILLS.matched.length}
        total={total}
        delay={0.25}
      />
      <p className="mt-3 mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        Matched skills
      </p>
      <div className="flex flex-wrap gap-1.5">
        {PREVIEW_SKILLS.matched.map((skill) => (
          <Chip key={skill} label={skill} variant="skill" />
        ))}
      </div>
    </DashboardPanel>
  );
}

function MissingKeywordsSection() {
  return (
    <DashboardPanel
      title="Missing Keywords"
      icon={AlertTriangle}
      badge={`${PREVIEW_KEYWORDS.missing.length} gaps`}
      badgeVariant="warning"
      delay={0.2}
    >
      <p className="mb-3 text-xs leading-relaxed text-slate-400">
        Add these terms naturally in your experience section to improve ATS
        ranking for this role.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {PREVIEW_KEYWORDS.missing.map((kw) => (
          <Chip key={kw} label={kw} variant="missing" />
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-amber-500/15 bg-amber-500/5 p-3">
        <p className="text-xs text-amber-200/90 leading-relaxed">
          <span className="font-semibold text-amber-300">Tip:</span> Mention
          Kubernetes in a bullet about cloud deployment to close the biggest gap.
        </p>
      </div>
      <p className="mt-3 mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
        Missing skills
      </p>
      <div className="flex flex-wrap gap-1.5">
        {PREVIEW_SKILLS.missing.map((skill) => (
          <Chip key={skill} label={skill} variant="warning" />
        ))}
      </div>
    </DashboardPanel>
  );
}

function AISuggestionsSection() {
  return (
    <DashboardPanel
      title="AI Suggestions"
      icon={Sparkles}
      badge="Llama 3.1"
      badgeVariant="ai"
      delay={0.25}
    >
      <div className="space-y-3">
        {PREVIEW_SUGGESTIONS.map((item, i) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
            className="rounded-lg border border-white/6 bg-gradient-to-br from-violet-500/5 to-brand-500/5 p-3"
          >
            <span className="mb-2 inline-block rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-medium text-violet-300">
              {item.category}
            </span>
            <p className="mb-2 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
              {item.original}
            </p>
            <p className="text-xs leading-relaxed text-slate-200">
              <span className="font-medium text-brand-400">→ </span>
              {item.improved}
            </p>
          </motion.div>
        ))}
      </div>
    </DashboardPanel>
  );
}

function StrengthsSection() {
  return (
    <DashboardPanel
      title="Resume Strengths"
      icon={ThumbsUp}
      badge={`${PREVIEW_STRENGTHS.length}`}
      badgeVariant="success"
      delay={0.3}
    >
      <ul className="space-y-2.5">
        {PREVIEW_STRENGTHS.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 + i * 0.06 }}
            className="flex gap-2.5 text-xs leading-relaxed text-slate-300"
          >
            <CheckCircle2
              size={14}
              className="mt-0.5 shrink-0 text-emerald-400"
            />
            {item}
          </motion.li>
        ))}
      </ul>
    </DashboardPanel>
  );
}

function WeaknessesSection() {
  return (
    <DashboardPanel
      title="Weaknesses"
      icon={ThumbsDown}
      badge={`${PREVIEW_WEAKNESSES.length}`}
      badgeVariant="danger"
      delay={0.35}
    >
      <ul className="space-y-2.5">
        {PREVIEW_WEAKNESSES.map((item, i) => (
          <motion.li
            key={item}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.06 }}
            className="flex gap-2.5 text-xs leading-relaxed text-slate-300"
          >
            <AlertTriangle
              size={14}
              className="mt-0.5 shrink-0 text-amber-400"
            />
            {item}
          </motion.li>
        ))}
      </ul>
    </DashboardPanel>
  );
}

export function DashboardPreview() {
  return (
    <section className="relative px-6 sm:px-8 pb-16 lg:pb-20">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 text-center sm:mb-10"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300">
            <Sparkles size={12} />
            Live analysis preview
          </span>
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl mb-3">
            Your ATS report,{" "}
            <span className="text-gradient">instantly</span>
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-400 sm:text-base">
            See exactly how recruiters&apos; systems score your resume — keywords,
            skills, gaps, and AI rewrites in one beautiful dashboard.
          </p>
        </motion.div>

        {/* Dashboard shell */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl border border-white/10 glass-strong shadow-elevated"
        >
          {/* Gradient backdrop */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/8 via-transparent to-violet-500/10"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl"
            aria-hidden
          />

          {/* Window chrome */}
          <div className="relative flex flex-wrap items-center gap-3 border-b border-white/8 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-1.5">
              <Circle size={10} className="fill-red-400/80 text-red-400/80" />
              <Circle size={10} className="fill-amber-400/80 text-amber-400/80" />
              <Circle size={10} className="fill-emerald-400/80 text-emerald-400/80" />
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-2 text-xs text-slate-400">
              <FileText size={13} className="shrink-0 text-slate-500" />
              <span className="truncate">
                {PREVIEW_META.resume}
              </span>
              <span className="hidden text-slate-600 sm:inline">·</span>
              <span className="hidden truncate sm:inline">
                {PREVIEW_META.role} @ {PREVIEW_META.company}
              </span>
            </div>
            <motion.span
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Analyzed {PREVIEW_META.analyzedAt}
            </motion.span>
          </div>

          {/* Dashboard grid */}
          <div className="relative grid grid-cols-1 gap-3 p-3 sm:gap-4 sm:p-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-4 lg:p-5">
            <div className="lg:col-span-4">
              <ScoreSection />
            </div>
            <div className="space-y-3 sm:space-y-4 md:col-span-1 lg:col-span-8">
              <KeywordSection />
              <SkillsSection />
            </div>
            <div className="md:col-span-1 lg:col-span-6">
              <MissingKeywordsSection />
            </div>
            <div className="md:col-span-1 lg:col-span-6">
              <AISuggestionsSection />
            </div>
            <div className="md:col-span-1 lg:col-span-6">
              <StrengthsSection />
            </div>
            <div className="md:col-span-1 lg:col-span-6">
              <WeaknessesSection />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
