"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type"> & {
  invalid?: boolean;
};

export function PasswordInput({
  className,
  invalid,
  disabled,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative group">
      <Lock
        size={15}
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 transition-colors duration-150",
          invalid ? "text-destructive" : "text-muted-foreground group-focus-within:text-primary"
        )}
      />
      <Input
        type={visible ? "text" : "password"}
        disabled={disabled}
        aria-invalid={invalid}
        className={cn(
          "h-10 pl-9 pr-10 md:text-sm transition-all duration-150",
          invalid && "border-destructive/70 focus-visible:ring-destructive/20",
          className
        )}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        disabled={disabled}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-transparent transition-colors duration-150"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          <EyeOff size={15} className="transition-transform duration-150 rotate-0" />
        ) : (
          <Eye size={15} className="transition-transform duration-150 rotate-0" />
        )}
      </Button>
    </div>
  );
}
