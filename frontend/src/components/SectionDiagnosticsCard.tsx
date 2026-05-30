import React from "react";
import { motion } from "framer-motion";
import { SectionDiagnostic } from "@/types";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import clsx from "clsx";

interface SectionDiagnosticsCardProps {
  diagnostics: SectionDiagnostic[];
}

export default function SectionDiagnosticsCard({ diagnostics }: SectionDiagnosticsCardProps) {
  if (!diagnostics || diagnostics.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
        Section Diagnostics
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {diagnostics.map((diag, index) => {
          const isHighRisk = diag.ats_risk.toLowerCase().includes("high");
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-5 border border-white/5 bg-surface-900"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {diag.present ? (
                    <CheckCircle className="text-emerald-400 shrink-0" size={18} />
                  ) : (
                    <XCircle className="text-red-400 shrink-0" size={18} />
                  )}
                  <h4 className="font-bold text-white text-lg">{diag.section_name}</h4>
                </div>
                <div className="text-right">
                  <span
                    className={clsx(
                      "text-[10px] uppercase font-bold px-2 py-0.5 rounded border tracking-wider",
                      isHighRisk
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    )}
                  >
                    Risk: {diag.ats_risk}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-400">
                  <span>Completeness</span>
                  <span>{diag.completeness_score.toFixed(1)}/10</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      "h-full rounded-full",
                      diag.completeness_score >= 8
                        ? "bg-emerald-400"
                        : diag.completeness_score >= 5
                        ? "bg-brand-400"
                        : "bg-red-400"
                    )}
                    style={{ width: `${(diag.completeness_score / 10) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-slate-300 mb-3">{diag.quality}</p>

              {diag.issues && diag.issues.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {diag.issues.map((issue, idx) => (
                    <div key={idx} className="flex gap-2 text-xs text-red-300 items-start bg-red-500/5 p-2 rounded">
                      <AlertTriangle size={14} className="shrink-0 mt-0.5 text-red-400" />
                      <span>{issue}</span>
                    </div>
                  ))}
                </div>
              )}

              {diag.suggestions && diag.suggestions.length > 0 && (
                <div className="mt-3 pl-2 border-l-2 border-brand-500/30">
                  {diag.suggestions.map((sug, idx) => (
                    <p key={idx} className="text-xs text-brand-200 mb-1 last:mb-0">
                      • {sug}
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
