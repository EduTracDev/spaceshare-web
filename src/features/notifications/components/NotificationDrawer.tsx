"use client";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCheck,
  Trash2,
  MoreHorizontal,
  X,
  BellRing,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { notificationService } from "@/services/notifications.service";
import {
  NOTIFICATION_TYPE_META,
  type Notification,
  type PaginatedNotifications,
} from "@/features/notifications/types/notifications.types";
import {
  formatNotificationTime,
  groupNotificationsByDate,
} from "@/features/notifications/utils/date-grouping";
import { cn } from "@/lib/utils";
import dataAlert from "@/assets/data-alert.svg";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                         Small reusable sub-components                      */
/* -------------------------------------------------------------------------- */

/* Purple SpaceShare brand notification icon badge (left of each row title).
   Every row gets this with the specific type icon inside it (matches Figma —
   each row has the purple/white circular brand badge). */
function NotificationIconBadge({ type }: { type: Notification["type"] }) {
  const { badgeIcon: Icon } = NOTIFICATION_TYPE_META[type];
  return (
    <div className="relative shrink-0">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-sm ring-2 ring-white">
        <Icon size={18} strokeWidth={2} />
      </div>
    </div>
  );
}

/* Date group dashed divider (EXACTLY matches Figma: "-------- Today --------" dashed line with date label in middle) */
function DateGroupDivider({ groupKey }: { groupKey: string }) {
  return (
    <div className="relative flex items-center py-2" role="separator">
      <div className="flex-1 h-px border-t border-dashed border-border/70" />
      <span className="mx-3 shrink-0 text-[11px] font-medium text-muted-foreground">
        {groupKey}
      </span>
      <div className="flex-1 h-px border-t border-dashed border-border/70" />
    </div>
  );
}

