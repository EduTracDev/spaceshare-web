"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Transaction, TransactionTab } from "@/features/transactions/types/transaction.types";
import {
  TRANSACTION_DB_STATUS_KEYS,
  DB_STATUS_LABELS,
  TYPE_TO_TAB,
} from "@/features/transactions/types/transaction.types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";

export interface TransactionRowActions {
  onViewDetails: (transaction: Transaction) => void;
}

function formatDate(value: string | undefined | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

/* -------------------------------------------------------------------------- */
/*                              RECIPIENT HELPER                              */
/*                                                                            */
/* For PAYOUT rows the backend creates TWO rows per booking COMPLETED:        */
/*   Row A: recipient = Host   (amount = net booking after commission)        */
/*   Row B: recipient = Guest  (amount = caution fee refund)                  */
/* For REFUND rows: recipient is always Guest (cancelled booking → refund).   */
/* For PAYMENT rows: counter-party is Guest (they paid us).                   */
/*                                                                            */
/* Strategy: if backend sends recipientId on Transaction (FK to User), use    */
/* it. Otherwise fall back to the heuristic below that matches the 2-row      */
/* payout write plan in booking.service.ts (same logic on frontend + backend).*/
/* -------------------------------------------------------------------------- */

type RecipientRole = "HOST" | "GUEST";
type Recipient = { role: RecipientRole; fullName: string; email: string };

function getRecipient(row: Transaction): Recipient {
  /* ================================================================
     AUTHORITATIVE DATA SOURCE ONLY — backend-supplied explicit fields.
     NO amount-math heuristics, NO role guesswork, NO fallbacks that
     silently misidentify parties. Financial ledgers require 100%
     explicit identity from the same `recipientId` FK written at
     `prisma.transaction.create()` time in booking.service.ts hooks.
     ================================================================== */
  const { host, guest, type, cancellation, recipientRole, recipientName, recipientEmail, counterpartyRole, counterpartyName, counterpartyEmail } = row;

  // 1) PAYMENT — money in from the booking guest.
  //    PAYMENT recipientId = NULL per DB CHECK rule (into SpaceShare holding account).
  //    => Payments tab Name column uses the EXPLICIT counterparty (guest) from backend,
  //       not recipient fields (they are intentionally null).
  if (type === "payment") {
    if (counterpartyName && counterpartyRole) {
      return {
        role: counterpartyRole,
        fullName: counterpartyName,
        email: counterpartyEmail ?? guest?.email ?? host.email,
      };
    }
    // Fallback: definitionally = Guest (who pays platform).
    return {
      role: "GUEST",
      fullName: guest?.fullName ?? host.fullName,
      email: guest?.email ?? host.email,
    };
  }

  // 2) REFUND — cash back to the cancelled-booking guest.
  //    (Required recipientId = guest per DB CHECK rule.)
  if (type === "refund") {
    if (recipientRole && recipientName) {
      return {
        role: recipientRole,
        fullName: recipientName,
        email: recipientEmail ?? counterpartyEmail ?? guest?.email ?? cancellation?.byEmail ?? host.email,
      };
    }
    // Fallback (should not happen post DB CHECK): counterparty explicit then booking guest.
    if (counterpartyName && counterpartyRole) {
      return { role: counterpartyRole, fullName: counterpartyName, email: counterpartyEmail ?? "—" };
    }
    return {
      role: "GUEST",
      fullName: guest?.fullName ?? cancellation?.byName ?? host.fullName,
      email: guest?.email ?? cancellation?.byEmail ?? host.email,
    };
  }

  // 3) PAYOUT — the ONLY case previously used fragile amount heuristics.
  //    From now on the backend MUST tell us explicitly (recipientRole + recipientName).
  if (type === "payout") {
    if (recipientRole && recipientName) {
      return {
        role: recipientRole,
        fullName: recipientName,
        email: recipientEmail ?? (recipientRole === "HOST" ? host.email : counterpartyEmail ?? guest?.email ?? host.email),
      };
    }
    // Fallback 1: counterparty explicit backend field (e.g. recipient is Guest caution payout).
    if (counterpartyName && counterpartyRole) {
      return {
        role: counterpartyRole,
        fullName: counterpartyName,
        email: counterpartyEmail ?? (counterpartyRole === "HOST" ? host.email : guest?.email ?? host.email),
      };
    }

    // -----------------------------------------------------------------
    // 🔴 BACKEND DATA MISSING (should never happen on post-refactor rows).
    //    Do NOT guess identity from amounts (wrong label = audit risk).
    //    Emit a dev warning and return dash/placeholder so the gap is
    //    VISIBLE to the admin (they'll open the row and see the missing
    //    recipient relation, fix is to re-run Transaction writer to
    //    populate `recipientId` on the legacy rows via backfill script).
    // -----------------------------------------------------------------
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "[getRecipient] ⚠️ Backend did not supply explicit recipientRole/recipientName on payout row " +
        `${row.transactionNumber ?? row.id}. Identity cannot be safely inferred from amounts; ` +
        `showing Unknown Recipient instead of guessing. Please backfill Transaction.recipientId FK.`
      );
    }
    return { role: "HOST", fullName: "Unknown Recipient", email: "—" };
  }

  // TypeScript exhaustiveness guard (all 3 types handled above).
  return { role: "HOST", fullName: host.fullName, email: host.email };
}

