import * as React from "react";
import { UsersRound, Home, UserCheck, Building2 } from "lucide-react";
import { StatsCard } from "@/components/shared/StatsCard";
import type { DashboardSummary } from "@/features/dashboard/types/dashboard.types";

interface StatsGridProps {
  data: DashboardSummary;
  className?: string;
}

export function StatsGrid({ data, className }: StatsGridProps) {
  const cards = [
    {
      title: "Total Users",
      value: data.totalUsers.value.toLocaleString("en-US"),
      icon: UsersRound,
      trend: data.totalUsers,
    },
    {
      title: "Total Hosts",
      value: data.totalHosts.value.toLocaleString("en-US"),
      icon: Home,
      trend: data.totalHosts,
    },
    {
      title: "Total Guests",
      value: data.totalGuests.value.toLocaleString("en-US"),
      icon: UserCheck,
      trend: data.totalGuests,
    },
    {
      title: "Active Listings",
      value: data.activeListings.value.toLocaleString("en-US"),
      icon: Building2,
      trend: data.activeListings,
    },
  ];
console.log("data:",data);
  return (
    <div
      data-slot="stats-grid"
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5",
        className
      )}
    >
      {cards.map((c) => (
        <StatsCard
          key={c.title}
          title={c.title}
          value={c.value}
          icon={c.icon}
          trend={{ value: c.trend.trend, tone: c.trend.tone }}
        />
      ))}
    </div>
  );
}

// Local import to avoid hoisting issues with Terser
import { cn } from "@/lib/utils";