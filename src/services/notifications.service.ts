import {
  emptyNotifications,
  paginateNotifications,
  seedNotifications,
} from "@/mocks/notifications.mock";
import type {
  Notification,
  PaginatedNotifications,
} from "@/features/notifications/types/notifications.types";

/** Shared in-memory mutable store (per-request pattern like our other mock services). */
let store: Notification[] = seedNotifications();

/** Matches our standard mock timing — feels like a real API round-trip. */
const wait = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

const clone = (items: Notification[]): Notification[] => items.map((n) => ({ ...n }));

export interface ListNotificationsParams {
  tab?: "all" | "unread";
}

export const notificationService = {
  async list(params: ListNotificationsParams = {}): Promise<PaginatedNotifications> {
    await wait();
    const { tab = "all" } = params;
    const all = clone(store);
    const filtered = tab === "unread" ? all.filter((n) => !n.isRead) : all;
    return paginateNotifications(filtered);
  },

  async markAsRead(notificationId: string): Promise<{ ok: true; notification: Notification }> {
    await wait(220);
    store = store.map((n) =>
      n.id === notificationId ? { ...n, isRead: true } : n,
    );
    const notification = store.find((n) => n.id === notificationId)!;
    return { ok: true, notification };
  },

  async markAllAsRead(): Promise<{ ok: true; updatedCount: number }> {
    await wait(280);
    let updatedCount = 0;
    store = store.map((n) => {
      if (!n.isRead) {
        updatedCount++;
        return { ...n, isRead: true };
      }
      return n;
    });
    return { ok: true, updatedCount };
  },

  async clearAll(): Promise<{ ok: true; removedCount: number }> {
    await wait(280);
    const removedCount = store.length;
    store = [];
    return { ok: true, removedCount };
  },

  /** Test helper: reset store back to seeded state (14 notifications). */
  async __reset(): Promise<PaginatedNotifications> {
    store = seedNotifications();
    return paginateNotifications(clone(store));
  },

  /** Test helper: empty store entirely so empty states can be demoed. */
  async __empty(): Promise<PaginatedNotifications> {
    store = [];
    return emptyNotifications();
  },
};