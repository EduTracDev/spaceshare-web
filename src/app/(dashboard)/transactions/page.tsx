"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { TransactionManagementTable } from "@/features/transactions/components/TransactionManagementTable";
import { TransactionDetailsSheet } from "@/features/transactions/components/TransactionDetailsDialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { transactionService } from "@/services/transaction.service";
import type { Transaction } from "@/features/transactions/types/transaction.types";

export default function TransactionsPage() {
  const queryClient = useQueryClient();
  const detailsDialog = useDisclosure();
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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader bleed
        title="Transaction"
        subtitle="Review and release host payouts."
        actions={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Notifications"
            className="hidden md:relative h-9 w-9 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground shrink-0"
          >
            <Bell size={17} />
          </Button>
        }
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
        onMarkAsPaid={(transaction) => markAsPaidMutation.mutate(transaction.id)}
        onMarkRefunded={(transaction) => markAsRefundedMutation.mutate(transaction.id)}
      />
    </div>
  );
}