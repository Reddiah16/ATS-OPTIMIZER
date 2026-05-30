import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import clsx from "clsx";

interface ScoreDeltaBadgeProps {
  delta: number;
}

export default function ScoreDeltaBadge({ delta }: ScoreDeltaBadgeProps) {
  if (delta === 0) return null;
  const isPositive = delta > 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: -10 }}
        className={clsx(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold tracking-wider",
          isPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
        )}
      >
        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {isPositive ? "+" : ""}
        {delta.toFixed(1)}
      </motion.div>
    </AnimatePresence>
  );
}
