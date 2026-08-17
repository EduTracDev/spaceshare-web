"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notificationService } from "@/services/notifications.service";
import { NotificationDrawer } from "@/features/notifications/components/NotificationDrawer";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                               Context                                      */
/* -------------------------------------------------------------------------- */

interface NotificationsContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toggle: () => void;
  unreadCount: number;
}

const NotificationsContext = React.createContext<NotificationsContextValue | null>(null);

function useNotificationsContext() {
  const ctx = React.useContext(NotificationsContext);
  if (!ctx) throw new Error("NotificationBell must be used inside <NotificationDrawerProvider>");
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*                           Provider (export default)                        */
/* -------------------------------------------------------------------------- */

export function NotificationDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const toggle = React.useCallback(() => setOpen((v) => !v), []);
  const onOpenChange = React.useCallback((v: boolean) => setOpen(v), []);

  // Poll unread count so bell badges stay fresh across nav.
  // Refetch whenever drawer closes (mark-as-read mutations already invalidate upstream list keys,
  // but we poll lightly here too to keep badges fresh on bell icons).
  const countQ = useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const r = await notificationService.list({ tab: "unread" });
      return r.unreadCount;
    },
    refetchInterval: 60_000,
    placeholderData: (prev) => prev ?? 0,
  });

  const unreadCount = countQ.data ?? 0;

  const value = React.useMemo<NotificationsContextValue>(
    () => ({ open, onOpenChange, toggle, unreadCount }),
    [open, onOpenChange, toggle, unreadCount]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      {/* Single shared drawer — rendered once at layout level, no duplicates! */}
      <NotificationDrawer open={open} onOpenChange={onOpenChange} />
    </NotificationsContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Bell Icon Reusable Helper                          */
/* -------------------------------------------------------------------------- */

function BellIconWithBadge({ className }: { className?: string }) {
  const { unreadCount, toggle } = useNotificationsContext();
  const showBadge = unreadCount > 0;
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={showBadge ? `${unreadCount} unread notifications` : "Notifications"}
      onClick={toggle}
      className={cn(
        "relative h-9 w-9 shrink-0 rounded-full border bg-gray-100 font-bold text-black/95 hover:bg-muted hover:text-foreground transition-colors",
        className
      )}
    >
      <Bell size={17} />
      {showBadge ? (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm"
        >
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : null}
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Desktop + Mobile Bell Exports                      */
/* -------------------------------------------------------------------------- */

/** Visible lg+ — replaces hardcoded bell inside PageHeader `actions` slot. */
export function DesktopBell() {
  return <BellIconWithBadge className="hidden lg:inline-flex" />;
}

/** Visible xs..md — placed in layout.tsx mobile top nav. */
export function MobileBell() {
  return <BellIconWithBadge className="inline-flex lg:hidden" />;
}