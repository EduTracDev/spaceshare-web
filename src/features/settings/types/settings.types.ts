export interface AdminProfile {
  fullName: string;
  email: string;
}

export interface PlatformCommission {
  hostCommissionPercent: number;
  guestProcessingFeePercent: number;
}

export interface PasswordChangePayload {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordCheckCurrentPasswordError extends Error {
  kind: "current-password-mismatch";
}