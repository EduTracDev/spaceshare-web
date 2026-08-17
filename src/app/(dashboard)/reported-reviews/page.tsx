"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { ReportedReviewsGrid } from "@/features/reported-reviews/components/ReportedReviewsGrid";
import { RetainReviewDialog } from "@/features/reported-reviews/components/RetainReviewDialog";
import { RemoveReviewDialog } from "@/features/reported-reviews/components/RemoveReviewDialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { reportedReviewService } from "@/services/reported-review.service";
import type { ReportedReview } from "@/features/reported-reviews/types/reported-review.types";

type ModerationAction = "retain" | "remove" | null;

export default function ReportedReviewsPage() {
  const queryClient = useQueryClient();

  const retainDialog = useDisclosure();
  const removeDialog = useDisclosure();

  const [selectedReview, setSelectedReview] = React.useState<ReportedReview | null>(null);
  const [activeAction, setActiveAction] = React.useState<ModerationAction>(null);

  const refetchReviews = () =>
    queryClient.invalidateQueries({ queryKey: ["reportedReviews"] });

  const retainMutation = useMutation({
    mutationFn: (reviewId: string) => reportedReviewService.retainReview(reviewId),
    onSuccess: (result) => {
      toast.success(result.message);
      refetchReviews();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to retain review");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (reviewId: string) => reportedReviewService.removeReview(reviewId),
    onSuccess: (result) => {
      toast.success(result.message);
      refetchReviews();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove review"
      );
    },
  });

  const handleRetain = (review: ReportedReview) => {
    setSelectedReview(review);
    setActiveAction("retain");
    retainDialog.open();
  };

  const handleRemove = (review: ReportedReview) => {
    setSelectedReview(review);
    setActiveAction("remove");
    removeDialog.open();
  };

  const actionLoading =
    (activeAction === "retain" && retainMutation.isPending) ||
    (activeAction === "remove" && removeMutation.isPending);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader bleed
        title="Reported Reviews"
        subtitle="Review and moderate reported reviews on space."
      />

      <ReportedReviewsGrid onRetain={handleRetain} onRemove={handleRemove} />

      <RetainReviewDialog
        open={retainDialog.isOpen}
        onOpenChange={(open) => {
          retainDialog.toggle();
          if (!open) {
            setActiveAction((prev) => (prev === "retain" ? null : prev));
          }
        }}
        review={selectedReview}
        confirmLoading={activeAction === "retain" && actionLoading}
        onConfirm={(review) => {
          retainMutation.mutate(review.id, {
            onSettled: () => retainDialog.close(),
          });
        }}
      />

      <RemoveReviewDialog
        open={removeDialog.isOpen}
        onOpenChange={(open) => {
          removeDialog.toggle();
          if (!open) {
            setActiveAction((prev) => (prev === "remove" ? null : prev));
          }
        }}
        review={selectedReview}
        confirmLoading={activeAction === "remove" && actionLoading}
        onConfirm={(review) => {
          removeMutation.mutate(review.id, {
            onSettled: () => removeDialog.close(),
          });
        }}
      />
    </div>
  );
}