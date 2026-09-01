"use client";

import * as React from "react";
import {
  BadgeCheck,
  Banknote,
  Calendar,
  Clock,
  Copy,
  Receipt,
  UserRound,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/Avatar";
import { TRANSACTION_STATUS_KEYS } from "@/features/transactions/types/transaction.types";
import type { Transaction } from "@/features/transactions/types/transaction.types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";
import { formatDateTime } from "@/utils/formatters";

interface TransactionDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  actionLoading?: "markPaid" | "markRefunded" | null;
  onMarkAsPaid: (transaction: Transaction) => void;
  onMarkRefunded: (transaction: Transaction) => void;
}

function InfoRow({
  label,
  value,
  rightSlot,
}: {
  label: string;
  value: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">{rightSlot ?? value}</div>
    </div>
  );
}

function CopyableValue({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[13px] font-medium text-foreground">{value}</span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label="Copy"
        className={cn(
          "h-6 w-6 rounded-md",
          copied ? "text-green-600 bg-green-50" : "text-muted-foreground hover:text-primary hover:bg-primary/10"
        )}
        onClick={handleCopy}
      >
        {copied ? <BadgeCheck size={12} /> : <Copy size={12} />}
      </Button>
    </div>
  );
}

function BreakdownLine({
  label,
  amount,
  isTotal,
  isNegative,
}: {
  label: string;
  amount: number;
  isTotal?: boolean;
  isNegative?: boolean;
}) {
  const amountLabel = isNegative ? `-${formatCurrency(amount)}` : formatCurrency(amount);
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 py-2.5 text-[13px]",
        isTotal && "border-t border-border/60 pt-4 mt-2 font-semibold text-foreground"
      )}
    >
      <span className={cn(isTotal ? "font-semibold" : "text-foreground/85")}>{label}</span>
      <span
        className={cn(
          "font-medium",
          isTotal ? "font-semibold" : isNegative ? "text-foreground/70" : "text-foreground/90"
        )}
      >
        {amountLabel}
      </span>
    </div>
  );
}

