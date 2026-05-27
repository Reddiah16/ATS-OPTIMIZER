"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthCardProps = {
  children: React.ReactNode;
  className?: string;
  showLogo?: boolean;
};

export function AuthCard({
  children,
  className,
  showLogo = true,
}: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        // Glassmorphism
        "border border-white/10 dark:border-white/8",
        "bg-white/80 dark:bg-white/5",
        "backdrop-blur-2xl",
        // Shadow
        "shadow-[0_8px_32px_hsl(228_30%_4%/0.18),0_2px_8px_hsl(228_30%_4%/0.10)]",
        "dark:shadow-[0_8px_48px_hsl(228_30%_2%/0.6),0_2px_12px_hsl(228_30%_2%/0.4)]",
        className
      )}
    >
      {/* Gradient shimmer overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/[0.06] via-transparent to-violet-500/[0.08]"
        aria-hidden
      />

      {/* Subtle top border highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden
      />

      <div className="relative p-6 sm:p-8">
        {showLogo && (
          <div className="mb-6 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 shadow-[0_0_16px_hsl(243_75%_59%/0.4)] transition-shadow group-hover:shadow-[0_0_24px_hsl(243_75%_59%/0.6)]">
                <Zap size={15} className="text-white" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                ResumeIQ
              </span>
            </Link>
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
}
