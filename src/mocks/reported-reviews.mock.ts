import type {
  ReportedReview,
  ReportedReviewAuthor,
  ReportedReviewReason,
  ReportedReviewReporter,
} from "@/features/reported-reviews/types/reported-review.types";

const AUTHORS: ReportedReviewAuthor[] = [
  { id: "a-1", fullName: "Daniel Kelvin", email: "daniel.kelvin@example.com" },
  { id: "a-2", fullName: "Sophia Tran", email: "sophia.tran@example.com" },
  { id: "a-3", fullName: "Lena Martinez", email: "lena.martinez@example.com" },
  { id: "a-4", fullName: "Aisha Patel", email: "aisha.patel@example.com" },
  { id: "a-5", fullName: "Dana Kim", email: "dana.kim@example.com" },
  { id: "a-6", fullName: "Emily Nguyen", email: "emily.nguyen@example.com" },
  { id: "a-7", fullName: "Noah Carter", email: "noah.carter@example.com" },
  { id: "a-8", fullName: "Alicia Martins", email: "alicia.martins@example.com" },
];

const REPORTERS: ReportedReviewReporter[] = [
  {
    id: "r-1",
    fullName: "Alicia Martins",
    email: "alicia.martins@example.com",
    role: "host",
  },
  {
    id: "r-2",
    fullName: "Ethan Brooks",
    email: "ethan.brooks@example.com",
    role: "host",
  },
  {
    id: "r-3",
    fullName: "Mark Chen",
    email: "mark.chen@example.com",
    role: "host",
  },
  {
    id: "r-4",
    fullName: "Jason Lee",
    email: "jason.lee@example.com",
    role: "host",
  },
  {
    id: "r-5",
    fullName: "Carlos Ramirez",
    email: "carlos.ramirez@example.com",
    role: "host",
  },
  {
    id: "r-6",
    fullName: "Oliver Smith",
    email: "oliver.smith@example.com",
    role: "host",
  },
  {
    id: "r-7",
    fullName: "Grace Ibekwe",
    email: "grace.ibekwe@example.com",
    role: "guest",
  },
];

const SPACES = [
  "Skyline Garden Hall",
  "Maplewood Conference Center",
  "Riverside Banquet Hall",
  "Sunset Pavilion",
  "Harborview Conference Center",
  "Garden Terrace",
  "Lakeside Meadows Hall",
  "Cedar Valley Ballroom",
];

const REVIEWS = [
  "The catering service provided a delightful assortment of dishes, catering well to diverse dietary preferences.",
  "The lighting setup created a warm and inviting atmosphere, enhancing the overall experience.",
  "The audio system malfunctioned periodically, affecting the clarity of speeches and presentations.",
  "The lighting was dimmer than expected, causing visibility issues during the award ceremony.",
  "The air conditioning was insufficient, making the room uncomfortably warm for attendees.",
  "Background music was not played as scheduled, resulting in a quieter ambiance than planned.",
  "The venue offered stunning views but the parking arrangement was a hassle for out-of-town guests.",
  "Several listed amenities were not available on arrival and replacement took hours to coordinate.",
];

const REASONS: ReportedReviewReason[] = [
  "Inappropriate language",
  "Offensive content",
  "Hate speech",
  "Spam or promotional content",
  "Extortion or blackmail",
];

function createReview(input: {
  id: string;
  spaceName: string;
  reviewText: string;
  writtenAt: string;
  author: ReportedReviewAuthor;
  reason: ReportedReviewReason;
  reportedBy: ReportedReviewReporter;
  status: ReportedReview["status"];
  moderatedAt?: string;
}): ReportedReview {
  return {
    id: input.id,
    spaceName: input.spaceName,
    reviewText: input.reviewText,
    writtenAt: input.writtenAt,
    author: input.author,
    reason: input.reason,
    reportedBy: input.reportedBy,
    status: input.status,
    moderatedAt: input.moderatedAt,
  };
}

