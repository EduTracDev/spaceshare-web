import type { StatusKey } from "@/constants/status";

export type TransactionStatus =
  | "pending"
  | "paid"
  | "failed"
  | "success"
  | "completed"
  | "cancelled";

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
}

export interface CancellationInfo {
  byName: string;
  byEmail: string;
  timestamp: string;
  reason: string;
}

export interface RefundInfo {
  hostPayoutAmount: number;
  refundAmount: number;
  refundedAt?: string;
}

export interface PaymentBreakdown {
  grossBookingAmount: number;
  platformCommission: number;
  refundableCautionFee: number;
  netPayoutHost: number;
}

export interface Transaction {
  id: string;
  bookingNumber: string;
  payoutNumber: string;
  spaceName: string;
  host: TransactionHost;
  guest?: TransactionGuest;
  eventDate: string;
  paymentDate: string;
  amountPaid: number;
  commission: number;
  netPayout: number;
  status: TransactionStatus;
  payout: PaymentBreakdown;
  cancellation?: CancellationInfo;
  refund?: RefundInfo;
}

export interface TransactionQueryParams {
  search?: string;
  status?: TransactionStatus;
  page?: number;
  pageSize?: number;
  sortBy?:
    | "bookingNumber"
    | "hostName"
    | "eventDate"
    | "amountPaid"
    | "commission"
    | "netPayout"
    | "status";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedTransactions {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}

export const TRANSACTION_STATUS_KEYS: Record<TransactionStatus, StatusKey> = {
  pending: "pending",
  paid: "approved",
  failed: "failed",
  success: "completed",
  completed: "completed",
  cancelled: "cancelled",
};