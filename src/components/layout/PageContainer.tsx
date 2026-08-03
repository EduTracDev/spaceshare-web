import * as React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
  paddingY?: "none" | "sm" | "md" | "lg";
}

const MAX_WIDTH_MAP = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-screen-2xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
} as const;

const PADDING_Y_MAP = {
  none: "py-0",
  sm: "py-4",
  md: "py-6",
  lg: "py-8",
} as const;

export function PageContainer({
  children,
  maxWidth = "7xl",
  paddingY = "lg",
  className,
  ...props
}: PageContainerProps) {
  return (
    <div
      data-slot="page-container"
      className={cn(
        "w-full mx-auto px-4 sm:px-6 lg:px-8",
        MAX_WIDTH_MAP[maxWidth],
        PADDING_Y_MAP[paddingY],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}