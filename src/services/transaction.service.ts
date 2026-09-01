import type {
  PaginatedTransactions,
  Transaction,
  TransactionQueryParams,
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

export const transactionService = {
  /**
   * GET /api/admin/transactions
   * Paginated list with filters, search, sort. Backend runs canonical 7-status badge
   * via shaper (deriveFrontendStatus on backend) so row.status === display badge.
   * Server-side handles: 7-status badge filter, type filter, 3-way search,
   * 8-column sort, accurate paginated counts.
   */
  async getTransactions(params: TransactionQueryParams = {}): Promise<PaginatedTransactions> {
    try {
      const response = await api.get("/transactions", {
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10,
          ...(params.type ? { type: params.type } : {}),
          ...(params.status ? { status: params.status } : {}),
          ...(params.search ? { search: params.search } : {}),
          ...(params.sortBy ? { sortBy: params.sortBy } : {}),
          ...(params.sortOrder ? { sortOrder: params.sortOrder } : {}),
        },
      });

      return unwrapPaginated(response.data, params);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * GET /api/admin/transactions/:id
   * Backend returns fully-shaped Transaction DTO for details dialog.
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
   * Batch pays BOTH pending payout rows (host net + guest caution atomically.
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