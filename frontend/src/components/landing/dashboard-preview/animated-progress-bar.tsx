"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type AnimatedProgressBarProps = {
  label: string;
  value: number;
  max: number;
  color?: string;
  showValue?: boolean;
  delay?: number;
  size?: "sm" | "md";
};

export function AnimatedProgressBar({
  label,
  value,
  max,
  color = "#6172f5",
  showValue = true,
  delay = 0,
  size = "md",
}: AnimatedProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-32px" });
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400">{label}</span>
        {showValue && (
          <span className="font-mono text-xs font-medium text-white">
            {value}
            <span className="text-slate-500">/{max}</span>
          </span>
        )}
      </div>
      <div
        className={cn(
          "overflow-hidden rounded-full bg-white/5",
          size === "sm" ? "h-1.5" : "h-2"
        )}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}dd, ${color})`,
            boxShadow: `0 0 12px ${color}40`,
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{
            duration: 0.9,
            delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </div>
  );
}

type CoverageBarProps = {
  label: string;
  percentage: number;
  matched: number;
  total: number;
  gradient?: string;
  delay?: number;
};

export function CoverageBar({
  label,
  percentage,
  matched,
  total,
  gradient = "linear-gradient(90deg, #34d399, #10b981)",
  delay = 0,
}: CoverageBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-32px" });

  return (
    <div ref={ref}>
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono text-white">
          {matched}
          <span className="text-slate-500">/{total}</span>
          <span className="ml-2 text-emerald-400">{percentage}%</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <motion.div
          className="h-full rounded-full"
          style={{ background: gradient }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${percentage}%` } : { width: 0 }}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
