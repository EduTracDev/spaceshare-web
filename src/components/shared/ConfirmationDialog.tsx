"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ConfirmDialogTone = "default" | "danger" | "success" | "warning";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  tone?: ConfirmDialogTone;
  confirmLoading?: boolean;
  icon?: LucideIcon;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  confirmDisabled?: boolean;
}

const TONE_CONFIG: Record<
  ConfirmDialogTone,
  { icon: LucideIcon; iconClass: string; confirmClass: string }
> = {
  default: {
    icon: Info,
    iconClass: "bg-primary/10 text-primary",
    confirmClass:
      "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "bg-green-50 text-green-700",
    confirmClass: "bg-green-600 hover:bg-green-700 text-white",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "bg-amber-50 text-amber-700",
    confirmClass: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  danger: {
    icon: Trash2,
    iconClass: "bg-red-50 text-red-600",
    confirmClass:
      "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  },
};

const SIZE_CLASS = {
  sm: "sm:max-w-[400px]",
  md: "sm:max-w-[520px]",
  lg: "sm:max-w-[640px]",
} as const;

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  tone = "default",
  confirmLoading,
  icon: customIcon,
  children,
  footer,
  size = "md",
  confirmDisabled,
}: ConfirmationDialogProps) {
  const config = TONE_CONFIG[tone];
  const Icon = customIcon ?? config.icon;

  const handleCancel = React.useCallback(() => {
    onCancel?.();
    onOpenChange(false);
  }, [onCancel, onOpenChange]);

  const handleConfirm = React.useCallback(async () => {
    if (!onConfirm) {
      onOpenChange(false);
      return;
    }
    await onConfirm();
  }, [onConfirm, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn("rounded-2xl p-3 overflow-hidden", SIZE_CLASS[size])}
      >
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "h-11 w-11 shrink-0 rounded-xl flex items-center justify-center",
                config.iconClass
              )}
            >
              <Icon size={20} strokeWidth={1.9} />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg font-semibold leading-tight">
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription className="mt-1.5 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {description}
                </DialogDescription>
              ) : null}
            </div>
          </div>
        </DialogHeader>

        {children ? (
          <div className="px-6 py-5 space-y-4">{children}</div>
        ) : null}

        <DialogFooter className="px-6 py-4 border-t border-border/60 bg-muted/20 sm:justify-end flex-col-reverse sm:flex-row sm:space-x-2">
          {footer ?? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={confirmLoading}
                className="h-9 rounded-xl px-4 border-border"
              >
                {cancelLabel}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirm}
                disabled={confirmLoading || confirmDisabled}
                className={cn(
                  "h-9 rounded-xl px-4 gap-1.5",
                  config.confirmClass,
                  confirmDisabled && "opacity-50 pointer-events-none"
                )}
              >
                {confirmLoading ? (
                  <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                ) : null}
                {confirmLabel}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}