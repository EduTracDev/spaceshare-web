import * as React from "react";
import { cn } from "@/lib/utils";
import { getInitials } from "@/utils/formatters";
import type { StatusKey } from "@/constants/status";
import { Avatar as AvatarPrimitive } from "@/components/ui/avatar";

export interface UserAvatarProps extends Omit<React.ComponentPropsWithoutRef<typeof AvatarPrimitive>, "children" | "size"> {
  name: string;
  imageUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  status?: StatusKey | "offline" | null;
  className?: string;
}

const SIZE_MAP = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
} as const;

const STATUS_DOT_SIZE = {
  xs: "h-1.5 w-1.5 ring-1",
  sm: "h-2 w-2 ring-2",
  md: "h-2.5 w-2.5 ring-2",
  lg: "h-3 w-3 ring-2",
  xl: "h-4 w-4 ring-[3px]",
} as const;

const STATUS_DOT_COLOR = {
  active: "bg-green-500",
  pending: "bg-amber-500",
  suspended: "bg-red-500",
  approved: "bg-green-500",
  completed: "bg-green-500",
  paid: "bg-green-500",
  resolved: "bg-emerald-500",
  in_progress: "bg-indigo-500",
  open: "bg-orange-500",
  upcoming: "bg-blue-500",
  ongoing: "bg-indigo-500",
  offline: "bg-gray-400",
  pending_invite: "bg-purple-500",
  cancelled: "bg-gray-400",
  rejected: "bg-red-500",
  failed: "bg-red-500",
  hidden: "bg-gray-400",
} as const;

export function UserAvatar({
  name,
  imageUrl,
  size = "md",
  status,
  className,
  ...props
}: UserAvatarProps) {
  const initials = getInitials(name);
  const statusDotColor = status ? STATUS_DOT_COLOR[status] : null;

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      <AvatarPrimitive
        className={cn(
          "rounded-full bg-primary/10 text-primary font-semibold ring-2 ring-background",
          SIZE_MAP[size]
        )}
        {...props}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) :
        <span aria-hidden className="flex h-full w-full items-center justify-center">
          {initials}
        </span>}

      </AvatarPrimitive>
      {status && statusDotColor ? (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full ring-background",
            STATUS_DOT_SIZE[size],
            statusDotColor
          )}
        />
      ) : null}
    </div>
  );
}