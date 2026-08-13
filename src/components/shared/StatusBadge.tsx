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

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-4xl border font-medium border border-green-600",
        size === "sm" ? "px-2 !py-3 text-[10px]" : "px-2.5 py-1 text-[11px]",
        meta.className,
        className
      )}>
      {label ?? meta.label}
    </Badge>
  );
}