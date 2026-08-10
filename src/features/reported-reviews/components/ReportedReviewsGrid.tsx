"use client";

import * as React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";
import { Filter, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTablePagination } from "@/components/shared/DataTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingState } from "@/components/shared/LoadingState";
import { ReportedReviewCard } from "@/features/reported-reviews/components/ReportedReviewCard";
import type {
  ReportedReview,
  ReportedReviewStatusFilter,
} from "@/features/reported-reviews/types/reported-review.types";
import { reportedReviewService } from "@/services/reported-review.service";
import { cn } from "@/lib/utils";
import { PaginatedReportedReviews } from "@/features/reported-reviews/types/reported-review.types";


interface ReportedReviewsGridProps {
  onRetain: (review: ReportedReview) => void;
  onRemove: (review: ReportedReview) => void;
}

const STATUS_OPTIONS: { value: ReportedReviewStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "closed", label: "Closed" },
];

const STATUS_FILTER_LABEL_CLASS: Record<
  Exclude<ReportedReviewStatusFilter, "all">,
  string
> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  closed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function ReportedReviewsGrid({
  onRetain,
  onRemove,
}: ReportedReviewsGridProps) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<ReportedReviewStatusFilter>("all");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });

  const query = useQuery<PaginatedReportedReviews, Error>({
    queryKey: [
      "reportedReviews",
      search,
      status,
      pagination.pageIndex + 1,
      pagination.pageSize,
    ],
    queryFn: () =>
      reportedReviewService.getReportedReviews({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      }),
    placeholderData: keepPreviousData
  });

  const { items, total } = query.data ?? { items: [], total: 0 };
  const activeFilterLabel = STATUS_OPTIONS.find(
    (option) => option.value === status
  )?.label;

  const isEmpty = !query.isLoading && items.length === 0;
  const showError = query.isError && !query.isLoading;
  const showLoading = query.isLoading && !query.isFetched;

  return (
    <Card className="rounded-2xl border-border/70 bg-card shadow-sm">
      <CardHeader className="space-y-0 px-5 pt-5 pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[22px] font-semibold tracking-tight">
            Reviews({total})
          </h2>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <div className="relative flex-1 lg:w-[290px]">
              <Search
                size={15}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground/70"
              />
              <Input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                placeholder="Search reviews..."
                className="h-11 rounded-xl border-border bg-background pl-10 text-[13px]"
              />
            </div>

            {status !== "all" && activeFilterLabel ? (
              <Button
                type="button"
                onClick={() => {
                  setStatus("all");
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className={cn(
                  "h-11 rounded-full px-4 text-[13px] font-semibold border",
                  STATUS_FILTER_LABEL_CLASS[
                    status as Exclude<ReportedReviewStatusFilter, "all">
                  ]
                )}
              >
                <X size={13} className="mr-1" />
                {activeFilterLabel}
              </Button>
            ) : null}

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 rounded-xl border-border bg-background px-4 text-[13px] font-medium"
                  />
                }
              >
                <Filter size={15} className="text-muted-foreground" />
                Filter
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="mt-1.5 w-48 rounded-2xl p-1">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                    Filter by status
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  {STATUS_OPTIONS.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      checked={status === option.value}
                      onCheckedChange={() => {
                        setStatus(option.value);
                        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                      }}
                      className="h-9 rounded-lg px-2.5 text-[13px] cursor-pointer"
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 sm:px-5 pb-5 pt-0 space-y-5">
        {showLoading ? (
          <LoadingState rows={6} />
        ) : showError ? (
          <ErrorState
            title="Unable to load reported reviews"
            description="Something went wrong while loading the reported reviews. Please try again."
            onRetry={() => query.refetch()}
          />
        ) : isEmpty ? (
          <EmptyState
            title={search ? "No reported reviews match your search" : "No Reported Reviews Yet"}
            description={
              search
                ? "Check for typos or try different keywords."
                : "When reviews are reported on the platform, they will appear here for review and moderation."
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {items.map((review) => (
                <ReportedReviewCard
                  key={review.id}
                  review={review}
                  onRetain={onRetain}
                  onRemove={onRemove}
                />
              ))}
            </div>

            <DataTablePagination
              pageIndex={pagination.pageIndex}
              pageSize={pagination.pageSize}
              totalCount={total}
              onPaginationChange={setPagination}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}