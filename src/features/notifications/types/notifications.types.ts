import type { LucideIcon } from "lucide-react";
import { Building2, CalendarClock, UserPlus, Flag, Wallet, Shield } from "lucide-react";

export type NotificationType =
  | "listing_submitted"
  | "booking_requires_attention"
  | "new_user_registered"
  | "review_reported"
  | "payout_ready"
  | "admin_activity"
  | "transaction_failed"
  | "dispute_raised"
  ;

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string; // ISO timestamp so we can do date grouping
  isRead: boolean;
  /** optional contextual link data (can be used to deep-link to page on click) */
  referenceId?: string;
  /** absolute route path to navigate when notification row clicked */
  targetPath?: string;
}

export type NotificationTab = "all" | "unread";

export interface PaginatedNotifications {
  items: Notification[];
  total: number;
  unreadCount: number;
}

/** Friendly label + icon mapping used for the small logo badge per type.
 *  All badges use SpaceShare brand purple to match Figma.
 */
export const NOTIFICATION_TYPE_META: Record<
  NotificationType,
  { label: string; badgeIcon: LucideIcon }
> = {
  listing_submitted: { label: "New Space Submitted", badgeIcon: Building2 },
  booking_requires_attention: { label: "Booking Requires Attention", badgeIcon: CalendarClock },
  new_user_registered: { label: "New User Registered", badgeIcon: UserPlus },
  review_reported: { label: "Review Reported", badgeIcon: Flag },
  payout_ready: { label: "Payout Ready for Review", badgeIcon: Wallet },
  admin_activity: { label: "Admin Activity", badgeIcon: Shield },
  transaction_failed: { label: "Transaction Failed", badgeIcon: Wallet },
  dispute_raised: { label: "Dispute Raised", badgeIcon: Shield },
};

export { Building2, CalendarClock, UserPlus, Flag, Wallet, Shield };