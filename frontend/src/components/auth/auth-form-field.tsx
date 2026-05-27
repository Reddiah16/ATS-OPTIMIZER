"use client";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { PasswordInput } from "./password-input";
import { motion, AnimatePresence } from "framer-motion";

type AuthFormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  icon?: LucideIcon;
  autoComplete?: string;
  disabled?: boolean;
  hint?: string;
};

export function AuthFormField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  autoComplete,
  disabled,
  hint,
}: AuthFormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const invalid = !!fieldState.error;
        const errorId = `${String(name)}-error`;
        const hintId = `${String(name)}-hint`;

        return (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor={String(name)}
                className={cn(
                  "text-xs font-medium transition-colors duration-150",
                  invalid ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {label}
              </Label>
              {hint && (
                <span
                  id={hintId}
                  className="text-[10px] text-muted-foreground/70"
                >
                  {hint}
                </span>
              )}
            </div>

            {type === "password" ? (
              <PasswordInput
                id={String(name)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                disabled={disabled}
                invalid={invalid}
                aria-describedby={
                  [invalid && errorId, hint && hintId]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                {...field}
              />
            ) : (
              <div className="relative group">
                {Icon && (
                  <Icon
                    size={15}
                    className={cn(
                      "pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 transition-colors duration-150",
                      invalid
                        ? "text-destructive"
                        : "text-muted-foreground group-focus-within:text-primary"
                    )}
                  />
                )}
                <Input
                  id={String(name)}
                  type={type}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  disabled={disabled}
                  aria-invalid={invalid}
                  aria-describedby={
                    [invalid && errorId, hint && hintId]
                      .filter(Boolean)
                      .join(" ") || undefined
                  }
                  className={cn(
                    "h-10 md:text-sm transition-all duration-150",
                    Icon && "pl-9",
                    invalid &&
                      "border-destructive/70 focus-visible:ring-destructive/20"
                  )}
                  {...field}
                />
              </div>
            )}

            <AnimatePresence mode="wait">
              {fieldState.error && (
                <motion.p
                  key={fieldState.error.message}
                  id={errorId}
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs text-destructive leading-tight"
                >
                  {fieldState.error.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        );
      }}
    />
  );
}
