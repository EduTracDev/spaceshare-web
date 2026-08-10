"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { AuditLogsManagementTable } from "@/features/audit-logs/components/AuditLogsManagementTable";

export default function AuditLogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader bleed
        title="Audit Logs"
        subtitle="Monitor and track all system actions and updates"
        actions={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Notifications"
            className="relative h-9 w-9 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground shrink-0"
          >
            <Bell size={17} />
          </Button>
        }
      />

      <AuditLogsManagementTable />
    </div>
  );
}