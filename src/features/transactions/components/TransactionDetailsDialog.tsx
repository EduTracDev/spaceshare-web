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
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
              <span className="font-semibold text-foreground">{transaction.host.fullName}</span>
              <span>•</span>
              <span>{transaction.spaceName}</span>
              <span>•</span>
              <span>{transaction.payoutNumber}</span>
            </div>

            <div className="mt-3 rounded-2xl border border-border/60 px-4 py-3.5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Banknote size={12} />
                    Amount
                  </div>
                  <div className="mt-1 text-[18px] font-bold tracking-tight text-foreground">
                    {formatCurrency(transaction.amountPaid)}
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
                    {formatDateTime(transaction.paymentDate)}
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

            {transaction.status === "completed" && transaction.guest ? (
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
                    <InfoRow label="Bank Name" value="GTBank" />
                    <InfoRow
                      label="Account Number"
                      value="01234456789"
                      rightSlot={<CopyableValue value="01234456789" />}
                    />
                    <InfoRow label="Account Name" value="Abdul Mike" />
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {transaction.status === "cancelled" && transaction.cancellation ? (
              <Card className="mt-4 rounded-2xl border-border/60 shadow-none">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-medium text-muted-foreground">
                        Cancelled by
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <UserAvatar
                          name={transaction.cancellation.byName}
                          size="sm"
                        />
                        <div>
                          <div className="text-[13px] font-semibold text-foreground">
                            {transaction.cancellation.byName}
                          </div>
                          <div className="text-[12px] text-muted-foreground">
                            {transaction.cancellation.byEmail}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge className="rounded-full bg-blue-50 text-blue-700 border-blue-200">
                      Guest
                    </Badge>
                  </div>

                  <div className="border-t border-border/50 text-[13px]">
                    <InfoRow
                      label="Cancellation Time"
                      value={
                        <span className="text-[13px] font-medium text-foreground/90">
                          {formatDateTime(transaction.cancellation.timestamp)}
                        </span>
                      }
                    />
                    <div className="py-2.5">
                      <div className="text-[12px] font-medium text-muted-foreground">
                        Cancellation Reason
                      </div>
                      <div className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] leading-5 text-red-700">
                        {transaction.cancellation.reason}
                      </div>
                    </div>
                  </div>

                  {transaction.refund ? (
                    <div className="border-t border-border/50 text-[13px]">
                      <InfoRow
                        label="Host Payout"
                        value={formatCurrency(transaction.refund.hostPayoutAmount)}
                      />
                      <InfoRow
                        label="Refund Amount"
                        value={formatCurrency(transaction.refund.refundAmount)}
                      />
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            {transaction.status === "success" ? (
              <Card className="mt-4 rounded-2xl border-border/60 shadow-none">
                <CardContent className="p-4 space-y-4">
                  {transaction.guest ? (
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
                  ) : null}

                  <div className="grid grid-cols-2 gap-3 text-[13px]">
                    <div className="rounded-xl border border-border/60 px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <UserRound size={12} />
                        Net Payout Host
                      </div>
                      <div className="mt-1.5 font-semibold text-foreground">
                        {formatCurrency(transaction.payout.netPayoutHost)}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/60 px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Clock size={12} />
                        Refundable Caution Fee
                      </div>
                      <div className="mt-1.5 font-semibold text-foreground">
                        {formatCurrency(transaction.payout.refundableCautionFee)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {transaction.status === "paid" ? (
              <Card className="mt-4 rounded-2xl border-border/60 shadow-none">
                <CardContent className="p-4 space-y-4">
                  {transaction.guest ? (
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
                  ) : null}

                  <div className="rounded-xl border border-border/60 px-4 py-3 text-[13px]">
                    <InfoRow
                      label="Refundable Caution Fee"
                      value={formatCurrency(transaction.payout.refundableCautionFee)}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : null}

            <Card className="mt-4 rounded-2xl border-border/60 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                  <Wallet size={15} />
                  <span>Payment Breakdown</span>
                </div>
                <div className="mt-2 text-[13px]">
                  <BreakdownLine
                    label="Gross booking amount"
                    amount={transaction.payout.grossBookingAmount}
                  />
                  <BreakdownLine
                    label="Platform Commission (10%)"
                    amount={transaction.payout.platformCommission}
                    isNegative
                  />
                  <BreakdownLine
                    label="Refundable Caution Fee"
                    amount={transaction.payout.refundableCautionFee}
                  />
                  <BreakdownLine
                    label="Net Payout Host"
                    amount={transaction.payout.netPayoutHost}
                    isTotal
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="border-t border-border/60 bg-muted/20 px-6 py-4">
            {transaction.status === "pending" || transaction.status === "completed" ? (
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
            ) : transaction.status === "cancelled" ? (
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