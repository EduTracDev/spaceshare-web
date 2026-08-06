"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/formatters";
import type { AuditLog } from "@/features/audit-logs/types/audit-log.types";

function formatDateOnly(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function buildAuditLogColumns(): ColumnDef<AuditLog>[] {
  return [
    {
      accessorKey: "actor.fullName",
      header: "User/ID",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="min-w-0">
          <div className="text-[13px] font-medium text-foreground/95">
            {row.original.actor.fullName}
          </div>
          <div className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
            {row.original.actor.email}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "timestamp",
      header: "Date & Time",
      enableSorting: true,
      sortingFn: (rowA, rowB) =>
        new Date(rowA.original.timestamp).getTime() -
        new Date(rowB.original.timestamp).getTime(),
      cell: ({ row }) => {
        const timestamp = row.original.timestamp;
        return (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[12.5px] font-medium text-foreground/90">
              {formatDateOnly(timestamp)}
            </span>
            <span className="text-[12.5px] text-foreground/70">
              {new Date(timestamp).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Activity",
      enableSorting: true,
      cell: ({ row }) => (
        <span
          className={cn(
            "inline-flex rounded-full bg-primary/10 px-3 py-1 text-[12px] font-semibold text-primary"
          )}
        >
          {row.original.action}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      enableSorting: true,
      cell: ({ row }) => (
        <p className="text-[12.5px] leading-6 text-foreground/85">
          {row.original.description}
        </p>
      ),
    },
  ];
}