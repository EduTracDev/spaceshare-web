import type { Notification } from "../types/notifications.types";

/** Returns a pretty relative timestamp for the right side of each notification row:
 *  < 1 min ago → "just now"
 *  < 60 min ago → "Xm ago"
 *  Today, older than 1h but still today → "HH:MM AM/PM" (matches Figma "10:49 AM" absolute style for older Today entries)
 *  Yesterday → "DD-Mon-YYYY" (exactly matches Figma group labels: "12-Aug-2026")
 *  > yesterday → same DD-Mon-YYYY label
 */
export function formatNotificationTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHour = Math.floor(diffMin / 60);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  // Same calendar day = "today"
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    // > 1h but still today — for entries 10 minutes/hour-ago style, use relative text when < 24h:
    if (diffHour < 24) {
      if (diffHour < 2) return `${diffHour} hour ago`;
      return `${diffHour} hours ago`;
    }
    // Otherwise fallback to absolute time (matches Figma older entries per date group)
    return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });
  }

  // Yesterday or older → absolute short time inside the group
  return date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: true });
}

/** Group key used for section dividers between date groups.
 *  Returns "Today", or "DD-Mon-YYYY" exactly like Figma shows "12-Aug-2026". */
export function getDateGroupKey(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (isSameDay) return "Today";

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();
  if (isYesterday) {
    // Figma literally showed "12-Aug-2026" for the previous day group. Keep consistent DD-Mon-YYYY format.
    return formatDDMonYYYY(date);
  }

  return formatDDMonYYYY(date);
}

function formatDDMonYYYY(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dd = date.getDate().toString().padStart(2, "0");
  const mon = months[date.getMonth()];
  const yyyy = date.getFullYear();
  return `${dd}-${mon}-${yyyy}`;
}

/** Flat sorted list → grouped into ordered sections by date group key, preserving sort order. */
export function groupNotificationsByDate(
  items: Notification[]
): Array<{ groupKey: string; items: Notification[] }> {
  const map = new Map<string, Notification[]>();
  const order: string[] = [];
  for (const item of items) {
    const key = getDateGroupKey(item.createdAt);
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(item);
  }
  return order.map((groupKey) => ({ groupKey, items: map.get(groupKey)! }));
}