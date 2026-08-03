"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import type {
  SortingState,
  PaginationState,
  ColumnDef,
} from "@tanstack/react-table";
import { Filter, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SegmentedControl } from "@/components/shared/SegmentedControl";
import { DataTable } from "@/components/shared/DataTable";
import { buildUserColumns, type UserRowActions } from "@/features/users/table-columns";
import type {
  AnyUser,
  StatusFilter,
  UserRoleTab,
} from "@/features/users/types/user.types";
import { userService } from "@/services/user.service";

interface UserManagementTableProps {
  onInviteAdminClick: () => void;
  onViewDetails: (user: AnyUser) => void;
  onSuspend: (user: AnyUser) => void;
  onReactivate: (user: AnyUser) => void;
}

const ROLE_TABS = [
  { value: "host" as UserRoleTab, label: "Host", count: 10 },
  { value: "guest" as UserRoleTab, label: "Guest", count: 10 },
  { value: "admin" as UserRoleTab, label: "Admin", count: 3 },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

export function UserManagementTable({
  onInviteAdminClick,
  onViewDetails,
  onSuspend,
  onReactivate,
}: UserManagementTableProps) {
  const [role, setRole] = React.useState<UserRoleTab>("host");
  const [search, setSearch] = React.useState<string>("");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const actions: UserRowActions = { onViewDetails, onSuspend, onReactivate };

  const columns = React.useMemo<ColumnDef<AnyUser>[]>(
    () => buildUserColumns(actions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onViewDetails, onSuspend, onReactivate]
  );

  const query = useQuery({
    queryKey: [
      "users",
      role,
      search,
      status,
      pagination.pageIndex + 1,
      pagination.pageSize,
      sorting,
    ],
    queryFn: () =>
      userService.getUsers({
        role,
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      }),
    keepPreviousData: true,
  });

  const statusLabel = STATUS_OPTIONS.find((s) => s.value === status)?.label ?? "All";

  return (
    <Card className="rounded-2xl border-border/70 bg-card shadow-sm">
      <CardHeader className="flex flex-col gap-5 px-5 pt-5 pb-4 space-y-0">
        {/* Top row: Users heading + Invite button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-[17px] font-semibold tracking-tight">Users</h2>
          <Button
            type="button"
            onClick={onInviteAdminClick}
            className="h-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-5 text-[13px] font-semibold shadow-[0_6px_16px_-6px_rgba(98,0,238,0.5)] self-start sm:self-auto"
          >
            Invite Admin User
          </Button>
        </div>

        {/* Second row: Tabs LEFT + Search + Filter RIGHT */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3">
          <SegmentedControl
            options={ROLE_TABS}
            value={role}
            onValueChange={(v) => {
              setRole(v);
              setPagination((p) => ({ ...p, pageIndex: 0 }));
            }}
          />

          <div className="flex flex-row items-stretch gap-2 w-full xl:w-auto">
            <div className="relative flex-1 xl:w-72">
              <span
                aria-hidden
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 pointer-events-none"
              >
                🔍
              </span>
              <Input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPagination((p) => ({ ...p, pageIndex: 0 }));
                }}
                placeholder="Search by email or name…"
                className="h-11 rounded-xl border-border pl-10 pr-3 text-[13px] bg-muted/30 placeholder:text-muted-foreground/70 focus-visible:bg-background"
              />
            </div>

            {/* Status: label in button with dropdown - matches screenshot "Status: All ▾" */}
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-11 rounded-xl border-border px-3.5 gap-2 text-[13px] font-medium bg-background hover:bg-muted/50 shrink-0"
                  />
                }
              >
                <Filter size={15} className="text-primary" />
                <span className="text-muted-foreground">Status:</span>
                <span className="text-foreground font-semibold">{statusLabel}</span>
                <ArrowUpDown size={13} className="text-muted-foreground ml-0.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1 mt-1.5">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                    Filter by status
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-1" />
                  {STATUS_OPTIONS.map((opt) => (
                    <DropdownMenuCheckboxItem
                      key={opt.value}
                      checked={status === opt.value}
                      onCheckedChange={() => {
                        setStatus(opt.value);
                        setPagination((p) => ({ ...p, pageIndex: 0 }));
                      }}
                      className="h-9 rounded-lg px-2.5 text-[13px] cursor-pointer"
                    >
                      {opt.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-5 pt-0">
        <DataTable<AnyUser, unknown>
          columns={columns}
          data={query.data?.items ?? []}
          totalCount={query.data?.total ?? 0}
          isLoading={query.isLoading && !query.isFetched}
          isError={query.isError}
          error={query.error as Error}
          onRetry={() => query.refetch()}
          pagination={{
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
          }}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
          searchTerm={search || undefined}
          emptyTitle="No Users Found"
          emptyDescription="There are currently no users matching your search or filter criteria. Try adjusting your filters or check back later as new users join the platform."
          tableClassName="px-2 sm:px-3"
        />
      </CardContent>
    </Card>
  );
}