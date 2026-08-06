"use client";

import * as React from "react";
import { Copy, Phone, Mail, Calendar, Building2, BadgeCheck, X } from "lucide-react";
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

interface UserDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AnyUser | null;
  onSuspendClick: (user: AnyUser) => void;
}

function InfoRow({
  icon: Icon,
  label,
  value,
  copyable,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: React.ReactNode;
  copyable?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    if (!copyable) return;
    navigator.clipboard?.writeText(copyable);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <div className="flex items-start gap-3 min-w-0">
        <div className="h-8 w-8 shrink-0 rounded-lg bg-muted/60 text-muted-foreground flex items-center justify-center mt-0.5">
          <Icon size={15} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
          <span className="text-[13.5px] font-medium text-foreground mt-0.5 truncate">{value}</span>
        </div>
      </div>
      {copyable ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={handleCopy}
          aria-label="Copy"
          className={cn(
            "h-7 w-7 rounded-lg text-muted-foreground",
            copied ? "text-green-600 bg-green-50" : "hover:text-primary hover:bg-primary/10"
          )}
        >
          {copied ? <BadgeCheck size={14} /> : <Copy size={13} />}
        </Button>
      ) : null}
    </div>
  );
}

export function UserDetailsSheet({
  open,
  onOpenChange,
  user,
  onSuspendClick,
}: UserDetailsSheetProps) {
  if (!user) return null;

  const roleLabel =
    user.role === "super_admin"
      ? "Super Admin"
      : user.role[0].toUpperCase() + user.role.slice(1);

  const bookings = user.role === "guest" ? (user as any).totalBookings : 38;
  const listings = user.role === "host" ? (user as HostUser).totalListings : 6;
  const isInvitedAdmin = user.role === "admin" && !user.dateRegistered;
  const registrationDate = isInvitedAdmin
    ? "Invite pending"
    : user.dateRegistered ?? "Invite pending";

  const canSuspend = user.status === "active" || user.status === "pending";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[460px] min-h-full p-0 rounded-l-3xl overflow-hidden flex flex-col">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-4 border-b border-border/60">
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
              <SheetClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Close"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted -m-2"
                  />
                }
              >
                <X size={16} />
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
            <InfoRow icon={Phone} label="Phone" value={user.phone ?? "—"} copyable={user.phone ?? undefined} />
            <InfoRow icon={Mail} label="Email" value={user.email} copyable={user.email} />
            <InfoRow icon={Calendar} label="Registration Date" value={registrationDate} />

            {user.role === "host" && (user as HostUser).bankDetails ? (
              <>
                <div className="mt-4 mb-1 pt-2 border-t border-border/60">
                  <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Bank Details
                  </h4>
                </div>
                <InfoRow
                  icon={Building2}
                  label="Bank"
                  value={(user as HostUser).bankDetails!.bankName}
                />
                <InfoRow
                  icon={BadgeCheck}
                  label="Account Number"
                  value={(user as HostUser).bankDetails!.accountNumber}
                  copyable={(user as HostUser).bankDetails!.accountNumber}
                />
                <div className="flex items-start gap-3 py-2">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-muted/60 text-muted-foreground flex items-center justify-center mt-0.5">
                    <span aria-hidden className="text-sm">👤</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
                      Account Name
                    </span>
                    <span className="text-[13.5px] font-medium text-foreground mt-0.5">
                      {(user as HostUser).bankDetails!.accountName}
                    </span>
                  </div>
                </div>
              </>
            ) : null}

            {user.role === "admin" || user.role === "super_admin" ? (
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
            ) : null}

            {/* Activity cards */}
            <div className="mt-5 mb-2 pt-4 border-t border-border/60">
              <h4 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Activity
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
                  <CardContent className="p-4 flex flex-col gap-1">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      <span aria-hidden className="mr-1.5">📅</span>
                      Bookings
                    </span>
                    <span className="text-2xl font-bold tracking-tight">{bookings}</span>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
                  <CardContent className="p-4 flex flex-col gap-1">
                    <span className="text-[11px] text-muted-foreground font-medium">
                      <span aria-hidden className="mr-1.5">🏢</span>
                      Listings
                    </span>
                    <span className="text-2xl font-bold tracking-tight">{listings}</span>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Bottom action */}
          <div className="p-5 pt-4 border-t border-border/60 bg-muted/20 shrink-0">
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
                  "w-full h-11 rounded-full text-[13px] font-semibold",
                  "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 shadow-none"
                )}
              >
                <span aria-hidden className="mr-1.5">🚫</span>
                Suspend User
              </Button>
            ) : user.status === "suspended" ? (
              <Button
                type="button"
                size="lg"
                className="w-full h-11 rounded-full text-[13px] font-semibold bg-green-600 hover:bg-green-700 text-white shadow-[0_6px_16px_-6px_rgba(22,163,74,0.5)]"
              >
                <span aria-hidden className="mr-1.5">✅</span>
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