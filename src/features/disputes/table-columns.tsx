"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Dispute } from "@/features/disputes/types/dispute.types";
import { DISPUTE_STATUS_KEYS } from "@/features/disputes/types/dispute.types";

export interface DisputeRowActions {
  onViewDetails: (dispute: Dispute) => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function buildDisputeColumns(actions: DisputeRowActions): ColumnDef<Dispute>[] {
  return [
    {
      accessorKey: "disputeNumber",
      header: "Dispute ID",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[12.5px] font-semibold text-foreground/90">
          {row.original.disputeNumber}
        </span>
      ),
    },
    {
      accessorKey: "bookingNumber",
      header: "Booking ID",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[13px] font-medium text-foreground/85">
          {row.original.bookingNumber}
        </span>
      ),
    },
    {
      accessorKey: "guest.fullName",
      header: "Guest",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground/85">{row.original.guest.fullName}</span>
      ),
    },
    {
      accessorKey: "host.fullName",
      header: "Host",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground/85">{row.original.host.fullName}</span>
      ),
    },
    {
      accessorKey: "spaceName",
      header: "Space",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="block text-left text-[13px] text-foreground/85">
          {row.original.spaceName}
        </span>
      ),
    },
    {
      accessorKey: "dateFiled",
      header: "Date",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[12.5px] text-foreground/85 whitespace-nowrap">
          {formatDate(row.original.dateFiled)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => (
        <StatusBadge status={DISPUTE_STATUS_KEYS[row.original.status]} />
      ),
    },
  ];
}