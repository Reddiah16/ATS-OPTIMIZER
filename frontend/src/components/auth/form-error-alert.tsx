"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorAlertProps {
  message?: string | null;
  className?: string;
}

export function FormErrorAlert({ message, className }: FormErrorAlertProps) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: -8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          role="alert"
          aria-live="assertive"
          className={cn(
            "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm",
            "border-destructive/30 bg-destructive/10 text-destructive",
            className
          )}
        >
          <ShieldAlert size={15} className="mt-0.5 shrink-0 opacity-80" />
          <span className="leading-snug">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
