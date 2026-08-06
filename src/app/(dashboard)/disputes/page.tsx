"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
      <PageHeader
        title="Disputes"
        subtitle="Manually review and resolve disputes between guests and hosts."
        actions={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Notifications"
            className="relative h-9 w-9 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground shrink-0"
          >
            <Bell size={17} />
          </Button>
        }
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