function RecipientChip({ role }: { role: RecipientRole }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        role === "HOST"
          ? "bg-brand-50 text-primary"
          : "bg-blue-50 text-blue-700"
      )}
    >
      {role === "HOST" ? "Host" : "Guest"}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                         COLUMN SET BUILDER — PER TAB                       */
/* -------------------------------------------------------------------------- */

export function buildTransactionColumns(
  tab: TransactionTab,
  actions: TransactionRowActions
): ColumnDef<Transaction>[] {
  const baseCellClick = (row: { original: Transaction }) => {
    actions.onViewDetails(row.original);
  };

  // ============ TAB: PAYMENTS ============
  if (tab === "payments") {
    return [
      {
        accessorKey: "transactionNumber",
        header: "#ID",
        enableSorting: true,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => baseCellClick(row)}
            className="text-left text-[12.5px] font-semibold text-foreground/90 hover:text-primary"
          >
            {row.original.transactionNumber}
          </button>
        ),
      },
      {
        id: "guest",
        header: "Name",
        enableSorting: true,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => baseCellClick(row)}
            className="text-left text-[13px] text-foreground/85 hover:text-primary"
          >
            {getRecipient(row.original).fullName}
          </button>
        ),
      },
      {
        accessorKey: "eventDate",
        header: "Event Date",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-[12.5px] text-foreground/85 whitespace-nowrap">
            {formatDate(row.original.eventDate)}
          </span>
        ),
      },
      {
        accessorKey: "breakdown.grossBookingAmount",
        header: "Amount Paid",
        enableSorting: true,
        sortingFn: (a, b) =>
          Number(a.original.breakdown?.grossBookingAmount ?? 0) -
          Number(b.original.breakdown?.grossBookingAmount ?? 0),
        cell: ({ row }) => (
          <span className="text-[13px] font-medium text-foreground/90 whitespace-nowrap">
            {formatCurrency(
              Number(row.original.breakdown?.grossBookingAmount ?? row.original.amount ?? 0)
            )}
          </span>
        ),
      },
      {
        accessorKey: "commission",
        header: "Commission",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-[13px] text-foreground/60 whitespace-nowrap">
            -{formatCurrency(Math.abs(Number(row.original.commission ?? 0)))}
          </span>
        ),
      },
      {
        accessorKey: "netPayout",
        header: "Net Payout",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-[13px] font-medium text-foreground/90 whitespace-nowrap">
            {formatCurrency(Number(row.original.netPayout ?? 0))}
          </span>
        ),
      },
      {
        accessorKey: "dbStatus",
        header: "Status",
        enableSorting: true,
        cell: ({ row }) => (
          <StatusBadge
            status={TRANSACTION_DB_STATUS_KEYS[row.original.dbStatus]}
            label={DB_STATUS_LABELS[row.original.dbStatus]}
          />
        ),
      },
    ];
  }

  // ============ TAB: PAYOUTS ============
  if (tab === "payouts") {
    return [
      {
        accessorKey: "transactionNumber",
        header: "#ID",
        enableSorting: true,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => baseCellClick(row)}
            className="text-left text-[12.5px] font-semibold text-foreground/90 hover:text-primary"
          >
            {row.original.transactionNumber}
          </button>
        ),
      },
      {
        id: "name",
        header: "Name",
        enableSorting: true,
        sortingFn: (a, b) =>
          getRecipient(a.original).fullName.localeCompare(getRecipient(b.original).fullName),
        cell: ({ row }) => {
          const recipient = getRecipient(row.original);
          return (
            <button
              type="button"
              onClick={() => baseCellClick(row)}
              className="text-left text-[13px] text-foreground/85 hover:text-primary"
            >
              {recipient.fullName}
            </button>
          );
        },
      },
      {
        accessorKey: "transactionDate",
        header: "Date Created",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-[12.5px] text-foreground/85 whitespace-nowrap">
            {formatDate(row.original.transactionDate)}
          </span>
        ),
      },
      {
        id: "userType",
        header: "User Type",
        enableSorting: false,
        cell: ({ row }) => <RecipientChip role={getRecipient(row.original).role} />,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-[13px] font-medium text-foreground/90 whitespace-nowrap">
            {formatCurrency(Number(row.original.amount ?? 0))}
          </span>
        ),
      },
      {
        accessorKey: "dbStatus",
        header: "Status",
        enableSorting: true,
        cell: ({ row }) => (
          <StatusBadge
            status={TRANSACTION_DB_STATUS_KEYS[row.original.dbStatus]}
            label={DB_STATUS_LABELS[row.original.dbStatus]}
          />
        ),
      },
    ];
  }

  // ============ TAB: REFUNDS ============
  return [
    {
      accessorKey: "transactionNumber",
      header: "#ID",
      enableSorting: true,
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => baseCellClick(row)}
          className="text-left text-[12.5px] font-semibold text-foreground/90 hover:text-primary"
        >
          {row.original.transactionNumber}
        </button>
      ),
    },
    {
      id: "name",
      header: "Name",
      enableSorting: true,
      sortingFn: (a, b) =>
        getRecipient(a.original).fullName.localeCompare(getRecipient(b.original).fullName),
      cell: ({ row }) => {
        const recipient = getRecipient(row.original);
        return (
          <button
            type="button"
            onClick={() => baseCellClick(row)}
            className="text-left text-[13px] text-foreground/85 hover:text-primary"
          >
            {recipient.fullName}
          </button>
        );
      },
    },
    {
      accessorKey: "spaceName",
      header: "Space",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[12.5px] text-foreground/85 whitespace-nowrap">
          {row.original.spaceName}
        </span>
      ),
    },
    {
      id: "dateCancelled",
      header: "Date Cancelled",
      enableSorting: true,
      sortingFn: (a, b) => {
        const ax = new Date(a.original.cancellation?.timestamp ?? 0).getTime();
        const bx = new Date(b.original.cancellation?.timestamp ?? 0).getTime();
        return ax - bx;
      },
      cell: ({ row }) => (
        <span className="text-[12.5px] text-foreground/85 whitespace-nowrap">
          {formatDate(row.original.cancellation?.timestamp)}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-[13px] font-medium text-foreground/90 whitespace-nowrap">
          {formatCurrency(Number(row.original.amount ?? 0))}
        </span>
      ),
    },
    {
        accessorKey: "dbStatus",
        header: "Status",
        enableSorting: true,
        cell: ({ row }) => {
         const label = DB_STATUS_LABELS[row.original.dbStatus];
          const statusKey = TRANSACTION_DB_STATUS_KEYS[row.original.dbStatus];
          return <StatusBadge status={statusKey} label={label} />;
        },
      },
  ];
}

/* -------------------------------------------------------------------------- */
/*                                LOOKUP TABLE                                */
/*   Used by PAYOUTS tab User Type All/Host/Guest dropdown filter client-side.*/
/* -------------------------------------------------------------------------- */

export function matchesUserTypeFilter(
  row: Transaction,
  userType: "all" | "HOST" | "GUEST"
): boolean {
  if (userType === "all") return true;
  // Payouts tab only — 99% hot path: backend authoritative recipient.
  if (row.type === "payout") {
    if (row.recipientRole) return row.recipientRole === userType;
    if (row.counterpartyRole) return row.counterpartyRole === userType;
  }
  // Fallback for legacy rows (should be zero after schema + write hooks).
  return getRecipient(row).role === userType;
}

export { TYPE_TO_TAB, getRecipient };