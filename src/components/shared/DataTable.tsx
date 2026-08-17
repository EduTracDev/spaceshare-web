"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
  type OnChangeFn,
  type Updater,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ArrowUpDown, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";

export interface DataTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  onPaginationChange: (pagination: PaginationState) => void;
  pageSizes?: number[];
}

export function DataTablePagination({
  pageIndex,
  pageSize,
  totalCount,
  onPaginationChange,
  pageSizes = [10, 20, 50, 100],
}: DataTablePaginationProps) {
  const pageCount = Math.max(1, Math.ceil(totalCount / (pageSize || 1)));
  const currentPage = pageIndex + 1;
  const nextPage = currentPage + 1;
  const hasNextPage = nextPage <= pageCount;
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const firstVisible = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const lastVisible = Math.min((pageIndex + 1) * pageSize, totalCount);

  return (
    <div className="mt-8 md:mt-5 flex w-full flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
      {/* LEFT: Showing X – Y of Z entries */}
      <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
        <span>Showing{" "}</span>
        <span className="font-semibold text-foreground">{firstVisible}</span>
        {" – "}
        <span className="font-semibold text-foreground">{lastVisible}</span>
        {" of "}
        <span className="font-semibold text-foreground">{totalCount}</span>
      </div>

      <div className="inline-flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() =>
            onPaginationChange({
              pageIndex: Math.max(0, pageIndex - 1),
              pageSize,
            })
          }
          disabled={!canPreviousPage}
          aria-label="Previous page"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all",
            canPreviousPage
              ? "bg-white border border-border text-muted-foreground hover:text-foreground hover:bg-muted shadow-sm"
              : "bg-primary/30 text-white/90 cursor-not-allowed"
          )}
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          aria-label={`Page ${currentPage}`}
          aria-current="page"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted-foreground/20 font-semibold text-foreground shadow-sm border border-border"
        >
          {currentPage}
        </button>

        {hasNextPage ? (
          <button
            type="button"
            onClick={() =>
              onPaginationChange({ pageIndex: currentPage, pageSize })
            }
            aria-label={`Go to page ${nextPage}`}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-semibold text-foreground/70 hover:text-foreground hover:bg-muted transition-colors bg-transparent border border-transparent"
          >
            {nextPage}
          </button>
        ) : null}

        <button
          type="button"
          onClick={() =>
            onPaginationChange({
              pageIndex: Math.min(pageCount - 1, pageIndex + 1),
              pageSize,
            })
          }
          disabled={!canNextPage}
          aria-label="Next page"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all",
            canNextPage
              ? "bg-primary text-primary-foreground shadow-[0_8px_20px_-6px_rgba(98,0,238,0.55)] hover:bg-primary/95"
              : "bg-primary/30 text-white/90 cursor-not-allowed"
          )}
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* RIGHT: Show X entries selector */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
        <span>Show</span>
        <select
          className="h-10 rounded-xl border border-border bg-background px-3 text-xs font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          value={pageSize}
          onChange={(e) =>
            onPaginationChange({
              pageIndex: 0,
              pageSize: Number(e.target.value),
            })
          }
        >
          {pageSizes.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span>entries</span>
      </div>
    </div>
  );
}


// DATATABLE
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  pageSizes?: number[];
  searchTerm?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  tableClassName?: string;
  cellVerticalPadding?: "sm" | "md";
  pagination?: PaginationState;
  onPaginationChange?: (p: PaginationState) => void;
  sorting?: SortingState;
  onSortingChange?: (s: SortingState) => void;
  /** Called when the user clicks anywhere on a data row (not header, not empty state). */
  onRowClick?: (row: TData) => void;
}

/**
 * Resolve a TanStack Table `Updater<T>` into a concrete `T` value.
 * `Updater<T>` is `T | ((old: T) => T)` so we call it with the prior state
 * when it's a function, otherwise return it as-is.
 */
