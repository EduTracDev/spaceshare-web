import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { STATUS_VARIANTS, type StatusKey } from "@/constants/status";

interface StatusBadgeProps {
  status: StatusKey;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, label, size = "md", className }: StatusBadgeProps) {
  const meta = STATUS_VARIANTS[status];
  if (!meta) return null;

  const dotColor = meta.className.includes("green")   ? "bg-green-500"
    : meta.className.includes("emerald")             ? "bg-emerald-500"
    : meta.className.includes("amber") || meta.className.includes("orange") ? "bg-amber-500"
    : meta.className.includes("red")                 ? "bg-red-500"
    : meta.className.includes("indigo")              ? "bg-indigo-500"
    : meta.className.includes("blue")                ? "bg-blue-500"
    : meta.className.includes("purple")              ? "bg-purple-500"
    : "bg-gray-400";

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full border font-medium",
        size === "sm" ? "px-2 py-0 text-[10px]" : "px-2.5 py-0.5 text-[11px]",
        meta.className,
        className
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <span
          className={cn(
            "rounded-full",
            size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
            dotColor
          )}
        />
        {label ?? meta.label}
      </span>
    </Badge>
  );
}