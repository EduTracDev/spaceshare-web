import type {
  Notification,
  NotificationType,
  PaginatedNotifications,
} from "@/features/notifications/types/notifications.types";

/** Small random-ish ISO timestamp helpers so mock relative timestamps feel like Figma ("10m ago", "1 hour ago", "10:49 AM") */
function relativeIso(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}
function yesterdayIso(hour24: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  d.setHours(hour24, minute, 0, 0);
  return d.toISOString();
}

type BaseNotif = {
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  referenceId?: string;
  targetPath?: string;
};

const TODAY_NOTIFICATIONS: BaseNotif[] = [
  // 10m ago
  {
    type: "space_submitted",
    title: "New Space Submitted",
    body: "A new space listing has been submitted and is awaiting your review.",
    createdAt: relativeIso(10),
    isRead: false,
    referenceId: "LST-10451",
    targetPath: "/listings",
  },
  // 15m ago
  {
    type: "booking_attention",
    title: "Booking Requires Attention",
    body: "Booking #SS10245 has been cancelled and requires your review.",
    createdAt: relativeIso(15),
    isRead: false,
    referenceId: "BK-SS10245",
    targetPath: "/bookings",
  },
  // 1 hour ago
  {
    type: "new_user_registered",
    title: "New User Registered",
    body: "A new user has created an account on SpaceShare.",
    createdAt: relativeIso(60),
    isRead: false,
    targetPath: "/users",
  },
  // 3 hours ago
  {
    type: "review_reported",
    title: "Review Reported",
    body: "A host has reported a review for moderation.",
    createdAt: relativeIso(180),
    isRead: true,
    targetPath: "/reported-reviews",
  },
];

/** YESTERDAY group in Figma was labeled "12-Aug-2026". These are all marked unread so total = 14 (matches screenshot) */
const YESTERDAY_NOTIFICATIONS: BaseNotif[] = [
  { type: "space_submitted", title: "New Space Submitted", body: "A new space listing has been submitted and is awaiting your review.", createdAt: yesterdayIso(10, 49), isRead: true, referenceId: "LST-10399", targetPath: "/listings" },
  { type: "payout_ready", title: "Payout Ready for Review", body: "A host payout of ₦90,000 is ready for approval.", createdAt: yesterdayIso(11, 23), isRead: false, referenceId: "PO-88331", targetPath: "/transactions" },
  { type: "admin_activity", title: "Admin Activity", body: "John Admin updated the platform commission settings.", createdAt: yesterdayIso(14, 12), isRead: true },
  { type: "booking_attention", title: "Booking Requires Attention", body: "Booking #SS10201 has been cancelled and requires your review.", createdAt: yesterdayIso(9, 15), isRead: false, targetPath: "/bookings" },
  { type: "new_user_registered", title: "New User Registered", body: "A new host has created an account on SpaceShare.", createdAt: yesterdayIso(8, 0), isRead: false, targetPath: "/users" },
  { type: "review_reported", title: "Review Reported", body: "A guest has reported a review for moderation.", createdAt: yesterdayIso(16, 20), isRead: true, targetPath: "/reported-reviews" },
  { type: "payout_ready", title: "Payout Ready for Review", body: "A host payout of ₦210,500 is ready for approval.", createdAt: yesterdayIso(15, 40), isRead: false, referenceId: "PO-88322", targetPath: "/transactions" },
  { type: "space_submitted", title: "New Space Submitted", body: "A new outdoor event space listing is awaiting your review.", createdAt: yesterdayIso(13, 5), isRead: true, referenceId: "LST-10395", targetPath: "/listings" },
  { type: "admin_activity", title: "Admin Activity", body: "Chiamaka Admin invited 2 new admins.", createdAt: yesterdayIso(17, 33), isRead: true },
  { type: "new_user_registered", title: "New User Registered", body: "A new guest account was created.", createdAt: yesterdayIso(18, 1), isRead: false, targetPath: "/users" },
];

const ALL_NOTIFICATIONS_SEED: Notification[] = [
  ...TODAY_NOTIFICATIONS,
  ...YESTERDAY_NOTIFICATIONS,
].map((base, idx) => ({
  id: `NOT-${(idx + 1000).toString().padStart(5, "0")}`,
  ...base,
}));

/** Seed total = 14 notifications, matching the Figma "Notifications (14)" header */
export function seedNotifications(): Notification[] {
  // Shallow-copy so in-memory mutations (markAsRead, clear) don't mutate seed
  return ALL_NOTIFICATIONS_SEED.map((n) => ({ ...n }));
}

export function paginateNotifications(items: Notification[]): PaginatedNotifications {
  return {
    items: [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    total: items.length,
    unreadCount: items.filter((n) => !n.isRead).length,
  };
}

/* Useful when we want to test the empty-state scenario easily */
export function emptyNotifications(): PaginatedNotifications {
  return { items: [], total: 0, unreadCount: 0 };
}