import type {
  AnyUser,
  PaginatedUsers,
  UserQueryParams,
  StatusFilter,
  AdminUser,
} from "@/features/users/types/user.types";
import { ALL_USERS, MOCK_HOSTS, MOCK_GUESTS, MOCK_ADMINS } from "@/mocks/users.mock";
import type { Id } from "@/types/common";

const delay = <T>(data: T, ms = 450): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

function byRole(role: UserQueryParams["role"]) {
  if (role === "admin") return [...MOCK_ADMINS] as AnyUser[];
  if (role === "host") return [...MOCK_HOSTS] as AnyUser[];
  return [...MOCK_GUESTS] as AnyUser[];
}

function byStatus(list: AnyUser[], status?: StatusFilter) {
  if (!status || status === "all") return list;
  return list.filter((u) => u.status === status);
}

function bySearch(list: AnyUser[], search?: string) {
  if (!search) return list;
  const q = search.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (u) =>
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q)
  );
}

export const userService = {
  async getUsers(params: UserQueryParams): Promise<PaginatedUsers> {
    let list = byRole(params.role);
    list = byStatus(list, params.status);
    list = bySearch(list, params.search);

    // Sort
    if (params.sortBy) {
      const dir = params.sortOrder === "desc" ? -1 : 1;
      list = [...list].sort((a, b) => {
        const va = a[params.sortBy as keyof AnyUser];
        const vb = b[params.sortBy as keyof AnyUser];
        if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
        if (va && vb) return String(va).localeCompare(String(vb)) * dir;
        return 0;
      });
    }

    const total = list.length;
    const start = (params.page - 1) * params.pageSize;
    const items = list.slice(start, start + params.pageSize);
    return delay({ items, total, page: params.page, pageSize: params.pageSize });
  },

  async getUserById(id: Id): Promise<AnyUser | null> {
    const u = ALL_USERS.find((x) => x.id === id);
    return delay(u ?? null);
  },

  async suspendUser(id: Id): Promise<{ success: boolean; message: string }> {
    const u = ALL_USERS.find((x) => x.id === id);
    if (!u) return delay({ success: false, message: "User not found" }, 400);
    u.status = "suspended";
    u.updatedAt = new Date().toISOString();
    return delay({ success: true, message: `${u.fullName} has been suspended.` });
  },

  async reactivateUser(id: Id): Promise<{ success: boolean; message: string }> {
    const u = ALL_USERS.find((x) => x.id === id);
    if (!u) return delay({ success: false, message: "User not found" }, 400);
    u.status = "active";
    u.updatedAt = new Date().toISOString();
    return delay({ success: true, message: `${u.fullName}'s account has been reactivated.` });
  },

  async inviteAdmin(payload: {
    email: string;
    fullName: string;
    role?: "admin";
    permissions?: string[];
  }): Promise<{ success: boolean; message: string; admin: AdminUser }> {
    const admin: AdminUser = {
      id: "usr_a_" + Math.random().toString(36).slice(2, 8),
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role ?? "admin",
      status: "pending",
      permissions: payload.permissions ?? ["users:view"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      invitedAt: new Date().toISOString(),
      invitedBy: "usr_a_001",
    };
    (MOCK_ADMINS as AdminUser[]).unshift(admin);
    (ALL_USERS as AnyUser[]).unshift(admin);
    return delay({
      success: true,
      message: `Invitation sent to ${payload.email}.`,
      admin,
    });
  },
};