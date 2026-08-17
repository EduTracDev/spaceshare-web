"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { TransactionManagementTable } from "@/features/transactions/components/TransactionManagementTable";
import { TransactionDetailsSheet } from "@/features/transactions/components/TransactionDetailsDialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { transactionService } from "@/services/transaction.service";
import { formatCurrency } from "@/utils/formatters";
import type { Transaction } from "@/features/transactions/types/transaction.types";


function DialogInfoRow({
  label,
  children,
  valueRight,
  copyValue,
}: {
  label: string;
  children?: React.ReactNode;
  valueRight?: React.ReactNode;
  copyValue?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = React.useCallback(() => {
    if (!copyValue) return;
    void navigator.clipboard?.writeText(copyValue);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }, [copyValue]);

  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-[13.5px] font-medium text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        {valueRight ?? children}
        {copyValue ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Copy"
            className={
              copied
                ? "h-6 w-6 rounded-md text-green-600 bg-green-50"
                : "h-6 w-6 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10"
            }
            onClick={handleCopy}
          >
            <Copy size={12} />
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const detailsDialog = useDisclosure();
  const markPaidDialog = useDisclosure();
  const markRefundedDialog = useDisclosure();
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);

  const refetchTransactions = () =>
    queryClient.invalidateQueries({ queryKey: ["transactions"] });

  const markAsPaidMutation = useMutation({
    mutationFn: (transactionId: string) => transactionService.markAsPaid(transactionId),
    onSuccess: (result) => {
      toast.success(result.message);
      refetchTransactions();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to mark payout as paid");
    },
  });

  const markAsRefundedMutation = useMutation({
    mutationFn: (transactionId: string) => transactionService.markAsRefunded(transactionId),
    onSuccess: (result) => {
      toast.success(result.message);
      refetchTransactions();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to mark refund as successful");
    },
  });

  const actionLoading =
    markAsPaidMutation.isPending
      ? "markPaid"
      : markAsRefundedMutation.isPending
      ? "markRefunded"
      : null;

  const handleConfirmMarkPaid = React.useCallback(() => {
    if (!selectedTransaction) return;
    markAsPaidMutation.mutate(selectedTransaction.id, {
      onSettled: () => markPaidDialog.close(),
    });
  }, [selectedTransaction, markAsPaidMutation, markPaidDialog]);

  const handleConfirmMarkRefunded = React.useCallback(() => {
    if (!selectedTransaction) return;
    markAsRefundedMutation.mutate(selectedTransaction.id, {
      onSettled: () => markRefundedDialog.close(),
    });
  }, [selectedTransaction, markAsRefundedMutation, markRefundedDialog]);

  const markPaidDescription = "Confirm that payment has been successfully transferred to the host and guest. This action will update the payout status to Paid and cannot be undone.";
  const markRefundedDescription = "Confirm that the refund has been successfully transferred to the guest. This action will update the refund status and close the cancellation process.";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader bleed
        title="Transaction"
        subtitle="Review and release host payouts."

      />

      <TransactionManagementTable
        onViewDetails={(transaction) => {
          setSelectedTransaction(transaction);
          detailsDialog.open();
        }}
      />

      <TransactionDetailsSheet
        open={detailsDialog.isOpen}
        onOpenChange={detailsDialog.toggle}
        transaction={selectedTransaction}
        actionLoading={actionLoading}
        onMarkAsPaid={() => markPaidDialog.open()}
        onMarkRefunded={() => markRefundedDialog.open()}
      />


      <ConfirmationDialog
        open={markPaidDialog.isOpen}
        onOpenChange={markPaidDialog.toggle}
        tone="default"
        icon={CheckCircle2}
        title="Mark Payout as Paid"
        description={markPaidDescription}
        confirmLabel="Mark Paid"
        cancelLabel="Cancel"
        confirmLoading={markAsPaidMutation.isPending}
        onConfirm={handleConfirmMarkPaid}
        size="md"
      >
        <div className="border-t border-border/60 pt-2 space-y-0.5 text-[14px]">
          <DialogInfoRow
            label="Host Name"
            valueRight={
              <span className="text-[14px] font-semibold text-foreground">
                {selectedTransaction?.host.fullName ?? "—"}
              </span>
            }
          />
          <DialogInfoRow
            label="Booking ID"
            copyValue={selectedTransaction?.bookingNumber}
            valueRight={
              <span className="text-[14px] font-semibold tracking-tight text-foreground">
                {selectedTransaction?.bookingNumber ? `#${selectedTransaction.bookingNumber}` : "—"}
              </span>
            }
          />
          <DialogInfoRow
            label="Net Payout"
            valueRight={
              <span className="text-[16px] font-bold tracking-tight text-foreground">
                {selectedTransaction ? formatCurrency(selectedTransaction.payout.netPayoutHost) : "—"}
              </span>
            }
          />
        </div>
      </ConfirmationDialog>

      {/* ---- Mark Refund as Completed confirmation dialog (matches Figma screenshot 2) ---- */}
      <ConfirmationDialog
        open={markRefundedDialog.isOpen}
        onOpenChange={markRefundedDialog.toggle}
        tone="default"
        icon={CheckCircle2}
        title="Mark Refund as Completed"
        description={markRefundedDescription}
        confirmLabel="Mark as Refunded"
        cancelLabel="Cancel"
        confirmLoading={markAsRefundedMutation.isPending}
        onConfirm={handleConfirmMarkRefunded}
        size="md"
      >
        <div className="border-t border-border/60 pt-2 space-y-0.5 text-[14px]">
          <DialogInfoRow
            label="Guest Name"
            valueRight={
              <span className="text-[14px] font-semibold text-foreground">
                {selectedTransaction?.guest?.fullName ?? selectedTransaction?.cancellation?.byName ?? "—"}
              </span>
            }
          />
          <DialogInfoRow
            label="Booking ID"
            copyValue={selectedTransaction?.bookingNumber}
            valueRight={
              <span className="text-[14px] font-semibold tracking-tight text-foreground">
                {selectedTransaction?.bookingNumber ? `#${selectedTransaction.bookingNumber}` : "—"}
              </span>
            }
          />
          <DialogInfoRow
            label="Amount Refunded"
            valueRight={
              <span className="text-[16px] font-bold tracking-tight text-foreground">
                {selectedTransaction ? formatCurrency(selectedTransaction.refund?.refundAmount ?? 0) : "—"}
              </span>
            }
          />
        </div>
      </ConfirmationDialog>
    </div>
  );
}