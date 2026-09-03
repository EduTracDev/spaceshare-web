import type {
  Notification,
  PaginatedNotifications,
} from "@/features/notifications/types/notifications.types";
import { api } from "@/lib/api";

export interface ListNotificationsParams {
  tab?: "all" | "unread";
}

/**
 * Match patterns used in booking.service.ts / dispute.service.ts frontend:
 * Axios call → envelope unwrap → friendly error extraction fallback chain.
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
 * Safely unwrap PaginatedNotifications from backend envelope.
 * Backend returns: { success: true, data: { items, total, page, pageSize, unreadCount } }
 * Graceful fallback for any shape change — return empty paginated payload.
 */
function unwrapPaginated(
  data: any,
  tab: "all" | "unread"
): PaginatedNotifications {
  const payload = (data?.data ?? data) as PaginatedNotifications | undefined;
  if (payload && Array.isArray(payload.items)) {
    return {
      items: payload.items,
      total: typeof payload.total === "number" ? payload.total : 0,
      unreadCount:
        typeof payload.unreadCount === "number" ? payload.unreadCount : 0,
    };
  }
  // Graceful empty fallback — matches emptyNotifications shape exactly
  return { items: [], total: 0, unreadCount: 0 };
}

export const notificationService = {
  /**
   * GET /api/admin/notifications
   * Backend paginates DB-level, filters by tab (unread-only where clause),
   * and ALWAYS returns unreadCount (global unread count) so the bell badge
   * displays correctly regardless of current page / tab.
   */
  async list(params: ListNotificationsParams = {}): Promise<PaginatedNotifications> {
    try {
      const tab = params.tab ?? "all";
      const response = await api.get("/notifications", {
        params: {
          tab,
          // Notification inbox uses bigger default pageSize than data tables
          // so scrolling through a drawer feels smooth with minimal refetches
          page: 1,
          pageSize: 200,
        },
      });
      return unwrapPaginated(response.data, tab);
    } catch (error) {
      const status = (error as any)?.response?.status as number | undefined;
      if (status === 401 || status === 403 || status === 404) {
        return { items: [], total: 0, unreadCount: 0 };
      }
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * PATCH /api/admin/notifications/:id/read
   * Marks 1 notification as READ. Backend enforces ownership (admin can only
   * mark their own notifications as READ) — returns 403 if attempted otherwise.
   */
  async markAsRead(notificationId: string): Promise<{ ok: true; notification: Notification }> {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      const payload = response?.data?.data as
        | { ok: true; notification: Notification }
        | undefined;

      if (payload?.notification) return { ok: true, notification: payload.notification };
      // Fallback: backend only returned data = shaped notification.
      const direct = response?.data?.data as Notification | undefined;
      if (direct?.id) return { ok: true, notification: direct };
      throw new Error("Failed to mark notification as read");
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * PATCH /api/admin/notifications/read-all
   * Bulk marks all admin user's unread inbox as READ. Backend returns exact
   * number of rows flipped so the toast shows "Marked X notifications as read".
   */
  async markAllAsRead(): Promise<{ ok: true; updatedCount: number }> {
    try {
      const response = await api.patch("/notifications/read-all");
      const updatedCount =
        (response?.data?.data as { updatedCount?: number } | undefined)?.updatedCount ??
        0;
      return { ok: true, updatedCount };
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * DELETE /api/admin/notifications
   * Hard-delete all notification rows belonging to currently logged-in admin.
   * Returns removed count so frontend shows "Deleted X notifications" toast.
   */
  async clearAll(): Promise<{ ok: true; removedCount: number }> {
    try {
      const response = await api.delete("/notifications");
      const removedCount =
        (response?.data?.data as { removedCount?: number } | undefined)?.removedCount ??
        0;
      return { ok: true, removedCount };
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
