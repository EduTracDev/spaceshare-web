import type { StatusKey } from "@/constants/status";

export type BookingStatus =
  | "approved"
  | "pending"
  | "disputed"
  | "cancelled"
  | "completed";

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
  approved: "approved",
  pending: "pending",
  disputed: "rejected",
  cancelled: "cancelled",
  completed: "completed",
};