"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { ListingManagementTable } from "@/features/listings/components/ListingManagementTable";
import { ListingDetailsSheet } from "@/features/listings/components/ListingDetailsSheet";
import { useDisclosure } from "@/hooks/useDisclosure";
import { listingService } from "@/services/listing.service";
import type { Listing } from "@/features/listings/types/listing.types";

export default function SpaceListingsPage() {
  const queryClient = useQueryClient();
  const detailsSheet = useDisclosure();
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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader bleed
        title="Space Listings"
        subtitle="Review, approve and moderate event spaces."
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
        onApprove={(listing) => approveMutation.mutate(listing.id)}
        onReject={(listing) => rejectMutation.mutate(listing.id)}
        onSuspend={(listing) => suspendMutation.mutate(listing.id)}
      />
    </div>
  );
}