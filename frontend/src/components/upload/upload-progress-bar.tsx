"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadProgressBarProps {
  /** 0–100 */
  progress: number;
  status: "idle" | "uploading" | "processing" | "success" | "error";
  filename?: string;
  errorMessage?: string;
  className?: string;
}

const STATUS_CONFIG = {
  idle: { color: "bg-muted", label: "" },
  uploading: { color: "bg-gradient-to-r from-brand-500 to-violet-500", label: "Uploading…" },
  processing: { color: "bg-gradient-to-r from-violet-500 to-indigo-500", label: "Parsing resume…" },
  success: { color: "bg-gradient-to-r from-emerald-500 to-teal-500", label: "Upload complete" },
  error: { color: "bg-gradient-to-r from-red-500 to-rose-500", label: "Upload failed" },
} as const;

export function UploadProgressBar({
  progress,
  status,
  filename,
  errorMessage,
  className,
}: UploadProgressBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const config = STATUS_CONFIG[status];
  const isActive = status === "uploading" || status === "processing";

  // Smooth number interpolation
  useEffect(() => {
    const timer = setTimeout(() => setDisplayProgress(progress), 50);
    return () => clearTimeout(timer);
  }, [progress]);

  if (status === "idle") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="progress-bar"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn("overflow-hidden", className)}
      >
        <div className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm">
          {/* Header row */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {status === "uploading" || status === "processing" ? (
                <Loader2 size={14} className="animate-spin text-brand-400" />
              ) : status === "success" ? (
                <CheckCircle2 size={14} className="text-emerald-400" />
              ) : (
                <XCircle size={14} className="text-destructive" />
              )}
              <span className="text-sm font-medium text-foreground">
                {config.label}
              </span>
            </div>
            {isActive && (
              <span className="font-mono text-xs text-muted-foreground">
                {Math.round(displayProgress)}%
              </span>
            )}
          </div>

          {/* File name */}
          {filename && (
            <p className="mb-3 truncate text-xs text-muted-foreground">
              {filename}
            </p>
          )}

          {/* Bar */}
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className={cn("absolute inset-y-0 left-0 rounded-full", config.color)}
              initial={{ width: 0 }}
              animate={{ width: `${displayProgress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
            {/* Shimmer on active */}
            {isActive && (
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                style={{ animation: "shimmer 1.8s ease-in-out infinite" }}
              />
            )}
          </div>

          {/* Error message */}
          {status === "error" && errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs text-destructive"
            >
              {errorMessage}
            </motion.p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
