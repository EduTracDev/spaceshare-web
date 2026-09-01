"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatsGrid } from "@/features/dashboard/components/StatsGrid";
import { UserGrowthChart } from "@/features/dashboard/components/UserGrowthChart";
import { BookingsTrendChart } from "@/features/dashboard/components/BookingsTrendChart";
import { dashboardService } from "@/services/dashboard.service";


export default function DashboardPage() {
  const dashboardQ = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getDashboard,
  });

  const isLoading = dashboardQ.isLoading;
  const isError = dashboardQ.isError;
  const error = dashboardQ.error || null;
  const DashboardData = dashboardQ?.data?.data || {};

  
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        bleed
        title="Admin Dashboard"
        subtitle="Welcome back, Admin - here's what's happening on SpaceShare."
      />

      {isLoading && !dashboardQ.data ? (
        <>
          <LoadingState variant="card-grid" cards={4} />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="h-[360px] rounded-2xl border border-border/70 bg-card animate-pulse" />
            <div className="h-[360px] rounded-2xl border border-border/70 bg-card animate-pulse" />
          </div>
        </>
      ) : isError ? (
        <ErrorState
          title="Couldn't load dashboard"
          description="An error occurred while loading dashboard data."
          error={error as Error}
          onRetry={() => {
            dashboardQ.refetch();
          }}
        />
      ) : (
        <div className="flex flex-col-reverse md:flex-col gap-6">
          {/* Stats Grid */}
          {DashboardData.summary ? <StatsGrid data={DashboardData?.summary || {}} /> : null}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">
            <UserGrowthChart
              data={DashboardData.userGrowth ?? []}
              isLoading={isLoading}
            />
            <BookingsTrendChart
              data={DashboardData.bookingsTrend ?? []}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}