export const MOCK_REPORTED_REVIEWS: ReportedReview[] = [
  createReview({
    id: "rr-1",
    spaceName: SPACES[0],
    reviewText: REVIEWS[0],
    writtenAt: "2026-07-05T10:30:00.000Z",
    author: AUTHORS[0],
    reason: REASONS[0],
    reportedBy: REPORTERS[0],
    status: "pending",
  }),
  createReview({
    id: "rr-2",
    spaceName: SPACES[1],
    reviewText: REVIEWS[1],
    writtenAt: "2026-08-14T14:00:00.000Z",
    author: AUTHORS[1],
    reason: REASONS[4],
    reportedBy: REPORTERS[1],
    status: "closed",
    moderatedAt: "2026-08-16T09:30:00.000Z",
  }),
  createReview({
    id: "rr-3",
    spaceName: SPACES[2],
    reviewText: REVIEWS[2],
    writtenAt: "2026-09-22T18:45:00.000Z",
    author: AUTHORS[2],
    reason: REASONS[0],
    reportedBy: REPORTERS[2],
    status: "closed",
    moderatedAt: "2026-09-24T11:00:00.000Z",
  }),
  createReview({
    id: "rr-4",
    spaceName: SPACES[3],
    reviewText: REVIEWS[3],
    writtenAt: "2026-10-03T20:00:00.000Z",
    author: AUTHORS[3],
    reason: REASONS[3],
    reportedBy: REPORTERS[3],
    status: "pending",
  }),
  createReview({
    id: "rr-5",
    spaceName: SPACES[4],
    reviewText: REVIEWS[4],
    writtenAt: "2026-09-29T14:15:00.000Z",
    author: AUTHORS[4],
    reason: REASONS[1],
    reportedBy: REPORTERS[4],
    status: "pending",
  }),
  createReview({
    id: "rr-6",
    spaceName: SPACES[5],
    reviewText: REVIEWS[5],
    writtenAt: "2026-10-10T19:30:00.000Z",
    author: AUTHORS[5],
    reason: REASONS[2],
    reportedBy: REPORTERS[5],
    status: "pending",
  }),
  createReview({
    id: "rr-7",
    spaceName: SPACES[6],
    reviewText: REVIEWS[6],
    writtenAt: "2026-09-18T12:05:00.000Z",
    author: AUTHORS[6],
    reason: REASONS[3],
    reportedBy: REPORTERS[6],
    status: "closed",
    moderatedAt: "2026-09-20T16:20:00.000Z",
  }),
  createReview({
    id: "rr-8",
    spaceName: SPACES[7],
    reviewText: REVIEWS[7],
    writtenAt: "2026-09-04T09:00:00.000Z",
    author: AUTHORS[7],
    reason: REASONS[0],
    reportedBy: REPORTERS[0],
    status: "pending",
  }),
  createReview({
    id: "rr-9",
    spaceName: SPACES[0],
    reviewText: REVIEWS[2],
    writtenAt: "2026-08-02T10:15:00.000Z",
    author: AUTHORS[4],
    reason: REASONS[1],
    reportedBy: REPORTERS[3],
    status: "closed",
    moderatedAt: "2026-08-05T13:00:00.000Z",
  }),
  createReview({
    id: "rr-10",
    spaceName: SPACES[2],
    reviewText: REVIEWS[4],
    writtenAt: "2026-10-08T21:30:00.000Z",
    author: AUTHORS[1],
    reason: REASONS[2],
    reportedBy: REPORTERS[5],
    status: "pending",
  }),
  createReview({
    id: "rr-11",
    spaceName: SPACES[5],
    reviewText: REVIEWS[1],
    writtenAt: "2026-07-29T19:45:00.000Z",
    author: AUTHORS[6],
    reason: REASONS[4],
    reportedBy: REPORTERS[1],
    status: "pending",
  }),
  createReview({
    id: "rr-12",
    spaceName: SPACES[3],
    reviewText: REVIEWS[0],
    writtenAt: "2026-09-11T15:30:00.000Z",
    author: AUTHORS[3],
    reason: REASONS[3],
    reportedBy: REPORTERS[2],
    status: "closed",
    moderatedAt: "2026-09-13T10:00:00.000Z",
  }),
];