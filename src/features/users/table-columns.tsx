"use client";


import type { ColumnDef, CellContext } from "@tanstack/react-table";
import { Ban, CircleCheckBig, EllipsisVertical, Eye } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AnyUser, HostUser, AdminUser, GuestUser, UserRoleTab } from "@/features/users/types/user.types";
import { cn } from "@/lib/utils";

export interface UserRowActions {
  onViewDetails: (user: AnyUser) => void;
  onSuspend: (user: AnyUser) => void;
  onReactivate: (user: AnyUser) => void;
}

function RoleBadge({ role }: { role: AnyUser["role"] }) {
  const label = role === "super_admin" ? "Super Admin" : role[0].toUpperCase() + role.slice(1);
  return (
    <span className="inline-flex items-center rounded-full bg-brand-50 text-primary px-2.5 py-1 text-[11px] font-semibold">
      {label}
    </span>
  );
}

export function buildUserColumns(actions: UserRowActions, roleTab: UserRoleTab): ColumnDef<AnyUser>[] {
  return [
    {
      accessorKey: "fullName",
      header: "Name",
      enableSorting: true,
      cell: ({ row }: CellContext<AnyUser, unknown>) => {
        const u = row.original;
        return (
          <div className="group flex items-center gap-3 w-full text-left -my-1 py-1 pr-2">
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {u.fullName}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
      cell: ({ row }: CellContext<AnyUser, unknown>) => {
        const email = row.getValue("email") as string;
        return (
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-foreground/85 truncate max-w-[220px]">{email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      enableSorting: true,
      size: 100,
      cell: ({ row }: CellContext<AnyUser, unknown>) => <RoleBadge role={row.original.role} />,
    },
    roleTab === "host"
      ? {
          accessorKey: "totalListings",
          header: "Listings",
          enableSorting: true,
          size: 90,
          cell: ({ row }: CellContext<AnyUser, unknown>) => {
            const u = row.original;
            if (u.role === "host") {
              return <span className="text-[13px] font-medium text-foreground">{(u as HostUser).totalListings}</span>;
            }
            return <span className="text-[13px] text-muted-foreground">—</span>;
          },
        }
      : roleTab === "guest"
        ? {
            accessorKey: "totalBookings",
            header: "Bookings",
            enableSorting: true,
            size: 90,
            cell: ({ row }: CellContext<AnyUser, unknown>) => {
              const u = row.original;
              if (u.role === "guest") {
                return <span className="text-[13px] font-medium text-foreground">{(u as GuestUser).totalBookings}</span>;
              }
              return <span className="text-[13px] text-muted-foreground">—</span>;
            },
          }
        : null,
    {
      accessorKey: "dateRegistered",
      header: "Date Registered",
      enableSorting: true,
      cell: ({ row }: CellContext<AnyUser, unknown>) => {
        const value = row.getValue("dateRegistered") as string | undefined;
        if (!value) return <span className="text-[12px] text-muted-foreground">Invite pending</span>;
        return <span className="text-[12.5px] text-foreground/85 whitespace-nowrap">{value}</span>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      size: 120,
      cell: ({ row }: CellContext<AnyUser, unknown>) => (
        <StatusBadge status={row.original.status} />
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      enableSorting: false,
      size: 60,
      cell: ({ row }: CellContext<AnyUser, unknown>) => {
        const u = row.original;
        const canSuspend = u.status === "active" || u.status === "pending";
        const canReactivate = u.status === "suspended";
        return (
          <div onClick={(event) => event.stopPropagation()}>
            <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                  aria-label="User actions"
                />
              }
            >
              <EllipsisVertical size={18} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-2xl p-1.5 mt-1">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className={cn("h-9 gap-2.5 rounded-lg px-2.5 cursor-pointer")}
                  onClick={() => actions.onViewDetails(u)}
                >
                  <Eye size={16} />
                  <span className="text-[13px]">View details</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                {canSuspend ? (
                  <DropdownMenuItem
                    className="h-9 gap-2.5 rounded-lg px-2.5 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                    onClick={() => actions.onSuspend(u)}
                  >
                    <Ban size={16} />
                    <span className="text-[13px]">Suspend</span>
                  </DropdownMenuItem>
                ) : null}
                {canReactivate ? (
                  <DropdownMenuItem
                    className="h-9 gap-2.5 rounded-lg px-2.5 cursor-pointer text-green-700 focus:text-green-800 focus:bg-green-50"
                    onClick={() => actions.onReactivate(u)}
                  >
                    <CircleCheckBig size={16} />
                    <span className="text-[13px]">Reactivate</span>
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        );
      },
    },
  ].filter(Boolean) as ColumnDef<AnyUser>[];
}