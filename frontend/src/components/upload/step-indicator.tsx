"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UploadStep } from "./types";

const STEPS: { key: UploadStep; label: string; description: string }[] = [
  { key: "upload", label: "Upload", description: "Choose your resume" },
  { key: "describe", label: "Job Details", description: "Paste description" },
  { key: "analyzing", label: "Analysis", description: "AI processing" },
];

interface StepIndicatorProps {
  current: UploadStep;
  className?: string;
}

export function StepIndicator({ current, className }: StepIndicatorProps) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);

  return (
    <nav
      aria-label="Upload progress"
      className={cn("flex items-center justify-center gap-0", className)}
    >
      {STEPS.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isActive = idx === currentIdx;

        return (
          <div key={step.key} className="flex items-center">
            {/* Step node */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                {/* Glow for active */}
                {isActive && (
                  <motion.div
                    layoutId="step-glow"
                    className="absolute -inset-2 rounded-full bg-brand-500/25 blur-md"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? "hsl(160 55% 48%)"
                      : isActive
                      ? "hsl(243 75% 59%)"
                      : "transparent",
                    borderColor: isCompleted
                      ? "hsl(160 55% 48%)"
                      : isActive
                      ? "hsl(243 75% 59%)"
                      : "hsl(var(--border))",
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex h-8 w-8 items-center justify-center rounded-full border-2"
                >
                  {isCompleted ? (
                    <CheckCircle2 size={14} className="text-white" />
                  ) : isActive ? (
                    <motion.span
                      className="h-2 w-2 rounded-full bg-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  ) : (
                    <Circle size={10} className="text-muted-foreground/30" />
                  )}
                </motion.div>
              </div>

              {/* Label */}
              <div className="text-center">
                <p
                  className={cn(
                    "text-xs font-semibold leading-tight transition-colors",
                    isActive
                      ? "text-foreground"
                      : isCompleted
                      ? "text-emerald-500"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                <p
                  className={cn(
                    "hidden sm:block text-[10px] transition-colors",
                    isActive ? "text-muted-foreground" : "text-muted-foreground/50"
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div className="relative mx-3 mb-5 h-px w-16 sm:w-24 overflow-hidden rounded-full bg-border">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-brand-500"
                  animate={{ width: idx < currentIdx ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
