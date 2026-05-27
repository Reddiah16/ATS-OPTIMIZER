"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  FileText,
  CheckCircle2,
  AlertCircle,
  History,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Resume } from "@/types";

interface ExistingResumesPickerProps {
  resumes: Resume[];
  onSelect: (resume: Resume) => void;
  selectedId?: number | null;
  className?: string;
}

export function ExistingResumesPicker({
  resumes,
  onSelect,
  selectedId,
  className,
}: ExistingResumesPickerProps) {
  const [open, setOpen] = useState(false);

  if (resumes.length === 0) return null;

  return (
    <div className={cn("", className)}>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-sm",
          "transition-all duration-200",
          open
            ? "border-brand-500/30 bg-brand-500/[0.05]"
            : "border-border/50 bg-card/50 hover:border-brand-500/25 hover:bg-brand-500/[0.03]"
        )}
      >
        <span className="flex items-center gap-2.5 text-muted-foreground">
          <History size={15} className={open ? "text-brand-400" : ""} />
          <span className="font-medium">Use a previously uploaded resume</span>
          <span
            className={cn(
              "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold",
              open
                ? "border-brand-500/25 bg-brand-500/10 text-brand-400"
                : "border-border bg-muted text-muted-foreground"
            )}
          >
            {resumes.length}
          </span>
        </span>
        <ChevronDown
          size={15}
          className={cn(
            "text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1 rounded-xl border border-border/40 bg-card/80 p-2 backdrop-blur-sm">
              {resumes.map((resume, idx) => {
                const isSelected = selectedId === resume.id;
                return (
                  <motion.button
                    key={resume.id}
                    type="button"
                    onClick={() => {
                      onSelect(resume);
                      setOpen(false);
                    }}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left",
                      "transition-all duration-150",
                      isSelected
                        ? "bg-brand-500/10 border border-brand-500/25"
                        : "hover:bg-muted/60 border border-transparent"
                    )}
                  >
                    {/* File icon */}
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                        resume.file_type === "pdf"
                          ? "border-red-500/20 bg-red-500/10"
                          : "border-blue-500/20 bg-blue-500/10"
                      )}
                    >
                      <FileText
                        size={15}
                        className={
                          resume.file_type === "pdf"
                            ? "text-red-400"
                            : "text-blue-400"
                        }
                      />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {resume.original_filename}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <Clock size={10} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(resume.uploaded_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50">
                          {resume.file_type}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    {resume.has_text ? (
                      <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle size={15} className="shrink-0 text-amber-400" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
