import type {
  PaginatedAuditLogs,
  AuditLogQueryParams,
} from "@/features/audit-logs/types/audit-log.types";
import { api } from "@/lib/api";

/**
 * Extracts user-friendly backend error message from Axios errors.
 * Falls back progressively: server JSON message → Axios generic → safe default.
 * Mirrors the pattern used in user.service.ts / listing.service.ts for consistency.
 */
function extractErrorMessage(error: any): string {
  if (error?.response?.data?.message && typeof error.response.data.message === "string") {
    return error.response.data.message;
  }
  if (typeof error?.message === "string") return error.message;
  return "Request failed. Please try again.";
}

export const auditLogService = {
  /**
   * GET /api/admin/audit-logs
   * Backend performs all: pagination, search, date-range filtering, sorting.
   *
   * Query params sent:
   *   page, pageSize, search,
   *   dateRangeStart, dateRangeEnd (flat query-string friendly),
   *   sortBy, sortOrder
   *
   * Backend envelope: { success, message, data: { items, total, page, pageSize } }
   */
  async getAuditLogs(
    params: AuditLogQueryParams = {}
  ): Promise<PaginatedAuditLogs> {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set("page", String(params.page));
      if (params.pageSize) query.set("pageSize", String(params.pageSize));
      if (params.search?.trim()) query.set("search", params.search.trim());
      if (params.dateRange?.start) query.set("dateRangeStart", params.dateRange.start);
      if (params.dateRange?.end) query.set("dateRangeEnd", params.dateRange.end);
      if (params.sortBy) query.set("sortBy", params.sortBy);
      if (params.sortOrder) query.set("sortOrder", params.sortOrder);

      const url = `/audit-logs${query.toString() ? `?${query.toString()}` : ""}`;
      const response = await api.get(url);
      const envelope = response.data;
      const payload: PaginatedAuditLogs = envelope.data ?? envelope;

      return {
        items: payload.items ?? [],
        total: Number(payload.total ?? 0),
        page: Number(payload.page ?? params.page ?? 1),
        pageSize: Number(payload.pageSize ?? params.pageSize ?? 10),
      };
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },
};