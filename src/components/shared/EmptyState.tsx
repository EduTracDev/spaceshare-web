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
        <div className="relative mb-8 mt-2">
          {/* Purple circular icon wrapper */}
          <svg
            width="150"
            height="115"
            viewBox="0 0 240 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background blobs */}
            <ellipse
              cx="80"
              cy="105"
              rx="55"
              ry="35"
              fill="#F5F3FA"
            />

            <ellipse
              cx="165"
              cy="120"
              rx="55"
              ry="35"
              fill="#F5F3FA"
            />

            {/* Main circle */}
            <circle
              cx="120"
              cy="90"
              r="56"
              fill="#C5A5FA"
            />

            {/* Magnifying glass handle */}
            <path
              d="M160 130L185 155"
              stroke="#B28AF7"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Pulse line */}
            <path
              d="M82 91H105L114 77L128 108L140 91H158"
              stroke="white"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Decorative dots */}
            <circle cx="65" cy="45" r="5" fill="#D9DDE5" />
            <circle cx="55" cy="125" r="6" fill="#B58AF7" />
            <circle cx="190" cy="50" r="7" fill="#B58AF7" />
            <circle cx="210" cy="105" r="4" fill="#D9DDE5" />
            <circle cx="115" cy="155" r="6" fill="#B58AF7" />
            <circle cx="205" cy="75" r="3" fill="#B58AF7" />
          </svg>
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