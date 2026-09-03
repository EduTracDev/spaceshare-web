import type { StatusKey } from "@/constants/status";

/**
 * ⚠️ CANONICAL ADMIN BOOKING STATUS CONTRACT — SINGLE SOURCE OF TRUTH ⚠️
 *
 * These exact 7 lowercase literal strings are the ONLY values the backend
 * ever returns for the `status` field on admin booking endpoints.
 *
 * Source of truth — backend function:
 *   spaceshare-backend/src/services/admin/booking.service.ts → mapStatus()
 *
 * Values & semantics (synchronise any changes with backend mapStatus docstring):
 *   "pending"   BookingStatus.PENDING   — guest submitted request, host has not yet acted
 *   "approved"  BookingStatus.APPROVED  — host accepted request; guest may or may not have paid
 *   "declined"  BookingStatus.DECLINED  — host REFUSED the pending request.
 *                                          NO refund needed — money never moved.
 *                                          declined ≠ cancelled — see booking.service.ts
 *   "paid"      BookingStatus.PAID      — guest completed payment; paymentRef set; money held
 *   "completed" BookingStatus.COMPLETED — event finished; payout released to host
 *   "cancelled" BookingStatus.CANCELLED — EITHER party cancelled. REFUND required if was PAID.
 *   "disputed"  (VIRTUAL — not a DB enum) — overrides base status when open Dispute row exists
 *                                         AND base ∈ {pending, approved, paid, completed}
 */
export type BookingStatus =
  | "pending"
  | "approved"
  | "declined"
  | "paid"
  | "completed"
  | "cancelled"
  | "disputed";

export type BookingStatusFilter = "all" | BookingStatus;

export interface BookingParty {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export interface BookingPaymentLine {
  label: string;
  amount: number;
  isDeduction?: boolean;
  isTotal?: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  spaceName: string;
  location: string;
  capacityLabel: string;
  guest: BookingParty;
  host: BookingParty;
  eventDate: string;
  eventTimeLabel: string;
  paymentDate: string;
  amount: number;
  status: BookingStatus;
  spaceFee: number;
  addOnsTotal: number;
  cautionFee: number;
  serviceFee: number;
  platformCommission: number;
  netPayoutHost: number;
}

export interface BookingQueryParams {
  search?: string;
  status?: BookingStatus;
  page?: number;
  pageSize?: number;
  sortBy?:
    | "bookingNumber"
    | "guestName"
    | "hostName"
    | "spaceName"
    | "eventDate"
    | "amount"
    | "status";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedBookings {
  items: Booking[];
  total: number;
  page: number;
  pageSize: number;
}

export const BOOKING_STATUS_KEYS: Record<BookingStatus, StatusKey> = {
  pending: "pending",
  approved: "approved",
  declined: "declined",
  paid: "paid",
  completed: "completed",
  cancelled: "cancelled",
  // "disputed" → uses StatusKey 'in_progress' — indigo/blue variant is the correct
  // semantic color for an active open/dispute-in-progress, rather than red 'rejected'
  // which would imply the dispute was already resolved against someone.
  disputed: "in_progress",
};