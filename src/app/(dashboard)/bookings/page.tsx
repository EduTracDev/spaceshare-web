"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { BookingManagementTable } from "@/features/bookings/components/BookingManagementTable";
import { BookingDetailsSheet } from "@/features/bookings/components/BookingDetailsDialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { bookingService } from "@/services/booking.service";
import type { Booking } from "@/features/bookings/types/booking.types";

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const detailsDialog = useDisclosure();
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null);

  const refetchBookings = () =>
    queryClient.invalidateQueries({ queryKey: ["bookings"] });

  const approveMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.updateBookingStatus(bookingId, "approved"),
    onSuccess: (result) => {
      toast.success(result.message);
      refetchBookings();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to approve booking");
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.updateBookingStatus(bookingId, "cancelled"),
    onSuccess: (result) => {
      toast.success(result.message);
      refetchBookings();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to cancel booking");
    },
  });

  const disputeMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.updateBookingStatus(bookingId, "disputed"),
    onSuccess: (result) => {
      toast.success(result.message);
      refetchBookings();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to flag booking as disputed");
    },
  });

  const resolveMutation = useMutation({
    mutationFn: (bookingId: string) => bookingService.updateBookingStatus(bookingId, "completed"),
    onSuccess: (result) => {
      toast.success(result.message);
      refetchBookings();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to resolve booking");
    },
  });

  const actionLoading =
    approveMutation.isPending
      ? "approve"
      : cancelMutation.isPending
      ? "cancel"
      : disputeMutation.isPending
      ? "dispute"
      : resolveMutation.isPending
      ? "resolve"
      : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader bleed
        title="Bookings"
        subtitle="All bookings across the marketplace."
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

      <BookingManagementTable
        onViewDetails={(booking) => {
          setSelectedBooking(booking);
          detailsDialog.open();
        }}
      />

      <BookingDetailsSheet
        open={detailsDialog.isOpen}
        onOpenChange={detailsDialog.toggle}
        booking={selectedBooking}
        actionLoading={actionLoading}
        onApprove={(booking) => approveMutation.mutate(booking.id)}
        onCancel={(booking) => cancelMutation.mutate(booking.id)}
        onDispute={(booking) => disputeMutation.mutate(booking.id)}
        onResolve={(booking) => resolveMutation.mutate(booking.id)}
      />
    </div>
  );
}