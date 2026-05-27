"use client";

import { motion } from "framer-motion";
import { FileText, X, CheckCircle2, FileType2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes, getFileIcon } from "./types";

interface FilePreviewCardProps {
  filename: string;
  fileSize?: number;
  isParsed?: boolean;
  onRemove?: () => void;
  className?: string;
}

const FILE_TYPE_COLORS = {
  pdf: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: "text-red-400",
    badge: "border-red-500/25 bg-red-500/10 text-red-400",
    label: "PDF",
  },
  docx: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: "text-blue-400",
    badge: "border-blue-500/25 bg-blue-500/10 text-blue-400",
    label: "DOCX",
  },
  doc: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: "text-blue-400",
    badge: "border-blue-500/25 bg-blue-500/10 text-blue-400",
    label: "DOC",
  },
  generic: {
    bg: "bg-muted/50",
    border: "border-border/50",
    icon: "text-muted-foreground",
    badge: "border-border bg-muted text-muted-foreground",
    label: "FILE",
  },
} as const;

export function FilePreviewCard({
  filename,
  fileSize,
  isParsed,
  onRemove,
  className,
}: FilePreviewCardProps) {
  const fileType = getFileIcon(filename);
  const colors = FILE_TYPE_COLORS[fileType];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex items-center gap-4 rounded-2xl border p-4",
        "bg-card/60 backdrop-blur-sm",
        isParsed
          ? "border-emerald-500/25 bg-emerald-500/[0.04]"
          : "border-border/60",
        className
      )}
    >
      {/* File icon */}
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
          colors.bg,
          colors.border
        )}
      >
        <FileText size={22} className={colors.icon} />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-foreground">
            {filename}
          </p>
          <span
            className={cn(
              "shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
              colors.badge
            )}
          >
            {colors.label}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          {fileSize !== undefined && (
            <span className="text-xs text-muted-foreground">
              {formatBytes(fileSize)}
            </span>
          )}
          {isParsed && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-500">
              <CheckCircle2 size={11} />
              Parsed &amp; ready
            </span>
          )}
          {isParsed === false && (
            <span className="flex items-center gap-1 text-xs text-amber-500">
              <FileType2 size={11} />
              Text extraction pending
            </span>
          )}
        </div>
      </div>

      {/* Remove button */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove file"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X size={15} />
        </button>
      )}
    </motion.div>
  );
}
