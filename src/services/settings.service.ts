import {
  MOCK_ADMIN_PROFILE,
  MOCK_CURRENT_ADMIN_PASSWORD,
  MOCK_PLATFORM_COMMISSION,
} from "@/mocks/settings.mock";
import type {
  AdminProfile,
  PlatformCommission,
} from "@/features/settings/types/settings.types";

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

let profileDb: AdminProfile = JSON.parse(
  JSON.stringify(MOCK_ADMIN_PROFILE)
) as AdminProfile;

let commissionDb: PlatformCommission = JSON.parse(
  JSON.stringify(MOCK_PLATFORM_COMMISSION)
) as PlatformCommission;

export const settingsService = {
  async getProfile(): Promise<AdminProfile> {
    await wait(250);
    return JSON.parse(JSON.stringify(profileDb)) as AdminProfile;
  },

  async updateProfile(input: { fullName: string }): Promise<{ message: string }> {
    await wait(500);
    profileDb = {
      ...profileDb,
      fullName: input.fullName.trim(),
    };
    return {
      message: "Profile updated successfully",
    };
  },

  async getPlatformCommission(): Promise<PlatformCommission> {
    await wait(250);
    return JSON.parse(JSON.stringify(commissionDb)) as PlatformCommission;
  },

  async updatePlatformCommission(input: PlatformCommission): Promise<{
    message: string;
  }> {
    await wait(500);
    commissionDb = {
      hostCommissionPercent: input.hostCommissionPercent,
      guestProcessingFeePercent: input.guestProcessingFeePercent,
    };
    return {
      message: "Commission settings updated successfully",
    };
  },

  async changePassword(input: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    await wait(650);

    if (input.currentPassword !== MOCK_CURRENT_ADMIN_PASSWORD) {
      const error = new Error("Input the correct password");
      error.name = "CurrentPasswordMismatchError";
      throw error;
    }

    return {
      message: "Password updated successfully",
    };
  },
};