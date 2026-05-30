import React from "react";
import { motion } from "framer-motion";
import { CategoryScoreDetail } from "@/types";
import { CheckCircle2, ChevronRight } from "lucide-react";

interface CategoryScoreCardProps {
  title: string;
  detail: CategoryScoreDetail;
  delay?: number;
}

export default function CategoryScoreCard({
  title,
  detail,
  delay = 0,
}: CategoryScoreCardProps) {
  const isHigh = detail.percentage >= 80;
  const isMedium = detail.percentage >= 50 && detail.percentage < 80;
  
  let ringColor = "text-red-500";
  if (isHigh) ringColor = "text-emerald-500";
  else if (isMedium) ringColor = "text-brand-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="card p-5 flex flex-col h-full bg-surface-900 border border-white/5 hover:border-white/10 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-display font-bold text-lg text-white">{title}</h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            SCORE: {detail.score.toFixed(1)} / {detail.max_weight}
          </p>
        </div>
        <div className="relative flex items-center justify-center w-12 h-12">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-700"
              strokeDasharray="100, 100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <motion.path
              className={ringColor}
              strokeDasharray={`${detail.percentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${detail.percentage}, 100` }}
              transition={{ duration: 1.5, delay: delay + 0.2 }}
            />
          </svg>
          <span className="absolute text-[10px] font-bold text-white">
            {Math.round(detail.percentage)}%
          </span>
        </div>
      </div>

      <div className="mb-4 flex-grow">
        <p className="text-sm text-slate-300 leading-relaxed">
          {detail.explanation}
        </p>
      </div>

      {detail.suggestions && detail.suggestions.length > 0 && (
        <div className="mt-auto pt-4 border-t border-white/5">
          <h4 className="text-xs font-semibold text-slate-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <ChevronRight size={14} className="text-brand-400" />
            Suggestions
          </h4>
          <ul className="space-y-2.5">
            {detail.suggestions.map((sug, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle2 size={14} className="text-brand-500 mt-0.5 shrink-0" />
                <span className="leading-snug">{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