export function TransactionDetailsSheet({
  open,
  onOpenChange,
  transaction,
  actionLoading = null,
  onMarkAsPaid,
  onMarkRefunded,
}: TransactionDetailsSheetProps) {
  if (!transaction) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        side="right"
        className="!max-w-[92vw] md:!max-w-[80vw] lg:!max-w-[40vw] min-h-full overflow-hidden rounded-l-lg md:rounded-l-3xl p-0 border-l outline-none focus:outline-none focus-visible:outline-none ring-0"
      >
        <div className="relative flex h-full flex-col">
          <div className="w-full flex items-center justify-end px-5 pt-5 sm:px-7 sm:pt-6">
            <SheetClose
              render={
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Close transaction details"
                  className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                />
              }
            >
              <X size={18} strokeWidth={2.05} />
            </SheetClose>
          </div>

          {/* 2) Heading + summary block (BELOW top close button row — so there's space at top before content) */}
          <div className="px-6 sm:px-7 pt-4 pb-3">
            {/* Dialog SUBJECT = ACTUAL RECIPIENT (matches Figma):
                 PAYOUT → Host (they get paid) 
                 REFUND → Guest (they get refund back, as in Figma Cancelled screenshot recipient = GUEST)
                 PAYMENT → Host (booking contextual identity)
            */}
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
              <span className="font-semibold text-foreground">
                {transaction.type === "refund" && transaction.guest ? transaction.guest.fullName : transaction.host.fullName}
              </span>
              <span>•</span>
              <span>{transaction.spaceName}</span>
              <span>•</span>
              <span>{transaction.transactionNumber}</span>
            </div>

            {/* Cancelled / Refund flow: Inject Cancellation Summary directly under header
                 (matches Figma Cancelled screenshot layout) */}
            {transaction.type === "refund" && transaction.cancellation ? (
              <div className="mt-4 space-y-2.5 rounded-2xl border border-border/60 bg-white px-4 py-3.5">
                <InfoRow
                  label="Cancelled by"
                  value={
                    <span className="text-[13px] font-semibold text-foreground/90">
                      {transaction.cancellation.byName}
                      {(() => {
                        const role = transaction.cancellation.byRole;
                        if (role === "HOST") {
                          return (
                            <span className="ml-2 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              Host
                            </span>
                          );
                        }
                        if (role === "GUEST") {
                          return (
                            <span className="ml-2 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                              Guest
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </span>
                  }
                />
                <InfoRow
                  label="Cancellation Time"
                  value={
                    <span className="text-[13px] font-medium text-foreground/90">
                      {formatDateTime(transaction.cancellation.timestamp)}
                    </span>
                  }
                />
                <div className="pt-1">
                  <div className="text-[12px] font-medium text-muted-foreground mb-1.5">
                    Cancellation Reason
                  </div>
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] leading-5 text-red-700">
                    {transaction.cancellation.reason}
                  </div>
                </div>
              </div>
            ) : null}

            {/* ✨ ELIGIBILITY BANNER only on Payout + Completed pending */}
            {transaction.type === "payout" && transaction.status === "completed" ? (
              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <BadgeCheck size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-bold uppercase tracking-tight text-emerald-900">
                    Action Required — Ready to Pay
                  </div>
                  <div className="mt-0.5 text-[12px] leading-5 text-emerald-800/80">
                    Event has been completed. Both the host payout and guest caution refund can be processed.
                    Scroll down and click <strong>Mark as Paid</strong> to release funds.
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-3 rounded-2xl border border-border/60 px-4 py-3.5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Banknote size={12} />
                    Amount
                  </div>
                  <div className="mt-1 text-[18px] font-bold tracking-tight text-foreground">
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
                <StatusBadge status={TRANSACTION_STATUS_KEYS[transaction.status]} size="sm" />
              </div>
            </div>

            <div className="mt-1 border-b border-border/50">
              <InfoRow
                label="Payment Date"
                value={
                  <span className="text-[13px] font-medium text-foreground/90">
                    {formatDateTime(transaction.transactionDate)}
                  </span>
                }
              />
              <InfoRow
                label="Booking ID"
                value={
                  <span className="text-[13px] font-medium text-foreground/90">
                    #{transaction.bookingNumber}
                  </span>
                }
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 sm:px-7 pb-4 overscroll-contain scrollbar-gutter-stable">
            {/* ===========================================
               BANK RECIPIENT CARDS — vary by transaction TYPE:
               REFUND → ONLY Guest (money going to Guest per Figma)
               PAYOUT → Host + Guest BOTH (dual payout hybrid plan)
               PAYMENT → Both (contextual info only)
               =========================================== */}

            {/* REFUND TYPE: Only the GUEST bank card (Host gets N0 — as in Figma Cancelled screenshot shows only recipient = GUEST) */}
            {transaction.type === "refund" && transaction.guest ? (
              <Card className="rounded-2xl border-border/60 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={transaction.guest.fullName}
                      imageUrl={transaction.guest.avatarUrl}
                      size="lg"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-semibold text-foreground">
                          {transaction.guest.fullName}
                        </span>
                        <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                          Guest
                        </span>
                      </div>
                      <div className="mt-0.5 truncate text-[12px] text-muted-foreground">
                        {transaction.guest.email}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border/50 text-[13px]">
                    <InfoRow
                      label="Bank Name"
                      value={transaction.guest.bankName || "—"}
                    />
                    <InfoRow
                      label="Account Number"
                      value={transaction.guest.accountNumber || "—"}
                      rightSlot={
                        transaction.guest.accountNumber ? (
                          <CopyableValue value={transaction.guest.accountNumber} />
                        ) : undefined
                      }
                    />
                    <InfoRow
                      label="Account Name"
                      value={transaction.guest.accountName || "—"}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* NON-REFUND (Payout, Payment): Show HOST card always */}
            {transaction.type !== "refund" ? (
              <Card className="rounded-2xl border-border/60 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={transaction.host.fullName}
                      imageUrl={transaction.host.avatarUrl}
                      size="lg"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-semibold text-foreground">
                          {transaction.host.fullName}
                        </span>
                        <span className="inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          Host
                        </span>
                      </div>
                      <div className="mt-0.5 truncate text-[12px] text-muted-foreground">
                        {transaction.host.email}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border/50 text-[13px]">
                    <InfoRow label="Bank Name" value={transaction.host.bankName} />
                    <InfoRow
                      label="Account Number"
                      value={transaction.host.accountNumber}
                      rightSlot={<CopyableValue value={transaction.host.accountNumber} />}
                    />
                    <InfoRow label="Account Name" value={transaction.host.accountName} />
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* NON-REFUND (Payout, Payment): Show GUEST card if Guest info exists */}
            {transaction.type !== "refund" && transaction.guest ? (
              <Card className="mt-4 rounded-2xl border-border/60 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      name={transaction.guest.fullName}
                      imageUrl={transaction.guest.avatarUrl}
                      size="lg"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-semibold text-foreground">
                          {transaction.guest.fullName}
                        </span>
                        <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                          Guest
                        </span>
                      </div>
                      <div className="mt-0.5 truncate text-[12px] text-muted-foreground">
                        {transaction.guest.email}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-border/50 text-[13px]">
                    <InfoRow
                      label="Bank Name"
                      value={transaction.guest.bankName || "—"}
                    />
                    <InfoRow
                      label="Account Number"
                      value={transaction.guest.accountNumber || "—"}
                      rightSlot={
                        transaction.guest.accountNumber ? (
                          <CopyableValue value={transaction.guest.accountNumber} />
                        ) : undefined
                      }
                    />
                    <InfoRow
                      label="Account Name"
                      value={transaction.guest.accountName || "—"}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* =============== BREAKDOWN / SUMMARY CARDS =============== */}

            {/* REFUND: Use FIGMA simple 2-field card, NOT generic Payment Breakdown */}
            {transaction.type === "refund" && transaction.refund ? (
              <Card className="mt-4 rounded-2xl border-border/60 shadow-none">
                <CardContent className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between py-2.5 text-[13px]">
                    <span className="font-medium text-foreground/85">Host Payout</span>
                    <span className="font-semibold text-foreground/90">N0</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/50 pt-2.5 text-[13px]">
                    <span className="font-medium text-foreground/85">Refund Amount</span>
                    <span className="text-[15px] font-bold tracking-tight text-foreground">
                      {formatCurrency(transaction.refund.refundAmount)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Payment Breakdown = only for NON-refund (Payout/Payment) types */}
            {transaction.type !== "refund" ? (
              <Card className="mt-4 rounded-2xl border-border/60 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                    <Wallet size={15} />
                    <span>Payment Breakdown</span>
                  </div>
                  <div className="mt-2 text-[13px]">
                    <BreakdownLine
                      label="Gross booking amount"
                      amount={transaction.breakdown.grossBookingAmount}
                    />
                    {(() => {
                      const gross = Math.max(1, Number(transaction.breakdown.grossBookingAmount));
                      const pct = Math.round(
                        (Number(transaction.breakdown.platformCommission) / gross) * 100
                      );
                      return (
                        <BreakdownLine
                          label={`Platform Commission (${pct}%)`}
                          amount={transaction.breakdown.platformCommission}
                          isNegative
                        />
                      );
                    })()}
                    <BreakdownLine
                      label="Refundable Caution Fee (Guest refund)"
                      amount={transaction.breakdown.refundableCautionFee}
                      isNegative
                    />
                    <BreakdownLine
                      label="Net Payout Host"
                      amount={transaction.breakdown.netPayoutHost}
                      isTotal
                    />
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          <div className="border-t border-border/60 bg-muted/20 px-6 py-4">
            {/* IRONCLAD RULE: Mark As Paid button ONLY shows if:
               1. transaction.type = PAYOUT
               2. derived frontend status = "completed" (event done, booking COMPLETED, payout pending in DB)
               Showing button on status=pending rows would allow paying out BEFORE event = audit violation.
            */}
            {transaction.type === "payout" && transaction.status === "completed" ? (
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  onClick={() => onMarkAsPaid(transaction)}
                  disabled={actionLoading !== null}
                  className="h-11 rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  <Calendar size={14} className="mr-1.5" />
                  {actionLoading === "markPaid" ? "Marking as Paid..." : "Mark as Paid"}
                </Button>
              </div>
            ) : transaction.type === "refund" && transaction.status === "cancelled" ? (
              <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:justify-end">
                {transaction.refund ? (
                  <div className="flex flex-col items-end gap-0.5 text-[12px] text-foreground/80">
                    <div>
                      Host Payout <span className="font-medium text-foreground">{formatCurrency(transaction.refund.hostPayoutAmount)}</span>
                    </div>
                    <div>
                      Refund Amount <span className="font-medium text-foreground">{formatCurrency(transaction.refund.refundAmount)}</span>
                    </div>
                  </div>
                ) : null}
                <Button
                  type="button"
                  onClick={() => onMarkRefunded(transaction)}
                  disabled={actionLoading !== null}
                  className="h-11 rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {actionLoading === "markRefunded" ? "Processing..." : "Mark Refunded"}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}