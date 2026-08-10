import type { AdminUser, AuthTokens } from "@/features/auth/types/auth.types";

export const MOCK_ADMIN_USER: AdminUser = {
  id: "usr_admin_001",
  fullName: "Adebayo Admin",
  email: "admin@spaceshare.ng",
  phone: "+234 801 234 5678",
  role: "super_admin",
  avatarUrl: undefined,
  permissions: [
    "users:view",
    "users:manage",
    "listings:view",
    "listings:approve",
    "bookings:view",
    "bookings:manage",
    "payouts:view",
    "payouts:process",
    "disputes:view",
    "disputes:resolve",
    "reviews:moderate",
    "audit:view",
    "settings:manage",
  ],
  status: "active",
  lastLoginAt: new Date().toISOString(),
  joinedAt: "2025-11-01T09:00:00.000Z",
};

export const MOCK_AUTH_TOKENS: AuthTokens = {
  accessToken: "mock_access_token_" + Math.random().toString(36).slice(2),
  refreshToken: "mock_refresh_token_" + Math.random().toString(36).slice(2),
  expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
};