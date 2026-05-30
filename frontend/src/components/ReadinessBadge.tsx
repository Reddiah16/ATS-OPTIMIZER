import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface ReadinessBadgeProps {
  label: string;
}

export default function ReadinessBadge({ label }: ReadinessBadgeProps) {
  let colorClass = "bg-slate-500/20 text-slate-300 border-slate-500/30";
  let glowClass = "shadow-[0_0_15px_rgba(148,163,184,0.2)]";

  if (label === "Strong Fit") {
    colorClass = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    glowClass = "shadow-[0_0_15px_rgba(16,185,129,0.3)]";
  } else if (label === "Moderate Fit") {
    colorClass = "bg-brand-500/20 text-brand-400 border-brand-500/30";
    glowClass = "shadow-[0_0_15px_rgba(97,114,245,0.3)]";
  } else if (label === "Low Fit") {
    colorClass = "bg-red-500/20 text-red-400 border-red-500/30";
    glowClass = "shadow-[0_0_15px_rgba(239,68,68,0.3)]";
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide uppercase backdrop-blur-sm",
        colorClass,
        glowClass
      )}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={clsx(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            label === "Strong Fit" && "bg-emerald-400",
            label === "Moderate Fit" && "bg-brand-400",
            label === "Low Fit" && "bg-red-400",
            !["Strong Fit", "Moderate Fit", "Low Fit"].includes(label) && "bg-slate-400"
          )}
        ></span>
        <span
          className={clsx(
            "relative inline-flex rounded-full h-2 w-2",
            label === "Strong Fit" && "bg-emerald-500",
            label === "Moderate Fit" && "bg-brand-500",
            label === "Low Fit" && "bg-red-500",
            !["Strong Fit", "Moderate Fit", "Low Fit"].includes(label) && "bg-slate-500"
          )}
        ></span>
      </span>
      {label}
    </motion.div>
  );
}
