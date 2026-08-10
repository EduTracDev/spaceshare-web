"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileSettingsCard } from "@/features/settings/components/ProfileSettingsCard";
import { PasswordSettingsCard } from "@/features/settings/components/PasswordSettingsCard";
import { CommissionSettingsCard } from "@/features/settings/components/CommissionSettingsCard";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader bleed
        title="Settings"
        subtitle="Manage your account and platform commission."
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

      <div className="flex flex-col gap-5">
        <ProfileSettingsCard />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <PasswordSettingsCard />
          <CommissionSettingsCard />
        </div>
      </div>
    </div>
  );
}