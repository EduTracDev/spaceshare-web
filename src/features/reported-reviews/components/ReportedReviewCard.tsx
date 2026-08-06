"use client";

import * as React from "react";
import { MoreVertical, ThumbsUp, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ReportedReview } from "@/features/reported-reviews/types/reported-review.types";
import { REPORTED_REVIEW_STATUS_KEYS } from "@/features/reported-reviews/types/reported-review.types";
import { formatDateTime } from "@/utils/formatters";

interface ReportedReviewCardProps {
  review: ReportedReview;
  onRetain: (review: ReportedReview) => void;
  onRemove: (review: ReportedReview) => void;
}

export function ReportedReviewCard({
  review,
  onRetain,
  onRemove,
}: ReportedReviewCardProps) {
  const isPending = review.status === "pending";
  const reporterRoleLabel =
    review.reportedBy.role === "host" ? "Host" : "Guest";

  return (
    <Card className="relative rounded-2xl border-border/70 bg-card shadow-sm transition hover:border-border/90 hover:shadow-md">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11.5px] font-medium text-muted-foreground">
              {review.spaceName}
            </span>
            <p className="mt-1.5 text-[13.5px] leading-6 font-medium text-foreground/90">
              {review.reviewText}
            </p>
          </div>

          <div className="flex shrink-0 items-start gap-2">
            {isPending ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Moderation actions"
                      className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                    />
                  }
                >
                  <MoreVertical size={15} />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="mt-1 w-48 rounded-2xl p-1"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => onRetain(review)}
                      className="h-9 rounded-lg px-2.5 text-[13px] cursor-pointer"
                    >
                      <ThumbsUp size={14} className="mr-2 text-emerald-600" />
                      Retain Review
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={() => onRemove(review)}
                      className="h-9 rounded-lg px-2.5 text-[13px] cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <Trash2 size={14} className="mr-2 text-red-600" />
                      Remove Review
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <span className="sr-only">No actions available</span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted-foreground">
          <span>{formatDateTime(review.writtenAt)}</span>
          <span>Written by</span>
          <span className="font-medium text-foreground/85">
            {review.author.fullName}
          </span>
          <span className="ml-auto">
            <StatusBadge status={REPORTED_REVIEW_STATUS_KEYS[review.status]} />
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-y-2 border-t border-border/50 pt-3.5 text-[12px]">
          <div className="flex min-w-[45%] flex-col gap-1 pr-4">
            <span className="text-muted-foreground font-medium">Reason</span>
            <span className="font-semibold text-red-600">{review.reason}</span>
          </div>
          <div className="flex min-w-[45%] flex-col items-end gap-1 pl-4 ml-auto">
            <span className="text-muted-foreground font-medium">Reported by</span>
            <span className="text-right font-medium text-foreground/85">
              {review.reportedBy.fullName} ({reporterRoleLabel})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}