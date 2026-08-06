"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Transaction } from "@/features/transactions/types/transaction.types";
import { TRANSACTION_STATUS_KEYS } from "@/features/transactions/types/transaction.types";
import { formatCurrency } from "@/utils/formatters";

export interface TransactionRowActions {
  onViewDetails: (transaction: Transaction) => void;
}

function formatEventDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function buildTransactionColumns(
  actions: TransactionRowActions
): ColumnDef<Transaction>[] {
  return [
    {
      accessorKey: "bookingNumber",
      header: "#ID",
      enableSorting: true,
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => actions.onViewDetails(row.original)}
          className="text-[12.5px] font-semibold text-foreground/90 hover:text-primary"
        >
          {row.original.bookingNumber}
        </button>
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
      accessorKey: "eventDate",
      header: "Event Date",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[12.5px] text-foreground/85 whitespace-nowrap">
          {formatEventDate(row.original.eventDate)}
        </span>
      ),
    },
    {
      accessorKey: "amountPaid",
      header: "Amount Paid",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[13px] font-medium text-foreground/90">
          {formatCurrency(row.original.amountPaid)}
        </span>
      ),
    },
    {
      accessorKey: "commission",
      header: "Commission",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground/60">
          -{formatCurrency(Math.abs(row.original.commission))}
        </span>
      ),
    },
    {
      accessorKey: "netPayout",
      header: "Net Payout",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[13px] font-medium text-foreground/90">
          {formatCurrency(row.original.netPayout)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => (
        <StatusBadge status={TRANSACTION_STATUS_KEYS[row.original.status]} />
      ),
    },
  ];
}