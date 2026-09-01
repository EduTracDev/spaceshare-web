import type { Id } from "@/types/common";

export type UserRole = "super_admin" | "admin";

export interface AdminUser {
  id: Id;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  permissions: string[];
  status: "active" | "suspended" | "pending_invite";
  lastLoginAt?: string;
  joinedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginResponse {
  user: AdminUser;
  tokens: AuthTokens;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  code: string;
  password: string;
  confirmPassword: string;
  email: string;
}