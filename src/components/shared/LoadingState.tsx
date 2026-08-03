import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  variant?: "card-grid" | "table" | "page" | "spinner";
  rows?: number;
  columns?: number;
  cards?: number;
  className?: string;
  label?: string;
}

export function LoadingState({
  variant = "spinner",
  rows = 8,
  columns = 5,
  cards = 6,
  className,
  label = "Loading…",
}: LoadingStateProps) {
  if (variant === "spinner") {
    return (
      <div
        className={cn(
          "w-full py-12 flex flex-col items-center justify-center gap-3",
          className
        )}
      >
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-primary/15" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    );
  }

  if (variant === "card-grid") {
    return (
      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full",
          className
        )}
      >
        {Array.from({ length: cards }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/60 bg-card p-5 space-y-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
            </div>
            <Skeleton className="h-px w-full opacity-40" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div className={cn("w-full space-y-6", className)}>
        <div className="space-y-3 pb-6 border-b border-border">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-20 w-full rounded-2xl" />
        <LoadingState variant="card-grid" cards={cards} />
      </div>
    );
  }

  // Table variant
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border/60 bg-card overflow-hidden",
        className
      )}
    >
      <div
        className="grid px-5 py-4 border-b border-border/60 bg-muted/30 gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-3.5 w-full max-w-[150px]" />
        ))}
      </div>
      <div className="divide-y divide-border/60">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid px-5 py-4 gap-4 items-center"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton
                key={colIdx}
                className={cn(
                  "h-4 w-full",
                  colIdx === 0 ? "max-w-[200px]" : "max-w-[150px]"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}