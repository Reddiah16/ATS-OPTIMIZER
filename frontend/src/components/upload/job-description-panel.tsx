"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  FileText,
  Sparkles,
  Loader2,
  ArrowRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MIN_JOB_DESC_CHARS } from "./types";

interface JobDescriptionPanelProps {
  jobTitle: string;
  jobDesc: string;
  onJobTitleChange: (val: string) => void;
  onJobDescChange: (val: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  className?: string;
}

export function JobDescriptionPanel({
  jobTitle,
  jobDesc,
  onJobTitleChange,
  onJobDescChange,
  onAnalyze,
  isAnalyzing,
  className,
}: JobDescriptionPanelProps) {
  const wordCount = jobDesc.trim().split(/\s+/).filter(Boolean).length;
  const charCount = jobDesc.length;
  const isReady = charCount >= MIN_JOB_DESC_CHARS;
  const progress = Math.min((charCount / MIN_JOB_DESC_CHARS) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn("space-y-5", className)}
    >
      {/* Job Title */}
      <div className="space-y-2">
        <label
          htmlFor="job-title"
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          <Briefcase size={12} />
          Job Title
          <span className="rounded border border-border px-1.5 py-0.5 text-[10px] font-normal normal-case tracking-normal">
            optional
          </span>
        </label>
        <div className="relative">
          <input
            id="job-title"
            type="text"
            value={jobTitle}
            onChange={(e) => onJobTitleChange(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            disabled={isAnalyzing}
            className={cn(
              "w-full rounded-xl border border-input bg-transparent px-4 py-2.5 text-sm",
              "placeholder:text-muted-foreground/60",
              "focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring",
              "transition-all duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
        </div>
      </div>

      {/* Job Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="job-description"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            <FileText size={12} />
            Job Description
            <span className="text-destructive">*</span>
          </label>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{wordCount} words</span>
            <span>·</span>
            <span
              className={cn(
                "font-mono transition-colors",
                isReady ? "text-emerald-500" : "text-muted-foreground"
              )}
            >
              {charCount} / {MIN_JOB_DESC_CHARS}+ chars
            </span>
          </div>
        </div>

        <div className="relative">
          <Textarea
            id="job-description"
            value={jobDesc}
            onChange={(e) => onJobDescChange(e.target.value)}
            placeholder="Paste the full job description here — responsibilities, requirements, preferred skills, company context…&#10;&#10;The more detail you include, the more accurate the ATS analysis will be."
            rows={10}
            disabled={isAnalyzing}
            className="resize-none font-mono text-sm leading-relaxed"
          />

          {/* Character minimum progress bar */}
          {!isReady && charCount > 0 && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
              <div className="h-1 w-16 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-brand-500"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tip */}
        {!isReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-2 rounded-lg border border-brand-500/15 bg-brand-500/5 px-3 py-2.5"
          >
            <Info size={13} className="mt-0.5 shrink-0 text-brand-400" />
            <p className="text-xs text-muted-foreground">
              Paste at least {MIN_JOB_DESC_CHARS} characters for the best
              analysis. More context = better keyword matching.
            </p>
          </motion.div>
        )}
      </div>

      {/* CTA button */}
      <Button
        id="run-analysis-btn"
        type="button"
        onClick={onAnalyze}
        disabled={!isReady || isAnalyzing}
        className={cn(
          "h-12 w-full gap-2.5 text-base font-semibold",
          "bg-gradient-to-r from-brand-600 to-violet-600 text-white",
          "shadow-[0_4px_24px_hsl(243_75%_59%/0.4)]",
          "hover:shadow-[0_6px_32px_hsl(243_75%_59%/0.55)]",
          "hover:opacity-95 active:scale-[0.99]",
          "transition-all duration-200",
          "disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
        )}
      >
        {isAnalyzing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Running Analysis…
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Run ATS Analysis
            <ArrowRight size={16} className="ml-auto" />
          </>
        )}
      </Button>
    </motion.div>
  );
}
