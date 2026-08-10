"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps extends Omit<React.ComponentProps<"input">, "onChange" | "size" | "value"> {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  onClear?: () => void;
  placeholder?: string;
  wrapperClassName?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: "h-9 text-xs pl-9 pr-9",
  md: "h-11 text-sm pl-10 pr-10",
  lg: "h-12 text-sm pl-11 pr-11",
} as const;

export function SearchBar({
  value,
  onChange,
  debounceMs = 300,
  onClear,
  placeholder = "Search…",
  wrapperClassName,
  size = "md",
  className,
  id = "search-input",
  ...props
}: SearchBarProps) {
  const [local, setLocal] = React.useState(value);

  React.useEffect(() => {
    if (value !== local) setLocal(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  React.useEffect(() => {
    if (!debounceMs) {
      onChange(local);
      return;
    }
    const t = window.setTimeout(() => onChange(local), debounceMs);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local, debounceMs]);

  const clear = React.useCallback(() => {
    setLocal("");
    onClear?.();
  }, [onClear]);

  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <Search
        size={size === "sm" ? 14 : 16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
      />
      <Input
        id={id}
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "rounded-xl border-border bg-muted/30 placeholder:text-muted-foreground focus-visible:bg-background",
          SIZE_MAP[size],
          className
        )}
        {...props}
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Clear search"
          onClick={clear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
        >
          <X size={size === "sm" ? 12 : 14} />
        </Button>
      ) : null}
    </div>
  );
}