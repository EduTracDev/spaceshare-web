"use client";

import * as React from "react";
import {
  Download,
  FileImage,
  FileText,
  Flag,
  MessageSquare,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
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

function PartyCard({
  raisedByRole,
  roleLabel,
  fullName,
  email,
  avatarUrl,
  isRaisedBy,
}: {
  raisedByRole: "host" | "guest";
  roleLabel: "Host" | "Guest";
  fullName: string;
  email: string;
  avatarUrl?: string;
  isRaisedBy: boolean;
}) {
  const accentClass =
    raisedByRole === "host"
      ? "text-primary bg-brand-50"
      : "text-blue-700 bg-blue-50";

  return (
    <Card className="rounded-2xl border-border/60 shadow-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <UserAvatar name={fullName} imageUrl={avatarUrl} size="lg" />
            <div className="min-w-0">
              <div className="text-[13.5px] font-semibold text-foreground">{fullName}</div>
              <div className="mt-0.5 truncate text-[12px] text-muted-foreground">
                {email}
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn("rounded-full text-[10px] font-semibold", accentClass)}
          >
            {roleLabel}
          </Badge>
        </div>

        {isRaisedBy ? (
          <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50/40 px-3 py-2.5 text-[11px] font-semibold text-primary">
            <span className="inline-flex items-center gap-1.5">
              <Flag size={11} />
              Dispute Raised by {roleLabel}
            </span>
          </div>
        ) : null}
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
          className="sm:max-w-[560px] min-h-full overflow-hidden rounded-l-3xl p-0 border-l"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[18px] font-bold tracking-tight text-foreground">
                    Dispute {dispute.disputeNumber}
                  </h2>
                  <StatusBadge status={DISPUTE_STATUS_KEYS[dispute.status]} size="sm" />
                </div>
                <div className="mt-4 border-b border-border/50 text-[13px]">
                  <InfoRow label="Booking ID" value={`#${dispute.bookingNumber}`} />
                  <InfoRow
                    label="Date & Time"
                    value={formatDateTime(dispute.dateTimeFiled)}
                  />
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

            <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4">
              <PartyCard
                raisedByRole="host"
                roleLabel="Host"
                fullName={dispute.host.fullName}
                email={dispute.host.email}
                avatarUrl={dispute.host.avatarUrl}
                isRaisedBy={dispute.raisedBy === "host"}
              />

              <Card className="rounded-2xl border-border/60 shadow-none">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                    <MessageSquare size={14} className="text-primary" />
                    Dispute Reason
                  </div>
                  <p className="rounded-xl border border-border/60 bg-muted/30 px-3.5 py-3 text-[12.5px] leading-6 text-foreground/85">
                    {dispute.reason}
                  </p>
                </CardContent>
              </Card>

              {dispute.evidence.length ? (
                <Card className="rounded-2xl border-border/60 shadow-none">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                      <ShieldCheck size={14} className="text-primary" />
                      Evidence
                    </div>
                    <div className="space-y-2">
                      {dispute.evidence.map((file) => {
                        const FileIcon = file.kind === "document" ? FileText : FileImage;
                        return (
                          <div
                            key={file.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3.5 py-3"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <FileIcon size={17} />
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
                  </CardContent>
                </Card>
              ) : null}

              <PartyCard
                raisedByRole="guest"
                roleLabel="Guest"
                fullName={dispute.guest.fullName}
                email={dispute.guest.email}
                avatarUrl={dispute.guest.avatarUrl}
                isRaisedBy={dispute.raisedBy === "guest"}
              />
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
                    <UserRound size={14} className="mr-1.5" />
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