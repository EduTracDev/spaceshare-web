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

/** 3 transaction tabs — exactly matches backend Prisma TransactionType enum (lowercase UI) */
export type TransactionTab = "payments" | "payouts" | "refunds";

/** 3 ledger-typed values — exactly what backend returns, no derivation */
export type TransactionType = "payment" | "payout" | "refund";

/** Raw DB Transaction.status enum (3 values only).
 *  Frontend no longer derives 7 badge colors — badge maps directly from this.
 */
export type DbTransactionStatus = "PENDING" | "SUCCESSFUL" | "FAILED";

/** Status dropdown filter (4 options: All + 3 DB statuses). Replaces old 7-filter. */
export type TransactionStatusFilter =
  | "all"
  | "pending"
  | "success"
  | "failed";

/** Maps TransactionTab (plural UI label) <-> TransactionType (backend singular).
 *  Used when sending backend `type` query param from currently selected tab. */
export const TAB_TO_TYPE: Record<TransactionTab, TransactionType> = {
  payments: "payment",
  payouts:  "payout",
  refunds:  "refund",
};

export const TYPE_TO_TAB: Record<TransactionType, TransactionTab> = {
  payment: "payments",
  payout:  "payouts",
  refund:  "refunds",
};

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
  /** Authoritative role from backend (Booking.cancelledByRole enum): HOST | GUEST | ADMIN — NO FRONTEND GUESSING */
  byRole: "HOST" | "GUEST" | "ADMIN";
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
   * Booking status (PENDING / PAID / APPROVED / COMPLETED / CANCELLED).
   * Non-negotiable column visible on Payouts & Refunds tabs for button eligibility.
   * Eligibility rules:
   *   Mark As Paid visible ONLY when:
   *     type === 'payout' AND dbStatus === 'PENDING' AND bookingStatus === 'COMPLETED'
   *   Mark Refunded visible ONLY when:
   *     type === 'refund' AND dbStatus === 'PENDING' AND bookingStatus === 'CANCELLED'
   */
  bookingStatus: BookingStatus;
  eventDate: string;
  /** Generic transaction init timestamp (not just payments) */
  transactionDate: string;
  /** Generic amount (direction shown by type badge, not stored as +/- sign) */
  amount: number;
  commission: number;
  netPayout: number;
  /**
   * RAW DB status (3 values). Replaces old derived 7-status.
   * Badge color now maps 1:1 from this via TRANSACTION_DB_STATUS_KEYS below.
   */
  dbStatus: DbTransactionStatus;
  /** Financial ledger breakdown — same shape as backend shaper */
  breakdown: FinancialBreakdown;
  cancellation?: CancellationInfo;
  refund?: RefundInfo;
  /**
   * USER recipient receiving the cash movement (OUT of SpaceShare).
   *
   *   PAYMENT  → NULL. Money goes INTO SpaceShare holding account; no user recipient.
   *             Payment Details Dialog: NO bank card (Figma 1 & 2). Shows Payment Breakdown only.
   *   PAYOUT   → HOST or GUEST. Recipient bank card visible in Dialog (Figma 3). Mark As Paid button.
   *   REFUND   → GUEST only. Cancelled booking cash-back. Bank card + Mark Refunded button (Figma 4).
   */
  recipientRole: "HOST" | "GUEST" | null;
  recipientName: string | null;
  recipientEmail: string | null;
  /**
   * Counter-party identity = the user on the OTHER side of the transaction.
   * Used everywhere (always populated, non-null, no heuristics, explicit):
   * - Payments tab "Name" column → Guest who paid us (since recipient = NULL platform)
   * - Dialog header title → Mike Johnson (counter-party name)
   * - Sorted by Name column → counterpartyName sorts
   */
  counterpartyRole: "HOST" | "GUEST";
  counterpartyName: string;
  counterpartyEmail: string;
}

export interface TransactionQueryParams {
  search?: string;
  /** 3-value filter: All | pending | success | failed (maps 1:1 to DB status via FILTER_TO_DB below) */
  status?: TransactionStatusFilter;
  page?: number;
  pageSize?: number;
  sortBy?:
    | "transactionNumber" 
    | "bookingNumber" 
    | "name"           
    | "hostName"          
    | "amount"
    | "status"
    | "eventDate"          
    | "commission"
    | "netPayout"
    | "transactionDate"    
    | "dateCancelled";    
  sortOrder?: "asc" | "desc";
  type?: "all" | TransactionType;
  tab?: TransactionTab;
}

export interface PaginatedTransactions {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}

/* -------------------------------------------------------------------------- */
/*                          STATUS ↔ FILTER / BADGE MAPS                      */
/*                                                                            */
/*  ALL DERIVATION LOGIC DELETED. Everything maps raw DB enums 1:1.           */
/* -------------------------------------------------------------------------- */

/** Maps TransactionStatusFilter dropdown selection → backend DB status.
 *  'all' → no filter. */
export const FILTER_TO_DB: Record<
  Exclude<TransactionStatusFilter, "all">,
  DbTransactionStatus
> = {
  pending: "PENDING",
  success: "SUCCESSFUL",
  failed:  "FAILED",
};

export const DB_TO_FILTER: Record<DbTransactionStatus, Exclude<TransactionStatusFilter, "all">> = {
  PENDING:    "pending",
  SUCCESSFUL: "success",
  FAILED:     "failed",
};

/**
 * Badge coloring — 3 values only (no more completed/paid/cancelled/refunded magic).
 *   pending   → amber "Pending"
 *   success   → green "Success" (replaces old "Approved/Paid/Closed/Completed" variants)
 *   failed    → red "Failed"
 */
export const TRANSACTION_DB_STATUS_KEYS: Record<DbTransactionStatus, StatusKey> = {
  PENDING:    "pending",
  SUCCESSFUL: "approved",
  FAILED:     "failed",
};

/** Human-readable badge labels shown on Status column / dropdown. */
export const DB_STATUS_LABELS: Record<DbTransactionStatus, string> = {
  PENDING:    "Pending",
  SUCCESSFUL: "Success",
  FAILED:     "Failed",
};

/** Tab labels & colors. */
export const TAB_LABELS: Record<TransactionTab, string> = {
  payments: "Payments",
  payouts:  "Payouts",
  refunds:  "Refunds",
};

/**
 * Helpers — button visibility & eligibility.
 * These live on the frontend — backend STILL enforces 5 ironclad guards server-side.
 * Frontend just uses these to enable/disable buttons.
 */
export function canMarkPayoutAsPaid(
  row: Pick<Transaction, "type" | "dbStatus" | "bookingStatus">
): boolean {
  return (
    row.type === "payout" &&
    row.dbStatus === "PENDING" &&
    row.bookingStatus === "COMPLETED"
  );
}

export function canMarkRefundAsRefunded(
  row: Pick<Transaction, "type" | "dbStatus" | "bookingStatus">
): boolean {
  return (
    row.type === "refund" &&
    row.dbStatus === "PENDING" &&
    row.bookingStatus === "CANCELLED"
  );
}

/** Tooltip message to show on disabled pending payout button (explain why greyed). */
export function payoutIneligibilityReason(
  row: Pick<Transaction, "type" | "dbStatus" | "bookingStatus">
): string | null {
  if (row.type !== "payout" || row.dbStatus !== "PENDING") return null;
  if (row.bookingStatus !== "COMPLETED") {
    return `Booking not completed yet (status: ${row.bookingStatus}). You cannot release payout before the event has occurred.`;
  }
  return null;
}

