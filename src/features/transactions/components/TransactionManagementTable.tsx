"use client";

import * as React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ListFilter, Search } from "lucide-react";
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
import { DataTable } from "@/components/shared/DataTable";
import {
  buildTransactionColumns,
  matchesUserTypeFilter,
  type TransactionRowActions,
} from "@/features/transactions/table-columns";
import type {
  PaginatedTransactions,
  Transaction,
  TransactionStatusFilter,
  TransactionTab,
} from "@/features/transactions/types/transaction.types";
import {
  TAB_LABELS,
  TAB_TO_TYPE,
} from "@/features/transactions/types/transaction.types";
import { transactionService } from "@/services/transaction.service";

interface TransactionManagementTableProps {
  onViewDetails: (transaction: Transaction) => void;
}

const STATUS_OPTIONS: { value: TransactionStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];

type PayoutUserTypeFilter = "all" | "HOST" | "GUEST";
const PAYOUT_USER_TYPE_OPTIONS: { value: PayoutUserTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "HOST", label: "Host" },
  { value: "GUEST", label: "Guest" },
];

const VALID_TABS: TransactionTab[] = ["payments", "payouts", "refunds"];
const VALID_STATUSES: TransactionStatusFilter[] = ["all", "pending", "success", "failed"];

function parseTabFromUrl(raw: string | null): TransactionTab {
  const v = (raw ?? "").toLowerCase();
  if (v === "payment" || v === "payments") return "payments";
  if (v === "payout"  || v === "payouts")  return "payouts";
  if (v === "refund"  || v === "refunds")  return "refunds";
  return "payments";
}
function parseStatusFromUrl(raw: string | null): TransactionStatusFilter {
  const v = (raw ?? "").toLowerCase();
  return VALID_STATUSES.includes(v as TransactionStatusFilter)
    ? (v as TransactionStatusFilter)
    : "all";
}

