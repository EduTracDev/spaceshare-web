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
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  backHref,
  backLabel = "Back",
  className,
}: PageHeaderProps) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6 sm:mb-7 border-b border-sidebar",
        className
      )}
    >
      <div className="flex flex-col">
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
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {actions}
        </div>
      ) : null}
    </div>
  );
}