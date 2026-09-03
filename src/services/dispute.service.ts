import type {
  Dispute,
  DisputeQueryParams,
  PaginatedDisputes,
} from "@/features/disputes/types/dispute.types";
import { api } from "@/lib/api";

/**
 * Extract friendly backend message from Axios errors (same pattern as
 * booking.service.ts + other admin services).
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
 * with defensive fallbacks in case envelope shape is changed later.
 */
function unwrapPaginated(
  data: any,
  params: DisputeQueryParams,
): PaginatedDisputes {
  const payload = (data?.data ?? data) as PaginatedDisputes | undefined;
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

export const disputeService = {
  /**
   * GET /api/admin/disputes
   * Backend handles: status bucket filter (new = OPEN|UNDER_REVIEW, resolved = RESOLVED|REJECTED),
   * 6-field search (disputeNumber, bookingNumber, guest+host fullName/email, spaceName),
   * 7-field sort (DB native for disputeNumber/bookingNumber/spaceName/dateFiled/status;
   * JS in-memory for guestName/hostName derived fields), accurate count + pagination skip/take.
   */
  async getDisputes(params: DisputeQueryParams = {}): Promise<PaginatedDisputes> {
    try {
      const response = await api.get("/disputes", {
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10,
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
   * GET /api/admin/disputes/:id
   * Backend accepts BOTH CUID AND disputeNumber (DP-001) formats via
   * findUnique by id → fallback findFirst by disputeNumber.
   */
  async getDisputeById(id: string): Promise<Dispute> {
    try {
      const response = await api.get(`/disputes/${id}`);
      const payload = response?.data?.data as Dispute | undefined;
      if (!payload || !payload.id) throw new Error("Dispute not found");
      return payload;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * PATCH /api/admin/disputes/:id/resolve
   * Mark dispute as RESOLVED in DB. Backend requires status to be "new"
   * (OPEN or UNDER_REVIEW) or BadRequest. Optional resolutionNote body.
   * Returns { message } in same envelope shape as mock so caller UI continues
   * to display the success toast correctly.
   */
  async markAsResolved(id: string, resolutionNote?: string) {
    try {
      const body = resolutionNote ? { resolutionNote } : {};
      const response = await api.patch(`/disputes/${id}/resolve`, body);
      const message =
        (response?.data?.message as string | undefined) ??
        "Dispute resolved successfully";
      return { message };
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};