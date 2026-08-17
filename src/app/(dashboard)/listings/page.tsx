"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ban, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { ListingManagementTable } from "@/features/listings/components/ListingManagementTable";
import { ListingDetailsSheet } from "@/features/listings/components/ListingDetailsSheet";
import { useDisclosure } from "@/hooks/useDisclosure";
import { listingService } from "@/services/listing.service";
import type { Listing } from "@/features/listings/types/listing.types";

export default function SpaceListingsPage() {
  const queryClient = useQueryClient();
  const detailsSheet = useDisclosure();
  const approveDialog = useDisclosure();
  const rejectDialog = useDisclosure();
  const suspendDialog = useDisclosure();
  const [selectedListing, setSelectedListing] = React.useState<Listing | null>(null);

  const refetchListings = () =>
    queryClient.invalidateQueries({ queryKey: ["listings"] });

  const approveMutation = useMutation({
    mutationFn: (listingId: string) => listingService.approveListing(listingId),
    onSuccess: (result) => {
      toast.success(result.message);
      setSelectedListing(result.listing);
      refetchListings();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to approve listing");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (listingId: string) => listingService.rejectListing(listingId),
    onSuccess: (result) => {
      toast.success(result.message);
      setSelectedListing(result.listing);
      refetchListings();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to reject listing");
    },
  });

  const suspendMutation = useMutation({
    mutationFn: (listingId: string) => listingService.suspendListing(listingId),
    onSuccess: (result) => {
      toast.success(result.message);
      setSelectedListing(result.listing);
      refetchListings();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to suspend listing");
    },
  });

  const actionLoading =
    approveMutation.isPending
      ? "approve"
      : rejectMutation.isPending
      ? "reject"
      : suspendMutation.isPending
      ? "suspend"
      : null;

  const handleConfirmApprove = React.useCallback(() => {
    if (!selectedListing) return;
    approveMutation.mutate(selectedListing.id, {
      onSettled: () => approveDialog.close(),
    });
  }, [selectedListing, approveMutation, approveDialog]);

  const handleConfirmReject = React.useCallback(() => {
    if (!selectedListing) return;
    rejectMutation.mutate(selectedListing.id, {
      onSettled: () => rejectDialog.close(),
    });
  }, [selectedListing, rejectMutation, rejectDialog]);

  const handleConfirmSuspend = React.useCallback(() => {
    if (!selectedListing) return;
    suspendMutation.mutate(selectedListing.id, {
      onSettled: () => suspendDialog.close(),
    });
  }, [selectedListing, suspendMutation, suspendDialog]);


  const approveDialogDescription = selectedListing
    ? `Approve "${selectedListing.spaceName}"? This space will become visible to guests and can start receiving booking requests.`
    : "This space will become visible to guests and can start receiving booking requests.";

  const rejectDialogDescription = selectedListing
    ? `Reject "${selectedListing.spaceName}"? This space will NOT be published and the host will be notified of your decision.`
    : "This space will not be published and the host will be notified of your decision.";

  const suspendDialogDescription = selectedListing
    ? `Suspend "${selectedListing.spaceName}"? This listing will immediately become unavailable to guests.`
    : "This listing will immediately become unavailable to guests.";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader bleed
        title="Space Listings"
        subtitle="Review, approve and moderate event spaces."
      />

      <ListingManagementTable
        onViewDetails={(listing) => {
          setSelectedListing(listing);
          detailsSheet.open();
        }}
      />

      <ListingDetailsSheet
        open={detailsSheet.isOpen}
        onOpenChange={detailsSheet.toggle}
        listing={selectedListing}
        actionLoading={actionLoading}
        onApprove={() => approveDialog.open()}
        onReject={() => rejectDialog.open()}
        onSuspend={() => suspendDialog.open()}
      />

      <ConfirmationDialog
        open={approveDialog.isOpen}
        onOpenChange={approveDialog.toggle}
        tone="success"
        icon={CheckCircle2}
        title="Approve Space Listing"
        description={approveDialogDescription}
        confirmLabel="Approve Listing"
        cancelLabel="Cancel"
        confirmLoading={approveMutation.isPending}
        onConfirm={handleConfirmApprove}
        size="sm"
      />

      <ConfirmationDialog
        open={rejectDialog.isOpen}
        onOpenChange={rejectDialog.toggle}
        tone="danger"
        icon={Trash2}
        title="Reject Space Listing"
        description={rejectDialogDescription}
        confirmLabel="Reject Listing"
        cancelLabel="Cancel"
        confirmLoading={rejectMutation.isPending}
        onConfirm={handleConfirmReject}
        size="sm"
      />

      <ConfirmationDialog
        open={suspendDialog.isOpen}
        onOpenChange={suspendDialog.toggle}
        tone="warning"
        icon={Ban}
        title="Suspend Space Listing"
        description={suspendDialogDescription}
        confirmLabel="Suspend Listing"
        cancelLabel="Cancel"
        confirmLoading={suspendMutation.isPending}
        onConfirm={handleConfirmSuspend}
        size="sm"
      />
    </div>
  );
}