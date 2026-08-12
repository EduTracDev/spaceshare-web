"use client";

import * as React from "react";
import { X, MapPin, Users, Calendar, Clock, Receipt, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/Avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Booking } from "@/features/bookings/types/booking.types";
import { BOOKING_STATUS_KEYS } from "@/features/bookings/types/booking.types";
import { getBookingPaymentLines } from "@/mocks/bookings.mock";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";

interface BookingDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  actionLoading?: "approve" | "cancel" | "dispute" | "resolve" | null;
  onApprove: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
  onDispute: (booking: Booking) => void;
  onResolve: (booking: Booking) => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-2 rounded-xl border border-border/60 px-3 py-3">
      <Icon size={12} />
      <div className="text-[11px] text-muted-foreground">
        {label}
      </div>
      <div className="text-[11px] font-medium text-foreground">{value}</div>
    </div>
  );
}

function PartyCard({
  label,
  labelClassName,
  fullName,
  email,
}: {
  label: string;
  labelClassName: string;
  fullName: string;
  email: string;
}) {
  return (
    <div className="flex-1 rounded-2xl border border-border/60 p-4">
      <span
        className={cn(
          "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
          labelClassName
        )}
      >
        {label}
      </span>
      <div className="mt-3 flex items-center gap-3">
        <UserAvatar name={fullName} size="md" />
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-foreground">{fullName}</div>
          <div className="truncate text-[12px] text-muted-foreground">{email}</div>
        </div>
      </div>
    </div>
  );
}

export function BookingDetailsSheet({
  open,
  onOpenChange,
  booking,
  actionLoading = null,
  onApprove,
  onCancel,
  onDispute,
  onResolve,
}: BookingDetailsSheetProps) {
  if (!booking) return null;

  const paymentLines = getBookingPaymentLines(booking);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        side="right"
        className="!max-w-[92vw] md:!max-w-[80vw] lg:!max-w-[40vw] min-h-full overflow-hidden rounded-l-lg md:rounded-l-3xl p-0 border-l-none outline-none focus:outline-none focus-visible:outline-none ring-0"
      >
        <div className="relative flex h-full flex-col">
          {/* 1) TOP close button row (X at very top-right, matches Figma screenshot exactly) */}
          <div className="w-full flex items-center justify-end px-5 pt-5 sm:px-7 sm:pt-6">
            <SheetClose
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Close booking details"
                  className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                />
              }
            >
              <X size={18} strokeWidth={2.05} />
            </SheetClose>
          </div>

          {/* 2) Heading + metadata (BELOW the top close button row — so there's whitespace top before content) */}
          <div className="px-6 sm:px-7 pt-4 pb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[18px] font-bold tracking-tight text-foreground">
                  {booking.spaceName}
                </h2>
                <span className="text-[12px] text-muted-foreground">•</span>
                <span className="text-[12px] font-medium text-muted-foreground">
                  {booking.bookingNumber}
                </span>
                <span className="text-[12px] text-muted-foreground">•</span>
                <StatusBadge status={BOOKING_STATUS_KEYS[booking.status]} size="md" />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={12} />
                  {booking.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users size={12} />
                  {booking.capacityLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 sm:px-7 pb-4 overscroll-contain scrollbar-gutter-stable">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <InfoTile
                icon={Calendar}
                label="Payment Date"
                value={formatDate(booking.paymentDate)}
              />
              <InfoTile
                icon={Calendar}
                label="Event Date"
                value={formatDate(booking.eventDate)}
              />
              <InfoTile icon={Clock} label="Event Time" value={booking.eventTimeLabel} />
              <InfoTile
                icon={Receipt}
                label="Amount"
                value={formatCurrency(booking.amount)}
              />
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              <PartyCard
                label="Host"
                labelClassName="bg-brand-50 text-primary"
                fullName={booking.host.fullName}
                email={booking.host.email}
              />
              <PartyCard
                label="Guest"
                labelClassName="bg-blue-50 text-blue-700"
                fullName={booking.guest.fullName}
                email={booking.guest.email}
              />
            </div>

            <Card className="mt-5 rounded-2xl border-border/60 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                  <Wallet size={15} className="text-primary" />
                  Payment Breakdown
                </div>

                <div className="mt-4 space-y-3 text-[12.5px]">
                  {paymentLines.map((line) => {
                    const hasDivider = line.isTotal;
                    const isDeduction = line.isDeduction;
                    const amountLabel = isDeduction
                      ? `-${formatCurrency(line.amount)}`
                      : formatCurrency(line.amount);

                    return (
                      <div
                        key={line.label}
                        className={cn(
                          "flex items-center justify-between gap-4",
                          hasDivider && "border-t border-border/60 pt-3 mt-1"
                        )}
                      >
                        <span
                          className={cn(
                            line.isTotal ? "font-semibold text-foreground" : "text-foreground/85"
                          )}
                        >
                          {line.label}
                        </span>
                        <span
                          className={cn(
                            "font-medium",
                            line.isTotal && "font-semibold text-foreground",
                            isDeduction && "text-foreground/60"
                          )}
                        >
                          {amountLabel}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="h-6" />
          </div>

          {/* Review. Can Admin cancel boooking? If yes thiw would be implemented here */}
          {/* <div className="border-t border-border/60 bg-muted/20 px-6 py-4">
            {booking.status === "pending" ? (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onCancel(booking)}
                  disabled={actionLoading !== null}
                  className="h-10 rounded-full border-border px-4 text-[13px] font-medium"
                >
                  {actionLoading === "cancel" ? "Cancelling..." : "Cancel Booking"}
                </Button>
                <Button
                  type="button"
                  onClick={() => onApprove(booking)}
                  disabled={actionLoading !== null}
                  className="h-10 rounded-full bg-primary px-4 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {actionLoading === "approve" ? "Approving..." : "Approve Booking"}
                </Button>
              </div>
            ) : booking.status === "disputed" ? (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onCancel(booking)}
                  disabled={actionLoading !== null}
                  className="h-10 rounded-full border-border px-4 text-[13px] font-medium"
                >
                  Cancel Booking
                </Button>
                <Button
                  type="button"
                  onClick={() => onResolve(booking)}
                  disabled={actionLoading !== null}
                  className="h-10 rounded-full bg-emerald-600 px-4 text-[13px] font-semibold text-white hover:bg-emerald-700"
                >
                  {actionLoading === "resolve" ? "Resolving..." : "Resolve Dispute"}
                </Button>
              </div>
            ) : booking.status === "approved" ? (
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onCancel(booking)}
                  disabled={actionLoading !== null}
                  className="h-10 rounded-full border-border px-4 text-[13px] font-medium"
                >
                  Cancel Booking
                </Button>
                <Button
                  type="button"
                  onClick={() => onDispute(booking)}
                  disabled={actionLoading !== null}
                  className="h-10 rounded-full bg-red-50 px-4 text-[13px] font-semibold text-red-600 hover:bg-red-100"
                >
                  {actionLoading === "dispute" ? "Flagging..." : "Flag as Disputed"}
                </Button>
              </div>
            ) : booking.status === "completed" ? (
              <div className="text-right text-[12px] text-muted-foreground">
                This booking has been completed.
              </div>
            ) : (
              <div className="text-right text-[12px] text-muted-foreground">
                This booking has been cancelled.
              </div>
            )}
          </div> */}
        </div>
      </SheetContent>
    </Sheet>
  );
}