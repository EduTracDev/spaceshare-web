"use client";

import * as React from "react";
import {
  Calendar,
  Check,
  MapPin,
  PartyPopper,
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
  onApprove: () => void;
  onReject: () => void;
  onSuspend: () => void;
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
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  // Reset tab + selected large image whenever user opens a DIFFERENT listing
  React.useEffect(() => {
    setActiveTab("details");
    setSelectedImageIndex(0);
  }, [listing?.id, listing?.status]);

  if (!listing) return null;
  const listReviews = listing?.reviews ?? []
  const showReviewsTab = (listing.status === "approved" || listing.status === "suspended") && listReviews.length > 0;

  return (
    <div className="">
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full !max-w-[90vw] sm:!max-w-[820px] md:!max-w-[70vw] lg:!max-w-[60vw] rounded-l-2xl pt-10 outline-none focus:outline-none focus-visible:outline-none ring-0">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-4 overscroll-contain scrollbar-gutter-stable">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-4">
                { showReviewsTab ? (
                  <TabsList className="!h-12 rounded-full bg-muted/90">
                    <TabsTrigger
                      value="details"
                      className="rounded px-4 text-[12px] font-bold data-active:bg-primary data-active:text-white">
                      Space Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="rounded px-4 text-[12px] font-bold data-active:bg-primary data-active:text-white">
                      Reviews
                    </TabsTrigger>
                  </TabsList>
                ) : null}
                <SheetHeader className="px-5 pt-5 pb-4">
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
                  </div>
                </SheetHeader>
                <TabsContent value="details" className="space-y-5">
                  <div className="space-y-4">
                    <StatusBadge status={listing.status} size="sm" />
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground mb-5">
                      <span className="font-semibold text-[21px] leading-none tracking-tight text-foreground">
                        {listing.spaceName}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={12} />
                        {listing.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={12} />
                        {formatDateTime(listing.submittedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-[1fr_40%] gap-3">
                    <div className="overflow-hidden rounded-2xl border border-border/60">
                      <img
                        src={listing.gallery[selectedImageIndex] ?? listing.gallery[0]}
                        alt={`${listing.spaceName} preview`}
                        className="h-[194px] w-full object-cover"
                      />
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                      {listing.gallery.map((image, index) => {
                        const isSelected = selectedImageIndex === index;
                        return (
                          <button
                            type="button"
                            key={`${image}-${index}`}
                            onClick={() => setSelectedImageIndex(index)}
                            aria-label={`View photo ${index + 1} of ${listing.spaceName} large`}
                            aria-pressed={isSelected}
                            className={cn(
                              "group block overflow-hidden rounded-lg border transition-all",
                              isSelected
                                ? "ring-2 ring-primary/70 ring-offset-1 shadow-sm scale-[1.01]"
                                : "hover:border-primary/60 hover:ring-1 hover:ring-primary/40"
                            )}
                          >
                            <img
                              src={image}
                              alt={`${listing.spaceName} thumbnail ${index + 1}`}
                              loading="lazy"
                              className={cn(
                                "h-full w-full object-cover transition-all duration-200",
                                isSelected ? "opacity-100" : "opacity-95 group-hover:opacity-100"
                              )}
                            />
                          </button>
                        );
                      })}
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
                  <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                    {/* ROW 1: AMENITIES — full width, internal 3-column grid with check icons */}
                    <div className="space-y-3 px-5 pt-5 pb-4">
                      <h4 className="text-[13px] font-bold tracking-tight text-foreground">
                        Amenities
                      </h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 md:grid-cols-3">
                        {listing.amenities.map((item) => (
                          <div
                            key={item}
                            className="inline-flex items-center gap-2 text-[13px] font-medium text-foreground/80"
                          >
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center text-primary">
                              <Check size={14} strokeWidth={2.75} />
                            </span>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DIVIDER between amenity row top / house+parking row bottom */}
                    <div className="border-t border-border/60" />

                    {/* ROW 2: HOUSE RULES LEFT + PARKING INSTRUCTIONS RIGHT, with a vertical divider down the middle */}
                    <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
                      <div className="space-y-3 px-5 py-5">
                        <h4 className="text-[13px] font-bold tracking-tight text-foreground">
                          House rules
                        </h4>
                        <ul className="space-y-2.5">
                          {listing.houseRules.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-[13px] leading-5 text-foreground/80"
                            >
                              <span className="mt-[7px] block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/45" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Vertical divider — ONLY visible on md+ screens (when cols side-by-side) */}
                      <div className="hidden md:block relative">
                        <div className="absolute inset-y-5 left-0 w-px bg-border/70" />
                      </div>

                      <div className="space-y-3 border-t border-border/60 px-5 py-5 md:border-t-0 md:pl-5">
                        <h4 className="text-[13px] font-bold tracking-tight text-foreground">
                          Parking Instructions
                        </h4>
                        <ul className="space-y-2.5">
                          {listing.parkingInstructions.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-[13px] leading-5 text-foreground/80"
                            >
                              <span className="mt-[7px] block h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/45" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 px-2 pt-2">
                    <div className="flex items-center gap-2">
                      <PartyPopper size={22} strokeWidth={2} className="text-foreground/80" />
                      <h3 className="text-[17px] font-bold tracking-tight text-foreground">
                        Add-Ons
                      </h3>
                    </div>

                    <div className="space-y-0">
                      {listing.addOns.map((addon, idx) => (
                        <div key={addon.id}>
                          {idx > 0 ? (
                            <div className="my-2" />
                          ) : null}
                          <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0 flex items-center gap-3 text-[13px] text-foreground/80">
                              <span className="truncate font-medium">
                                {addon.name}
                              </span>
                              <span
                                aria-hidden
                                className="block h-1 w-1 shrink-0 rounded-full bg-muted-foreground/55"
                              />
                              <span>
                                {addon.quantityLabel}
                              </span>
                            </div>
                            <div className="shrink-0 text-[15.5px] font-semibold tracking-tight text-foreground/90">
                              {formatCurrency(addon.price)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                    onClick={() => onReject()}
                    disabled={actionLoading !== null}
                    className={cn(
                      "h-10 rounded-full px-4 text-[13px] font-bold py-5",
                      "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                    )}
                  >
                    {actionLoading === "reject" ? "Rejecting..." : "Reject Listing"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => onApprove()}
                    disabled={actionLoading !== null}
                    className="h-10 rounded-full bg-primary px-4 py-5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    {actionLoading === "approve" ? "Approving..." : "Approve Listing"}
                  </Button>
                </div>
              ) : listing.status === "approved" ? (
                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    onClick={() => onSuspend()}
                    disabled={actionLoading !== null}
                    className={cn(
                      "h-10 rounded-full px-4 py-5 text-[13px] font-medium",
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
    </div>
  );
}