// c:\Users\user\Projects\Curr Proj\SPACE_SHARE-ADM\spaceshare-web\src\services\booking.service.ts
import type {
  Booking,
  BookingQueryParams,
  PaginatedBookings,
} from "@/features/bookings/types/booking.types";
import { api } from "@/lib/api";

/**
 * User-friendly error extraction for Axios errors.
 * Prevents showing generic Axios text "Request failed with status code 401"
 * when the backend actually returned a specific message like "Only pending bookings can be approved".
 *
 * Fallback tiers:
 * 1. Backend JSON response.data.message (what you threw in CustomErrors)
 * 2. Backend JSON response.data.error (fallback envelope format)
 * 3. Axios native err.message (Network Error / CORS / etc.)
 * 4. Static "Request failed..." text
 */
function extractErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong. Please try again.";
  const err = error as Record<string, any>;
  const candidate: unknown =
    err?.response?.data?.message ??
    err?.response?.data?.error ??
    err?.message;
  if (typeof candidate === "string" && candidate.trim().length > 0) {
    return candidate.trim();
  }
  return "Request failed. Please try again.";
}

export const bookingService = {
  /**
   * GET /api/admin/bookings
   * Backend does: pagination, status filter, search (space/host/guest names/emails),
   * sort (7 sortable columns), disputed virtual status, accurate total count.
   *
   * Backend envelope: { success: true, data: { items, total, page, pageSize } }
   */
  async getBookings(params: BookingQueryParams = {}): Promise<PaginatedBookings> {
    try {
      const response = await api.get("/bookings", {
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10,
          ...(params.status ? { status: params.status } : {}),
          ...(params.search ? { search: params.search } : {}),
          ...(params.sortBy ? { sortBy: params.sortBy } : {}),
          ...(params.sortOrder ? { sortOrder: params.sortOrder } : {}),
        },
      });

      const envelope = response?.data?.data as PaginatedBookings | undefined;

      if (!envelope || !Array.isArray(envelope.items)) {
        const direct = (response?.data ?? {}) as PaginatedBookings;
        if (direct && Array.isArray(direct.items)) {
          return {
            items: direct.items,
            total: typeof direct.total === "number" ? direct.total : 0,
            page: typeof direct.page === "number" ? direct.page : params.page ?? 1,
            pageSize:
              typeof direct.pageSize === "number"
                ? direct.pageSize
                : params.pageSize ?? 10,
          };
        }
        return {
          items: [],
          total: 0,
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 10,
        };
      }
      console.log("res:", envelope.items);
      return {
        items: envelope.items,
        total: typeof envelope.total === "number" ? envelope.total : 0,
        page: typeof envelope.page === "number" ? envelope.page : params.page ?? 1,
        pageSize:
          typeof envelope.pageSize === "number"
            ? envelope.pageSize
            : params.pageSize ?? 10,
      };
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * GET /api/admin/bookings/:id
   * Full booking details for the right-side details sheet/drawer.
   *
   * Path is relative `/bookings/:id` because the api axios instance already
   * sets NEXT_PUBLIC_SERVER_URL = /api/admin as its baseURL.
   * DO NOT prefix with `/admin/` — that would produce `/api/admin/admin/bookings/:id`.
   */
  async getBookingById(id: string): Promise<Booking> {
    try {
      const response = await api.get(`/bookings/${id}`);
      const booking = response?.data?.data as Booking | undefined;
      if (!booking || !booking.id) throw new Error("Booking not found");
      return booking;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  /**
   * Intentionally left as a descriptive stub. Status-transition endpoints
   * (approve/reject/cancel/complete/dispute booking actions) can be added later.
   *
   * Throwing an explicit user-visible error NOW avoids the silent-failure bug
   * where the UI button click "does nothing" and the user has no idea why.
   */
  async updateBookingStatus(_id: string, _nextStatus: Booking["status"]) {
    throw new Error(
      "Booking status updates are not yet enabled. Please check back shortly."
    );
  },
};