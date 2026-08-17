"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { AuditLogsManagementTable } from "@/features/audit-logs/components/AuditLogsManagementTable";

export default function AuditLogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader bleed
        title="Audit Logs"
        subtitle="Monitor and track all system actions and updates"
      />

      <AuditLogsManagementTable />
    </div>
  );
}