/* Single notification row (icon/badge + red unread dot + bold title + muted body + timestamp right) */
function NotificationRow({
  notification,
  onMarkAsRead,
  markAsReadPending,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  markAsReadPending: boolean;
}) {
  const handleClick = () => {
    if (!notification.isRead) onMarkAsRead(notification.id);
    if (notification.targetPath) {console.log("notification:", notification)
      // Deep link handled by caller via toast visual feedback now.
      // When router is wired later use: router.push(notification.targetPath)
      toast.message(`Read ${notification.title}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={markAsReadPending && !notification.isRead}
      className={cn(
        "group block w-full rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-muted/60",
        !notification.isRead && "bg-primary/[0.015]"
      )}
    >
      <div className="flex gap-3">
        <div className="relative">
          <NotificationIconBadge type={notification.type} />
          {/* Small red unread dot top-left of icon badge (per Figma) */}
          {!notification.isRead ? (
            <span className="absolute -left-0.5 -top-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full border-2 border-white bg-red-500" />
          ) : null}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-start justify-between gap-3">
            <h4
              className={cn(
                "truncate text-[13.5px] leading-tight",
                !notification.isRead ? "font-bold text-foreground" : "font-semibold text-foreground/90"
              )}
            >
              {notification.title}
            </h4>
            <span className="shrink-0 text-right text-[11px] font-medium text-muted-foreground">
              {formatNotificationTime(notification.createdAt)}
            </span>
          </div>
          <p className="mt-1 truncate text-[12.5px] leading-5 text-muted-foreground line-clamp-2">
            {notification.body}
          </p>
        </div>
      </div>
    </button>
  );
}

/* Reusable scroll body sub-components (mounted inside each TabsContent) */
function NotificationsLoadingSkeleton() {
  return (
    <div className="flex flex-col gap-2 py-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-xl px-2 py-2.5">
          <div className="flex gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-muted/70 animate-pulse" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="flex items-start justify-between gap-3">
                <div className="h-3.5 w-40 rounded-md bg-muted/70 animate-pulse" />
                <div className="h-2.5 w-12 rounded-md bg-muted/60 animate-pulse" />
              </div>
              <div className="h-2.5 w-full rounded-md bg-muted/60 animate-pulse" />
              <div className="h-2.5 w-2/3 rounded-md bg-muted/50 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationsGroupedList({
  groupedByDate,
  onMarkAsRead,
  markAsReadPending,
}: {
  groupedByDate: ReturnType<typeof groupNotificationsByDate>;
  onMarkAsRead: (id: string) => void;
  markAsReadPending: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-1">
      {groupedByDate.map((group) => (
        <div key={group.groupKey} className="contents">
          <DateGroupDivider groupKey={group.groupKey} />
          <div className="flex flex-col gap-0.5 pb-1">
            {group.items.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                onMarkAsRead={onMarkAsRead}
                markAsReadPending={markAsReadPending}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Figma empty state illustration area — uses simple SVG based purple/white icon matching the screenshot. */
function EmptyStateIllustration({ variant }: { variant: "empty-total" | "all-caught-up" }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <div className="relative mb-6">
        <div className="flex justify-center items-center gap-0">
          <Image src={dataAlert} height={100} width={100} alt="no data" loading="eager"/>
        </div>
      </div>
      {variant === "empty-total" ? (
        <>
          <h3 className="text-[18px] font-semibold text-foreground tracking-tight">
            No Notifications Yet
          </h3>
          <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-muted-foreground whitespace-pre-line">
            {`You're all caught up. New notifications\nabout platform activity will appear here.`}
          </p>
        </>
      ) : (
        <>
          <h3 className="text-[18px] font-semibold text-foreground tracking-tight">
            You're All Caught Up
          </h3>
          <p className="mt-2 text-[15px] text-muted-foreground">
            You have no unread notifications.
          </p>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Main Drawer Export Component                       */
/* -------------------------------------------------------------------------- */

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QUERY_KEY = ["notifications"];

export function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState<"all" | "unread">("all");

  const query = useQuery({
    queryKey: [...QUERY_KEY, activeTab],
    queryFn: () => notificationService.list({ tab: activeTab }),
    enabled: open, // only fetch when drawer is open
    staleTime: 20_000,
    placeholderData: (prev) => prev,
  });

  /* Mark single row as read mutation */
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to mark as read"),
  });

  /* Mark all as read mutation (3-dot menu action 1) */
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: (r) => {
      toast.success(`Marked ${r.updatedCount} notification${r.updatedCount === 1 ? "" : "s"} as read`);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed"),
  });

  /* Clear all mutation (3-dot menu action 2) */
  const clearAllMutation = useMutation({
    mutationFn: () => notificationService.clearAll(),
    onSuccess: (r) => {
      toast.success(`Cleared ${r.removedCount} notification${r.removedCount === 1 ? "" : "s"}`);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed"),
  });

  const data = query.data ?? ({ items: [], total: 0, unreadCount: 0 } as PaginatedNotifications);
  const anyPending =
    query.isFetching ||
    markAsReadMutation.isPending ||
    markAllAsReadMutation.isPending ||
    clearAllMutation.isPending;

  /* Precompute groups */
  const groupedByDate = React.useMemo(
    () => groupNotificationsByDate(data.items),
    [data.items]
  );

  const menuLoading = markAllAsReadMutation.isPending || clearAllMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="!max-w-[92vw] md:!max-w-[560px] lg:!max-w-[40vw] min-h-full overflow-hidden rounded-l-lg md:rounded-l-3xl p-0 border-l outline-none focus:outline-none focus-visible:outline-none ring-0"
      >
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "all" | "unread")}
          className="relative flex h-full w-full flex-col"
        >
          <div className="flex h-full w-full flex-col">
            {/* ---------- TOP close button row (same pattern as other detail sheets) ---------- */}

          <div className="w-full flex items-center justify-end px-5 pt-5 sm:px-7 sm:pt-6">
            <SheetClose
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Close notifications"
                  className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                />
              }
            >
              <X size={18} strokeWidth={2.05} />
            </SheetClose>
          </div>

          {/* ---------- Header: Title + unread count pill ---------- */}
          <div className="px-6 sm:px-7 pt-2 pb-3">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[22px] font-bold tracking-tight text-foreground">
                Notifications
              </h2>
              <Badge
                variant="outline"
                className="rounded-full border-border/70 bg-muted/40 text-[11.5px] font-bold text-muted-foreground px-2 py-0.5"
              >
                {data.total}
              </Badge>
            </div>

            {/* Tabs + 3-dot menu row */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="w-full max-w-xs">
                <TabsList className="h-9 w-full grid grid-cols-2 rounded-full bg-muted/50 p-0.5 gap-0">
                  <TabsTrigger
                    value="all"
                    className="h-full rounded-full text-[12.5px] font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground/90 data-[state=inactive]:shadow-none transition-all duration-200"
                  >
                    All
                    <span className="ml-1.5 inline-flex min-w-[20px] items-center justify-center rounded-full bg-muted/80 px-1.5 py-0.5 text-[10.5px] font-bold text-muted-foreground data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-colors">
                      {data.total}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    className="h-full rounded-full text-[12.5px] font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground/90 data-[state=inactive]:shadow-none transition-all duration-200"
                  >
                    Unread
                    <span className="ml-1.5 inline-flex min-w-[20px] items-center justify-center rounded-full bg-muted/80 px-1.5 py-0.5 text-[10.5px] font-bold text-muted-foreground data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-colors">
                      {data.unreadCount}
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* 3-dot Kebab menu */}
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Notification actions"
                      disabled={menuLoading || data.total === 0}
                      className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground shrink-0"
                    />
                  }
                >
                  <MoreHorizontal size={18} strokeWidth={2} />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={10}
                  className="w-52 rounded-2xl p-1.5 shadow-xl"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      disabled={markAllAsReadMutation.isPending || data.unreadCount === 0}
                      onSelect={() => void markAllAsReadMutation.mutate()}
                      className="gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-foreground/90 focus:bg-muted focus:text-foreground cursor-pointer"
                    >
                      <CheckCheck size={16} strokeWidth={2} className="text-primary" />
                      Mark all as Read
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={clearAllMutation.isPending || data.total === 0}
                      onSelect={() => void clearAllMutation.mutate()}
                      className="gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium text-red-600 focus:bg-red-50/60 focus:text-red-700 cursor-pointer"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                      Clear all
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

            {/* ---------- Tabs Content (main scroll body) ---------- */}
            <TabsContent
              value="all"
              className="mt-0 flex-1 overflow-hidden border-t-0 outline-none focus-visible:outline-none ring-0"
            >
              <div className="h-full overflow-y-auto overscroll-contain scrollbar-gutter-stable px-6 sm:px-7 py-1.5 pb-8">
                {query.isLoading && !query.data ? (
                  <NotificationsLoadingSkeleton />
                ) : data.items.length === 0 ? (
                  activeTab === "all" && data.total === 0 ? (
                    <EmptyStateIllustration variant="empty-total" />
                  ) : (
                    <EmptyStateIllustration variant="all-caught-up" />
                  )
                ) : (
                  <NotificationsGroupedList
                    groupedByDate={groupedByDate}
                    markAsReadPending={markAsReadMutation.isPending}
                    onMarkAsRead={(id) => void markAsReadMutation.mutate(id)}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="unread"
              className="mt-0 flex-1 overflow-hidden border-t-0 outline-none focus-visible:outline-none ring-0"
            >
              <div className="h-full overflow-y-auto overscroll-contain scrollbar-gutter-stable px-6 sm:px-7 py-1.5 pb-8">
                {query.isLoading && !query.data ? (
                  <NotificationsLoadingSkeleton />
                ) : data.items.length === 0 ? (
                  activeTab === "all" && data.total === 0 ? (
                    <EmptyStateIllustration variant="empty-total" />
                  ) : (
                    <EmptyStateIllustration variant="all-caught-up" />
                  )
                ) : (
                  <NotificationsGroupedList
                    groupedByDate={groupedByDate}
                    markAsReadPending={markAsReadMutation.isPending}
                    onMarkAsRead={(id) => void markAsReadMutation.mutate(id)}
                  />
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}