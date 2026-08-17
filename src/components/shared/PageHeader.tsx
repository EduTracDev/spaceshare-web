"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { DesktopBell } from "@/features/notifications/providers/NotificationDrawerProvider";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Right-slot: pass page-specific buttons (e.g. Export, New Item). The notification bell is rendered automatically (opt out with hideNotificationBell). */
  actions?: React.ReactNode;
  /** Set true to hide the default desktop notification bell for this page. */
  hideNotificationBell?: boolean;
  backHref?: string;
  backLabel?: string;
  /**
   * When true, pulls the header flush with the sidebar + top edge,
   * negating the horizontal/top padding applied by the outer PageContainer.
   * The header's own internal text padding remains unchanged.
   * Use this on every dashboard page inside `(dashboard)`.
   */
  bleed?: boolean;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  hideNotificationBell = false,
  backHref,
  backLabel = "Back",
  bleed = false,
  className,
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "sticky top-0 left-0 right-0 flex h-22 md:h-20 flex-col gap-4 border-b border-sidebar bg-background py-8 lg:py-4 sm:flex-row sm:items-start sm:justify-between z-30",
        // Internal padding (applied only to text/action insides of header)
        "px-4 sm:px-6 lg:px-8 xl:px-12",
        bleed && [
          // Pull flush with outer PageContainer edges:
          //   matches PageContainer.tsx line 38: `px-4 sm:px-6 lg:px-8`
          "lg:-mx-8",
          // Pull flush with top of main (aligns header top with sidebar logo top):
          //   matches layout.tsx `paddingY="md"` → `py-6` per PADDING_Y_MAP
          "",
        ],
        className
      )}
    >
      <div className="flex flex-col justify-center h-full">
        {backHref ? (
          <Link
            href={backHref}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft size={14} />
            {backLabel}
          </Link>
        ) : null}
        <h1 className="text-[22px] font-bold text-foreground text-left tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed max-w-2xl text-left">
            {subtitle}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2.5 shrink-0 flex-wrap h-full">
        {actions ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            {actions}
          </div>
        ) : null}
        {!hideNotificationBell ? <DesktopBell /> : null}
      </div>
    </div>
  );
}