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
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  const canPreviousPage = pageIndex > 0;
  const canNextPage = pageIndex < pageCount - 1;

  const firstVisible = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const lastVisible = Math.min((pageIndex + 1) * pageSize, totalCount);

  return (
    <div className="mt-5 flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
      <div className="text-xs text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">{firstVisible}</span>
        {" – "}
        <span className="font-semibold text-foreground">{lastVisible}</span>
        {" of "}
        <span className="font-semibold text-foreground">{totalCount}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <span>Rows</span>
          <select
            className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
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
        </div>

        <div className="inline-flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onPaginationChange({ pageIndex: 0, pageSize })}
            disabled={!canPreviousPage}
            className="h-8 w-8 rounded-lg border-border"
            aria-label="First page"
          >
            <ChevronsLeft size={14} />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() =>
              onPaginationChange({ pageIndex: Math.max(0, pageIndex - 1), pageSize })
            }
            disabled={!canPreviousPage}
            className="h-8 w-8 rounded-lg border-border"
            aria-label="Previous page"
          >
            <ChevronLeft size={14} />
          </Button>
          <div className="px-2 min-w-[70px] text-center text-xs font-medium text-foreground">
            Page{" "}
            <span className="text-primary">{pageIndex + 1}</span> / {pageCount}
          </div>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() =>
              onPaginationChange({
                pageIndex: Math.min(pageCount - 1, pageIndex + 1),
                pageSize,
              })
            }
            disabled={!canNextPage}
            className="h-8 w-8 rounded-lg border-border"
            aria-label="Next page"
          >
            <ChevronRight size={14} />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() =>
              onPaginationChange({
                pageIndex: Math.max(0, pageCount - 1),
                pageSize,
              })
            }
            disabled={!canNextPage}
            className="h-8 w-8 rounded-lg border-border"
            aria-label="Last page"
          >
            <ChevronsRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}

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
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSizes[0] ?? 10,
  });

  const resolvedSorting = extSorting ?? sorting;
  const setResolvedSorting = extOnSortingChange ?? setSorting;

  const resolvedPagination = extPagination ?? pagination;
  const setResolvedPagination = extOnPaginationChange ?? setPagination;

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / (resolvedPagination.pageSize || 1)),
    state: {
      sorting: resolvedSorting,
      pagination: resolvedPagination,
    },
    onSortingChange: setResolvedSorting,
    onPaginationChange: setResolvedPagination,
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
      <div className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
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
                        "h-11 px-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                        cellVerticalPadding === "sm" ? "py-2.5" : "py-3"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : sortable
                        ? (
                            <button
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                              className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors -mx-1 px-1 py-0.5 rounded-md hover:bg-muted-foreground/5 w-fit text-left"
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
                              <ArrowUpDown
                                size={12}
                                className={cn(
                                  "text-muted-foreground shrink-0",
                                  header.column.getIsSorted() &&
                                    "text-primary opacity-100"
                                )}
                              />
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
                  className="border-b-border/40 hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-5 align-middle",
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
          onPaginationChange={setResolvedPagination}
          pageSizes={pageSizes}
        />
      ) : null}
    </div>
  );
}