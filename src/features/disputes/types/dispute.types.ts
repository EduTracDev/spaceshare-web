import type { StatusKey } from "@/constants/status";

export type DisputeStatus = "new" | "resolved";
export type DisputeStatusFilter = "all" | DisputeStatus;
export type DisputeRaisedBy = "host" | "guest";

export interface DisputeEvidenceFile {
  id: string;
  name: string;
  sizeLabel: string;
  kind: "document" | "image";
  downloadUrl: string;
  mimeType: string;
}

export interface DisputeRaisedParty {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
}

export interface Dispute {
  id: string;
  disputeNumber: string;
  bookingNumber: string;
  guest: DisputeRaisedParty;
  host: DisputeRaisedParty;
  spaceName: string;
  dateFiled: string;
  dateTimeFiled: string;
  status: DisputeStatus;
  raisedBy: DisputeRaisedBy;
  raisedByParty: DisputeRaisedParty;
  reason: string;
  evidence: DisputeEvidenceFile[];
}

export interface DisputeQueryParams {
  search?: string;
  status?: DisputeStatus;
  page?: number;
  pageSize?: number;
  sortBy?:
    | "disputeNumber"
    | "bookingNumber"
    | "guestName"
    | "hostName"
    | "spaceName"
    | "dateFiled"
    | "status";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedDisputes {
  items: Dispute[];
  total: number;
  page: number;
  pageSize: number;
}

export const DISPUTE_STATUS_KEYS: Record<DisputeStatus, StatusKey> = {
  new: "new",
  resolved: "resolved",
};