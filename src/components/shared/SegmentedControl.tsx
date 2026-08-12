"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  disabled?: boolean;
  count?: number | string;
}

interface SegmentedControlProps<T extends string = string> {
  options: SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  size?: "sm" | "md";
  className?: string;
  variant?: "default" | "outline";
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onValueChange,
  size = "md",
  className,
  variant = "default",
}: SegmentedControlProps<T>) {
  const base =
    variant === "outline"
      ? "border border-border bg-background"
      : "bg-muted/40";
  const sizing =
    size === "sm" ? "h-8 p-0.5 rounded-lg gap-0.5" : "h-10 p-1 rounded-xl gap-1";

  const pillActive =
    "bg-primary text-primary-foreground shadow-[0_2px_8px_-2px_rgba(98,0,238,0.45)]";
  const pillInactive =
    "text-foreground/70 hover:text-foreground hover:bg-background/60";
  const pillSize =
    size === "sm"
      ? "h-7 px-3 text-[11px] rounded-md"
      : "h-8 px-4 text-[13px] rounded-lg";

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(
        "hidden md:inline-flex items-center shrink-0 py-2",
        base,
        sizing,
        className
      )}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={selected}
            type="button"
            disabled={opt.disabled}
            onClick={() => !opt.disabled && onValueChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 py-5 font-semibold transition-all",
              pillSize,
              selected ? pillActive : pillInactive,
              opt.disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          >
            <span>{opt.label}</span>
            {/* {typeof opt.count !== "undefined" ? (
              <span
                className={cn(
                  "inline-flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[10px] font-bold",
                  selected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background text-foreground/70"
                )}
              >
                {opt.count}
              </span>
            ) : null} */}
          </button>
        );
      })}
    </div>
  );
}