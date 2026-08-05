export type ListingStatus = "pending" | "approved" | "rejected" | "suspended";
export type ListingStatusFilter = "all" | ListingStatus;

export type ListingCategory =
  | "rooftop"
  | "garden"
  | "studio"
  | "open_space"
  | "lounge"
  | "hall";

export interface ListingHost {
  id: string;
  fullName: string;
  avatarUrl?: string;
  totalListings: number;
}

export interface ListingAddOn {
  id: string;
  name: string;
  quantityLabel: string;
  price: number;
}

export interface ListingReview {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  slug: string;
  spaceName: string;
  host: ListingHost;
  location: string;
  price: number;
  submittedAt: string;
  status: ListingStatus;
  category: ListingCategory;
  capacity: number;
  description: string;
  coverImageUrl: string;
  gallery: string[];
  amenities: string[];
  houseRules: string[];
  parkingInstructions: string[];
  addOns: ListingAddOn[];
  reviews: ListingReview[];
}

export interface ListingQueryParams {
  search?: string;
  status?: ListingStatus;
  page?: number;
  pageSize?: number;
  sortBy?: "spaceName" | "location" | "price" | "submittedAt" | "status";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedListings {
  items: Listing[];
  total: number;
  page: number;
  pageSize: number;
}