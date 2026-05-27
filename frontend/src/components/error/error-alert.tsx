"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ErrorAlertProps = {
  message?: string | null;
  title?: string;
  className?: string;
  onDismiss?: () => void;
};

export function ErrorAlert({
  message,
  title = "Something went wrong",
  className,
  onDismiss,
}: ErrorAlertProps) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          role="alert"
          className={cn(
            "flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3",
            className
          )}
        >
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 text-destructive"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-destructive">{title}</p>
            <p className="mt-0.5 text-sm text-destructive/90">{message}</p>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-xs text-destructive/80 hover:text-destructive"
            >
              Dismiss
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
