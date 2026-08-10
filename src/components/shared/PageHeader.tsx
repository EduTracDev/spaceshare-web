import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Right-slot: pass bell icon + export/print buttons or any actions */
  actions?: React.ReactNode;
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
  backHref,
  backLabel = "Back",
  bleed = false,
  className,
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "flex h-20 flex-col gap-4 border-b border-sidebar bg-background py-4 sm:flex-row sm:items-start sm:justify-between",
        // Internal padding (applied only to text/action insides of header)
        "px-4 sm:px-6 lg:px-8 xl:px-12",
        bleed && [
          // Pull flush with outer PageContainer edges:
          //   matches PageContainer.tsx line 38: `px-4 sm:px-6 lg:px-8`
          "-mx-4 sm:-mx-6 lg:-mx-8",
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
        <h1 className="text-[22px] font-bold text-foreground tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap h-full">
          {actions}
        </div>
      ) : null}
    </div>
  );
}