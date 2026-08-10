import type {
  AdminProfile,
  PlatformCommission,
} from "@/features/settings/types/settings.types";

export const MOCK_ADMIN_PROFILE: AdminProfile = {
  fullName: "Oloruntomi Dosunmu",
  email: "admin@spaceshare.com",
};

export const MOCK_PLATFORM_COMMISSION: PlatformCommission = {
  hostCommissionPercent: 10,
  guestProcessingFeePercent: 5,
};

/**
 * Password the mock backend validates against. Used inside settings service when
 * updatePassword is called. Changing the current password will return
 * anything else throws a "current-password-mismatch" error.
 */
export const MOCK_CURRENT_ADMIN_PASSWORD = "AdminPass123!";