"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileCheck2, CloudUpload, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCEPTED_MIME_TYPES, validateFile } from "./types";

interface DropZoneProps {
  onFileDrop: (file: File) => void;
  onError: (message: string) => void;
  isUploading?: boolean;
  disabled?: boolean;
  className?: string;
}

const HINT_ITEMS = [
  { icon: FileCheck2, label: "PDF or DOCX" },
  { icon: ShieldCheck, label: "Max 10 MB" },
  { icon: CloudUpload, label: "Secure upload" },
];

export function DropZone({
  onFileDrop,
  onError,
  isUploading = false,
  disabled = false,
  className,
}: DropZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file) return;
      const result = validateFile(file);
      if (!result.valid) {
        onError(result.error!);
        return;
      }
      onFileDrop(file);
    },
    [onFileDrop, onError]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_MIME_TYPES,
      maxFiles: 1,
      disabled: isUploading || disabled,
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn("relative", className)}
    >
      <div
        {...getRootProps()}
        id="resume-dropzone"
        className={cn(
          "group relative flex flex-col items-center justify-center",
          "rounded-2xl border-2 border-dashed",
          "px-8 py-14 text-center cursor-pointer",
          "transition-all duration-300",
          // idle state
          !isDragActive &&
            !isDragReject &&
            "border-border/50 hover:border-brand-500/50 hover:bg-brand-500/[0.02]",
          // drag active
          isDragActive &&
            !isDragReject &&
            "border-brand-500 bg-brand-500/[0.06] scale-[1.01]",
          // drag reject
          isDragReject && "border-destructive/60 bg-destructive/[0.04]",
          // uploading
          isUploading && "pointer-events-none opacity-80",
          // disabled
          (disabled || isUploading) && "cursor-default"
        )}
      >
        <input {...getInputProps()} id="resume-file-input" />

        {/* Glowing orb behind icon */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "h-32 w-32 rounded-full blur-3xl transition-opacity duration-500",
            isDragActive
              ? "opacity-30 bg-brand-500"
              : "opacity-0 group-hover:opacity-15 bg-brand-500"
          )}
          aria-hidden
        />

        {/* Icon container */}
        <motion.div
          animate={isDragActive ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "relative mb-5 flex h-20 w-20 items-center justify-center rounded-2xl",
            "border transition-all duration-300",
            isDragReject
              ? "border-destructive/30 bg-destructive/10"
              : isDragActive
              ? "border-brand-500/40 bg-brand-500/15 shadow-[0_0_32px_hsl(243_75%_59%/0.35)]"
              : "border-border/40 bg-muted/50 group-hover:border-brand-500/30 group-hover:bg-brand-500/8"
          )}
        >
          <Upload
            size={32}
            className={cn(
              "transition-colors duration-300",
              isDragReject
                ? "text-destructive"
                : isDragActive
                ? "text-brand-400"
                : "text-muted-foreground group-hover:text-brand-400"
            )}
          />
        </motion.div>

        {/* Text */}
        <AnimatePresence mode="wait">
          {isDragActive ? (
            <motion.div
              key="drag-active"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-1"
            >
              <p className="text-lg font-semibold text-brand-400">
                Release to upload
              </p>
              <p className="text-sm text-muted-foreground">
                We&apos;ll parse your resume instantly
              </p>
            </motion.div>
          ) : isDragReject ? (
            <motion.div
              key="drag-reject"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-1"
            >
              <p className="text-lg font-semibold text-destructive">
                Unsupported file type
              </p>
              <p className="text-sm text-muted-foreground">
                Please use a PDF or DOCX file
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="space-y-2"
            >
              <p className="text-base font-semibold text-foreground">
                Drag & drop your resume
              </p>
              <p className="text-sm text-muted-foreground">
                or{" "}
                <span className="font-semibold text-brand-400 underline underline-offset-2">
                  browse files
                </span>{" "}
                from your computer
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint chips */}
        <div className="mt-6 flex items-center gap-3 flex-wrap justify-center">
          {HINT_ITEMS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
            >
              <Icon size={11} className="opacity-70" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
