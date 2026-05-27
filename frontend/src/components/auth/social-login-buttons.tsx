"use client";

import { notify } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-4.185-.45-8.55-2.085-8.55-9.285 0-2.07.735-3.765 1.95-5.085-.195-.48-.84-2.43.195-5.055 0 0 1.59-.51 5.205 1.935 1.515-.42 3.135-.63 4.755-.63 1.62 0 3.24.21 4.755.63 3.615-2.46 5.205-1.935 5.205-1.935 1.035 2.625.39 4.575.195 5.055 1.215 1.32 1.95 3.015 1.95 5.085 0 7.23-4.365 8.835-8.55 9.285.675.585 1.275 1.74 1.275 3.51 0 2.535-.015 4.575-.015 5.205 0 .33.225.705.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

type SocialLoginButtonsProps = {
  disabled?: boolean;
  className?: string;
};

export function SocialLoginButtons({
  disabled,
  className,
}: SocialLoginButtonsProps) {
  const handlePlaceholder = (provider: string) => {
    notify.info(`${provider} sign-in coming soon`);
  };

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => handlePlaceholder("Google")}
        className="h-10 gap-2 border-border/80 bg-background/50 hover:bg-muted/50"
      >
        <GoogleIcon className="size-4" />
        Google
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => handlePlaceholder("GitHub")}
        className="h-10 gap-2 border-border/80 bg-background/50 hover:bg-muted/50"
      >
        <GitHubIcon className="size-4" />
        GitHub
      </Button>
    </div>
  );
}
