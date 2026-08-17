"use client";

import * as React from "react";
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
      />

      <div className="flex flex-col md:gap-5 bg-card">
        <ProfileSettingsCard />

        <div className="grid grid-cols-1 md:gap-5 lg:grid-cols-2">
          <PasswordSettingsCard />
          <CommissionSettingsCard />
        </div>
      </div>
    </div>
  );
}