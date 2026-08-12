"use client";

import * as React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Filter, ListFilter, Search } from "lucide-react";
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
  type TransactionRowActions,
} from "@/features/transactions/table-columns";
import type {
  Transaction,
  TransactionStatusFilter,
} from "@/features/transactions/types/transaction.types";
import { transactionService } from "@/services/transaction.service";
import { PaginatedTransactions } from "@/features/transactions/types/transaction.types";


interface TransactionManagementTableProps {
  onViewDetails: (transaction: Transaction) => void;
}

const STATUS_OPTIONS: { value: TransactionStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "success", label: "Success" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function TransactionManagementTable({ onViewDetails }: TransactionManagementTableProps) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<TransactionStatusFilter>("all");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const actions: TransactionRowActions = { onViewDetails };

  const columns = React.useMemo<ColumnDef<Transaction>[]>(
    () => buildTransactionColumns(actions),
    [onViewDetails]
  );

  const query = useQuery<PaginatedTransactions, Error>({
    queryKey: [
      "transactions",
      search,
      status,
      pagination.pageIndex + 1,
      pagination.pageSize,
      sorting,
    ],
    queryFn: () =>
      transactionService.getTransactions({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy: sorting[0]?.id as
          | "bookingNumber"
          | "hostName"
          | "eventDate"
          | "amountPaid"
          | "commission"
          | "netPayout"
          | "status"
          | undefined,
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
    placeholderData: keepPreviousData,
  });

  return (
    <Card className="md:rounded-2xl md:border-border/70 bg-card md:shadow-sm">
      <CardHeader className="space-y-0 px-3 md:px-5 pt-2 md:pt-5 pb-4">
        <div className="flex flex-col gap-4 lg:justify-between">
          <h2 className="hidden md:block text-[22px] font-semibold tracking-tight">
            Transactions({query.data?.total ?? 0})
          </h2>

          <div className="flex w-full gap-4 lg:gap-4 flex-row lg:w-auto">
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
        <DataTable<Transaction, unknown>
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
          onRowClick={(transaction) => onViewDetails(transaction)}
          searchTerm={search || undefined}
          emptyTitle="No Transactions Yet"
          emptyDescription="Payouts will appear here once bookings are completed and payouts are ready for release."
          tableClassName="px-2 sm:px-3"
        />
      </CardContent>
    </Card>
  );
}