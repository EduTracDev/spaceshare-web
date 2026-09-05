"use client";

import * as React from "react";
import { Copy, Phone, Mail, Calendar, Building2, BadgeCheck, X, CalendarFold, List, Ban, CircleCheckBig } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { UserAvatar } from "@/components/shared/Avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import type { AnyUser, HostUser, AdminUser } from "@/features/users/types/user.types";
import { cn } from "@/lib/utils";
import { InfoRow } from "@/features/users/components/InfoRow";

interface UserDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AnyUser | null;
  onSuspendClick: (user: AnyUser) => void;
  onReactivateClick: (user: AnyUser) => void;
}


export function UserDetailsSheet({
  open,
  onOpenChange,
  user,
  onSuspendClick,
  onReactivateClick,
}: UserDetailsSheetProps) {
  if (!user) return null;

  const roleLabel =
    user.role === "super_admin"
      ? "Super Admin"
      : user.role[0].toUpperCase() + user.role.slice(1);

  // ---- Activity counts ----
  // RULES:
  //  - GUESTS: Bookings count populated from user.totalBookings (Listings = 0 (guests never list)
  //  - HOSTS:  Listings count populated from user.totalListings, Bookings = 0
  //  - ADMINS / SUPER_ADMINS: Both = 0 (they are staff, not platform users) + hide grid hidden via conditional render below
  const bookings =
    user.role === "guest"
      ? ((user as any).totalBookings ?? 0)
      : 0;
  const listings =
    user.role === "host"
      ? ((user as HostUser).totalListings ?? 0)
      : 0;

  // ---- Date labels ----
  const isInvitedAdmin =
    (user.role === "admin" || user.role === "super_admin") &&
    !!user.dateRegistered;
  const registrationLabel = isInvitedAdmin ? "Accepted Invite On" : "Registration Date";
  const registrationDate = isInvitedAdmin
    ? user.dateRegistered
    : user.dateRegistered ?? "Invite pending";

  const canSuspend = user.status === "active" || user.status === "pending";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-[92vw] md:max-w-[500px] min-h-full p-0 pt-8 md:pt-12 rounded-l md:rounded-l-3xl overflow-hidden flex flex-col outline-none focus:outline-none focus-visible:outline-none ring-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 pb-2">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <UserAvatar name={user.fullName} imageUrl={user.avatarUrl} size="xl" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1.5 pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <SheetTitle className="text-[17px] font-bold tracking-tight leading-tight">
                    {user.fullName}
                  </SheetTitle>
                  <StatusBadge status={user.status} size="sm" />
                </div>
                <span className="inline-flex items-center rounded-full bg-brand-50 text-primary px-2.5 py-1 text-[11px] font-semibold w-fit">
                  {roleLabel}
                </span>
              </div>
              {/* <SheetClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Close"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted -m-2 hidden"
                  />
                }
              >
                <X size={16} />
              </SheetClose> */}
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 pt-4 space-y-1 overscroll-contain scrollbar-gutter-stable">
            <InfoRow icon={Phone} label="Phone" value={user.phone ?? "—"} copyable={user.phone ?? undefined} />
            <InfoRow icon={Mail} label="Email" value={user.email} copyable={user.email} />
            <InfoRow icon={Calendar} label={registrationLabel} value={registrationDate} />

            {/* Show invited-by info ONLY for staff admin roles */}
            {(user.role === "admin" || user.role === "super_admin") &&
            ((user as AdminUser).invitedByName || (user as AdminUser).invitedByEmail || (user as AdminUser).invitedAt) ? (
              <InfoRow
                icon={BadgeCheck}
                label="Invited By"
                value={(() => {
                  const name = (user as AdminUser).invitedByName;
                  const email = (user as AdminUser).invitedByEmail;
                  // if (name && email) return `${name}. ${email}`;
                  if (name) return name;
                  if (email) return email;
                  if ((user as AdminUser).invitedAt) return `Invited on ${(user as AdminUser).invitedAt ? new Date((user as AdminUser).invitedAt!).toLocaleDateString('en-NG') : ''}`;
                  return "—";
                })()}
              />
            ) : null}

            {user.role === "host" && (user as HostUser).bankDetails ? (
              <>
                <div className="flex items-center gap-2 mb-4 pt-4">
                  <Building2 size={16} />
                  <h4 className="font-semibold tracking-wide text-black">
                    Bank Details
                  </h4>
                </div>
                <InfoRow
                  label="Bank"
                  value={(user as HostUser).bankDetails!.bankName}
                />
                <InfoRow
                  label="Account Number"
                  value={(user as HostUser).bankDetails!.accountNumber}
                  copyable={(user as HostUser).bankDetails!.accountNumber}
                />
                <InfoRow
                  label="Account Name"
                  value={(user as HostUser).bankDetails!.accountName}
                />
              </>
            ) : null}

            {/* {user.role === "admin" || user.role === "super_admin" ? (
              <>
                <div className="mt-4 mb-1 pt-2 border-t border-border/60">
                  <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Permissions
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {(user as AdminUser).permissions?.includes("*") ? (
                    <span className="inline-flex rounded-full bg-primary/10 text-primary px-2.5 py-1 text-[11px] font-semibold">
                      All permissions
                    </span>
                  ) : (
                    (user as AdminUser).permissions?.map((p) => (
                      <span
                        key={p}
                        className="inline-flex rounded-full bg-muted/60 text-foreground/80 px-2.5 py-1 text-[11px] font-medium"
                      >
                        {p}
                      </span>
                    ))
                  )}
                </div>
              </>
            ) : null} */}

            {/* Activity cards — only meaningful for HOST (listings) + GUEST (bookings) roles. Hide for admin/super staff. */}
            {(user.role === "host" || user.role === "guest") ? (
              <div className="mt-5 mb-2 pt-4">
                <h4 className="font-semibold tracking-wide mb-3">
                  Activity
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Card className="rounded-lg border-border/60 bg-card shadow-sm">
                    <CardContent className="p-4 flex flex-col gap-1">
                      <CalendarFold size={16} />
                      <span className="text-[11px] text-muted-foreground font-medium mt-1">
                        Bookings
                      </span>
                      <span className="font-bold tracking-tight">{bookings}</span>
                    </CardContent>
                  </Card>
                  <Card className="rounded-lg border-border/60 bg-card shadow-sm">
                    <CardContent className="p-4 flex flex-col gap-1">
                      <List size={16}/>
                      <span className="text-[11px] text-muted-foreground font-medium mt-1">
                        Listings
                      </span>
                      <span className="font-bold tracking-tight">{listings}</span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}
          </div>

          {/* Bottom action */}
          <div className="p-5 pt-4 bg-muted/20 shrink-0">
            {canSuspend ? (
              <Button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  setTimeout(() => onSuspendClick(user), 220);
                }}
                variant="destructive"
                size="lg"
                className={cn(
                  "h-11 rounded-xl md:rounded-full text-[15px] lg:text-[13px] font-bold ml-auto flex items-center gap-1",
                  "bg-red-300/55 hover:bg-red-400/50 text-red-600 border border-red-200 shadow-none"
                )}
              >
                <Ban size={16} />
                Suspend User
              </Button>
            ) : user.status === "suspended" ? (
              <Button
                type="button"
                size="lg"
                onClick={() => {
                  onOpenChange(false);
                  setTimeout(() => onReactivateClick(user), 220);
                }}
                className="h-11 rounded-full text-[13px] font-bold ml-auto flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white shadow-[0_6px_16px_-6px_rgba(22,163,74,0.5)]"
              >
                <CircleCheckBig size={16} />
                Reactivate User
              </Button>
            ) : (
              <div className="text-center text-[12px] text-muted-foreground py-2">
                No actions available for a pending account
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}