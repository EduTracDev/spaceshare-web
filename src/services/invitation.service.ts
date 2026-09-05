// import type {
//   AnyUser,
//   PaginatedUsers,
// } from "@/features/users/types/user.types";
// import type { Id } from "@/types/common";
// import { api } from "@/lib/api";

// /**
//  * Extracts the user-friendly backend error message from an Axios error.
//  * Matches the same extract pattern used in user.service.ts for consistency.
//  */
// function extractErrorMessage(error: any): string {
//   return (
//     error?.response?.data?.message ??
//     error?.message ??
//     "Request failed. Please try again."
//   );
// }

// export interface PaginatedInvitations {
//   items: AnyUser[];
//   total: number;
//   page: number;
//   pageSize: number;
// }

// export const invitationService = {
//   /**
//    * List / search / filter admin invitations.
//    * Fetches ALL invitations (accepted/revoked/expired/pending) with status filter.
//    * Backend envelope: { success, message, data: { items, total, page, pageSize } }
//    */
//   async listInvitations(params?: {
//     status?: "all" | "pending" | "accepted" | "revoked" | "expired";
//     search?: string;
//     page?: number;
//     pageSize?: number;
//     sortBy?: string;
//     sortOrder?: "asc" | "desc";
//   }): Promise<PaginatedInvitations> {
//     try {
//       const response = await api.get("/invitation", {
//         params: {
//           page: params?.page ?? 1,
//           pageSize: params?.pageSize ?? 50, // fetch all invitations for frontend merge (never >50 anyway)
//           search: params?.search || undefined,
//           status: params?.status ?? "all",
//           sortBy: params?.sortBy || undefined,
//           sortOrder: params?.sortOrder || undefined,
//         },
//       });
//       const envelope = response.data;
//       const payload = envelope.data ?? envelope;

//       // ---- Shape backend AdminInvitationListItem to match AnyUser frontend type ---
//       const shapedItems: AnyUser[] = (payload.items ?? []).map((inv: any) => {
//         // Map backend virtual status (pending/accepted/revoked/expired) →
//         //   → frontend invite_* status keys that StatusBadge understands
//         let mappedStatus: AnyUser["status"] = "pending_invite";
//         if (inv.status === "accepted") mappedStatus = "invite_accepted";
//         else if (inv.status === "revoked") mappedStatus = "invite_revoked";
//         else if (inv.status === "expired") mappedStatus = "invite_expired";
//         else mappedStatus = "pending_invite";

//         return {
//           id: inv.id,
//           __kind: "invitation",
//           fullName: inv.fullName,
//           email: inv.email,
//           role: "admin", // Invited to be an admin (pre-accept they are "admin" role for tab purposes)
//           status: mappedStatus,
//           dateRegistered: inv.createdAt
//             ? new Date(inv.createdAt).toLocaleDateString("en-NG", {
//                 day: "2-digit",
//                 month: "2-digit",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "Invitation pending",
//           createdAt: inv.createdAt,
//           updatedAt: inv.createdAt,
//           // Invitation-specific extras:
//           inviteExpiresAt: inv.expiresAt,
//           invitedByName: inv.invitedByName,
//           invitedByEmail: inv.invitedByEmail,
//         };
//       });

//       return {
//         items: shapedItems,
//         total: payload.total ?? 0,
//         page: payload.page ?? params?.page ?? 1,
//         pageSize: payload.pageSize ?? params?.pageSize ?? 10,
//       };
//     } catch (error: any) {
//       const message = extractErrorMessage(error);
//       throw new Error(message);
//     }
//   },

//   /**
//    * Resend a pending / expired invitation:
//    * Rotates the token hash + resets expiry (backend 12h or custom)
//    * Then sends a fresh invitation email via Brevo.
//    */
//   async resendInvitation(
//     invitationId: Id
//   ): Promise<{ success: boolean; message: string }> {
//     try {
//       const response = await api.patch(`/invitation/${invitationId}/resend`);
//       const envelope = response.data;
//       return {
//         success: envelope.success ?? true,
//         message: envelope.message ?? "Invitation resent",
//       };
//     } catch (error: any) {
//       const message = extractErrorMessage(error);
//       throw new Error(message);
//     }
//   },

//   /**
//    * Revoke an invitation that has NOT been accepted yet.
//    * Sets AdminInvitation.revokedAt = NOW().
//    * Backend throws 400 if: already accepted OR already revoked.
//    */
//   async revokeInvitation(
//     invitationId: Id
//   ): Promise<{ success: boolean; message: string }> {
//     try {
//       const response = await api.patch(`/invitation/${invitationId}/revoke`);
//       const envelope = response.data;
//       return {
//         success: envelope.success ?? true,
//         message: envelope.message ?? "Invitation revoked",
//       };
//     } catch (error: any) {
//       const message = extractErrorMessage(error);
//       throw new Error(message);
//     }
//   },
// };
