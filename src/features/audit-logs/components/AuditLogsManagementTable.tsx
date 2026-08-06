"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { CalendarDays, Search, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DataTable } from "@/components/shared/DataTable";
import { buildAuditLogColumns } from "@/features/audit-logs/table-columns";
import type {
  AuditLog,
  AuditLogDateRange,
} from "@/features/audit-logs/types/audit-log.types";
import { auditLogService } from "@/services/audit-log.service";
import { cn } from "@/lib/utils";

interface AuditLogsManagementTableProps {
  onView?: never;
}

function formatDateLabel(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getRangeLabel(range: AuditLogDateRange) {
  if (range.start && range.end) {
    return `${formatDateLabel(range.start)} - ${formatDateLabel(range.end)}`;
  }
  return "Select Date Range";
}

function getStartOfMonth(monthsBack = 0) {
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  now.setMonth(now.getMonth() - monthsBack);
  return now.toISOString().slice(0, 10);
}

function getEndOfMonth(dateStr: string) {
  const date = new Date(dateStr);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  return end.toISOString().slice(0, 10);
}

const QUICK_RANGES: {
  label: string;
  range: AuditLogDateRange;
}[] = [
  {
    label: "This month",
    range: {
      start: getStartOfMonth(0),
      end: getEndOfMonth(getStartOfMonth(0)),
    },
  },
  {
    label: "Last month",
    range: {
      start: getStartOfMonth(1),
      end: getEndOfMonth(getStartOfMonth(1)),
    },
  },
  {
    label: "Last 3 months",
    range: {
      start: getStartOfMonth(2),
      end: getEndOfMonth(getStartOfMonth(0)),
    },
  },
  {
    label: "Last 6 months",
    range: {
      start: getStartOfMonth(5),
      end: getEndOfMonth(getStartOfMonth(0)),
    },
  },
];

export function AuditLogsManagementTable(
  _: AuditLogsManagementTableProps
) {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [dateRange, setDateRange] = React.useState<AuditLogDateRange>({
    start: null,
    end: null,
  });
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "timestamp", desc: true },
  ]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  React.useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 250);
    return () => window.clearTimeout(t);
  }, [search]);

  const columns = React.useMemo<ColumnDef<AuditLog>[]>(
    () => buildAuditLogColumns(),
    []
  );

  const query = useQuery({
    queryKey: [
      "auditLogs",
      debouncedSearch,
      dateRange.start,
      dateRange.end,
      pagination.pageIndex + 1,
      pagination.pageSize,
      sorting,
    ],
    queryFn: () =>
      auditLogService.getAuditLogs({
        search: debouncedSearch || undefined,
        dateRange,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy: sorting[0]?.id as
          | "actorName"
          | "timestamp"
          | "action"
          | "description"
          | undefined,
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
    keepPreviousData: true,
  });

  const activeChip = dateRange.start && dateRange.end;

  return (
    <Card className="rounded-2xl border-border/70 bg-card shadow-sm">
      <CardHeader className="space-y-0 px-5 pt-5 pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[22px] font-semibold tracking-tight">
            Audit Logs
            {query.data && query.data.total > 0
              ? `(${query.data.total})`
              : query.data
              ? "(0)"
              : ""}
          </h2>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
            <div className="relative flex-1 lg:w-[340px]">
              <Search
                size={15}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground/70"
              />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, email, action..."
                className="h-11 rounded-xl border-border bg-background pl-10 text-[13px]"
              />
            </div>

            {activeChip ? (
              <Button
                type="button"
                onClick={() =>
                  setDateRange({ start: null, end: null })
                }
                className="h-11 rounded-full border border-border bg-background px-4 text-[12.5px] font-semibold text-foreground/90 hover:text-foreground"
              >
                <X size={13} className="mr-1" />
                {getRangeLabel(dateRange)}
              </Button>
            ) : null}

            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl border-border bg-background px-4 text-[13px] font-medium"
                  />
                }
              >
                <CalendarDays size={15} className="text-primary" />
                {getRangeLabel(dateRange)}
              </PopoverTrigger>

              <PopoverContent
                align="end"
                side="bottom"
                sideOffset={8}
                className="w-[320px] rounded-2xl p-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <span className="block text-[12px] font-semibold text-foreground/90">
                        Start date
                      </span>
                      <input
                        type="date"
                        value={dateRange.start ?? ""}
                        onChange={(event) =>
                          setDateRange((prev) => ({
                            ...prev,
                            start: event.target.value || null,
                          }))
                        }
                        className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[12.5px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[12px] font-semibold text-foreground/90">
                        End date
                      </span>
                      <input
                        type="date"
                        value={dateRange.end ?? ""}
                        onChange={(event) =>
                          setDateRange((prev) => ({
                            ...prev,
                            end: event.target.value || null,
                          }))
                        }
                        className="h-9 w-full rounded-lg border border-border bg-background px-3 text-[12.5px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="block text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Quick ranges
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_RANGES.map((range) => {
                        const active =
                          dateRange.start === range.range.start &&
                          dateRange.end === range.range.end;
                        return (
                          <Button
                            key={range.label}
                            type="button"
                            variant="outline"
                            onClick={() => setDateRange(range.range)}
                            className={cn(
                              "h-9 rounded-xl px-3 text-[12px] font-medium border-border",
                              active &&
                                "border-primary bg-primary/10 text-primary"
                            )}
                          >
                            {range.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() =>
                        setDateRange({ start: null, end: null })
                      }
                      className="h-9 rounded-xl px-3 text-[12.5px] text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </Button>
                    <Button
                      type="button"
                      className="h-9 rounded-xl bg-primary px-4 text-[12.5px] font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-5 pt-0">
        <DataTable<AuditLog, unknown>
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
          searchTerm={debouncedSearch || undefined}
          emptyTitle="No Activity Yet"
          emptyDescription="There are no recorded admin activities yet. Actions performed by administrators will appear here."
          tableClassName="px-2 sm:px-3"
        />
      </CardContent>
    </Card>
  );
}