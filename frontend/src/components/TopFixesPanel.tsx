import React from "react";
import { motion } from "framer-motion";
import { TopFix } from "@/types";
import { AlertCircle, TrendingUp, Lightbulb } from "lucide-react";
import clsx from "clsx";

interface TopFixesPanelProps {
  fixes: TopFix[];
}

export default function TopFixesPanel({ fixes }: TopFixesPanelProps) {
  if (!fixes || fixes.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
        <AlertCircle className="text-brand-400" />
        Prioritized Fixes
      </h3>
      <div className="grid gap-4">
        {fixes.map((fix, index) => {
          const isHigh = fix.severity.toLowerCase() === "high";
          const isMedium = fix.severity.toLowerCase() === "medium";
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-5 border border-white/5 bg-surface-900 flex flex-col md:flex-row gap-5 items-start md:items-center relative overflow-hidden group"
            >
              {/* Highlight bar */}
              <div 
                className={clsx(
                  "absolute left-0 top-0 bottom-0 w-1",
                  isHigh ? "bg-red-500" : isMedium ? "bg-amber-500" : "bg-emerald-500"
                )}
              />
              
              <div className="flex-grow pl-2">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-base font-bold text-white">{fix.title}</h4>
                  <span 
                    className={clsx(
                      "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border",
                      isHigh ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      isMedium ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    )}
                  >
                    {fix.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mb-3">{fix.why_it_matters}</p>
                <div className="flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
                  <Lightbulb size={16} className="text-brand-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-200">
                    <span className="font-semibold text-white">Action:</span> {fix.suggested_action}
                  </p>
                </div>
              </div>
              
              <div className="shrink-0 w-full md:w-auto bg-brand-500/10 border border-brand-500/20 rounded-xl p-4 flex flex-col items-center justify-center min-w-[140px]">
                <TrendingUp size={20} className="text-brand-400 mb-1" />
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Impact</span>
                <span className="text-sm font-bold text-brand-300 text-center">
                  {fix.estimated_score_impact}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
