"use client";

import * as React from "react";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import type { AnyUser } from "@/features/users/types/user.types";

interface SuspendUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AnyUser | null;
  onConfirm: (user: AnyUser) => void | Promise<void>;
  loading?: boolean;
}

export function SuspendUserDialog({
  open,
  onOpenChange,
  user,
  onConfirm,
  loading,
}: SuspendUserDialogProps) {
  if (!user) return null;

  return (
    <ConfirmationDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Suspend User"
      description={`${user.fullName} will lose access to their account and will not be able to create bookings, manage listings, or access SpaceShare until their account is reactivated.`}
      tone="danger"
      size="md"
      confirmLabel="Suspend User"
      cancelLabel="Cancel"
      confirmLoading={loading}
      onConfirm={() => onConfirm(user)}
    />
  );
}