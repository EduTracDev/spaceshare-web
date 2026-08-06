import type { StatusKey } from "@/constants/status";

export type ReportedReviewStatus = "pending" | "closed";
export type ReportedReviewStatusFilter = "all" | ReportedReviewStatus;

export type ReportedReviewReason =
  | "Inappropriate language"
  | "Offensive content"
  | "Hate speech"
  | "Spam or promotional content"
  | "Extortion or blackmail";

export type ReportedByRole = "host" | "guest";

export interface ReportedReviewAuthor {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export interface ReportedReviewReporter {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: ReportedByRole;
}

export interface ReportedReview {
  id: string;
  spaceName: string;
  reviewText: string;
  writtenAt: string;
  author: ReportedReviewAuthor;
  reason: ReportedReviewReason;
  reportedBy: ReportedReviewReporter;
  status: ReportedReviewStatus;
  moderatedAt?: string;
}

export interface PaginatedReportedReviews {
  items: ReportedReview[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ReportedReviewQueryParams {
  search?: string;
  status?: ReportedReviewStatus;
  page?: number;
  pageSize?: number;
  sortBy?: "spaceName" | "writtenAt" | "status" | "authorName" | "reporterName";
  sortOrder?: "asc" | "desc";
}

export const REPORTED_REVIEW_STATUS_KEYS: Record<ReportedReviewStatus, StatusKey> = {
  pending: "pending",
  closed: "completed",
};