function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === "function"
    ? (updater as (old: T) => T)(previous)
    : updater;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  isLoading,
  isError,
  error,
  onRetry,
  pageSizes = [10, 20, 50, 100],
  searchTerm,
  emptyTitle = "No results",
  emptyDescription = "Try adjusting your search or filters.",
  tableClassName,
  cellVerticalPadding = "md",
  pagination: extPagination,
  onPaginationChange: extOnPaginationChange,
  sorting: extSorting,
  onSortingChange: extOnSortingChange,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSizes[0] ?? 10,
  });

  const resolvedSorting = extSorting ?? sorting;
  const resolvedPagination = extPagination ?? pagination;

  const handleSortingChange: OnChangeFn<SortingState> = React.useCallback(
    (updater) => {
      const next = resolveUpdater(updater, resolvedSorting);
      if (extOnSortingChange) {
        extOnSortingChange(next);
      } else {
        setSorting(next);
      }
    },
    [extOnSortingChange, resolvedSorting]
  );

  const handlePaginationChange: OnChangeFn<PaginationState> = React.useCallback(
    (updater) => {
      const next = resolveUpdater(updater, resolvedPagination);
      if (extOnPaginationChange) {
        extOnPaginationChange(next);
      } else {
        setPagination(next);
      }
    },
    [extOnPaginationChange, resolvedPagination]
  );

  const handlePaginationPlain = React.useCallback(
    (next: PaginationState) => {
      if (extOnPaginationChange) {
        extOnPaginationChange(next);
      } else {
        setPagination(next);
      }
    },
    [extOnPaginationChange]
  );

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / (resolvedPagination.pageSize || 1)),
    state: {
      sorting: resolvedSorting,
      pagination: resolvedPagination,
    },
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: Boolean(extOnPaginationChange),
    manualSorting: Boolean(extOnSortingChange),
  });

  if (isLoading) {
    return <LoadingState variant="table" rows={10} columns={columns.length} />;
  }

  if (isError) {
    return (
      <div className="max-w-3xl mx-auto w-full">
        <ErrorState
          title="Couldn't load results"
          description="An unexpected error occurred while loading this data."
          error={error}
          onRetry={onRetry}
          compact
        />
      </div>
    );
  }

  const isEmpty = table.getRowModel().rows.length === 0;

  return (
    <div className={cn("w-full", tableClassName)}>
      <div className="rounded-2xl md:bg-card overflow-hidden">
        <Table>
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b-border/60 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  const sortable = header.column.getCanSort();
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "h-11 px-5 text-[15px] font-semibold tracking-wider text-black",
                        cellVerticalPadding === "sm" ? "py-2.5" : "py-3"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : sortable
                        ? (
                            <button
                              type="button"
                              disabled
                              className="inline-flex items-center gap-1.5 transition-colors -mx-1 px-1 py-0.5 rounded-md w-fit text-left cursor-text"
                              title={
                                header.column.getIsSorted() === "asc"
                                  ? "Sorted ascending — click to reverse"
                                  : header.column.getIsSorted() === "desc"
                                  ? "Sorted descending — click to clear"
                                  : "Click to sort"
                              }
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {/* <ArrowUpDown
                                size={12}
                                className={cn(
                                  "text-muted-foreground shrink-0",
                                  header.column.getIsSorted() &&
                                    "text-primary opacity-100"
                                )}
                              /> */}
                            </button>
                          )
                        : (
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isEmpty ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0 align-top">
                  <EmptyState
                    title={
                      searchTerm
                        ? `No results for "${searchTerm}"`
                        : emptyTitle
                    }
                    description={
                      searchTerm
                        ? "Check for typos or try different keywords."
                        : emptyDescription
                    }
                    compact
                  />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-row-clickable={onRowClick ? "true" : undefined}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={cn(
                    "border-b-border/40 transition-colors",
                    onRowClick
                      ? "cursor-pointer hover:bg-muted/50 active:bg-muted/60"
                      : "hover:bg-muted/30"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-5 align-middle select-none",
                        cellVerticalPadding === "sm" ? "py-3" : "py-4"
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!isEmpty ? (
        <DataTablePagination
          pageIndex={resolvedPagination.pageIndex}
          pageSize={resolvedPagination.pageSize}
          totalCount={totalCount}
          onPaginationChange={handlePaginationPlain}
          pageSizes={pageSizes}
        />
      ) : null}
    </div>
  );
}