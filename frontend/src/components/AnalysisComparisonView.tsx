import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import clsx from "clsx";

interface CategoryDelta {
  category: string;
  old_score: number;
  new_score: number;
  delta: number;
}

interface AnalysisComparisonProps {
  comparison: {
    old_analysis_id: number;
    new_analysis_id: number;
    overall_score_delta: number;
    category_deltas: CategoryDelta[];
    improvements: string[];
    remaining_issues: string[];
  };
}

export default function AnalysisComparisonView({ comparison }: AnalysisComparisonProps) {
  if (!comparison) return null;
  const isOverallPositive = comparison.overall_score_delta > 0;
  
  return (
    <div className="card p-6 bg-surface-900 border border-white/5 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-brand-500/20 text-brand-400 rounded-xl">
          <Activity size={24} />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-white">Score Progress</h3>
          <p className="text-sm text-slate-400">Comparing current version to previous</p>
        </div>
        <div className="ml-auto text-right">
          <span className="text-xs text-slate-400 block mb-1 uppercase font-bold">Overall Delta</span>
          <span className={clsx(
            "inline-flex items-center gap-1 px-3 py-1 rounded-lg text-lg font-bold",
            isOverallPositive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
          )}>
            {isOverallPositive ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
            {isOverallPositive ? "+" : ""}
            {comparison.overall_score_delta.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {comparison.category_deltas.map((cat, idx) => {
          const isPos = cat.delta > 0;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between"
            >
              <span className="font-bold text-slate-300">{cat.category}</span>
              <span className={clsx(
                "font-mono text-sm font-bold flex items-center gap-1",
                isPos ? "text-emerald-400" : cat.delta === 0 ? "text-slate-500" : "text-red-400"
              )}>
                {cat.delta > 0 ? "+" : ""}{cat.delta.toFixed(1)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
