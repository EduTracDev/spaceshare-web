export type AuditLogAction =
  | "Admin login"
  | "Admin Logout"
  | "Admin suspend user"
  | "Invited admin user"
  | "Resent admin invitation"
  | "Cancelled admin invitation"
  | "Suspended admin user"
  | "Restored admin access"
  | "Approved space listing"
  | "Rejected space listing"
  | "Removed review";

export interface AuditLogActor {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export interface AuditLog {
  id: string;
  actor: AuditLogActor;
  timestamp: string;
  action: AuditLogAction;
  description: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditLogDateRange {
  start: string | null;
  end: string | null;
}

export interface PaginatedAuditLogs {
  items: AuditLog[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuditLogQueryParams {
  search?: string;
  dateRange?: AuditLogDateRange;
  page?: number;
  pageSize?: number;
  sortBy?: "actorName" | "timestamp" | "action" | "description";
  sortOrder?: "asc" | "desc";
}