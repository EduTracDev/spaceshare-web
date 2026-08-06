import { MOCK_DISPUTES, MOCK_DISPUTE_D440 } from "@/mocks/disputes.mock";
import type {
  Dispute,
  DisputeQueryParams,
  PaginatedDisputes,
} from "@/features/disputes/types/dispute.types";

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

const disputesDb: Dispute[] = JSON.parse(JSON.stringify(MOCK_DISPUTES)) as Dispute[];

function sortDisputes(
  items: Dispute[],
  sortBy?: DisputeQueryParams["sortBy"],
  sortOrder: DisputeQueryParams["sortOrder"] = "asc"
) {
  if (!sortBy) return items;

  const factor = sortOrder === "desc" ? -1 : 1;

  return [...items].sort((a, b) => {
    if (sortBy === "guestName") {
      return a.guest.fullName.localeCompare(b.guest.fullName) * factor;
    }

    if (sortBy === "hostName") {
      return a.host.fullName.localeCompare(b.host.fullName) * factor;
    }

    if (sortBy === "dateFiled") {
      return (new Date(a.dateFiled).getTime() - new Date(b.dateFiled).getTime()) * factor;
    }

    const valueA = a[sortBy as "disputeNumber" | "bookingNumber" | "spaceName" | "status"];
    const valueB = b[sortBy as "disputeNumber" | "bookingNumber" | "spaceName" | "status"];

    return String(valueA).localeCompare(String(valueB)) * factor;
  });
}

export const disputeService = {
  async getDisputes(params: DisputeQueryParams = {}): Promise<PaginatedDisputes> {
    await wait();

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;

    let filtered = [...disputesDb];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter((dispute) =>
        [
          dispute.disputeNumber,
          dispute.bookingNumber,
          dispute.guest.fullName,
          dispute.host.fullName,
          dispute.spaceName,
        ].some((value) => value.toLowerCase().includes(term))
      );
    }

    if (params.status) {
      filtered = filtered.filter((dispute) => dispute.status === params.status);
    }

    filtered = sortDisputes(filtered, params.sortBy, params.sortOrder);

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

  async getDisputeById(id: string): Promise<Dispute> {
    await wait(250);

    if (id === MOCK_DISPUTE_D440.id) {
      return JSON.parse(JSON.stringify(MOCK_DISPUTE_D440)) as Dispute;
    }

    const dispute = disputesDb.find((item) => item.id === id);
    if (!dispute) {
      throw new Error("Dispute not found");
    }

    return JSON.parse(JSON.stringify(dispute)) as Dispute;
  },

  async markAsResolved(id: string) {
    await wait(500);

    const index = disputesDb.findIndex((item) => item.id === id);
    if (index >= 0) {
      disputesDb[index] = {
        ...disputesDb[index],
        status: "resolved",
      };
    }

    return {
      message: "Dispute resolved successfully",
    };
  },
};