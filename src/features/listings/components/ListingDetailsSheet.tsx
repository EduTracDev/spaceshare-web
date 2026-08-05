"use client";

import * as React from "react";
import {
  Calendar,
  MapPin,
  Sparkles,
  Tag,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAvatar } from "@/components/shared/Avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { Listing } from "@/features/listings/types/listing.types";
import { ListingReviewsPanel } from "@/features/listings/components/ListingReviewsPanel";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";

interface ListingDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listing: Listing | null;
  actionLoading?: "approve" | "reject" | "suspend" | null;
  onApprove: (listing: Listing) => void;
  onReject: (listing: Listing) => void;
  onSuspend: (listing: Listing) => void;
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-NG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function labelizeCategory(value: Listing["category"]) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 px-3 py-3">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Icon size={12} />
        {label}
      </div>
      <div className="mt-1.5 text-[13px] font-medium text-foreground">{value}</div>
    </div>
  );
}

export function ListingDetailsSheet({
  open,
  onOpenChange,
  listing,
  actionLoading = null,
  onApprove,
  onReject,
  onSuspend,
}: ListingDetailsSheetProps) {
  const [activeTab, setActiveTab] = React.useState("details");

  React.useEffect(() => {
    setActiveTab("details");
  }, [listing?.id, listing?.status]);

  if (!listing) return null;

  const showReviewsTab = listing.status === "approved" || listing.status === "suspended";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[620px] rounded-l-3xl p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b border-border/60 px-5 pt-5 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <UserAvatar
                  name={listing.host.fullName}
                  imageUrl={listing.host.avatarUrl}
                  size="lg"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <SheetTitle className="text-[15px] font-semibold">
                      {listing.host.fullName}
                    </SheetTitle>
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      Host
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    {listing.host.totalListings} listings
                  </p>
                </div>
              </div>

              <SheetClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Close"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted"
                  />
                }
              >
                <X size={16} />
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
              <TabsList className="h-9 rounded-full bg-muted/60 p-1">
                <TabsTrigger
                  value="details"
                  className="rounded-full px-4 text-[12px] font-medium data-active:bg-primary data-active:text-primary-foreground"
                >
                  Space Details
                </TabsTrigger>
                {showReviewsTab ? (
                  <TabsTrigger
                    value="reviews"
                    className="rounded-full px-4 text-[12px] font-medium data-active:bg-primary data-active:text-primary-foreground"
                  >
                    Reviews
                  </TabsTrigger>
                ) : null}
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="flex items-center gap-2 text-[11px]">
                  <StatusBadge status={listing.status} size="sm" />
                  <span className="font-semibold text-[21px] leading-none tracking-tight text-foreground">
                    {listing.spaceName}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={12} />
                    {listing.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={12} />
                    {formatDateTime(listing.submittedAt)}
                  </span>
                </div>

                <div className="grid grid-cols-[1fr_92px] gap-3">
                  <div className="overflow-hidden rounded-2xl border border-border/60">
                    <img
                      src={listing.coverImageUrl}
                      alt={listing.spaceName}
                      className="h-[194px] w-full object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {listing.gallery.slice(0, 4).map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="overflow-hidden rounded-xl border border-border/60"
                      >
                        <img
                          src={image}
                          alt={`${listing.spaceName} thumbnail ${index + 1}`}
                          className="h-[92px] w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="rounded-2xl border-border/60 shadow-none">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-foreground">
                      <Sparkles size={13} className="text-primary" />
                      Space Details
                    </div>
                    <p className="mt-2 text-[12px] leading-5 text-muted-foreground">
                      {listing.description}
                    </p>

                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <MetricCard
                        icon={Tag}
                        label="Category"
                        value={labelizeCategory(listing.category)}
                      />
                      <MetricCard
                        icon={Users}
                        label="Capacity"
                        value={`${listing.capacity} guests`}
                      />
                      <MetricCard
                        icon={Calendar}
                        label="Price"
                        value={formatCurrency(listing.price)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-4 text-[12px]">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Amenities</h4>
                    {listing.amenities.map((item) => (
                      <div key={item} className="text-muted-foreground">
                        ✓ {item}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">House rules</h4>
                    {listing.houseRules.map((item) => (
                      <div key={item} className="text-muted-foreground">
                        • {item}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Parking Instructions</h4>
                    {listing.parkingInstructions.map((item) => (
                      <div key={item} className="text-muted-foreground">
                        • {item}
                      </div>
                    ))}
                  </div>
                </div>

                <Card className="rounded-2xl border-border/60 shadow-none">
                  <CardContent className="p-4">
                    <div className="text-[12px] font-semibold text-foreground">Add-Ons</div>
                    <div className="mt-3 space-y-2">
                      {listing.addOns.map((addon) => (
                        <div
                          key={addon.id}
                          className="flex items-center justify-between gap-3 text-[12px]"
                        >
                          <div>
                            <div className="text-foreground">{addon.name}</div>
                            <div className="text-[11px] text-muted-foreground">
                              {addon.quantityLabel}
                            </div>
                          </div>
                          <div className="font-medium text-foreground">
                            {formatCurrency(addon.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {showReviewsTab ? (
                <TabsContent value="reviews">
                  <ListingReviewsPanel listing={listing} />
                </TabsContent>
              ) : null}
            </Tabs>
          </div>

          <div className="border-t border-border/60 bg-muted/20 px-5 py-4">
            {listing.status === "pending" ? (
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onReject(listing)}
                  disabled={actionLoading !== null}
                  className={cn(
                    "h-10 rounded-full px-4 text-[13px] font-medium",
                    "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                  )}
                >
                  {actionLoading === "reject" ? "Rejecting..." : "Reject Listing"}
                </Button>
                <Button
                  type="button"
                  onClick={() => onApprove(listing)}
                  disabled={actionLoading !== null}
                  className="h-10 rounded-full bg-primary px-4 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {actionLoading === "approve" ? "Approving..." : "Approve Listing"}
                </Button>
              </div>
            ) : listing.status === "approved" ? (
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  onClick={() => onSuspend(listing)}
                  disabled={actionLoading !== null}
                  className={cn(
                    "h-10 rounded-full px-4 text-[13px] font-medium",
                    "bg-red-50 text-red-600 hover:bg-red-100"
                  )}
                >
                  {actionLoading === "suspend" ? "Suspending..." : "Suspend Listing"}
                </Button>
              </div>
            ) : listing.status === "suspended" ? (
              <div className="text-right text-[12px] text-muted-foreground">
                This listing is currently suspended.
              </div>
            ) : (
              <div className="text-right text-[12px] text-muted-foreground">
                This listing has been rejected.
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}