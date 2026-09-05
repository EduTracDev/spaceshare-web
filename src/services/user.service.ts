import type {
  AnyUser,
  PaginatedUsers,
  UserQueryParams,
  AdminUser,
} from "@/features/users/types/user.types";
import type { Id } from "@/types/common";
import { api } from "@/lib/api";

/**
 * Extracts the user-friendly backend error message from an Axios error.
 * Falls back progressively: server JSON message → Axios generic → safe default.
 */
function extractErrorMessage(error: any): string {
  return (
    error?.response?.data?.message ??
    error?.message ??
    "Request failed. Please try again."
  );
}

export const userService = {
  /**
   * Paginated, filterable, searchable users list for the Users Management table.
   * Backend envelope: { success, message, data: { items, total, page, pageSize } }
   * Frontend contract expects: { items, total, page, pageSize }
   */
  async getUsers(params: UserQueryParams): Promise<PaginatedUsers> {
    try {
      const response = await api.get("/users", { params });
      const envelope = response.data;
      // Backend wraps under `data: { items, total, page, pageSize }`
      const payload: PaginatedUsers = envelope.data ?? envelope;
      console.log("payload:", payload.items);
      return {
        items: payload.items ?? [],
        total: payload.total ?? 0,
        page: payload.page ?? params.page,
        pageSize: payload.pageSize ?? params.pageSize,
      };
    } catch (error: any) {
      const message = extractErrorMessage(error);
      throw new Error(message);
    }
  },

  async getUserById(id: Id): Promise<AnyUser | null> {
    try {
      const response = await api.get(`/users/${id}`);
      const envelope = response.data;
      return (envelope.data ?? envelope ?? null) as AnyUser | null;
    } catch (error: any) {
      // Treat 404 as null "not found", consistent with old mock contract
      if (error?.response?.status === 404) return null;
      const message = extractErrorMessage(error);
      throw new Error(message);
    }
  },

  async suspendUser(id: Id): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/users/${id}/suspend`);
      const envelope = response.data;
      return {
        success: envelope.success ?? true,
        message: envelope.message ?? "User suspended successfully",
      };
    } catch (error: any) {
      const message = extractErrorMessage(error);
      throw new Error(message);
    }
  },

  async reactivateUser(id: Id): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/users/${id}/reactivate`);
      const envelope = response.data;
      return {
        success: envelope.success ?? true,
        message: envelope.message ?? "User reactivated successfully",
      };
    } catch (error: any) {
      const message = extractErrorMessage(error);
      throw new Error(message);
    }
  },

  async inviteAdmin(payload: {
    firstName: string;
    lastName: string;
    email: string;
    role?: "admin";
    permissions?: string[];
  }): Promise<{ success: boolean; message: string; admin: AdminUser }> {
    try {
      const response = await api.post("/invitation/create", payload);
      const envelope = response.data;
      return {
        success: envelope.success ?? true,
        message: envelope.message ?? "Invitation sent",
        admin: envelope.data?.admin ?? envelope.admin,
      };
    } catch (error: any) {
      const message = extractErrorMessage(error);
      throw new Error(message);
    }
  },
};