"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import type { BookingsPoint } from "@/features/dashboard/types/dashboard.types";

interface BookingsTrendChartProps {
  data: BookingsPoint[];
  isLoading?: boolean;
}

export function BookingsTrendChart({
  data,
  isLoading,
}: BookingsTrendChartProps) {
  const empty = !isLoading && data.length === 0;

  return (
    <Card className="rounded-2xl border-border/70 bg-card shadow-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between px-5 pt-5 pb-3 space-y-0">
        <CardTitle className="text-[15px] font-semibold tracking-tight">
          Bookings trend
        </CardTitle>
      </CardHeader>

      <CardContent className="px-2 sm:px-3 pb-4 pt-0">
        {isLoading ? (
          <div className="h-[320px] w-full rounded-xl bg-muted/30 animate-pulse" />
        ) : empty ? (
          <div className="h-[320px] w-full">
            <EmptyState
              variant="chart"
              title="No Bookings trend yet"
              compact
            />
          </div>
        ) : (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                barSize={36}
                barGap={8}
              >
                <defs>
                  <pattern
                    id="purpleHatch"
                    patternUnits="userSpaceOnUse"
                    width="8"
                    height="8"
                    patternTransform="rotate(45)"
                  >
                    <rect width="8" height="8" fill="#B495FB" />
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="8"
                      stroke="#6200EE"
                      strokeWidth="1.5"
                      strokeOpacity={0.55}
                    />
                  </pattern>
                  <linearGradient id="purpleFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B495FB" />
                    <stop offset="100%" stopColor="#9469FA" />
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
                  cursor={{ fill: "#ad72b985" }}  //controls the bar fill on tooltip activated
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(var(--border))",
                    boxShadow:
                      "0 10px 30px -10px rgba(15, 23, 42, 0.15)",
                    fontSize: 12,
                  }}
                  formatter={(value) => {
                    const num = typeof value === "number" ? value : Number(value ?? 0);
                    return [`Bookings: ${num.toLocaleString()}`, "Bookings"] as const;
                  }}
                  labelFormatter={(label) => `${String(label ?? "")} 15`}
                />

                <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="url(#purpleFill)"
                      stroke="url(#purpleHatch)"
                      strokeWidth={0}
                      fillOpacity={0.92}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}