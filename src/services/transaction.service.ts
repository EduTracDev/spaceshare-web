import type {
  PaginatedTransactions,
  Transaction,
  TransactionQueryParams,
} from "@/features/transactions/types/transaction.types";
import {
  TAB_TO_TYPE,
  FILTER_TO_DB,
  type DbTransactionStatus,
  type TransactionType,
  type TransactionStatusFilter,
  type TransactionTab,
} from "@/features/transactions/types/transaction.types";
import { api } from "@/lib/api";

/**
 * Extract friendly backend message from Axios errors (same pattern as
 * dispute.service.ts and other admin services; shared verbatim to keep
 * error wording consistent across all admin feature pages.
 */
function extractErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong. Please try again.";
  const err = error as Record<string, any>;
  const candidate: unknown =
    err?.response?.data?.message ??
    err?.response?.data?.error ??
    err?.message;
  if (typeof candidate === "string" && candidate.trim().length > 0) {
    return candidate.trim();
  }
  return "Request failed. Please try again.";
}

/**
 * Safely unwrap backend envelope { success, data: { items, total, page, pageSize } }
 * with defensive fallbacks (defensive against future envelope shape changes).
 */
function unwrapPaginated(
  data: any,
  params: TransactionQueryParams,
): PaginatedTransactions {
  const payload = (data?.data ?? data) as PaginatedTransactions | undefined;
  if (payload && Array.isArray(payload.items)) {
    return {
      items: payload.items,
      total: typeof payload.total === "number" ? payload.total : 0,
      page: typeof payload.page === "number" ? payload.page : params.page ?? 1,
      pageSize:
        typeof payload.pageSize === "number"
          ? payload.pageSize
          : params.pageSize ?? 10,
    };
  }
  return {
    items: [],
    total: 0,
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 10,
  };
}

/**
 * Resolve backend `type` query param from TransactionQueryParams.
 * Priority:
 *   1. explicit legacy `type` param (caller passed 'all' | 'payment' | 'payout' | 'refund')
 *   2. new `tab` param (payments/payouts/refunds plural UI)
 *   3. default: payments tab -> payment type
 */
function resolveBackendType(
  params: TransactionQueryParams
): "all" | TransactionType {
  if (params.type) return params.type;
  if (params.tab) return TAB_TO_TYPE[params.tab as TransactionTab];
  return "payment"; // match default tab=Payments when neither provided
}

/**
 * Resolve backend status query param from dropdown filter. Dropdown sends
 * human-friendly 'all/pending/success/failed'. Backend expects raw DB
 * PENDING/SUCCESSFUL/FAILED uppercase. Returns undefined (no filter) for 'all'.
 */
function resolveBackendStatus(
  filter: TransactionStatusFilter | undefined
): DbTransactionStatus | undefined {
  if (!filter || filter === "all") return undefined;
  return FILTER_TO_DB[filter];
}

export const transactionService = {
  /**
   * GET /api/admin/transactions
   * New simplified 3-tab query. No more 7-status decoder needed on backend.
   * Tab dropdown drives `type` directly. Status dropdown drives DB status directly.
   * Backend applies SQL WHERE + sort natively (no post-fetch in-memory filter hacks).
   */
  async getTransactions(params: TransactionQueryParams = {}): Promise<PaginatedTransactions> {
    try {
      const backendType = resolveBackendType(params);
      const backendStatus = resolveBackendStatus(params.status);

      const response = await api.get("/transactions", {
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10,
          ...(backendType && backendType !== "all" ? { type: backendType } : {}),
          ...(backendStatus ? { status: backendStatus } : {}),
          ...(params.search ? { search: params.search } : {}),
          ...(params.sortBy ? { sortBy: params.sortBy } : {}),
          ...(params.sortOrder ? { sortOrder: params.sortOrder } : {}),
        },
      });
    
      return unwrapPaginated(response.data, params);
    } catch (error) {
      console.log("error:", error);
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * GET /api/admin/transactions/:id
   * Backend returns fully-shaped Transaction DTO for details dialog.
   * Now includes raw dbStatus (3 values) + bookingStatus explicit (no derive).
   */
  async getTransactionById(id: string): Promise<Transaction> {
    try {
      const response = await api.get(`/transactions/${id}`);
      const payload = response?.data?.data as Transaction | undefined;
      if (!payload || !payload.id) throw new Error("Transaction not found");
      return payload;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * POST /api/admin/transactions/:id/mark-as-paid
   * Backend enforces 5 ironclad guards: exists, type=PAYOUT, dbStatus=PENDING,
   * booking.status=COMPLETED, no OPEN/UNDER_REVIEW disputes on booking.
   * Batch pays BOTH pending payout rows (host net + guest caution) atomically.
   * Success returns { message, rowsPaid, paidAt }.
   */
  async markAsPaid(id: string) {
    try {
      const response = await api.post(`/transactions/${id}/mark-as-paid`, {});
      const message =
        (response?.data?.message as string | undefined) ??
        "Mark payout as Paid successfully";
      return { message, rowsPaid: (response?.data?.data as any)?.rowsPaid ?? 1 };
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * POST /api/admin/transactions/:id/mark-as-refunded
   * Backend enforces 5 guards: exists, type=REFUND, dbStatus=PENDING,
   * booking.status=CANCELLED, no OPEN/UNDER_REVIEW disputes on booking.
   * Success returns { message, refundedAt }.
   */
  async markAsRefunded(id: string) {
    try {
      const response = await api.post(`/transactions/${id}/mark-as-refunded`, {});
      const message =
        (response?.data?.message as string | undefined) ??
        "Mark Refund as Successful successfully";
      return { message };
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};