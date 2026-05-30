import React from "react";
import { motion } from "framer-motion";
import { FormattingChecks } from "@/types";
import { LayoutTemplate, AlertTriangle, Lightbulb } from "lucide-react";
import { ScoreBar } from "./ATSScoreGauge";

interface FormattingCheckCardProps {
  checks: FormattingChecks;
}

export default function FormattingCheckCard({ checks }: FormattingCheckCardProps) {
  if (!checks) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-6 border border-white/5 bg-surface-900"
    >
      <div className="flex items-center gap-2 mb-6">
        <LayoutTemplate className="text-amber-400" />
        <h3 className="text-xl font-display font-bold text-white">Formatting & ATS Rules</h3>
      </div>
      
      <div className="mb-6 max-w-sm">
        <ScoreBar label="Formatting Score" score={checks.formatting_score} maxScore={15} color="#fbbf24" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle size={16} className="text-red-400" /> Issues Detected
          </h4>
          {checks.issues && checks.issues.length > 0 ? (
            <ul className="space-y-2">
              {checks.issues.map((issue, idx) => (
                <li key={idx} className="text-sm text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5">
                  {issue}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No formatting issues detected.</p>
          )}
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Lightbulb size={16} className="text-emerald-400" /> Actionable Advice
          </h4>
          {checks.suggestions && checks.suggestions.length > 0 ? (
            <ul className="space-y-2">
              {checks.suggestions.map((sug, idx) => (
                <li key={idx} className="text-sm text-slate-300 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10">
                  {sug}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No formatting suggestions available.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
