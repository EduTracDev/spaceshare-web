import type { StatusKey } from "@/constants/status";
import type { Id, Timestamped } from "@/types/common";

export type UserRole = "host" | "guest" | "admin" | "super_admin";

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface BaseUser extends Timestamped {
  id: Id;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: Exclude<StatusKey, "approved" | "rejected" | "paid" | "failed" | "resolved" | "in_progress" | "open" | "completed" | "upcoming" | "ongoing" | "cancelled" | "hidden" | "pending_invite">;
  avatarUrl?: string;
  dateRegistered?: string; // format: DD/MM/YYYY hh:mm A Nigeria
  lastActiveAt?: string;
  totalBookings?: number;
  totalListings?: number;
  bankDetails?: BankDetails;
}

export type HostUser = BaseUser & { role: "host"; totalListings: number; bankDetails?: BankDetails };
export type GuestUser = BaseUser & { role: "guest"; totalBookings: number };
export type AdminUser = BaseUser & {
  role: "admin" | "super_admin";
  permissions: string[];
  invitedAt?: string;
  invitedBy?: Id;
};

export type AnyUser = BaseUser;

export type UserRoleTab = "host" | "guest" | "admin";

export type StatusFilter = "all" | "pending" | "active" | "suspended";

export interface UserQueryParams {
  role: UserRoleTab;
  search?: string;
  status?: StatusFilter;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedUsers {
  items: AnyUser[];
  total: number;
  page: number;
  pageSize: number;
}