"use client";

import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import type { ReportedReview } from "@/features/reported-reviews/types/reported-review.types";

interface RetainReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: ReportedReview | null;
  confirmLoading?: boolean;
  onConfirm: (review: ReportedReview) => void;
}

export function RetainReviewDialog({
  open,
  onOpenChange,
  review,
  confirmLoading = false,
  onConfirm,
}: RetainReviewDialogProps) {
  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      tone="success"
      size="sm"
      title="Retain Review"
      description="Are you sure you want to retain this review?"
      children={
        <div className="space-y-2.5 text-[13px] leading-6 text-muted-foreground/90">
          <p>
            After reviewing the report, this review will remain visible on the
            platform. The report will be closed, and no further action will be
            taken on this review.
          </p>
        </div>
      }
      confirmLabel="Retain Review"
      cancelLabel="Cancel"
      confirmLoading={confirmLoading}
      onConfirm={() => {
        if (!review) return;
        onConfirm(review);
      }}
    />
  );
}