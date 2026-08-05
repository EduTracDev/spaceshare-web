"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Listing, ListingCategory } from "@/features/listings/types/listing.types";
import { formatCurrency } from "@/utils/formatters";

export interface ListingRowActions {
  onViewDetails: (listing: Listing) => void;
}

const CATEGORY_LABELS: Record<ListingCategory, string> = {
  rooftop: "Rooftop",
  garden: "Garden",
  studio: "Studio",
  open_space: "Open Space",
  lounge: "Lounge",
  hall: "Hall",
};

function formatSubmittedAt(value: string) {
  return new Date(value).toLocaleString("en-NG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function buildListingColumns(actions: ListingRowActions): ColumnDef<Listing>[] {
  return [
    {
      accessorKey: "spaceName",
      header: "Space Name",
      enableSorting: true,
      cell: ({ row }) => {
        const listing = row.original;

        return (
          <button
            type="button"
            onClick={() => actions.onViewDetails(listing)}
            className="flex w-full flex-col rounded-lg py-1 text-left transition-colors hover:bg-muted/30"
          >
            <span className="text-[13px] font-medium text-foreground">{listing.spaceName}</span>
            <span className="mt-0.5 text-[11px] text-muted-foreground">
              {CATEGORY_LABELS[listing.category]}
            </span>
          </button>
        );
      },
    },
    {
      accessorKey: "host.fullName",
      header: "Host",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground/85">{row.original.host.fullName}</span>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground/85 whitespace-nowrap">{row.original.location}</span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[13px] text-foreground/85">{formatCurrency(row.original.price)}</span>
      ),
    },
    {
      accessorKey: "submittedAt",
      header: "Date Submitted",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[12.5px] text-foreground/85 whitespace-nowrap">
          {formatSubmittedAt(row.original.submittedAt)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      enableSorting: true,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];
}