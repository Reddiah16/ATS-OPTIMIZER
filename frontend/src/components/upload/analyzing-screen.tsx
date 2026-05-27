"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Brain, Target, BarChart3, CheckCircle2 } from "lucide-react";

const ANALYSIS_STAGES = [
  { icon: Target, label: "Parsing job requirements…", color: "text-brand-400" },
  { icon: BarChart3, label: "Running ATS score engine…", color: "text-violet-400" },
  { icon: Brain, label: "Extracting keyword gaps…", color: "text-indigo-400" },
  { icon: Sparkles, label: "Generating AI suggestions…", color: "text-emerald-400" },
];

interface AnalyzingScreenProps {
  resumeFilename?: string;
}

export function AnalyzingScreen({ resumeFilename }: AnalyzingScreenProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<number[]>([]);

  // Cycle through stages every 2s
  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedStages((prev) => {
        if (!prev.includes(stageIndex)) return [...prev, stageIndex];
        return prev;
      });
      setStageIndex((prev) => (prev + 1) % ANALYSIS_STAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [stageIndex]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center px-4 py-16 text-center"
    >
      {/* Animated orb + spinner */}
      <div className="relative mb-8">
        {/* Outer glow ring */}
        <div className="absolute -inset-4 rounded-full bg-brand-500/10 blur-xl animate-pulse-glow" />

        {/* Spinning ring */}
        <svg
          className="absolute inset-0 animate-spin"
          style={{ animationDuration: "3s" }}
          viewBox="0 0 96 96"
          width="96"
          height="96"
        >
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="url(#spinGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="276"
            strokeDashoffset="200"
          />
          <defs>
            <linearGradient id="spinGrad" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="hsl(243 75% 59%)" stopOpacity="0" />
              <stop offset="100%" stopColor="hsl(243 75% 59%)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center icon */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-brand-500/25 bg-gradient-to-br from-brand-500/15 to-violet-500/10">
          <Sparkles size={36} className="text-brand-400 animate-pulse" />
        </div>
      </div>

      {/* Title */}
      <h2 className="font-display text-2xl font-bold text-foreground mb-2">
        Analyzing Your Resume
      </h2>
      {resumeFilename && (
        <p className="mb-8 text-sm text-muted-foreground truncate max-w-xs">
          {resumeFilename}
        </p>
      )}

      {/* Stage list */}
      <div className="w-full max-w-xs space-y-2.5 text-left">
        {ANALYSIS_STAGES.map(({ icon: Icon, label, color }, i) => {
          const isActive = i === stageIndex;
          const isDone = completedStages.includes(i);

          return (
            <motion.div
              key={label}
              animate={{
                opacity: isDone ? 0.5 : isActive ? 1 : 0.3,
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  isDone
                    ? "bg-emerald-500/15"
                    : isActive
                    ? "bg-brand-500/15"
                    : "bg-muted/50"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                ) : (
                  <Icon
                    size={14}
                    className={isActive ? color : "text-muted-foreground"}
                  />
                )}
              </div>
              <span
                className={`text-sm ${
                  isDone
                    ? "text-muted-foreground line-through decoration-muted-foreground/40"
                    : isActive
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
              {isActive && (
                <AnimatePresence>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="ml-auto text-xs text-brand-400"
                  >
                    ●
                  </motion.span>
                </AnimatePresence>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Subtle sub-label */}
      <p className="mt-8 text-xs text-muted-foreground/60">
        This usually takes 5–15 seconds
      </p>
    </motion.div>
  );
}
