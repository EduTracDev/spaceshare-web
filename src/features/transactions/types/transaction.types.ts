import type { StatusKey } from "@/constants/status";

/* -------------------------------------------------------------------------- */
/*                             BASE TYPE ALIASES                              */
/* -------------------------------------------------------------------------- */

/** Mirrors Prisma BookingStatus on backend — backend joins from Booking row */
export type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "DECLINED"
  | "PAID"
  | "COMPLETED"
  | "CANCELLED";

export type TransactionType = "payment" | "payout" | "refund";

/** Raw DB Transaction.status enum (only 3 values, never changes) */
export type DbTransactionStatus = "PENDING" | "SUCCESSFUL" | "FAILED";

/* 7 frontend statuses = derived from (type × dbStatus × booking.status) */
export type TransactionStatus =
  | "pending"    // Payment or payout BEFORE the event
  | "success"    // PAYMENT — guest paid into platform successfully
  | "failed"     // Any transaction type returned failure
  | "completed"  // IRONCLAD: PAYOUT pending DB + BOOKING COMPLETED event
  | "paid"       // PAYOUT — admin completed offline bank transfer
  | "cancelled"  // REFUND pending (cancelled booking, refund queued)
  | "refunded";  // REFUND successful (cash returned to guest)

export type TransactionStatusFilter = "all" | TransactionStatus;

export interface TransactionHost {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface TransactionGuest {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  /** Guest bank details for caution-fee refund (payout flow when booking COMPLETED). */
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface CancellationInfo {
  /** Booking canceler user id (CUID) — matches Booking.cancelledById FK */
  byId: string;
  /** User who cancelled the booking — person's display name at cancel time (snapshot) */
  byName: string;
  /** Email of canceller (snapshot) */
  byEmail: string;
  /** Authoritative role from backend (Booking.cancelledByRole enum): HOST | GUEST — NO FRONTEND GUESSING */
  byRole: "HOST" | "GUEST";
  /** ISO timestamp of when cancellation occurred (Booking.cancelledAt) */
  timestamp: string;
  /** Booking.cancelReason */
  reason: string;
}

export interface RefundInfo {
  hostPayoutAmount: number;
  refundAmount: number;
  refundedAt?: string;
}

/** Financial breakdown used by all 3 transaction types (previously named PaymentBreakdown) */
export interface FinancialBreakdown {
  grossBookingAmount: number;
  platformCommission: number;
  refundableCautionFee: number;
  netPayoutHost: number;
  /** REFUND only — total cash returned to the guest on cancelled booking */
  refundAmountToGuest?: number;
  /** REFUND only — if partial refund, what Spaceshare kept as cancellation penalty */
  amountWithheldByPlatform?: number;
}

export interface Transaction {
  id: string;
  /** Type of ledger entry — money IN (payment) or OUT (payout/refund) */
  type: TransactionType;
  bookingNumber: string;
  transactionNumber: string;
  spaceName: string;
  host: TransactionHost;
  guest?: TransactionGuest;
  /**
   * Backend fills this from Booking.status — REQUIRED for deriveFrontendStatus:
   * PAYOUT pending + booking COMPLETED → frontend completed (Mark as Paid lives here)
   */
  bookingStatus?: BookingStatus;
  eventDate: string;
  /** Renamed from paymentDate: generic for payouts + refunds (not just payments) */
  transactionDate: string;
  /** Generic amount (direction shown by type badge, not stored as +/- sign) */
  amount: number;
  commission: number;
  netPayout: number;
  /**
   * Derive this field using `deriveFrontendStatus` from {type, bookingStatus, DB status}.
   * NEVER hard-code pending/completed: the 2 are contextual based on booking.event done.
   */
  status: TransactionStatus;
  /** Financial ledger breakdown — renamed from `payout` to be agnostic across all 3 types */
  breakdown: FinancialBreakdown;
  cancellation?: CancellationInfo;
  refund?: RefundInfo;
}

export interface TransactionQueryParams {
  search?: string;
  status?: TransactionStatusFilter;
  page?: number;
  pageSize?: number;
  sortBy?:
    | "bookingNumber"
    | "hostName"
    | "eventDate"
    | "amount"
    | "commission"
    | "netPayout"
    | "status";
  sortOrder?: "asc" | "desc";
  type?: "all" | TransactionType;
}

export interface PaginatedTransactions {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Badge coloring — matches exact 7-status flow:
 *   pending    → amber "Pending"
 *   success    → green "Approved" (guest paid platform ✓)
 *   failed     → red "Failed"
 *   completed  → emerald "Completed" ✅ EVENT DONE, PAYOUT QUEUED (Mark As Paid button LIVES HERE ONLY)
 *   paid       → green "Paid" ✨ Host payout FINALIZED (button disappears — previously this used "completed" same label = bug)
 *   cancelled  → grey "Cancelled" (refund pending)
 *   refunded   → emerald "Closed" (refund processed, distinct from "Completed"/button-target rows)
 */
export const TRANSACTION_STATUS_KEYS: Record<TransactionStatus, StatusKey> = {
  pending:   "pending",
  success:   "approved",
  failed:    "failed",
  completed: "completed",
  paid:      "paid",
  cancelled: "cancelled",
  refunded:  "closed",
};

/* -------------------------------------------------------------------------- */
/*                     CANONICAL FRONTEND STATUS DERIVATION                   */
/*                                                                            */
/* BACKEND MIRRORS THIS FUNCTION EXACTLY (admin/transaction.service.ts).     */
/* If you modify this logic, update BOTH SIDES so badges stay in sync.       */
/* -------------------------------------------------------------------------- */

const FALLBACK: Record<string, TransactionStatus> = {
  "PAYMENT|PENDING":    "pending",
  "PAYMENT|SUCCESSFUL": "success",
  "PAYMENT|FAILED":     "failed",
  "PAYOUT|SUCCESSFUL":  "paid",
  "PAYOUT|FAILED":      "failed",
  "REFUND|PENDING":     "cancelled",
  "REFUND|SUCCESSFUL":  "refunded",
  "REFUND|FAILED":      "failed",
};

/**
 * IRONCLAD RULE 1 (special-cased because admin workflow depends on it):
 *   payout + DB pending + booking COMPLETED → "completed"
 *   (admin sees Mark As Paid button ONLY on completed-status rows, NOT pending)
 *
 * Everything else falls back to the standard 3×3 table.
 */
export function deriveFrontendStatus(
  row: Pick<Transaction, "type" | "bookingStatus"> & {
    /** Provide the raw DB (PENDING / SUCCESSFUL / FAILED) status for accurate derivation */
    dbStatus: DbTransactionStatus;
  }
): TransactionStatus {
  const t: "PAYMENT" | "PAYOUT" | "REFUND" =
    row.type === "payment" ? "PAYMENT"
    : row.type === "payout" ? "PAYOUT"
    : "REFUND";

  if (
    t === "PAYOUT" &&
    row.dbStatus === "PENDING" &&
    row.bookingStatus === "COMPLETED"
  ) {
    return "completed";
  }

  const key = `${t}|${row.dbStatus}`;
  return FALLBACK[key] ?? "pending";
}