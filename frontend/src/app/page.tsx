"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import {
  Zap, Target, Brain, TrendingUp, ArrowRight,
  CheckCircle, Star, Shield, BarChart3
} from "lucide-react";

const features = [
  {
    icon: Target,
    title: "ATS Score Engine",
    desc: "Custom-built algorithm scores your resume against job descriptions with keyword, skill, and formatting analysis.",
    color: "text-brand-400",
    bg: "bg-brand-500/10",
  },
  {
    icon: Brain,
    title: "AI-Powered Suggestions",
    desc: "Llama 3.1 rewrites weak bullet points into achievement-focused statements with quantifiable impact.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: BarChart3,
    title: "Keyword Gap Analysis",
    desc: "NLP-driven comparison shows exactly which keywords you're missing and which ones you nailed.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: TrendingUp,
    title: "Score History",
    desc: "Track your ATS score improvements over time as you refine your resume for different roles.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const stats = [
  { value: "3x", label: "More interview callbacks" },
  { value: "87%", label: "Average score improvement" },
  { value: "2min", label: "Time to full analysis" },
  { value: "100+", label: "Skills recognized" },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-surface-950 bg-grid">
      {/* Radial glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 border-b border-white/5 glass">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-14 lg:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">ResumeIQ</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link href="/dashboard" className="btn-primary text-sm">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm">
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary text-sm">
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero — tighter vertical rhythm, laptop-first spacing */}
      <section className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-10 sm:pt-12 lg:pt-14 pb-12 lg:pb-16 text-center">
        <div className="mx-auto max-w-3xl lg:max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium mb-5 sm:mb-6 animate-fade-up">
            <Star size={12} />
            AI-powered ATS optimization
          </div>

          <h1 className="font-display font-bold text-[2.25rem] leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem] xl:text-7xl text-white mb-4 sm:mb-5 animate-fade-up-delay-1">
            Beat the ATS.
            <br />
            <span className="text-brand-400">Land the Interview.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl sm:max-w-2xl mx-auto mb-7 sm:mb-8 animate-fade-up-delay-2 leading-relaxed lg:leading-[1.65]">
            Upload your resume, paste any job description, and get an instant ATS
            compatibility score with AI-powered suggestions to maximize your chances.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 animate-fade-up-delay-3">
            <Link
              href={isAuthenticated ? "/upload" : "/register"}
              className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 flex items-center justify-center gap-2 glow"
            >
              Analyze My Resume
              <ArrowRight size={18} />
            </Link>
            <Link
              href={isAuthenticated ? "/history" : "/login"}
              className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-3.5 flex items-center justify-center"
            >
              View Sample Report
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-12 lg:mt-14 max-w-3xl mx-auto pt-8 sm:pt-10 border-t border-white/5">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center px-1">
              <div className="font-display font-bold text-2xl sm:text-3xl text-white mb-0.5 sm:mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-500 leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ATS dashboard preview */}
      <DashboardPreview />

      {/* Features */}
      <section className="relative max-w-7xl mx-auto px-6 sm:px-8 py-16 lg:py-20">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="font-display font-bold text-4xl text-white mb-4">
            Everything you need to get hired
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Our AI analyzes your resume from every angle — keywords, skills, formatting, and impact.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card card-hover p-6 group"
            >
              <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon size={20} className={feature.color} />
              </div>
              <h3 className="font-display font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl text-white mb-4">How it works</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { n: "01", title: "Upload Resume", desc: "Upload your PDF or DOCX resume. Our parser extracts all text content." },
            { n: "02", title: "Paste Job Description", desc: "Copy the job posting you want to apply to and paste it in." },
            { n: "03", title: "Get Your Score", desc: "Receive your ATS score, keyword gaps, and AI-powered improvements instantly." },
          ].map((step) => (
            <div key={step.n} className="text-center">
              <div className="font-display font-bold text-5xl text-brand-600/30 mb-4">{step.n}</div>
              <h3 className="font-display font-semibold text-white text-xl mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="card p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-violet-500/10" />
          <div className="relative">
            <Shield size={40} className="text-brand-400 mx-auto mb-6" />
            <h2 className="font-display font-bold text-4xl text-white mb-4">
              Ready to optimize your resume?
            </h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Join thousands of job seekers who improved their ATS score and landed more interviews.
            </p>
            <Link href={isAuthenticated ? "/upload" : "/register"} className="btn-primary text-base px-10 py-3.5 inline-flex items-center gap-2 glow">
              Start for Free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-brand-600 flex items-center justify-center">
              <Zap size={10} className="text-white" />
            </div>
            ResumeIQ
          </div>
          <div>Built with FastAPI, Next.js & Groq API</div>
        </div>
      </footer>
    </div>
  );
}
