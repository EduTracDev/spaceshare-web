"use client";

import * as React from "react";
import { Check, Download, FilePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { UserAvatar } from "@/components/shared/Avatar";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { DISPUTE_STATUS_KEYS } from "@/features/disputes/types/dispute.types";
import type { Dispute } from "@/features/disputes/types/dispute.types";
import { useDisclosure } from "@/hooks/useDisclosure";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/utils/formatters";

interface DisputeDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dispute: Dispute | null;
  actionLoading?: boolean;
  onMarkAsResolved: (dispute: Dispute) => void;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      <div className="text-[13px] font-medium text-foreground/90">{value}</div>
    </div>
  );
}


function getRoleBadgeClass(role: "host" | "guest") {
  return role === "host" ? "text-primary bg-brand-50 border-brand-100" : "text-blue-700 bg-blue-50 border-blue-200";
}

function RaisedByPartyCard({
  fullName,
  email,
  avatarUrl,
  raisedByRole,
  reason,
}: {
  fullName: string;
  email: string;
  avatarUrl?: string;
  raisedByRole: "host" | "guest";
  reason: string;
}) {
  const roleLabel = raisedByRole === "host" ? "Host" : "Guest";
  const accentClass = getRoleBadgeClass(raisedByRole);

  return (
    <Card className="rounded-2xl border-border/60 shadow-none">
      <CardContent className="px-4 py-2 lg:py-1">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-semibold">Dispute Raised by</span>
            <Badge
              variant="outline"
              className={cn("rounded-full text-[10px] font-semibold", accentClass)}
            >
              {roleLabel}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <UserAvatar name={fullName} imageUrl={avatarUrl} size="lg" />
            <div className="min-w-0">
              <div className="text-[13.5px] font-semibold text-foreground">{fullName}</div>
              <div className="mt-0.5 truncate text-[12px] text-muted-foreground">
                {email}
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-[13px] tracking-tight">Dispute Reason</p>
            <p className="mt-1.5 text-[12.5px] leading-6 text-foreground/85">
              {reason}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


function CounterpartyPartyCard({
  fullName,
  email,
  avatarUrl,
  role,
}: {
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: "host" | "guest";
}) {
  const roleLabel = role === "host" ? "Host" : "Guest";
  const accentClass = getRoleBadgeClass(role);

  return (
    <Card className="rounded-2xl border-border/60 shadow-none">
      <CardContent className="px-4 py-2">
        <div className="space-y-4">
          <Badge
            variant="outline"
            className={cn("rounded-full text-[10px] font-semibold w-fit", accentClass)}
          >
            {roleLabel}
          </Badge>
          <div className="flex items-center gap-3">
            <UserAvatar name={fullName} imageUrl={avatarUrl} size="lg" />
            <div className="min-w-0">
              <div className="text-[13.5px] font-semibold text-foreground">{fullName}</div>
              <div className="mt-0.5 truncate text-[12px] text-muted-foreground">
                {email}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DisputeDetailsSheet({
  open,
  onOpenChange,
  dispute,
  actionLoading = false,
  onMarkAsResolved,
}: DisputeDetailsSheetProps) {
  const resolveDialog = useDisclosure();

  if (!dispute) return null;

  const isNew = dispute.status === "new";
 
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          showCloseButton={false}
          side="right"
          className="!max-w-[92vw] md:!max-w-[80vw] lg:!max-w-[40vw] min-h-full overflow-hidden rounded-lg md:rounded-l-3xl p-0 border-l outline-none focus:outline-none focus-visible:outline-none ring-0"
        >
          <div className="relative flex h-full flex-col">
            <div className="w-full flex items-center justify-end px-5 pt-5 sm:px-7 sm:pt-6">
              <SheetClose
                render={
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label="Close dispute details"
                    className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                  />
                }
              >
                <X size={18} strokeWidth={2.05} />
              </SheetClose>
            </div>
            <div className="px-6 sm:px-7 pt-4 pb-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[18px] font-bold tracking-tight text-foreground">
                    Dispute {dispute.disputeNumber}
                  </h2>
                  <StatusBadge status={DISPUTE_STATUS_KEYS[dispute.status]} size="sm" />
                </div>
                <div className="mt-4 text-[13px]">
                  <InfoRow label="Booking ID" value={`#${dispute.bookingNumber}`} />
                  <InfoRow
                    label="Date & Time"
                    value={formatDateTime(dispute.dateTimeFiled)}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 sm:px-7 pt-2 pb-4 space-y-4 overscroll-contain scrollbar-gutter-stable">
              {(() => {
                const raisedByIsHost = dispute.raisedBy === "host";
                const complainant = raisedByIsHost ? dispute.host : dispute.guest;
                const complainantRole: "host" | "guest" = raisedByIsHost ? "host" : "guest";
                const respondent = raisedByIsHost ? dispute.guest : dispute.host;
                const respondentRole: "host" | "guest" = raisedByIsHost ? "guest" : "host";

                return (
                  <>
                    <RaisedByPartyCard
                      fullName={complainant.fullName}
                      email={complainant.email}
                      avatarUrl={complainant.avatarUrl}
                      raisedByRole={complainantRole}
                      reason={dispute.reason}
                    />
              
                    {/* Evidence Card */}
                    {dispute.evidence.length ? (
                    <div className="p-4">
                      <h3 className="text-[13px] mb-3 font-semibold text-foreground">
                        Evidence
                      </h3>
                      <div className="space-y-2">
                        {dispute.evidence.map((file) => {
                          return (
                            <div
                              key={file.id}
                              className="flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                  <FilePlus size={17} />
                                </div>
                                <div className="min-w-0">
                                  <div className="truncate text-[13px] font-medium text-foreground">
                                    {file.name}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground">
                                    {file.sizeLabel}
                                  </div>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                aria-label="Download evidence"
                                className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0"
                                onClick={() => {
                                  if (typeof window === "undefined") return;
                                  window.location.href = file.downloadUrl;
                                }}
                              >
                                <Download size={14} />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    ) : null}

                    <CounterpartyPartyCard
                      fullName={respondent.fullName}
                      email={respondent.email}
                      avatarUrl={respondent.avatarUrl}
                      role={respondentRole}
                    />
                  </>
                );
              })()}
            </div>

            <div className="border-t border-border/60 bg-muted/20 px-6 py-4">
              {isNew ? (
                <div className="flex items-center justify-end">
                  <Button
                    type="button"
                    onClick={() => resolveDialog.open()}
                    disabled={actionLoading}
                    className="h-11 rounded-full bg-primary px-5 text-[13px] font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <Check size={14} className="mr-1.5" />
                    {actionLoading ? "Resolving..." : "Mark as Resolved"}
                  </Button>
                </div>
              ) : (
                <div className="text-right text-[12px] text-muted-foreground">
                  This dispute has already been resolved.
                </div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmationDialog
        open={resolveDialog.isOpen}
        onOpenChange={resolveDialog.toggle}
        tone="success"
        size="sm"
        title="Resolve Dispute"
        description="Confirm that this dispute has been reviewed and a final resolution has been reached. This action will close the dispute and notify the affected parties."
        confirmLabel="Mark as Resolved"
        cancelLabel="Cancel"
        confirmLoading={actionLoading}
        onConfirm={() => {
          resolveDialog.close();
          onMarkAsResolved(dispute);
        }}
      />
    </>
  );
}