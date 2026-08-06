import { MOCK_AUDIT_LOGS } from "@/mocks/audit-logs.mock";
import type {
  AuditLog,
  AuditLogQueryParams,
  PaginatedAuditLogs,
} from "@/features/audit-logs/types/audit-log.types";

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

const logsDb: AuditLog[] = JSON.parse(
  JSON.stringify(MOCK_AUDIT_LOGS)
) as AuditLog[];

function sortLogs(
  items: AuditLog[],
  sortBy?: AuditLogQueryParams["sortBy"],
  sortOrder: AuditLogQueryParams["sortOrder"] = "desc"
) {
  const factor = sortOrder === "desc" ? -1 : 1;

  if (!sortBy) {
    return [...items].sort(
      (a, b) =>
        (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) *
        factor
    );
  }

  return [...items].sort((a, b) => {
    if (sortBy === "actorName") {
      return a.actor.fullName.localeCompare(b.actor.fullName) * factor;
    }

    if (sortBy === "timestamp") {
      return (
        (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) *
        factor
      );
    }

    const valueA = a[sortBy as "action" | "description"];
    const valueB = b[sortBy as "action" | "description"];

    return String(valueA).localeCompare(String(valueB)) * factor;
  });
}

export const auditLogService = {
  async getAuditLogs(
    params: AuditLogQueryParams = {}
  ): Promise<PaginatedAuditLogs> {
    await wait();

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;

    let filtered = [...logsDb];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter((log) =>
        [
          log.actor.fullName,
          log.actor.email,
          log.action,
          log.description,
        ].some((value) => value.toLowerCase().includes(term))
      );
    }

    if (params.dateRange?.start || params.dateRange?.end) {
      const start = params.dateRange.start
        ? new Date(params.dateRange.start).getTime()
        : Number.NEGATIVE_INFINITY;
      const end = params.dateRange.end
        ? new Date(params.dateRange.end).getTime() + 86_399_999
        : Number.POSITIVE_INFINITY;

      filtered = filtered.filter((log) => {
        const ts = new Date(log.timestamp).getTime();
        return ts >= start && ts <= end;
      });
    }

    filtered = sortLogs(filtered, params.sortBy, params.sortOrder);

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
    };
  },
};