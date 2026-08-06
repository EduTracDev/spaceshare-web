import { MOCK_REPORTED_REVIEWS } from "@/mocks/reported-reviews.mock";
import type {
  PaginatedReportedReviews,
  ReportedReview,
  ReportedReviewQueryParams,
} from "@/features/reported-reviews/types/reported-review.types";

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

const reviewsDb: ReportedReview[] = JSON.parse(
  JSON.stringify(MOCK_REPORTED_REVIEWS)
) as ReportedReview[];

function sortReviews(
  items: ReportedReview[],
  sortBy?: ReportedReviewQueryParams["sortBy"],
  sortOrder: ReportedReviewQueryParams["sortOrder"] = "desc"
) {
  if (!sortBy) {
    return [...items].sort(
      (a, b) =>
        (new Date(b.writtenAt).getTime() - new Date(a.writtenAt).getTime()) *
        (sortOrder === "asc" ? -1 : 1)
    );
  }

  const factor = sortOrder === "desc" ? -1 : 1;

  return [...items].sort((a, b) => {
    if (sortBy === "authorName") {
      return a.author.fullName.localeCompare(b.author.fullName) * factor;
    }

    if (sortBy === "reporterName") {
      return a.reportedBy.fullName.localeCompare(b.reportedBy.fullName) * factor;
    }

    if (sortBy === "writtenAt") {
      return (
        (new Date(a.writtenAt).getTime() - new Date(b.writtenAt).getTime()) * factor
      );
    }

    const valueA = a[sortBy as "spaceName" | "status"];
    const valueB = b[sortBy as "spaceName" | "status"];

    return String(valueA).localeCompare(String(valueB)) * factor;
  });
}

export const reportedReviewService = {
  async getReportedReviews(
    params: ReportedReviewQueryParams = {}
  ): Promise<PaginatedReportedReviews> {
    await wait();

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 6;

    let filtered = [...reviewsDb];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter((review) =>
        [
          review.spaceName,
          review.reviewText,
          review.author.fullName,
          review.reportedBy.fullName,
          review.reason,
        ].some((value) => value.toLowerCase().includes(term))
      );
    }

    if (params.status) {
      filtered = filtered.filter((review) => review.status === params.status);
    }

    filtered = sortReviews(filtered, params.sortBy, params.sortOrder);

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
    };
  },

  async getReportedReviewById(id: string): Promise<ReportedReview> {
    await wait(250);
    const review = reviewsDb.find((item) => item.id === id);
    if (!review) throw new Error("Reported review not found");
    return JSON.parse(JSON.stringify(review)) as ReportedReview;
  },

  async retainReview(id: string) {
    await wait(500);
    const index = reviewsDb.findIndex((item) => item.id === id);
    if (index >= 0) {
      reviewsDb[index] = {
        ...reviewsDb[index],
        status: "closed",
        moderatedAt: new Date().toISOString(),
      };
    }
    return {
      message: "Review retained successfully",
    };
  },

  async removeReview(id: string) {
    await wait(550);
    const index = reviewsDb.findIndex((item) => item.id === id);
    if (index >= 0) {
      reviewsDb[index] = {
        ...reviewsDb[index],
        status: "closed",
        moderatedAt: new Date().toISOString(),
      };
    }
    return {
      message: "Review removed successfully",
    };
  },
};