"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import type { Listing, ListingReview } from "@/features/listings/types/listing.types";
import { listingService } from "@/services/listing.service";

interface ListingReviewsPanelProps {
  listing: Listing;
}

function formatReviewDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ListingReviewsPanel({ listing }: ListingReviewsPanelProps) {
  const queryClient = useQueryClient();
  const reviews = listing.reviews.slice(0, 10);

  const [deleteTarget, setDeleteTarget] =
    React.useState<ListingReview | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const averageRating = React.useMemo(() => {
    if (listing.reviews.length === 0) return 0;
    const total = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / listing.reviews.length;
  }, [listing.reviews]);

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => listingService.deleteReview(reviewId),
    onSuccess: (result) => {
      toast.success(result.message);
      // Refetch listings cache so the reviews panel + listing aggregates refresh
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      setDeleteTarget(null);
      setDeleteDialogOpen(false);
    },
    onError: (error: unknown) => {
      const msg = error instanceof Error ? error.message : "Failed to delete review";
      toast.error(msg);
    },
  });

  const confirmDelete = React.useCallback(() => {
    if (!deleteTarget) return;
    deleteReviewMutation.mutate(deleteTarget.id);
  }, [deleteTarget, deleteReviewMutation]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-muted/30 px-5 py-4 text-center">
        <div className="text-[26px] font-bold tracking-tight">{averageRating.toFixed(1)}</div>
        <div className="mt-1 inline-flex items-center gap-0.5 text-amber-500">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={14}
              className={index < Math.round(averageRating) ? "fill-current" : ""}
            />
          ))}
        </div>
        <div className="mt-1 text-[12px] text-muted-foreground">
          ({listing.reviews.length} Reviews)
        </div>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border/50 pb-3 last:border-b-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-muted-foreground">
                  {formatReviewDate(review.createdAt)}
                </div>
                <p className="mt-2 text-[12.5px] leading-5 text-foreground/90">
                  {review.comment}
                </p>
                <div className="mt-2 text-[11px] font-semibold text-foreground">
                  {review.reviewerName}
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                  <Star size={12} className="fill-current" />
                  {review.rating.toFixed(1)}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Delete review"
                  className="h-7 w-7 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => {
                    setDeleteTarget(review);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 pt-1">
        <span className="h-2 w-2 rounded-full bg-brand-200" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        <span className="h-2 w-2 rounded-full bg-primary" />
      </div>

      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open && !deleteReviewMutation.isPending) setDeleteTarget(null);
        }}
        title="Delete this review?"
        description={
          deleteTarget
            ? `Deleting "${deleteTarget.reviewerName}'s" review (${deleteTarget.rating.toFixed(1)}★) will permanently hide it from the public listing and update the space's average rating. This action cannot be undone.`
            : "This review will be removed from the listing."
        }
        confirmLabel="Delete review"
        confirmLoading={deleteReviewMutation.isPending}
        tone="danger"
        onConfirm={confirmDelete}
      />
    </div>
  );
}