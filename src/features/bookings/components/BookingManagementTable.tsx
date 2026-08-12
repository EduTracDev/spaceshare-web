"use client";

import * as React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
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
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/DataTable";
import { buildBookingColumns, type BookingRowActions } from "@/features/bookings/table-columns";
import type {
  Booking,
  BookingStatusFilter,
} from "@/features/bookings/types/booking.types";
import { bookingService } from "@/services/booking.service";
import { cn } from "@/lib/utils";
import { PaginatedBookings } from "@/features/bookings/types/booking.types";

interface BookingManagementTableProps {
  onViewDetails: (booking: Booking) => void;
}

const STATUS_OPTIONS: { value: BookingStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "disputed", label: "Disputed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const STATUS_FILTER_LABEL_CLASS: Record<Exclude<BookingStatusFilter, "all">, string> = {
  approved: "bg-primary/10 text-primary border-primary/30",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  disputed: "bg-red-50 text-red-600 border-red-200",
  cancelled: "bg-gray-100 text-gray-700 border-gray-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function BookingManagementTable({ onViewDetails }: BookingManagementTableProps) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<BookingStatusFilter>("all");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const actions: BookingRowActions = { onViewDetails };

  const columns = React.useMemo<ColumnDef<Booking>[]>(
    () => buildBookingColumns(actions),
    [onViewDetails]
  );

  const query = useQuery<PaginatedBookings>({
    queryKey: [
      "bookings",
      search,
      status,
      pagination.pageIndex + 1,
      pagination.pageSize,
      sorting,
    ],
    queryFn: () =>
      bookingService.getBookings({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy: sorting[0]?.id as
          | "bookingNumber"
          | "guestName"
          | "hostName"
          | "spaceName"
          | "eventDate"
          | "amount"
          | "status"
          | undefined,
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
      placeholderData: keepPreviousData
  });

  const activeFilterLabel = STATUS_OPTIONS.find((option) => option.value === status)?.label;

  return (
    <Card className="md:rounded-2xl md:border-border/70 bg-card md:shadow-sm">
      <CardHeader className="space-y-0 px-3 md:px-5 pt-2 md:pt-5 pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="hidden md:block text-[22px] font-semibold tracking-tight">
            Bookings({query.data?.total ?? 0})
          </h2>

          <div className="flex w-full gap-4 lg:gap-2 flex-row lg:w-auto">
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
                placeholder="Search by bookings..."
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
                  STATUS_FILTER_LABEL_CLASS[status as Exclude<BookingStatusFilter, "all">]
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
                <span className="hidden md:inline">Filter</span>
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

      <CardContent className="px-0 pb-5 pt-0">
        <DataTable<Booking, unknown>
          columns={columns}
          data={query.data?.items ?? []}
          totalCount={query.data?.total ?? 0}
          isLoading={query.isLoading && !query.isFetched}
          isError={query.isError}
          error={query.error as Error}
          onRetry={() => query.refetch()}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          onRowClick={(booking) => onViewDetails(booking)}
          searchTerm={search || undefined}
          emptyTitle="No Bookings Yet"
          emptyDescription="Bookings will appear here once guests start reserving spaces on the platform."
          tableClassName="px-2 sm:px-3"
        />
      </CardContent>
    </Card>
  );
}