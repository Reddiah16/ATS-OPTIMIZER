"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { analysisApi, getErrorMessage } from "@/lib/api";
import { notify } from "@/lib/toast";
import { DashboardSkeleton } from "@/components/loading";
import { ErrorState } from "@/components/error";
import Navbar from "@/components/Navbar";
import ATSScoreGauge from "@/components/ATSScoreGauge";
import { AnalysisSummary } from "@/types";
import {
  History, ArrowRight, Upload, Search, Calendar,
  TrendingUp, Target, Filter
} from "lucide-react";
import clsx from "clsx";

function scoreLabel(s: number) {
  if (s >= 80) return { label: "Excellent", cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
  if (s >= 60) return { label: "Good", cls: "text-brand-400 bg-brand-500/10 border-brand-500/20" };
  if (s >= 40) return { label: "Fair", cls: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
  return { label: "Needs Work", cls: "text-red-400 bg-red-500/10 border-red-500/20" };
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalysisSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const limit = 10;

  const fetchHistory = () => {
    setLoading(true);
    setError(null);
    analysisApi
      .getHistory(page * limit, limit)
      .then((r) => {
        setAnalyses(r.data.analyses || []);
        setTotal(r.data.total || 0);
      })
      .catch((e) => {
        const message = getErrorMessage(e);
        setError(message);
        notify.error(message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const filtered = analyses.filter(a =>
    !search ||
    (a.job_title || "").toLowerCase().includes(search.toLowerCase()) ||
    a.resume_filename.toLowerCase().includes(search.toLowerCase())
  );

  const avgScore = analyses.length > 0
    ? Math.round(analyses.reduce((s, a) => s + a.ats_score, 0) / analyses.length)
    : 0;
  const bestScore = analyses.length > 0 ? Math.max(...analyses.map(a => a.ats_score)) : 0;

  if (loading) {
    return (
      <>
        <Navbar />
        <DashboardSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-950">
        <Navbar />
        <div className="mx-auto max-w-lg px-6 py-16">
          <ErrorState message={error} onRetry={fetchHistory} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 bg-grid">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-brand-500/3 rounded-full blur-[100px]" />
      </div>
      <Navbar />

      <main className="relative max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 animate-fade-up">
          <div>
            <h1 className="font-display font-bold text-3xl text-white mb-1">Analysis History</h1>
            <p className="text-slate-400">Track your ATS score progress over time</p>
          </div>
          <Link href="/upload" className="btn-primary flex items-center gap-2 text-sm">
            <Upload size={14} />
            New Analysis
          </Link>
        </div>

        {/* Stats */}
        {analyses.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-up-delay-1">
            <div className="card p-4 text-center">
              <p className="font-display font-bold text-2xl text-white">{total}</p>
              <p className="text-xs text-slate-500 mt-0.5">Total Analyses</p>
            </div>
            <div className="card p-4 text-center">
              <p className="font-display font-bold text-2xl text-white">{avgScore}%</p>
              <p className="text-xs text-slate-500 mt-0.5">Average Score</p>
            </div>
            <div className="card p-4 text-center">
              <p className="font-display font-bold text-2xl text-white">{bestScore}%</p>
              <p className="text-xs text-slate-500 mt-0.5">Best Score</p>
            </div>
          </div>
        )}

        {/* Search */}
        {analyses.length > 0 && (
          <div className="relative mb-6 animate-fade-up-delay-2">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by job title or resume…"
              className="input pl-10 text-sm"
            />
          </div>
        )}

        {/* List */}
        <div className="animate-fade-up-delay-2">
          {filtered.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-5">
                <History size={28} className="text-brand-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                {search ? "No results found" : "No analyses yet"}
              </h3>
              <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
                {search
                  ? "Try a different search term"
                  : "Upload a resume and paste a job description to run your first analysis"}
              </p>
              {!search && (
                <Link href="/upload" className="btn-primary inline-flex items-center gap-2">
                  <Upload size={15} /> Get Started
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {filtered.map((analysis) => {
                  const { label, cls } = scoreLabel(analysis.ats_score);
                  return (
                    <Link
                      key={analysis.id}
                      href={`/analysis/${analysis.id}`}
                      className="flex items-center gap-5 p-4 card card-hover group transition-all"
                    >
                      <ATSScoreGauge score={analysis.ats_score} size="sm" showLabel={false} animate={false} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-white truncate">
                            {analysis.job_title || "Untitled Position"}
                          </p>
                          <span className={clsx("text-xs px-2 py-0.5 rounded-lg border shrink-0", cls)}>
                            {label}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 truncate">{analysis.resume_filename}</p>
                        <div className="flex items-center gap-4 mt-1.5 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(analysis.created_at).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric"
                            })}
                          </span>
                          <span className="text-emerald-500">{analysis.matched_keywords_count} matched</span>
                          <span className="text-red-500">{analysis.missing_keywords_count} missing</span>
                        </div>
                      </div>

                      <ArrowRight
                        size={16}
                        className="text-slate-600 group-hover:text-brand-400 transition-colors shrink-0"
                      />
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {total > limit && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                  <p className="text-sm text-slate-500">
                    Showing {page * limit + 1}–{Math.min((page + 1) * limit, total)} of {total}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(p => p - 1)}
                      disabled={page === 0}
                      className="btn-secondary text-xs px-4 py-2 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={(page + 1) * limit >= total}
                      className="btn-secondary text-xs px-4 py-2 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
