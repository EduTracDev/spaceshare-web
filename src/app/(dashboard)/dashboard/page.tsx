"use client";

import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatsGrid } from "@/features/dashboard/components/StatsGrid";
import { UserGrowthChart } from "@/features/dashboard/components/UserGrowthChart";
import { BookingsTrendChart } from "@/features/dashboard/components/BookingsTrendChart";
import { dashboardService } from "@/services/dashboard.service";


export default function DashboardPage() {
  const summaryQ = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardService.getSummary,
  });
  const growthQ = useQuery({
    queryKey: ["dashboard", "growth"],
    queryFn: dashboardService.getUserGrowth,
  });
  const bookingsQ = useQuery({
    queryKey: ["dashboard", "bookings"],
    queryFn: dashboardService.getBookingsTrend,
  });

  const isLoading = summaryQ.isLoading || growthQ.isLoading || bookingsQ.isLoading;
  const isError = summaryQ.isError || growthQ.isError || bookingsQ.isError;
  const error = summaryQ.error || growthQ.error || bookingsQ.error || null;


  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        bleed
        title="Admin Dashboard"
        subtitle="Welcome back, Admin - here's what's happening on SpaceShare."
        actions={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Notifications"
            className="hidden lg:inline-flex relative h-9 w-9 rounded-full border bg-gray-100 font-bold hover:animate-pulse text-black/95 hover:text-foreground shrink-0"
          >
            <Bell size={17} className=""/>
          </Button>
        }
      />

      {isLoading && !summaryQ.data ? (
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
            summaryQ.refetch();
            growthQ.refetch();
            bookingsQ.refetch();
          }}
        />
      ) : (
        <div className="flex flex-col-reverse md:flex-col gap-6">
          {/* Stats Grid */}
          {summaryQ.data ? <StatsGrid data={summaryQ.data} /> : null}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">
            <UserGrowthChart
              data={growthQ.data ?? []}
              isLoading={growthQ.isLoading && !growthQ.data}
            />
            <BookingsTrendChart
              data={bookingsQ.data ?? []}
              isLoading={bookingsQ.isLoading && !bookingsQ.data}
            />
          </div>
        </div>
      )}
    </div>
  );
}