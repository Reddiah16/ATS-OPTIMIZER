import React from "react";
import { motion } from "framer-motion";
import { KeywordGrouping } from "@/types";
import { Search, CheckCircle, XCircle, ArrowRight, Lightbulb } from "lucide-react";

interface KeywordGroupCardsProps {
  grouping: KeywordGrouping;
}

export default function KeywordGroupCards({ grouping }: KeywordGroupCardsProps) {
  if (!grouping) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Search className="text-brand-400" />
        <h3 className="text-xl font-display font-bold text-white">Keyword Intelligence</h3>
        <span className="ml-auto text-sm font-bold bg-brand-500/20 text-brand-400 px-3 py-1 rounded-full border border-brand-500/30">
          Match: {Math.round(grouping.keyword_match_percentage)}%
        </span>
      </div>
      
      {grouping.explanation && (
        <p className="text-sm text-slate-300 bg-white/5 p-4 rounded-xl border border-white/5">
          {grouping.explanation}
        </p>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Missing Required */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 border border-red-500/20 bg-red-500/5"
        >
          <h4 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
            <XCircle size={16} /> Missing Required Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {grouping.missing_required_keywords.length > 0 ? (
              grouping.missing_required_keywords.map((kw, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20">
                  {kw}
                  {grouping.suggested_section_for_each_missing_keyword[kw] && (
                    <span className="ml-1 text-[9px] opacity-70">
                      → {grouping.suggested_section_for_each_missing_keyword[kw]}
                    </span>
                  )}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">None missing!</span>
            )}
          </div>
        </motion.div>

        {/* Matched Required */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-5 border border-emerald-500/20 bg-emerald-500/5"
        >
          <h4 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
            <CheckCircle size={16} /> Matched Required Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {grouping.matched_required_keywords.length > 0 ? (
              grouping.matched_required_keywords.map((kw, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {kw}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">No matches found.</span>
            )}
          </div>
        </motion.div>

        {/* Equivalent Skills */}
        {grouping.equivalent_skill_matches && grouping.equivalent_skill_matches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-5 border border-brand-500/20 bg-brand-500/5 lg:col-span-2"
          >
            <h4 className="text-sm font-bold text-brand-400 mb-3 flex items-center gap-2">
              <Lightbulb size={16} /> Equivalent Skill Matches (ATS Warning)
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              You have these skills, but ATS systems look for exact matches. Consider renaming them to match the job description.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {grouping.equivalent_skill_matches.map((eq, idx) => (
                <div key={idx} className="bg-surface-900 border border-white/5 p-3 rounded-lg flex items-center gap-3">
                  <span className="text-sm text-slate-400 line-through decoration-red-500/50">
                    {eq.candidate_equivalent}
                  </span>
                  <ArrowRight size={14} className="text-brand-500" />
                  <span className="text-sm font-bold text-emerald-400">
                    {eq.job_requirement}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
