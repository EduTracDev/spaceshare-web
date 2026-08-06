"use client";

import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import type { ReportedReview } from "@/features/reported-reviews/types/reported-review.types";

interface RemoveReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: ReportedReview | null;
  confirmLoading?: boolean;
  onConfirm: (review: ReportedReview) => void;
}

export function RemoveReviewDialog({
  open,
  onOpenChange,
  review,
  confirmLoading = false,
  onConfirm,
}: RemoveReviewDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      tone="danger"
      size="sm"
      title="Remove Review"
      description="This action will permanently remove the review from public view. The review will be notified that their review was removed for violating the platform's review guidelines."
      confirmLabel="Remove Review"
      cancelLabel="Cancel"
      confirmLoading={confirmLoading}
      onConfirm={() => {
        if (!review) return;
        onConfirm(review);
      }}
    />
  );
}