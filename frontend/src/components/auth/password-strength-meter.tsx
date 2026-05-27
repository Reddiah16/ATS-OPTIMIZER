"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PasswordCheck {
  label: string;
  met: boolean;
}

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

function getChecks(password: string): PasswordCheck[] {
  return [
    { label: "8+ chars", met: password.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special", met: /[^A-Za-z0-9]/.test(password) },
  ];
}

function getStrength(checks: PasswordCheck[]): {
  level: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
} {
  const count = checks.filter((c) => c.met).length;
  if (count === 0) return { level: 0, label: "", color: "" };
  if (count === 1) return { level: 1, label: "Weak", color: "bg-red-500" };
  if (count === 2) return { level: 2, label: "Fair", color: "bg-amber-500" };
  if (count === 3) return { level: 3, label: "Good", color: "bg-blue-500" };
  return { level: 4, label: "Strong", color: "bg-emerald-500" };
}

export function PasswordStrengthMeter({
  password,
  className,
}: PasswordStrengthMeterProps) {
  const checks = useMemo(() => getChecks(password), [password]);
  const strength = useMemo(() => getStrength(checks), [checks]);

  if (!password) return null;

  return (
    <div className={cn("space-y-2.5", className)}>
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full overflow-hidden bg-muted"
            >
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  i <= strength.level ? strength.color : "bg-transparent"
                )}
                initial={{ width: 0 }}
                animate={{ width: i <= strength.level ? "100%" : "0%" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          ))}
        </div>
        {strength.label && (
          <motion.span
            key={strength.label}
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "text-[10px] font-semibold w-12 text-right",
              strength.level === 1 && "text-red-500",
              strength.level === 2 && "text-amber-500",
              strength.level === 3 && "text-blue-500",
              strength.level === 4 && "text-emerald-500"
            )}
          >
            {strength.label}
          </motion.span>
        )}
      </div>

      {/* Requirement badges */}
      <ul className="flex flex-wrap gap-1.5">
        {checks.map(({ label, met }) => (
          <motion.li
            key={label}
            animate={{
              scale: met ? [1, 1.08, 1] : 1,
              transition: { duration: 0.25 },
            }}
            className={cn(
              "rounded-md border px-2 py-0.5 text-[10px] font-medium transition-colors duration-200",
              met
                ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-400"
                : "border-border bg-muted/30 text-muted-foreground"
            )}
          >
            {met ? "✓ " : ""}{label}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
