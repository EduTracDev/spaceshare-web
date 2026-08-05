import { MOCK_LISTINGS } from "@/mocks/listings.mock";
import type {
  Listing,
  ListingQueryParams,
  PaginatedListings,
} from "@/features/listings/types/listing.types";

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

let listingsDb: Listing[] = JSON.parse(JSON.stringify(MOCK_LISTINGS)) as Listing[];

function sortListings(
  items: Listing[],
  sortBy?: ListingQueryParams["sortBy"],
  sortOrder: ListingQueryParams["sortOrder"] = "asc"
) {
  if (!sortBy) return items;

  const factor = sortOrder === "desc" ? -1 : 1;

  return [...items].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (sortBy === "submittedAt") {
      return (new Date(String(aValue)).getTime() - new Date(String(bValue)).getTime()) * factor;
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * factor;
    }

    return String(aValue).localeCompare(String(bValue)) * factor;
  });
}

export const listingService = {
  async getListings(params: ListingQueryParams = {}): Promise<PaginatedListings> {
    await wait();

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;

    let filtered = [...listingsDb];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter((listing) =>
        [listing.spaceName, listing.host.fullName, listing.location].some((value) =>
          value.toLowerCase().includes(term)
        )
      );
    }

    if (params.status) {
      filtered = filtered.filter((listing) => listing.status === params.status);
    }

    filtered = sortListings(filtered, params.sortBy, params.sortOrder);

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

  async getListingById(id: string): Promise<Listing> {
    await wait(250);
    const listing = listingsDb.find((item) => item.id === id);

    if (!listing) {
      throw new Error("Listing not found");
    }

    return JSON.parse(JSON.stringify(listing)) as Listing;
  },

  async approveListing(id: string): Promise<{ message: string; listing: Listing }> {
    await wait(500);
    const index = listingsDb.findIndex((item) => item.id === id);

    if (index < 0) {
      throw new Error("Listing not found");
    }

    listingsDb[index] = {
      ...listingsDb[index],
      status: "approved",
    };

    return {
      message: "Listing approved successfully",
      listing: JSON.parse(JSON.stringify(listingsDb[index])) as Listing,
    };
  },

  async rejectListing(id: string): Promise<{ message: string; listing: Listing }> {
    await wait(500);
    const index = listingsDb.findIndex((item) => item.id === id);

    if (index < 0) {
      throw new Error("Listing not found");
    }

    listingsDb[index] = {
      ...listingsDb[index],
      status: "rejected",
    };

    return {
      message: "Listing rejected successfully",
      listing: JSON.parse(JSON.stringify(listingsDb[index])) as Listing,
    };
  },

  async suspendListing(id: string): Promise<{ message: string; listing: Listing }> {
    await wait(500);
    const index = listingsDb.findIndex((item) => item.id === id);

    if (index < 0) {
      throw new Error("Listing not found");
    }

    listingsDb[index] = {
      ...listingsDb[index],
      status: "suspended",
    };

    return {
      message: "Listing suspended successfully",
      listing: JSON.parse(JSON.stringify(listingsDb[index])) as Listing,
    };
  },
};