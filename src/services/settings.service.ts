import type {
  AdminProfile,
  PlatformCommission,
} from "@/features/settings/types/settings.types";
import { api } from "@/lib/api";

/**
 * Shape of the consolidated GET /api/admin/settings response data.
 * Returned by settingsService.getAllSettings() for the page mount load.
 */
export interface AdminSettingsBundle {
  profile: AdminProfile;
  commission: PlatformCommission;
}

function extractErrorMessage(error: any): string {
  if (
    error?.response?.data?.message &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }
  if (typeof error?.message === "string") return error.message;
  return "Request failed. Please try again.";
}

/**
 * Deduplicate concurrent GET /settings calls on the same tick.
 * Without this, both the Profile + Commission cards fire useQuery in the
 * same render pass → two separate network requests. With this guard both
 * awaiters share the same promise → exactly 1 RTT, 1 network call.
 *
 * Cleared when the promise settles so the next read cycle gets fresh data.
 */
let inFlightBundle: Promise<AdminSettingsBundle> | null = null;

function unwrapSettingsBundle(envelope: any): AdminSettingsBundle {
  const data = envelope.data ?? envelope;
  const profile = data.profile ?? envelope.profile;
  const commission = data.commission ?? envelope.commission;
  return {
    profile: {
      fullName: String(profile?.fullName ?? ""),
      email: String(profile?.email ?? ""),
    },
    commission: {
      hostCommissionPercent: Number(
        commission?.hostCommissionPercent ?? 0
      ),
      guestProcessingFeePercent: Number(
        commission?.guestProcessingFeePercent ?? 0
      ),
    },
  };
}

export const settingsService = {
  /**
   * GET /api/admin/settings
   * Consolidated page-load read: returns BOTH admin profile + platform
   * commission in one envelope. Deduplicated so concurrent callers share.
   */
  async getAllSettings(): Promise<AdminSettingsBundle> {
    if (inFlightBundle) return inFlightBundle;
    inFlightBundle = (async () => {
      try {
        const res = await api.get("/settings");
        return unwrapSettingsBundle(res.data);
      } finally {
        inFlightBundle = null;
      }
    })();
    return inFlightBundle;
  },

  /**
   * GET /api/admin/settings → extracts just { fullName, email }.
   * Shares the same in-flight bundle as getPlatformCommission(). Exactly
   * one network request when both cards mount together.
   */
  async getProfile(): Promise<AdminProfile> {
    const bundle = await settingsService.getAllSettings();
    return bundle.profile;
  },

  /**
   * PATCH /api/admin/settings/profile  Body: { fullName }
   */
  async updateProfile(input: {
    fullName: string;
  }): Promise<{ message: string }> {
    try {
      const res = await api.patch("/settings/profile", {
        fullName: input.fullName.trim(),
      });
      const envelope = res.data;
      return {
        message:
          envelope.message ??
          envelope.data?.message ??
          "Profile updated successfully",
      };
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * GET /api/admin/settings → extracts just the commission shape.
   * Shares the same in-flight bundle as getProfile(). Exactly one RTT when
   * both useQueries fire concurrently on page mount.
   */
  async getPlatformCommission(): Promise<PlatformCommission> {
    const bundle = await settingsService.getAllSettings();
    return bundle.commission;
  },

  /**
   * PATCH /api/admin/settings/commission
   * Body: { hostCommissionPercent, guestProcessingFeePercent }
   */
  async updatePlatformCommission(input: PlatformCommission): Promise<{
    message: string;
  }> {
    try {
      const res = await api.patch("/settings/commission", {
        hostCommissionPercent: Number(input.hostCommissionPercent),
        guestProcessingFeePercent: Number(input.guestProcessingFeePercent),
      });
      const envelope = res.data;
      return {
        message:
          envelope.message ??
          envelope.data?.message ??
          "Commission settings updated successfully",
      };
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },


  async changePassword(input: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    try {
      const res = await api.post("/auth/change-password", {
        currentPassword: input.currentPassword,
        newPassword: input.newPassword,
      });
      const envelope = res.data;
      return {
        message:
          envelope.message ??
          envelope.data?.message ??
          "Password updated successfully",
      };
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : undefined;
      const extracted = extractErrorMessage(error);

      const err = new Error(backendMessage ?? extracted);
      if (error?.response?.data?.kind) {
        // Forward discriminant: "current-password-mismatch"
        (err as any).kind = error.response.data.kind;
      }
      throw err;
    }
  },
};