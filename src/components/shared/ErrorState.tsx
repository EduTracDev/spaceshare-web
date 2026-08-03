"use client";

import * as React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error | string | null;
  onRetry?: () => void;
  compact?: boolean;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Please try again.",
  error,
  onRetry,
  compact = false,
  className,
}: ErrorStateProps) {
  const [showDetail, setShowDetail] = React.useState(false);
  const message = error instanceof Error ? error.message : error ?? null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "w-full flex flex-col items-center justify-center text-center border border-destructive/20 bg-destructive/[0.03] rounded-2xl",
        compact ? "py-8 px-4" : "py-14 px-6",
        className
      )}
    >
      <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
        <AlertTriangle size={22} strokeWidth={1.8} />
      </div>

      <h3 className="text-base font-semibold text-foreground mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-4">
        {description}
      </p>

      {message ? (
        <button
          type="button"
          onClick={() => setShowDetail((s) => !s)}
          className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2 mb-4"
        >
          {showDetail ? "Hide error details" : "Show error details"}
        </button>
      ) : null}

      {showDetail && message ? (
        <div className="w-full max-w-md mb-5 rounded-xl bg-background border border-border p-3 text-left">
          <pre className="text-[11px] text-muted-foreground whitespace-pre-wrap font-mono break-all">
            {message}
          </pre>
        </div>
      ) : null}

      {onRetry ? (
        <Button
          type="button"
          size="sm"
          onClick={onRetry}
          className="h-9 rounded-xl px-4 gap-1.5"
        >
          <RefreshCcw size={14} />
          Try again
        </Button>
      ) : null}
    </div>
  );
}