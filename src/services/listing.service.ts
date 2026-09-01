import type {
  Listing,
  ListingQueryParams,
  PaginatedListings,
} from "@/features/listings/types/listing.types";
import { api } from "@/lib/api";

/** Extract backend error message from AxiosError shapes safely, same pattern as user.service */
function extractErrorMessage(error: any): string {
  if (error?.response?.data?.message && typeof error.response.data.message === "string") {
    return error.response.data.message;
  }
  if (typeof error?.message === "string") return error.message;
  return "Request failed. Please try again.";
}

export const listingService = {
  /**
   * GET /api/admin/listings?page=&pageSize=&search=&status=&sortBy=&sortOrder=
   * Returns backend-paginated + filtered results (backend does search/filter/sort)
   */
  async getListings(params: ListingQueryParams = {}): Promise<PaginatedListings> {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set("page", String(params.page));
      if (params.pageSize) query.set("pageSize", String(params.pageSize));
      if (params.search?.trim()) query.set("search", params.search.trim());
      if (params.status) query.set("status", params.status);
      if (params.sortBy) query.set("sortBy", params.sortBy);
      if (params.sortOrder) query.set("sortOrder", params.sortOrder);

      const url = `/listings${query.toString() ? `?${query.toString()}` : ""}`;
      const response = await api.get(url);
      const envelope = response.data;
      const data = envelope.data ?? envelope;
      return {
        items: data.items ?? [],
        total: Number(data.total ?? 0),
        page: Number(data.page ?? params.page ?? 1),
        pageSize: Number(data.pageSize ?? params.pageSize ?? 10),
      };
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /** GET /api/admin/listings/:id  individual details */
  async getListingById(id: string): Promise<Listing> {
    if (!id) throw new Error("Listing id is required");
    try {
      const response = await api.get(`/listings/${id}`);
      const envelope = response.data;
      // Backend returns: { success, data: { listing } }
      const listing: Listing = envelope.data?.listing ?? envelope.listing ?? envelope.data;
      if (!listing) throw new Error("Listing not found");
      return listing;
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /** POST /api/admin/listings/:id/approve */
  async approveListing(id: string): Promise<{ message: string; listing: Listing }> {
    if (!id) throw new Error("Listing id is required");
    try {
      const response = await api.post(`/listings/${id}/approve`, {});
      const envelope = response.data;
      return {
        message: envelope.message ?? envelope.data?.message ?? "Listing approved successfully",
        listing: envelope.data?.listing ?? envelope.listing,
      };
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /** POST /api/admin/listings/:id/reject  (optional: { reason } in body) */
  async rejectListing(
    id: string,
    opts?: { reason?: string }
  ): Promise<{ message: string; listing: Listing }> {
    if (!id) throw new Error("Listing id is required");
    try {
      const body = opts?.reason ? { reason: opts.reason } : {};
      const response = await api.post(`/listings/${id}/reject`, body);
      const envelope = response.data;
      return {
        message: envelope.message ?? envelope.data?.message ?? "Listing rejected successfully",
        listing: envelope.data?.listing ?? envelope.listing,
      };
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /** POST /api/admin/listings/:id/suspend  (APPROVED -> SUSPENDED) */
  async suspendListing(id: string): Promise<{ message: string; listing: Listing }> {
    if (!id) throw new Error("Listing id is required");
    try {
      const response = await api.post(`/listings/${id}/suspend`, {});
      const envelope = response.data;
      return {
        message: envelope.message ?? envelope.data?.message ?? "Listing suspended successfully",
        listing: envelope.data?.listing ?? envelope.listing,
      };
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /** POST /api/admin/listings/:id/reactivate  (SUSPENDED -> APPROVED) */
  async reactivateListing(id: string): Promise<{ message: string; listing: Listing }> {
    if (!id) throw new Error("Listing id is required");
    try {
      const response = await api.post(`/listings/${id}/reactivate`, {});
      const envelope = response.data;
      return {
        message:
          envelope.message ?? envelope.data?.message ?? "Listing reactivated successfully",
        listing: envelope.data?.listing ?? envelope.listing,
      };
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * DELETE /api/admin/reported-reviews/:reviewId
   * Direct admin delete action for the Trash2 button in ListingReviewsPanel.
   * Removes any single review from a listing (sets visibility=REMOVED on the
   * underlying DB row). No report required — direct moderation action.
   */
  async deleteReview(reviewId: string): Promise<{ message: string }> {
    if (!reviewId) throw new Error("Review id is required");
    try {
      const response = await api.delete(`/reported-reviews/${reviewId}`);
      const envelope = response.data;
      return {
        message:
          envelope.message ?? envelope.data?.message ?? "Review deleted successfully",
      };
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },
};