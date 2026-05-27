"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/components/theme-provider";

export function SonnerToaster() {
  const { resolvedTheme } = useTheme();

  return (
    <Toaster
      theme={resolvedTheme}
      position="top-right"
      closeButton
      richColors
      expand={false}
      gap={8}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: [
            "!rounded-2xl !border",
            "!bg-card/95 !backdrop-blur-xl",
            "!text-foreground !border-border/60",
            "!shadow-[0_8px_32px_hsl(228_30%_4%/0.18)]",
            "dark:!shadow-[0_8px_32px_hsl(228_30%_4%/0.5)]",
          ].join(" "),
          title: "!text-sm !font-semibold",
          description: "!text-xs !text-muted-foreground",
          closeButton:
            "!border-border/60 !bg-muted/50 !text-muted-foreground hover:!text-foreground",
          success: "!border-emerald-500/20 dark:!border-emerald-500/15",
          error: "!border-destructive/20",
          info: "!border-brand-500/20",
          warning: "!border-amber-500/20",
        },
      }}
    />
  );
}