export function TransactionManagementTable({ onViewDetails }: TransactionManagementTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------------- Single source of truth = URL ---------------- */
  const tab: TransactionTab = parseTabFromUrl(searchParams.get("type"));
  const status: TransactionStatusFilter = parseStatusFromUrl(searchParams.get("status"));
  const search = searchParams.get("search") ?? "";
  const pageFromUrl = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSizeFromUrl = Math.max(1, parseInt(searchParams.get("pageSize") ?? "10", 10) || 10);

  /* ---------------- Local-only state (NOT part of URL) ---------------- */
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: pageFromUrl - 1,
    pageSize: pageSizeFromUrl,
  });
  const [payoutUserType, setPayoutUserType] = React.useState<PayoutUserTypeFilter>("all");

  /* ---------------- Keep pagination UI ↔ URL synced ---------------- */
  React.useEffect(() => {
    setPagination({ pageIndex: pageFromUrl - 1, pageSize: pageSizeFromUrl });
  }, [pageFromUrl, pageSizeFromUrl]);

  const actions: TransactionRowActions = { onViewDetails };

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => buildTransactionColumns(tab, actions),
    [tab, onViewDetails]
  );

  /* ---------------- Helper: write filters back to URL shallowly ---------------- */
  const applyUrl = React.useCallback(
    (patch: Record<string, string | number | null | undefined>, { resetPage = false }: { resetPage?: boolean } = {}) => {
      const next = new URLSearchParams(searchParams.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === null || v === undefined || v === "") {
          next.delete(k);
        } else {
          next.set(k, String(v));
        }
      });
      if (resetPage) next.set("page", "1");
      const qs = next.toString();
      router.replace(qs ? `/transactions?${qs}` : `/transactions`, { scroll: false });
    },
    [searchParams, router]
  );

  /* ---------------- Query (backend call params = URL + pagination) ---------------- */
  const query = useQuery<PaginatedTransactions, Error>({
    queryKey: [
      "transactions",
      tab,
      search,
      status,
      pagination.pageIndex + 1,
      pagination.pageSize,
      sorting,
    ],
    queryFn: () =>
      transactionService.getTransactions({
        tab,
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy: sorting[0]?.id as
          | "bookingNumber"
          | "transactionNumber"
          | "name"
          | "hostName"
          | "eventDate"
          | "transactionDate"
          | "dateCancelled"
          | "amount"
          | "commission"
          | "netPayout"
          | "status"
          | undefined,
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
    placeholderData: keepPreviousData,
  });

  /* ---------------- Sync pagination changes back to URL ---------------- */
  React.useEffect(() => {
    const nextPage = pagination.pageIndex + 1;
    const nextSize = pagination.pageSize;
    const p = searchParams.get("page");
    const s = searchParams.get("pageSize");
    if (String(nextPage) !== (p ?? "1") || String(nextSize) !== (s ?? "10")) {
      applyUrl({
        page: nextPage === 1 ? null : nextPage,
        pageSize: nextSize === 10 ? null : nextSize,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize]);

  /* ---- Client-side PAYOUTS only User Type filter (cheap, local state) ---- */
  const visibleRows = React.useMemo(() => {
    const all = query.data?.items ?? [];
    if (tab !== "payouts" || payoutUserType === "all") return all;
    return all.filter((row) => matchesUserTypeFilter(row, payoutUserType));
  }, [tab, payoutUserType, query.data?.items]);

  const visibleTotal =
    tab === "payouts" && payoutUserType !== "all" ? visibleRows.length : query.data?.total ?? 0;

  return (
    <Card className="md:rounded-2xl md:border-border/70 bg-card md:shadow-sm">
      <CardHeader className="space-y-4 px-3 md:px-5 pt-2 md:pt-5 pb-4">
        {/* ---- Row 1: Title (Left) + Filters Row (Right) ---- */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="hidden lg:block text-[22px] font-semibold tracking-tight">
            All {TAB_LABELS[tab]} ({visibleTotal})
          </h2>

          <div className="flex w-full flex-wrap gap-3 lg:w-auto lg:flex-nowrap lg:justify-end">
            <div className="relative flex-1 min-w-[200px] lg:w-[290px] lg:flex-none">
              <Search
                size={15}
                className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted-foreground/70"
              />
              <Input
                type="search"
                value={search}
                onChange={(event) => {
                  applyUrl({ search: event.target.value }, { resetPage: true });
                }}
                placeholder="Search by ID, name, user type..."
                className="h-11 rounded-lg lg:rounded-xl border-border bg-background pl-10 text-[13px]"
              />
            </div>

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
                <ListFilter size={15} className="text-muted-foreground" />
                <span className="ml-1.5 hidden md:inline">
                  Status: {STATUS_OPTIONS.find((o) => o.value === status)?.label ?? "All"}
                </span>
                <span className="md:hidden">Status</span>
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
                        applyUrl(
                          { status: option.value === "all" ? null : option.value },
                          { resetPage: true }
                        );
                      }}
                      className="h-9 rounded-lg px-2.5 text-[13px] cursor-pointer"
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* PAYOUTS TAB ONLY: extra User Type dropdown */}
            {tab === "payouts" ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-11 hidden xl:block rounded-xl border-border bg-background px-4 text-[13px] font-medium"
                    />
                  }
                >
                  <ListFilter size={15} className="text-muted-foreground" />
                  <span className="ml-1.5 hidden md:inline">
                    User Type: {PAYOUT_USER_TYPE_OPTIONS.find((o) => o.value === payoutUserType)?.label ?? "All"}
                  </span>
                  <span className="md:hidden">User Type</span>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="mt-1.5 w-48 rounded-2xl p-1">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                      Filter by user type
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1" />
                    {PAYOUT_USER_TYPE_OPTIONS.map((option) => (
                      <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={payoutUserType === option.value}
                        onCheckedChange={() => setPayoutUserType(option.value)}
                        className="h-9 rounded-lg px-2.5 text-[13px] cursor-pointer"
                      >
                        {option.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>

        {/* ---- Row 2: 3 Tabs segmented pill control (Payment/Payout/Refunds labels per screenshot) ---- */}
        <div className="flex w-full">
          <div className="inline-flex rounded-full bg-muted/40 p-1 ring-1 ring-border/60">
            {([
              { key: "payments" as TransactionTab, label: "Payment", urlType: "PAYMENT" },
              { key: "payouts" as TransactionTab,  label: "Payout",  urlType: "PAYOUT"  },
              { key: "refunds" as TransactionTab,  label: "Refunds", urlType: "REFUND"  },
            ]).map(({ key: tabKey, label, urlType }, index) => {
              const active = tabKey === tab;
              return (
                <button
                  key={tabKey}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    /* PER SPEC: Tab change DOES NOT reset status/search. Status filter global persists. */
                    /* Only Payout User Type (local non-URL state) resets to All since it's payout-specific. */
                    setPayoutUserType("all");
                    applyUrl(
                      { type: urlType, page: null },
                      { resetPage: true }
                    );
                  }}
                  className={cn(
                    "inline-flex h-10 items-center justify-center px-4 lg:px-6 text-[13px] font-semibold rounded-full transition-colors",
                    index === 0 && "rounded-l-full",
                    index === 2 && "rounded-r-full",
                    active
                      ? "bg-primary text-primary-foreground shadow-[0_4px_12px_-4px_rgba(98,0,238,0.4)]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-5 pt-0">
        <DataTable<Transaction, unknown>
          columns={columns}
          data={visibleRows}
          totalCount={query.data?.total ?? 0}
          isLoading={query.isLoading && !query.isFetched}
          isError={query.isError}
          error={query.error as Error}
          onRetry={() => query.refetch()}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          onRowClick={(transaction) => onViewDetails(transaction)}
          searchTerm={search || undefined}
          emptyTitle="No Transactions Yet"
          emptyDescription={
            tab === "payments"
              ? "Payments will appear here once guests complete the Flutterwave checkout flow."
              : tab === "payouts"
                ? "Payouts will appear here once bookings are completed and payouts are ready for release to hosts & guests."
                : "Refunds will appear here once bookings are cancelled and refund processing is queued."
          }
          tableClassName="px-2 sm:px-3"
        />
      </CardContent>
    </Card>
  );
}