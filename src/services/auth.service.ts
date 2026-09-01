import type {
  ForgotPasswordPayload,
  LoginPayload,
  LoginResponse,
  ResetPasswordPayload,
} from "@/features/auth/types/auth.types";
import axios from "axios";

export interface AcceptInvitationPayload {
  email: string;
  token: string;
  password: string;
  confirmPassword: string;
}

const delay = <T>(data: T, ms = 600): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`, payload);
      const data = await response.data;
      const token = data?.data?.token;
      //set token to local storage for now
      if (!token) throw new Error("Login failed");
      //set token to local storage for now
      localStorage.setItem("token", token);
      return data;
    } catch(error: any){
      const errorMessage = error.response.data.message || "Login failed";
      console.log("error message:", errorMessage);
      throw new Error(errorMessage);
    }
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

  async verify(){
    //verifies the token first
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
    localStorage.removeItem("token");
    await delay(null, 200);
  },

  /**
   * Complete an admin email invitation by setting the user's first password.
   * Public endpoint (no JWT required) — the emailed token acts as single-use authorization.
   */
  async acceptInvitation(
    payload: AcceptInvitationPayload
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/invitation/accept`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      const envelope = response.data;
      return {
        success: envelope.success ?? true,
        message: envelope.message ?? "Invitation accepted successfully",
      };
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message ??
        error?.message ??
        "Failed to accept invitation. Please try again.";
      throw new Error(serverMessage);
    }
  },
};