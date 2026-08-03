import type {
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
} from "@/features/auth/types/auth.types";
import { MOCK_ADMIN_USER, MOCK_AUTH_TOKENS } from "@/mocks/auth.mock";

const delay = <T>(data: T, ms = 600): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    // Simulate email/password validation
    if (!payload.email || !payload.password) {
      throw new Error("Invalid credentials");
    }
    await delay(null);
    return {
      user: { ...MOCK_ADMIN_USER, email: payload.email },
      tokens: MOCK_AUTH_TOKENS,
    };
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<{ success: boolean; message: string }> {
    if (!payload.email) {
      throw new Error("Email is required");
    }
    await delay(null);
    return {
      success: true,
      message: `A reset link has been sent to ${payload.email}. It will expire in 15 minutes.`,
    };
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> {
    if (!payload.token || !payload.password) {
      throw new Error("Invalid password reset request");
    }
    await delay(null);
    return {
      success: true,
      message: "Your password has been updated successfully. You can now log in.",
    };
  },

  async logout(): Promise<void> {
    await delay(null, 200);
  },
};