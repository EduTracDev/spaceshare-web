"use client";

import * as React from "react";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Listing } from "@/features/listings/types/listing.types";

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
  const reviews = listing.reviews.slice(0, 10);

  const averageRating = React.useMemo(() => {
    if (listing.reviews.length === 0) return 0;
    const total = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / listing.reviews.length;
  }, [listing.reviews]);

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
    </div>
  );
}