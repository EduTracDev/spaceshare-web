"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { DisputeManagementTable } from "@/features/disputes/components/DisputeManagementTable";
import { DisputeDetailsSheet } from "@/features/disputes/components/DisputeDetailsSheet";
import { useDisclosure } from "@/hooks/useDisclosure";
import { disputeService } from "@/services/dispute.service";
import type { Dispute } from "@/features/disputes/types/dispute.types";

export default function DisputesPage() {
  const queryClient = useQueryClient();
  const detailsDialog = useDisclosure();
  const [selectedDispute, setSelectedDispute] = React.useState<Dispute | null>(null);

  const refetchDisputes = () =>
    queryClient.invalidateQueries({ queryKey: ["disputes"] });

  const resolveMutation = useMutation({
    mutationFn: (disputeId: string) => disputeService.markAsResolved(disputeId),
    onSuccess: (result) => {
      toast.success(result.message);
      refetchDisputes();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to resolve dispute");
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader bleed
        title="Disputes"
        subtitle="Manually review and resolve disputes between guests and hosts."
      />

      <DisputeManagementTable
        onViewDetails={(dispute) => {
          setSelectedDispute(dispute);
          detailsDialog.open();
        }}
      />

      <DisputeDetailsSheet
        open={detailsDialog.isOpen}
        onOpenChange={detailsDialog.toggle}
        dispute={selectedDispute}
        actionLoading={resolveMutation.isPending}
        onMarkAsResolved={(dispute) => resolveMutation.mutate(dispute.id)}
      />
    </div>
  );
}