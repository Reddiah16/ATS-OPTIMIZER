import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

const sizes = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
};

export function Spinner({ size = "md", className, label }: SpinnerProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)} role="status">
      <Loader2
        className={cn("animate-spin text-primary", sizes[size])}
        aria-hidden
      />
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </span>
  );
}
