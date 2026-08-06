import { MOCK_BOOKINGS, MOCK_SKYLINE_PAVILION_BOOKING } from "@/mocks/bookings.mock";
import type {
  Booking,
  BookingQueryParams,
  PaginatedBookings,
} from "@/features/bookings/types/booking.types";

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

const bookingsDb: Booking[] = JSON.parse(JSON.stringify(MOCK_BOOKINGS)) as Booking[];

function sortBookings(
  items: Booking[],
  sortBy?: BookingQueryParams["sortBy"],
  sortOrder: BookingQueryParams["sortOrder"] = "asc"
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

    if (sortBy === "eventDate") {
      return (new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()) * factor;
    }

    if (sortBy === "amount") {
      return (a.amount - b.amount) * factor;
    }

    if (sortBy === "bookingNumber") {
      return a.bookingNumber.localeCompare(b.bookingNumber) * factor;
    }

    if (sortBy === "spaceName") {
      return a.spaceName.localeCompare(b.spaceName) * factor;
    }

    if (sortBy === "status") {
      return a.status.localeCompare(b.status) * factor;
    }

    return 0;
  });
}

export const bookingService = {
  async getBookings(params: BookingQueryParams = {}): Promise<PaginatedBookings> {
    await wait();

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;

    let filtered = [...bookingsDb];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter((booking) =>
        [
          booking.bookingNumber,
          booking.guest.fullName,
          booking.host.fullName,
          booking.spaceName,
        ].some((value) => value.toLowerCase().includes(term))
      );
    }

    if (params.status) {
      filtered = filtered.filter((booking) => booking.status === params.status);
    }

    filtered = sortBookings(filtered, params.sortBy, params.sortOrder);

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

  async getBookingById(id: string): Promise<Booking> {
    await wait(250);

    if (id === MOCK_SKYLINE_PAVILION_BOOKING.id) {
      return JSON.parse(JSON.stringify(MOCK_SKYLINE_PAVILION_BOOKING)) as Booking;
    }

    const booking = bookingsDb.find((item) => item.id === id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    return JSON.parse(JSON.stringify(booking)) as Booking;
  },

  async updateBookingStatus(id: string, nextStatus: Booking["status"]) {
    await wait(500);

    const index = bookingsDb.findIndex((item) => item.id === id);
    const skylineIndex = id === MOCK_SKYLINE_PAVILION_BOOKING.id ? -1 : index;

    if (index < 0 && skylineIndex < 0) {
      throw new Error("Booking not found");
    }

    if (index >= 0) {
      bookingsDb[index] = {
        ...bookingsDb[index],
        status: nextStatus,
      };
    }

    const statusLabel = nextStatus[0].toUpperCase() + nextStatus.slice(1);

    return {
      message: `Booking ${statusLabel} successfully`,
    };
  },
};