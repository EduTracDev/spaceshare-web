import type {
  PaginatedReportedReviews,
  ReportedReview,
  ReportedReviewQueryParams,
} from "@/features/reported-reviews/types/reported-review.types";
import { api } from "@/lib/api";

function extractErrorMessage(error: any): string {
  if (error?.response?.data?.message && typeof error.response.data.message === "string") {
    return error.response.data.message;
  }
  if (typeof error?.message === "string") return error.message;
  return "Request failed. Please try again.";
}

export const reportedReviewService = {
  async getReportedReviews(
    params: ReportedReviewQueryParams = {}
  ): Promise<PaginatedReportedReviews> {
    try {
      const query = new URLSearchParams();
      if (params.page) query.set("page", String(params.page));
      if (params.pageSize) query.set("pageSize", String(params.pageSize));
      if (params.search?.trim()) query.set("search", params.search.trim());
      if (params.status) query.set("status", params.status);
      if (params.sortBy) query.set("sortBy", params.sortBy);
      if (params.sortOrder) query.set("sortOrder", params.sortOrder);

      const url = `/reported-reviews${query.toString() ? `?${query.toString()}` : ""}`;
      const response = await api.get(url);
      const envelope = response.data;
      const data = envelope.data ?? envelope;
      return {
        items: data.items ?? [],
        total: Number(data.total ?? 0),
        page: Number(data.page ?? params.page ?? 1),
        pageSize: Number(data.pageSize ?? params.pageSize ?? 6),
      };
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async getReportedReviewById(id: string): Promise<ReportedReview> {
    if (!id) throw new Error("Reported review id is required");
    try {
      const response = await api.get(`/reported-reviews/${id}`);
      const envelope = response.data;
      const review: ReportedReview =
        envelope.data?.review ?? envelope.review ?? envelope.data;
      if (!review) throw new Error("Reported review not found");
      return review;
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async retainReview(id: string): Promise<{ message: string }> {
    if (!id) throw new Error("Reported review id is required");
    try {
      const response = await api.patch(`/reported-reviews/${id}/retain`, {});
      const envelope = response.data;
      return {
        message:
          envelope.message ??
          envelope.data?.message ??
          "Review retained successfully",
      };
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async removeReview(id: string): Promise<{ message: string }> {
    if (!id) throw new Error("Reported review id is required");
    try {
      const response = await api.patch(`/reported-reviews/${id}/remove`, {});
      const envelope = response.data;
      return {
        message:
          envelope.message ??
          envelope.data?.message ??
          "Review removed successfully",
      };
    } catch (error: any) {
      throw new Error(extractErrorMessage(error));
    }
  },
};