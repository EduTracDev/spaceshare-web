"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Booking } from "@/features/bookings/types/booking.types";
import { BOOKING_STATUS_KEYS } from "@/features/bookings/types/booking.types";
import { formatCurrency } from "@/utils/formatters";

export interface BookingRowActions {
  onViewDetails: (booking: Booking) => void;
}

function formatEventDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function buildBookingColumns(actions: BookingRowActions): ColumnDef<Booking>[] {
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
        <button
          type="button"
          onClick={() => actions.onViewDetails(row.original)}
          className="text-left text-[13px] text-foreground/85 hover:text-primary"
        >
          {row.original.spaceName}
        </button>
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
      accessorKey: "amount",
      header: "Amount",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[13px] font-medium text-foreground/90">
          {formatCurrency(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => (
        <StatusBadge status={BOOKING_STATUS_KEYS[row.original.status]} />
      ),
    },
  ];
}