import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Copy } from "lucide-react";

export function InfoRow({
  icon: Icon,
  label,
  value,
  copyable,
}: {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: React.ReactNode;
  copyable?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    if (!copyable) return;
    navigator.clipboard?.writeText(copyable);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="gap-3 mb-4">
      <div className="flex items-center justify-between gap-3 min-w-0">
        <div className="text-muted-foreground flex items-center gap-2">
          <span className="hidden md:inline">{Icon ? <Icon size={15} /> : null}</span>
          <span className="text-[12px] font-medium text-muted-foreground tracking-wide">{label}</span>
        </div>
        <div className="flex items-center justify-end min-w-0">
          <span className="text-[13.5px] font-medium text-foreground mt-0.5 truncate">{value}</span>
          {copyable ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={handleCopy}
              aria-label="Copy"
              className={cn(
                "rounded-lg text-muted-foreground",
                copied ? "text-green-600 bg-green-50" : "hover:text-primary hover:bg-primary/10"
              )}
            >
              {copied ? <BadgeCheck size={13} /> : <Copy size={13} />}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}