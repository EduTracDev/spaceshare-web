export interface DashboardHeaderConfig {
  title: string;
  subtitle?: string;
}

export const DEFAULT_DASHBOARD_HEADER: DashboardHeaderConfig = {
  title: "Admin Dashboard",
  subtitle:
    "Welcome back, Admin - here's what's happening on SpaceShare.",
} as const;