import type {
  DashboardSummary,
  GrowthPoint,
  BookingsPoint,
} from "@/features/dashboard/types/dashboard.types";
import {
  MOCK_DASHBOARD_SUMMARY,
  EMPTY_DASHBOARD_SUMMARY,
  MOCK_USER_GROWTH,
  EMPTY_USER_GROWTH,
  MOCK_BOOKINGS_TREND,
  EMPTY_BOOKINGS_TREND,
} from "@/mocks/dashboard.mock";

const delay = <T>(data: T, ms = 500): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

type DataMode = "filled" | "empty";

const MODE: DataMode = "filled";

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const data =
      MODE === "filled" ? MOCK_DASHBOARD_SUMMARY : EMPTY_DASHBOARD_SUMMARY;
    return delay(data);
  },

  async getUserGrowth(): Promise<GrowthPoint[]> {
    const data = MODE === "filled" ? MOCK_USER_GROWTH : EMPTY_USER_GROWTH;
    return delay(data);
  },

  async getBookingsTrend(): Promise<BookingsPoint[]> {
    const data =
      MODE === "filled" ? MOCK_BOOKINGS_TREND : EMPTY_BOOKINGS_TREND;
    return delay(data);
  },
};