import React from "react";
import { motion } from "framer-motion";
import { BulletAnalysisItem } from "@/types";
import { Zap, AlertCircle, ArrowRight, Check } from "lucide-react";
import clsx from "clsx";

interface BulletAnalysisCardProps {
  bullets: BulletAnalysisItem[];
}

export default function BulletAnalysisCard({ bullets }: BulletAnalysisCardProps) {
  if (!bullets || bullets.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
        <Zap className="text-brand-400" />
        Experience Bullet Optimization
      </h3>
      <div className="grid gap-4">
        {bullets.map((bullet, index) => {
          const score = bullet.bullet_score;
          const isGood = score >= 8;
          const isAverage = score >= 5 && score < 8;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="card p-5 border border-white/5 bg-surface-900 grid lg:grid-cols-2 gap-6 relative overflow-hidden"
            >
              {/* Score Indicator */}
              <div
                className={clsx(
                  "absolute top-0 right-0 px-3 py-1 text-[10px] font-bold rounded-bl-xl uppercase tracking-wider",
                  isGood ? "bg-emerald-500/20 text-emerald-400" :
                  isAverage ? "bg-amber-500/20 text-amber-400" :
                  "bg-red-500/20 text-red-400"
                )}
              >
                Score: {score}/10
              </div>

              {/* Original Section */}
              <div className="space-y-3 pr-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Original Bullet</h4>
                <p className="text-sm text-slate-400 italic bg-white/5 p-4 rounded-xl border border-white/5">
                  "{bullet.original_text}"
                </p>
                
                {bullet.issues && bullet.issues.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-[10px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1 mb-2">
                      <AlertCircle size={12} /> Weaknesses Detected
                    </h5>
                    <ul className="space-y-1">
                      {bullet.issues.map((issue, idx) => (
                        <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                          <span className="text-red-500/50 mt-0.5">•</span> {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Improved Section */}
              <div className="space-y-3 relative lg:pl-6 lg:border-l border-white/10">
                <div className="hidden lg:flex absolute -left-3 top-6 h-6 w-6 rounded-full bg-surface-900 border border-white/10 items-center justify-center text-brand-400">
                  <ArrowRight size={12} />
                </div>
                
                <h4 className="text-xs font-bold text-brand-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Check size={14} /> AI Optimized Rewrite
                </h4>
                <p className="text-sm text-white font-medium bg-brand-500/10 p-4 rounded-xl border border-brand-500/20 leading-relaxed shadow-[0_0_15px_rgba(97,114,245,0.1)]">
                  {bullet.improved_text}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
