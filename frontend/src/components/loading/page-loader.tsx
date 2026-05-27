"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Spinner } from "./spinner";

type PageLoaderProps = {
  label?: string;
  fullScreen?: boolean;
};

export function PageLoader({
  label = "Loading…",
  fullScreen = true,
}: PageLoaderProps) {
  return (
    <div
      className={
        fullScreen
          ? "flex min-h-dvh flex-col items-center justify-center bg-surface-950 bg-grid"
          : "flex flex-col items-center justify-center py-24"
      }
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-glow">
          <Zap size={22} className="text-primary-foreground" />
        </div>
        <Spinner size="lg" label={label} />
      </motion.div>
    </div>
  );
}
