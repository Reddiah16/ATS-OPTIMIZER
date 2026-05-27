"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Search, Sparkles, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface KeywordAnalysisProps {
  matchedKeywords: string[];
  missingKeywords: string[];
  matchPercentage: number;
}

export default function KeywordAnalysis({
  matchedKeywords,
  missingKeywords,
  matchPercentage,
}: KeywordAnalysisProps) {
  const [filter, setFilter] = useState<"all" | "matched" | "missing">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const total = matchedKeywords.length + missingKeywords.length;

  // Combine keywords with meta metadata
  const keywords = [
    ...matchedKeywords.map((word) => ({ word, matched: true })),
    ...missingKeywords.map((word) => ({ word, matched: false })),
  ];

  // Filter based on selected tab and search query
  const filteredKeywords = keywords.filter((kw) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "matched" && kw.matched) ||
      (filter === "missing" && !kw.matched);
    const matchesSearch = kw.word.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Visual Progress Header */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[100px] bg-brand-500/5 rounded-full blur-[40px] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-brand-400" />
                Keyword Relevance Score
              </span>
              <span className="font-mono text-white text-xs">
                {matchedKeywords.length} <span className="text-slate-500">/ {total} matched</span>
              </span>
            </div>
            
            <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${matchPercentage}%` }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-brand-500 via-violet-500 to-emerald-500"
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
              <span>0% (Poor Fit)</span>
              <span>{matchPercentage}% Match Rate</span>
              <span>100% (Perfect Fit)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Quick Filter Tabs */}
        <div className="flex p-0.5 bg-white/5 border border-white/5 rounded-xl w-full md:w-auto">
          {(["all", "matched", "missing"] as const).map((type) => {
            const label = type === "all" ? "All" : type === "matched" ? "Matched" : "Missing";
            const count =
              type === "all"
                ? total
                : type === "matched"
                ? matchedKeywords.length
                : missingKeywords.length;
            const isActive = filter === type;

            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={clsx(
                  "relative flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-1.5",
                  isActive ? "text-white" : "text-slate-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeKeywordTab"
                    className="absolute inset-0 bg-white/10 rounded-lg border border-white/5"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
                <span
                  className={clsx(
                    "relative z-10 px-1.5 py-0.5 rounded-md text-[10px] font-mono",
                    isActive ? "bg-white/10" : "bg-white/5"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Real-time Search Box */}
        <div className="relative w-full md:w-[220px]">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-white/5 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/10 transition-all duration-200"
          />
        </div>
      </div>

      {/* Heatmap Keyword Badges Grid */}
      <motion.div 
        layout
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 min-h-[120px]"
      >
        <AnimatePresence mode="popLayout">
          {filteredKeywords.length > 0 ? (
            filteredKeywords.map(({ word, matched }) => (
              <motion.div
                key={word}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                whileHover={{ scale: 1.03, y: -1 }}
                className={clsx(
                  "p-3 rounded-xl border flex items-center justify-between gap-2.5 transition-shadow duration-300 relative group cursor-pointer overflow-hidden",
                  matched
                    ? "bg-emerald-500/[0.02] border-emerald-500/15 text-emerald-300 hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.06)]"
                    : "bg-red-500/[0.02] border-red-500/15 text-red-300 hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.06)]"
                )}
              >
                {/* Micro-glow highlights */}
                <div 
                  className={clsx(
                    "absolute -right-4 -bottom-4 w-12 h-12 rounded-full blur-[15px] opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none",
                    matched ? "bg-emerald-400" : "bg-red-400"
                  )} 
                />

                <span className="text-xs font-mono font-medium truncate tracking-tight">{word}</span>
                
                <span className="shrink-0 flex items-center">
                  {matched ? (
                    <CheckCircle2 size={13} className="text-emerald-400/80 group-hover:text-emerald-400 transition-colors" />
                  ) : (
                    <XCircle size={13} className="text-red-400/80 group-hover:text-red-400 transition-colors" />
                  )}
                </span>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-10 flex flex-col items-center justify-center text-center text-slate-500"
            >
              <Filter size={24} className="mb-2 text-slate-600 opacity-60" />
              <p className="text-xs font-medium">No matching keywords found</p>
              <p className="text-[10px] text-slate-600">Try adjusting your filters or query</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Helpful Hint */}
      {filter !== "matched" && missingKeywords.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-2 border-t border-white/5"
        >
          <span>💡</span>
          <span>
            <strong>Pro Tip:</strong> Integrating <span className="text-red-400 font-mono">missing keywords</span> naturally inside your professional summary and experience sections will dynamically boost your score.
          </span>
        </motion.div>
      )}
    </div>
  );
}
