"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type DashboardPanelProps = {
  title: string;
  icon?: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "danger" | "ai";
  className?: string;
  children: React.ReactNode;
  delay?: number;
};

const badgeStyles = {
  default: "bg-white/5 text-slate-400 border-white/10",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-red-500/10 text-red-400 border-red-500/20",
  ai: "bg-violet-500/10 text-violet-300 border-violet-500/20",
};

export function DashboardPanel({
  title,
  icon: Icon,
  badge,
  badgeVariant = "default",
  className,
  children,
  delay = 0,
}: DashboardPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-xl border border-white/8 bg-white/[0.03] p-4 sm:p-5",
        "backdrop-blur-sm transition-theme",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/15">
              <Icon size={15} className="text-brand-400" />
            </div>
          )}
          <h3 className="font-display text-sm font-semibold text-white truncate">
            {title}
          </h3>
        </div>
        {badge && (
          <span
            className={cn(
              "shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
              badgeStyles[badgeVariant]
            )}
          >
            {badge}
          </span>
        )}
      </div>
      {children}
    </motion.div>
  );
}
