"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { Filter, Search } from "lucide-react";
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
import { buildListingColumns, type ListingRowActions } from "@/features/listings/table-columns";
import type {
  Listing,
  ListingStatusFilter,
} from "@/features/listings/types/listing.types";
import { listingService } from "@/services/listing.service";

interface ListingManagementTableProps {
  onViewDetails: (listing: Listing) => void;
}

const STATUS_OPTIONS: { value: ListingStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
];

export function ListingManagementTable({
  onViewDetails,
}: ListingManagementTableProps) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<ListingStatusFilter>("all");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const actions: ListingRowActions = { onViewDetails };

  const columns = React.useMemo<ColumnDef<Listing>[]>(
    () => buildListingColumns(actions),
    [onViewDetails]
  );

  const query = useQuery({
    queryKey: [
      "listings",
      search,
      status,
      pagination.pageIndex + 1,
      pagination.pageSize,
      sorting,
    ],
    queryFn: () =>
      listingService.getListings({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy: sorting[0]?.id as
          | "spaceName"
          | "location"
          | "price"
          | "submittedAt"
          | "status"
          | undefined,
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
    keepPreviousData: true,
  });

  return (
    <Card className="rounded-2xl border-border/70 bg-card shadow-sm">
      <CardHeader className="space-y-0 px-5 pt-5 pb-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[22px] font-semibold tracking-tight">
            Spaces({query.data?.total ?? 0})
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
                placeholder="Search listings..."
                className="h-11 rounded-xl border-border bg-background pl-10 text-[13px]"
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

      <CardContent className="px-0 pb-5 pt-0">
        <DataTable<Listing, unknown>
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
          searchTerm={search || undefined}
          emptyTitle="No Spaces Found"
          emptyDescription="There are currently no space listings matching your search or filter criteria."
          tableClassName="px-2 sm:px-3"
        />
      </CardContent>
    </Card>
  );
}