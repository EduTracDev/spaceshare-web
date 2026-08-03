import { Search, Activity, Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type EmptyIconVariant = "default" | "chart" | "users" | "listings" | "bookings";

const ICON_MAP: Record<EmptyIconVariant, LucideIcon> = {
  default: Inbox,
  chart: Activity,
  users: Search,
  listings: Search,
  bookings: Search,
};

interface EmptyStateProps {
  title: string;
  description?: string;
  variant?: EmptyIconVariant;
  action?:
    | { label: string; onClick: () => void }
    | { label: string; href: string };
  secondaryAction?:
    | { label: string; onClick: () => void }
    | { label: string; href: string };
  compact?: boolean;
  className?: string;
}

function Sparkles({ color = "var(--color-brand-300)" }: { color?: string }) {
  const dots = [
    { top: "15%", left: "20%", size: 4 },
    { top: "10%", right: "18%", size: 6 },
    { top: "30%", left: "8%", size: 3 },
    { top: "55%", left: "12%", size: 5 },
    { bottom: "22%", right: "10%", size: 4 },
    { bottom: "12%", left: "30%", size: 3 },
    { top: "45%", right: "6%", size: 3 },
  ];
  return (
    <>
      {dots.map((d, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute rounded-full opacity-70"
          style={{
            top: d.top,
            left: "left" in d ? (d as any).left : undefined,
            right: "right" in d ? (d as any).right : undefined,
            bottom: "bottom" in d ? (d as any).bottom : undefined,
            width: d.size,
            height: d.size,
            background: color,
          }}
        />
      ))}
    </>
  );
}

export function EmptyState({
  title,
  description,
  variant = "default",
  action,
  secondaryAction,
  compact = false,
  className,
}: EmptyStateProps) {
  const Icon = variant === "chart" ? Activity : Search;
  const showIconBg =
    variant === "chart" ||
    variant === "users" ||
    variant === "listings" ||
    variant === "bookings";

  return (
    <div
      role="status"
      aria-label="Empty state"
      className={cn(
        "w-full flex flex-col items-center justify-center text-center",
        compact ? "py-8 px-4" : "py-12 px-6",
        className
      )}
    >
      {showIconBg ? (
        <div className="relative mb-5">
          {/* Purple circular icon wrapper */}
          <div className="relative h-20 w-20 rounded-full bg-brand-200/70 flex items-center justify-center">
            <div className="absolute inset-2 rounded-full bg-primary/20" />
            <div className="relative h-12 w-12 rounded-full bg-primary/30 text-primary flex items-center justify-center">
              <Icon size={22} strokeWidth={2} />
            </div>
            {/* Magnifying glass badge overlap */}
            {variant !== "default" ? (
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-brand-100 text-primary flex items-center justify-center ring-4 ring-white">
                <Search size={14} strokeWidth={2.2} />
              </div>
            ) : null}
            <Sparkles />
          </div>
        </div>
      ) : (
        <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
          <ICON_MAP.default size={28} />
        </div>
      )}

      <h3 className="text-[15px] font-semibold text-foreground mb-1.5">
        {title}
      </h3>
      {description ? (
        <p className="text-[13px] text-muted-foreground leading-relaxed max-w-sm mb-6">
          {description}
        </p>
      ) : null}

      {action || secondaryAction ? (
        <div className="flex items-center gap-2">
          {action ? (
            "href" in action ? (
              <a
                href={action.href}
                className={cn(
                  "inline-flex items-center justify-center h-9 rounded-xl px-4 text-sm font-medium transition-colors",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-50"
                )}
              >
                {action.label}
              </a>
            ) : (
              <Button
                size="sm"
                onClick={action.onClick}
                className="h-9 rounded-xl px-4"
              >
                {action.label}
              </Button>
            )
          ) : null}
          {secondaryAction ? (
            "href" in secondaryAction ? (
              <a
                href={secondaryAction.href}
                className={cn(
                  "inline-flex items-center justify-center h-9 rounded-xl px-4 text-sm font-medium transition-colors",
                  "border border-border bg-background hover:bg-muted hover:text-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:pointer-events-none disabled:opacity-50"
                )}
              >
                {secondaryAction.label}
              </a>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={secondaryAction.onClick}
                className="h-9 rounded-xl px-4"
              >
                {secondaryAction.label}
              </Button>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  );
}