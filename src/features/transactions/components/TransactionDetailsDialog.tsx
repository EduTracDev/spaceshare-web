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
import {
  TRANSACTION_DB_STATUS_KEYS,
  DB_STATUS_LABELS,
  canMarkPayoutAsPaid,
  canMarkRefundAsRefunded,
  payoutIneligibilityReason,
} from "@/features/transactions/types/transaction.types";
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
  const { type, host, guest, recipientRole, recipientName, recipientEmail } = transaction;
  const hostPaid = type === "payout" ? recipientRole === "HOST" : false;
  const guestPaid = type === "payout" ? recipientRole === "GUEST" : false;
  
  // Bank card data: For Payout/Refund = ONLY the explicit recipient of this transaction id.
  const bankCardForRecipient = (() => {
    if (type === "payment") return null; // Payments: no recipient user bank card (into platform)
    if (type === "refund") return guest ? "guest" as const : null;
    // Payout: explicit backend recipientRole is authoratitive (per 1:1 transaction = 1 recipient)
    if (recipientRole === "HOST") return "host" as const;
    if (recipientRole === "GUEST") return "guest" as const;
    return null;
  })();
  const paidAt = (transaction as unknown as { paidAt?: string }).paidAt;

  // Label for the top-left Amount card header. Per Figma it changes by type.
  const amountLabel =
    type === "payout" ? "Net Payout"
    : type === "refund" ? "Refund Amount"
    : "Amount";
  // Compute subtitle header identity (Figma top text: Mike Johnson • Skyline • BK-1234)
  const headerIdentityName =
    type === "payment" ? transaction.counterpartyName
    : recipientName ?? transaction.counterpartyName ?? host.fullName;

  // Custom badge for refund/cancelled rows (per Figma 3 refund amount top-right status: Cancelled when DB PENDING, Refunded = success)
  const amountStatusBadge = type === "refund"
    ? <StatusBadge
        status={transaction.dbStatus === "SUCCESSFUL" ? "completed" as const : transaction.dbStatus === "FAILED" ? "failed" as const : "cancelled" as const}
        label={
          transaction.dbStatus === "SUCCESSFUL" ? "Refunded"
          : transaction.dbStatus === "FAILED" ? DB_STATUS_LABELS.FAILED
          : "Cancelled"
        } size="sm" />
    : <StatusBadge status={TRANSACTION_DB_STATUS_KEYS[transaction.dbStatus]} label={DB_STATUS_LABELS[transaction.dbStatus]} size="sm" />;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        side="right"
        className="!max-w-[92vw] md:!max-w-[80vw] lg:!max-w-[42vw] min-h-full overflow-hidden rounded-l-lg md:rounded-l-3xl p-0 border-l outline-none focus:outline-none focus-visible:outline-none ring-0"
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

          {/* ================= HEADER (per Figma top row) ================= */}
          <div className="px-6 sm:px-7 pt-4 pb-3">
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
              <span className="font-semibold text-foreground">{headerIdentityName}</span>
              <span>•</span>
              <span>{transaction.spaceName}</span>
              <span>•</span>
              <span>{transaction.bookingNumber}</span>
            </div>

            {/* ELIGIBILITY BANNER only payout + pending + COMPLETED booking */}
            {canMarkPayoutAsPaid(transaction) ? (
              <div className="mt-3 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <BadgeCheck size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-bold uppercase tracking-tight text-emerald-900">
                    Action Required — Ready to Pay
                  </div>
                  <div className="mt-0.5 text-[12px] leading-5 text-emerald-800/80">
                    Event has been completed. Review the bank account details and click
                    <strong> Mark as Paid</strong> after the offline transfer is complete.
                  </div>
                </div>
              </div>
            ) : null}

            {/* =========== TOP AMOUNT CARD (label varies per type) =========== */}
            <div className="mt-3 rounded-2xl border border-border/60 px-4 py-3.5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Banknote size={12} />
                    {amountLabel}
                  </div>
                  <div className="mt-1 text-[18px] font-bold tracking-tight text-foreground">
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
                {amountStatusBadge}
              </div>
            </div>

            {/* ========== META INFO ROWS (labels vary per transaction type) ========== */}
            <div className="mt-1 border-b border-border/50 pb-2">
              {type === "payment" ? (
                // 💜 PAYMENT: Booking Date + Transaction ID (Figma 1)
                <>
                  <InfoRow
                    label="Booking Date"
                    value={<span className="text-[13px] font-medium text-foreground/90">{formatDateTime(transaction.transactionDate)}</span>}
                  />
                  <InfoRow
                    label="Transaction ID"
                    value={<span className="text-[13px] font-medium text-foreground/90">#{transaction.transactionNumber}</span>}
                    rightSlot={<CopyableValue value={`#${transaction.transactionNumber}`} />}
                  />
                </>
              ) : type === "payout" ? (
                // 🟢 PAYOUT: Date Created, Date Paid (if paid), Transaction ID (Figma 2)
                <>
                  <InfoRow
                    label="Date Created"
                    value={<span className="text-[13px] font-medium text-foreground/90">{formatDateTime(transaction.transactionDate)}</span>}
                  />
                  <InfoRow
                    label="Date Paid"
                    value={
                      <span className="text-[13px] font-medium text-foreground/90">
                        {paidAt ? formatDateTime(paidAt) : "—"}
                      </span>
                    }
                  />
                  <InfoRow
                    label="Transaction ID"
                    value={<span className="text-[13px] font-medium text-foreground/90">#{transaction.transactionNumber}</span>}
                    rightSlot={<CopyableValue value={`#${transaction.transactionNumber}`} />}
                  />
                </>
              ) : (
                // 🔵 REFUND: Date Created, Transaction ID (Figma 3 — Cancellation info goes below as its own card)
                <>
                  <InfoRow
                    label="Date Created"
                    value={<span className="text-[13px] font-medium text-foreground/90">{formatDateTime(transaction.transactionDate)}</span>}
                  />
                  <InfoRow
                    label="Transaction ID"
                    value={<span className="text-[13px] font-medium text-foreground/90">#{transaction.transactionNumber}</span>}
                    rightSlot={<CopyableValue value={`#${transaction.transactionNumber}`} />}
                  />
                </>
              )}
            </div>
          </div>

          {/* =============== SCROLLABLE MAIN BODY CONTENT =============== */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-7 pb-4 overscroll-contain scrollbar-gutter-stable">
            {/* 🔵 REFUND ONLY: 3-Field CANCELLATION CARD (Cancelled by / Time / Reason) — slot AFTER info rows BEFORE bank recipient (Figma 3 exact order) */}
            {type === "refund" && transaction.cancellation ? (
              <div className="space-y-2.5 rounded-2xl border border-border/60 bg-white px-4 py-3.5 mb-4">
                <InfoRow
                  label="Cancelled by"
                  value={
                    <span className="text-[13px] font-semibold text-foreground/90">
                      {transaction.cancellation.byName}
                      {(() => {
                        const role = transaction.cancellation!.byRole;
                        if (role === "HOST") return <span className="ml-2 inline-flex rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-primary">Host</span>;
                        if (role === "GUEST") return <span className="ml-2 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">Guest</span>;
                        if (role === "ADMIN") return <span className="ml-2 inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-700">Admin</span>;
                        return null;
                      })()}
                    </span>
                  }
                />
                <InfoRow
                  label="Cancellation Time"
                  value={<span className="text-[13px] font-medium text-foreground/90">{formatDateTime(transaction.cancellation.timestamp)}</span>}
                />
                <div className="pt-1">
                  <div className="text-[12px] font-medium text-muted-foreground mb-1.5">Cancellation Reason</div>
                  <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] leading-5 text-red-700">
                    {transaction.cancellation.reason}
                  </div>
                </div>
              </div>
            ) : null}

            {/* ============= RECIPIENT BANK CARDS (only for Payout/Refund. Payment = NO BANK CARDS!) ============= */}
            {(() => {
              if (type === "payment") return null;
              if (!bankCardForRecipient) return null;

              const rec = bankCardForRecipient === "host" ? host : (guest ?? host);
              const chipClass = bankCardForRecipient === "host"
                ? "bg-brand-50 text-primary"
                : "bg-blue-50 text-blue-700";
              const chipLabel = bankCardForRecipient === "host" ? "Host" : "Guest";
              // Show recipient avatar + role chip (Figma 2: Mike Johnson MJ avatar • Host pill • email)
              return (
                <Card className="rounded-2xl border-border/60 shadow-none mb-4">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={rec.fullName} imageUrl={rec.avatarUrl} size="lg" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13.5px] font-semibold text-foreground">{rec.fullName}</span>
                          <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold", chipClass)}>{chipLabel}</span>
                        </div>
                        <div className="mt-0.5 truncate text-[12px] text-muted-foreground">
                          {recipientEmail && recipientRole && bankCardForRecipient === recipientRole.toLowerCase() ? recipientEmail : rec.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-border/50 text-[13px]">
                      <InfoRow label="Bank Name" value={rec.bankName || "—"} />
                      <InfoRow
                        label="Account Number"
                        value={rec.accountNumber || "—"}
                        rightSlot={rec.accountNumber ? <CopyableValue value={rec.accountNumber} /> : undefined}
                      />
                      <InfoRow label="Account Name" value={rec.accountName || "—"} />
                    </div>
                  </CardContent>
                </Card>
              );
            })()}

            {/* =============== PAYMENT BREAKDOWN — ONLY ON PAYMENT TYPE (Figma 1) =============== */}
            {type === "payment" ? (
              <Card className="rounded-2xl border-border/60 shadow-none">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                    <Wallet size={15} />
                    <span>Payment Breakdown</span>
                  </div>
                  <div className="mt-2 text-[13px]">
                    <BreakdownLine label="Gross booking amount" amount={transaction.breakdown.grossBookingAmount} />
                    {(() => {
                      const gross = Math.max(1, Number(transaction.breakdown.grossBookingAmount));
                      const pct = Math.round((Number(transaction.breakdown.platformCommission) / gross) * 100);
                      return (
                        <BreakdownLine
                          label={`Platform Commission (${pct}%)`}
                          amount={transaction.breakdown.platformCommission}
                          isNegative
                        />
                      );
                    })()}
                    <BreakdownLine
                      label="Refundable Caution Fee"
                      amount={transaction.breakdown.refundableCautionFee}
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

            {/* PAYOUT/REFUND OLD 2-field duplicate summary card REMOVED — refund amount label now on top card! (Figma 3 no duplicate card) */}
          </div>

          {/* ===== FOOTER ACTIONS — only render bg-muted footer bar IF there are actions (Payout or Refund eligible). Payment = no actions! ===== */}
          {(() => {
            const payoutShowAction = canMarkPayoutAsPaid(transaction) || (type === "payout" && transaction.dbStatus === "PENDING");
            const refundShowAction = canMarkRefundAsRefunded(transaction);
            const hasAnyActions = type !== "payment" && (payoutShowAction || refundShowAction);
            if (!hasAnyActions) return null;

            return (
              <div className="border-t border-border/60 bg-muted/20 px-6 py-4">
                {canMarkPayoutAsPaid(transaction) ? (
                  <div className="flex items-center justify-end">
                    <Button
                      type="button"
                      onClick={() => onMarkAsPaid(transaction)}
                      disabled={actionLoading !== null}
                      className="h-11 rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <BadgeCheck size={14} className="mr-1.5" />
                      {actionLoading === "markPaid" ? "Marking as Paid..." : "Mark as Paid"}
                    </Button>
                  </div>
                ) : type === "payout" && transaction.dbStatus === "PENDING" ? (
                  <div className="flex items-center justify-end">
                    <span title={payoutIneligibilityReason(transaction) ?? ""}>
                      <Button
                        type="button"
                        disabled
                        className="h-11 cursor-not-allowed rounded-full bg-muted px-5 text-[13px] font-semibold text-muted-foreground"
                      >
                        <BadgeCheck size={14} className="mr-1.5" />
                        Mark as Paid
                      </Button>
                    </span>
                  </div>
                ) : canMarkRefundAsRefunded(transaction) ? (
                  <div className="flex items-center justify-end">
                    <Button
                      type="button"
                      onClick={() => onMarkRefunded(transaction)}
                      disabled={actionLoading !== null}
                      className="h-11 rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <BadgeCheck size={14} className="mr-1.5" />
                      {actionLoading === "markRefunded" ? "Processing..." : "Mark Refunded"}
                    </Button>
                  </div>
                ) : null}
              </div>
            );
          })()}
        </div>
      </SheetContent>
    </Sheet>
  );
}