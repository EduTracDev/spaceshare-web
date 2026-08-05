import type { TrendTone } from "@/components/shared/StatsCard";

export interface DashboardSummary {
  totalUsers: {
    value: number;
    trend: number;
    tone: TrendTone;
  };
  totalHosts: {
    value: number;
    trend: number;
    tone: TrendTone;
  };
  totalGuests: {
    value: number;
    trend: number;
    tone: TrendTone;
  };
  activeListings: {
    value: number;
    trend: number;
    tone: TrendTone;
  };
}

export type SeriesLabel = "Host" | "Guest";

export interface GrowthPoint {
  month: string;        // e.g. "Jan", "Feb", …
  Host: number;
  Guest: number;
}

export interface BookingsPoint {
  month: string;       // e.g. "Jan", "Feb", …
  bookings: number;
}