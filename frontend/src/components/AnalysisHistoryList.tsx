import React from "react";
import { motion } from "framer-motion";
import { History, ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnalysisSummary } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface AnalysisHistoryListProps {
  history: AnalysisSummary[];
}

export default function AnalysisHistoryList({ history }: AnalysisHistoryListProps) {
  if (!history || history.length === 0) {
    return (
      <div className="card p-6 text-center text-slate-400">
        <History className="mx-auto mb-3 text-slate-500" size={24} />
        <p>No analysis history available yet.</p>
      </div>
    );
  }

  return (
    <div className="card p-6 bg-surface-900 border border-white/5">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <History className="text-brand-400" size={20} />
        Version History
      </h3>
      <div className="space-y-3">
        {history.map((run, idx) => (
          <motion.div
            key={run.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-brand-500/30 transition-colors"
          >
            <div>
              <p className="text-sm font-bold text-white">
                Score: {run.ats_score.toFixed(1)}
              </p>
              <p className="text-xs text-slate-400">
                {formatDistanceToNow(new Date(run.created_at), { addSuffix: true })}
              </p>
            </div>
            <Link 
              href={`/analysis/${run.id}`}
              className="p-2 rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500/20 transition-colors"
            >
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
