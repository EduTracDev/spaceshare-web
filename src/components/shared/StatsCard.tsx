import * as React from "react";
import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export type TrendTone = "positive" | "negative";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: {
    value: number;       // e.g. 84 → +84%, -2 → -2%
    tone: TrendTone;
  };
  iconClassName?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  iconClassName,
  className,
}: StatsCardProps) {
  const positive = trend.tone === "positive";

  return (
    <Card
      data-slot="stats-card"
      className={cn(
        "rounded-2xl border-border/70 bg-card shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <CardContent className="p-5 h-full flex flex-col gap-4">
        {/* TOP ROW: icon + trend pill */}
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "h-9 w-9 rounded-lg flex items-center justify-center shrink-0",
              positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600",
              iconClassName
            )}
          >
            <Icon size={18} strokeWidth={2.2} />
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              positive
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-600"
            )}
          >
            {positive ? (
              <ArrowUpRight size={12} strokeWidth={2.5} />
            ) : (
              <ArrowDownRight size={12} strokeWidth={2.5} />
            )}
            {positive ? "+" : ""}
            {trend.value}%
          </span>
        </div>

        {/* BOTTOM: label + big number */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-medium text-muted-foreground">
            {title}
          </span>
          <span className="text-2xl font-bold text-foreground tracking-tight leading-none">
            {value}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}