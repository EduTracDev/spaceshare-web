"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import type { GrowthPoint } from "@/features/dashboard/types/dashboard.types";

interface UserGrowthChartProps {
  data: GrowthPoint[];
  isLoading?: boolean;
}

export function UserGrowthChart({ data, isLoading }: UserGrowthChartProps) {
  const empty = !isLoading && data.length === 0;

  return (
    <Card className="rounded-2xl border-border/70 bg-card shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between px-5 pt-5 pb-3 space-y-0">
        <CardTitle className="text-[15px] font-semibold tracking-tight">
          User Growth
        </CardTitle>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80">
            <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
            Host
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground/80">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            Guest
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-3 pb-4 pt-0">
        {isLoading ? (
          <div className="h-[320px] w-full rounded-xl bg-muted/30 animate-pulse" />
        ) : empty ? (
          <div className="h-[320px] w-full">
            <EmptyState
              variant="chart"
              title="No User Growth Data Yet"
              compact
            />
          </div>
        ) : (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="hostGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="guestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6200EE" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6200EE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border) / 0.6)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                  dy={6}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                  width={40}
                  tickFormatter={(v) =>
                    v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
                  }
                />
                <Tooltip
                  cursor={{ stroke: "hsl(var(--primary) / 0.2)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    boxShadow:
                      "0 10px 30px -10px rgba(15, 23, 42, 0.15)",
                    fontSize: 12,
                  }}
                  formatter={(value, name) => {
                    const num = typeof value === "number" ? value : Number(value ?? 0);
                    return [`${num.toLocaleString()} Users`, String(name ?? "")] as const;
                  }}
                />
                <Legend content={() => null} />
                <Area
                  type="monotone"
                  dataKey="Host"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="url(#hostGradient)"
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
                <Area
                  type="monotone"
                  dataKey="Guest"
                  stroke="#6200EE"
                  strokeWidth={2.5}
                  fill="url(#guestGradient)"
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}