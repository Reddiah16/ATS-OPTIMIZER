"use client";

import { useState } from "react";
import { 
  Brain, 
  ChevronDown, 
  ChevronUp, 
  Wand2, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ArrowRightLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { AISuggestion, ImprovedBullet } from "@/types";

const categoryStyles: Record<string, { bg: string; border: string; text: string; iconColor: string }> = {
  "Action Verbs": { 
    bg: "bg-violet-500/5", 
    border: "border-violet-500/20 hover:border-violet-500/40", 
    text: "text-violet-300", 
    iconColor: "text-violet-400" 
  },
  "Missing Keywords": { 
    bg: "bg-red-500/5", 
    border: "border-red-500/20 hover:border-red-500/40", 
    text: "text-red-300", 
    iconColor: "text-red-400" 
  },
  "Quantifiable Achievements": { 
    bg: "bg-amber-500/5", 
    border: "border-amber-500/20 hover:border-amber-500/40", 
    text: "text-amber-300", 
    iconColor: "text-amber-400" 
  },
  "Grammar": { 
    bg: "bg-blue-500/5", 
    border: "border-blue-500/20 hover:border-blue-500/40", 
    text: "text-blue-300", 
    iconColor: "text-blue-400" 
  },
  "Formatting": { 
    bg: "bg-slate-500/5", 
    border: "border-slate-500/20 hover:border-slate-500/40", 
    text: "text-slate-300", 
    iconColor: "text-slate-400" 
  },
  default: { 
    bg: "bg-brand-500/5", 
    border: "border-brand-500/20 hover:border-brand-500/40", 
    text: "text-brand-300", 
    iconColor: "text-brand-400" 
  },
};

function getCategoryStyle(category: string) {
  return categoryStyles[category] || categoryStyles.default;
}

// Inline comparison highlighters for a "diff" effect
function highlightDiffs(original: string, improved: string) {
  // A simple visual highlighter showing modifications. We split words and cross-reference them.
  const originalWords = original.split(/\s+/);
  const improvedWords = improved.split(/\s+/);
  
  return (
    <div className="space-y-3.5">
      <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-red-500/[0.02] border border-red-500/10">
        <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider font-mono">Original Resume Bullet</span>
        <p className="text-xs text-slate-300 font-mono leading-relaxed">
          {originalWords.map((word, i) => {
            const isWordRemoved = !improvedWords.includes(word);
            return (
              <span key={i} className={clsx("inline-block mr-1", isWordRemoved && "bg-red-500/15 text-red-200 line-through px-0.5 rounded")}>
                {word}
              </span>
            );
          })}
        </p>
      </div>
      
      <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10">
        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">AI Recommended Rewrite</span>
        <p className="text-xs text-white font-mono leading-relaxed">
          {improvedWords.map((word, i) => {
            const isWordAdded = !originalWords.includes(word);
            return (
              <span key={i} className={clsx("inline-block mr-1", isWordAdded && "bg-emerald-500/15 text-emerald-100 font-bold px-0.5 rounded")}>
                {word}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}

interface SuggestionCardProps {
  suggestion: AISuggestion;
  index: number;
}

function SuggestionCard({ suggestion, index }: SuggestionCardProps) {
  const [expanded, setExpanded] = useState(index < 2);
  const [copied, setCopied] = useState(false);
  const style = getCategoryStyle(suggestion.category);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!suggestion.improved) return;
    navigator.clipboard.writeText(suggestion.improved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      layout
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        "rounded-2xl border transition-all duration-300 overflow-hidden glass",
        style.border
      )}
    >
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="text-xs text-slate-500 font-mono w-5 tracking-tight">{String(index + 1).padStart(2, "0")}</span>
          
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={clsx(
                "text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-lg border",
                style.bg,
                style.text,
                "border-white/5"
              )}
            >
              {suggestion.category}
            </span>
          </div>

          <p className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-md">
            {suggestion.explanation.slice(0, 75)}...
          </p>
        </div>

        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-5 pb-5 pt-2 border-t border-white/5 space-y-4">
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                {suggestion.explanation}
              </p>

              {(suggestion.original || suggestion.improved) && (
                <div className="relative group/diff mt-4">
                  {suggestion.improved && (
                    <button
                      onClick={handleCopy}
                      className="absolute right-3.5 top-3 z-30 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
                      title="Copy rewrite"
                    >
                      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  )}

                  {highlightDiffs(suggestion.original || "", suggestion.improved || "")}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface ImprovedBulletProps {
  bullet: ImprovedBullet;
  index: number;
}

function ImprovedBulletCard({ bullet, index }: ImprovedBulletProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(bullet.improved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors relative group overflow-hidden"
    >
      {/* Visual background gradient blob on hover */}
      <div className="absolute -right-16 -top-16 w-32 h-32 bg-brand-500/5 rounded-full blur-[35px] pointer-events-none group-hover:bg-brand-500/10 transition-colors duration-500" />

      {/* Copy utility */}
      <button
        onClick={handleCopy}
        className="absolute right-4 top-4 p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-1.5"
      >
        {copied ? (
          <>
            <Check size={12} className="text-emerald-400" />
            <span className="text-[10px] font-semibold text-emerald-400 font-mono">Copied!</span>
          </>
        ) : (
          <>
            <Copy size={12} />
            <span className="text-[10px] font-semibold font-mono">Copy</span>
          </>
        )}
      </button>

      <span className="text-xs text-slate-500 font-mono tracking-tight block mb-4">REWRITE SUGGESTION {String(index + 1).padStart(2, "0")}</span>

      {/* Grid Side-by-Side comparative structure */}
      <div className="grid md:grid-cols-11 gap-4 items-center relative">
        {/* Before */}
        <div className="md:col-span-5 flex flex-col gap-1.5 p-4 rounded-xl bg-red-500/[0.01] border border-red-500/10 hover:border-red-500/20 transition-all duration-300">
          <div className="flex items-center gap-2 text-[10px] text-red-400 font-bold uppercase tracking-wider font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Before
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">{bullet.original}</p>
        </div>

        {/* Transition arrow indicator */}
        <div className="md:col-span-1 flex justify-center text-slate-600 group-hover:text-brand-400 transition-colors">
          <ArrowRightLeft size={16} className="rotate-90 md:rotate-0" />
        </div>

        {/* After */}
        <div className="md:col-span-5 flex flex-col gap-1.5 p-4 rounded-xl bg-emerald-500/[0.01] border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300 relative">
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Optimized (Impact-Driven)
          </div>
          <p className="text-xs text-white leading-relaxed font-mono">{bullet.improved}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface AISuggestionsProps {
  suggestions: AISuggestion[];
  improvedBullets: ImprovedBullet[];
  strengths: string[];
  weaknesses: string[];
}

export default function AISuggestions({
  suggestions,
  improvedBullets,
  strengths,
  weaknesses,
}: AISuggestionsProps) {
  const [activeTab, setActiveTab] = useState<"suggestions" | "bullets" | "analysis">("suggestions");

  const tabs = [
    { id: "suggestions" as const, label: "AI Suggestions", count: suggestions.length },
    { id: "bullets" as const, label: "Bullet Rewrites", count: improvedBullets.length },
    { id: "analysis" as const, label: "SWOT Analysis", count: strengths.length + weaknesses.length },
  ];

  return (
    <div className="space-y-6">
      {/* AI Badge header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-500/15 border border-brand-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(97,114,245,0.15)]">
            <Brain size={16} className="text-brand-400" />
          </div>
          <div>
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              AI-Powered Evaluation
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-lg bg-brand-500/10 text-brand-300 border border-brand-500/20 uppercase tracking-widest">PRO</span>
            </span>
            <p className="text-[10px] text-slate-500 font-medium">Expert feedback generated on-demand by GPT-4</p>
          </div>
        </div>
      </div>

      {/* Glass Tab switcher */}
      <div className="flex gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-2xl relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex-1 relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-300",
                isActive ? "text-white" : "text-slate-400 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSuggestionsTab"
                  className="absolute inset-0 bg-brand-600 rounded-xl border border-brand-500/30 shadow-[0_0_20px_rgba(97,114,245,0.25)]"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              {tab.count > 0 && (
                <span className={clsx(
                  "relative z-10 text-[10px] font-mono px-2 py-0.5 rounded-lg transition-all",
                  isActive ? "bg-white/20" : "bg-white/5"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels with AnimatePresence transitions */}
      <div className="min-h-[220px]">
        <AnimatePresence mode="wait">
          {activeTab === "suggestions" && (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              {suggestions.length > 0 ? (
                suggestions.map((s, i) => (
                  <SuggestionCard key={i} suggestion={s} index={i} />
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500">
                  <Sparkles size={24} className="mb-2 text-slate-600 opacity-60 animate-pulse-glow" />
                  <p className="text-xs font-semibold">Outstanding Resume formatting</p>
                  <p className="text-[10px] text-slate-600">No suggestions needed at this time!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "bullets" && (
            <motion.div
              key="bullets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {improvedBullets.length > 0 ? (
                improvedBullets.map((b, i) => (
                  <ImprovedBulletCard key={i} bullet={b} index={i} />
                ))
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-slate-500">
                  <Wand2 size={24} className="mb-2 text-slate-600 opacity-60" />
                  <p className="text-xs font-semibold">Perfect wording</p>
                  <p className="text-[10px] text-slate-600">All bullets scored maximum points for action verbs and impact metrics.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "analysis" && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid sm:grid-cols-2 gap-5"
            >
              {/* Strengths Card */}
              <div className="p-5 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.005] space-y-4">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-xs">
                    <TrendingUp size={12} />
                  </span>
                  Strengths
                  <span className="ml-auto text-[10px] font-mono bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/10">
                    {strengths.length}
                  </span>
                </h4>
                
                <ul className="space-y-3">
                  {strengths.map((s, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed"
                    >
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses Card */}
              <div className="p-5 rounded-2xl border border-amber-500/10 bg-amber-500/[0.005] space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center text-xs">
                    <ShieldAlert size={12} />
                  </span>
                  Optimizations Needed
                  <span className="ml-auto text-[10px] font-mono bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/10">
                    {weaknesses.length}
                  </span>
                </h4>
                
                <ul className="space-y-3">
                  {weaknesses.map((w, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed"
                    >
                      <AlertCircle size={13} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
