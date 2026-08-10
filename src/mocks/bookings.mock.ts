import type { Booking, BookingPaymentLine } from "@/features/bookings/types/booking.types";

function createBooking(partial: Partial<Booking> & Pick<Booking, "id" | "bookingNumber" | "spaceName" | "guest" | "host">): Booking {
  const spaceFee = partial.spaceFee ?? 250000;
  const addOnsTotal = partial.addOnsTotal ?? 48000;
  const cautionFee = partial.cautionFee ?? 50000;
  const serviceFee = partial.serviceFee ?? 6250;
  const amount = partial.amount ?? spaceFee + addOnsTotal + cautionFee + serviceFee;
  const platformCommission = partial.platformCommission ?? Math.round(amount * 0.1);
  const netPayoutHost = partial.netPayoutHost ?? amount - platformCommission;

  return {
    id: partial.id,
    bookingNumber: partial.bookingNumber,
    spaceName: partial.spaceName,
    location: partial.location ?? "Lekki Phase 1",
    capacityLabel: partial.capacityLabel ?? "50-100 guests",
    guest: partial.guest,
    host: partial.host,
    eventDate: partial.eventDate ?? "2025-10-02",
    eventTimeLabel: partial.eventTimeLabel ?? "10:00am - 2:00pm",
    paymentDate: partial.paymentDate ?? "2025-09-09",
    amount,
    status: partial.status ?? "pending",
    spaceFee,
    addOnsTotal,
    cautionFee,
    serviceFee,
    platformCommission,
    netPayoutHost,
  };
}

const PARTY = {
  mikeJohnson: {
    id: "host-1",
    fullName: "Mike Johnson",
    email: "mikejohnson@gmail.com",
  },
  bamideleMark: {
    id: "guest-1",
    fullName: "Bamidele Mark",
    email: "bamark@gmail.com",
  },
  adeyemiSteven: {
    id: "guest-2",
    fullName: "Adeniyi Steven",
    email: "adeniyi.steven@example.com",
  },
  ngoziChukwu: {
    id: "host-2",
    fullName: "Ngozi Chukwu",
    email: "ngozi.chukwu@example.com",
  },
  graceIbekwe: {
    id: "guest-3",
    fullName: "Grace Ibekwe",
    email: "grace.ibekwe@example.com",
  },
  emekaObi: {
    id: "host-3",
    fullName: "Emeka Obi",
    email: "emeka.obi@example.com",
  },
  chineduOkafor: {
    id: "guest-4",
    fullName: "Chinedu Okafor",
    email: "chinedu.okafor@example.com",
  },
  ifyUzo: {
    id: "host-4",
    fullName: "Ify Uzo",
    email: "ify.uzo@example.com",
  },
  halimaYusuf: {
    id: "guest-5",
    fullName: "Halima Yusuf",
    email: "halima.yusuf@example.com",
  },
  tundeBakare: {
    id: "host-5",
    fullName: "Tunde Bakare",
    email: "tunde.bakare@example.com",
  },
  funkeOlatunji: {
    id: "guest-6",
    fullName: "Funke Olatunji",
    email: "funke.olatunji@example.com",
  },
  ngoziOkpara: {
    id: "host-6",
    fullName: "Ngozi Okpara",
    email: "ngozi.okpara@example.com",
  },
  efeNnamdi: {
    id: "guest-7",
    fullName: "Efe Nnamdi",
    email: "efe.nnamdi@example.com",
  },
  chikaEze: {
    id: "host-7",
    fullName: "Chika Eze",
    email: "chika.eze@example.com",
  },
  bolanleAdebayo: {
    id: "guest-8",
    fullName: "Bolanle Adebayo",
    email: "bolanle.adebayo@example.com",
  },
  kemiAdeyemi: {
    id: "host-8",
    fullName: "Kemi Adeyemi",
    email: "kemi.adeyemi@example.com",
  },
  damilolaOgunleye: {
    id: "guest-9",
    fullName: "Damilola Ogunleye",
    email: "damilola.ogunleye@example.com",
  },
  seyiAjayi: {
    id: "host-9",
    fullName: "Seyi Ajayi",
    email: "seyi.ajayi@example.com",
  },
  ibrahimBello: {
    id: "guest-10",
    fullName: "Ibrahim Bello",
    email: "ibrahim.bello@example.com",
  },
  bayoAkinola: {
    id: "host-10",
    fullName: "Bayo Akinola",
    email: "bayo.akinola@example.com",
  },
};

export const MOCK_BOOKINGS: Booking[] = [
  createBooking({
    id: "booking-1",
    bookingNumber: "BK-29481",
    spaceName: "Garden Village Front",
    guest: PARTY.adeyemiSteven,
    host: PARTY.ngoziChukwu,
    location: "Lekki Phase 1 Lagos",
    eventDate: "2025-09-01",
    amount: 310000,
    status: "approved",
  }),
  createBooking({
    id: "booking-2",
    bookingNumber: "BK-29487",
    spaceName: "Cedar Valley Heights",
    guest: PARTY.graceIbekwe,
    host: PARTY.emekaObi,
    location: "Ajah Lagos",
    eventDate: "2025-09-04",
    amount: 290450,
    status: "pending",
  }),
  createBooking({
    id: "booking-3",
    bookingNumber: "BK-29482",
    spaceName: "Mountain View Terrace",
    guest: PARTY.chineduOkafor,
    host: PARTY.ifyUzo,
    location: "Surulere Lagos",
    eventDate: "2025-09-03",
    amount: 450500,
    status: "disputed",
  }),
  createBooking({
    id: "booking-4",
    bookingNumber: "BK-29484",
    spaceName: "Sunset Ridge Park",
    guest: PARTY.halimaYusuf,
    host: PARTY.tundeBakare,
    location: "Magodo Lagos",
    eventDate: "2025-09-05",
    amount: 500000,
    status: "pending",
  }),
  createBooking({
    id: "booking-5",
    bookingNumber: "BK-29483",
    spaceName: "Willow Creek Estates",
    guest: PARTY.funkeOlatunji,
    host: PARTY.ngoziOkpara,
    location: "Victoria Island Lagos",
    eventDate: "2025-09-02",
    amount: 385750,
    status: "completed",
  }),
  createBooking({
    id: "booking-6",
    bookingNumber: "BK-29485",
    spaceName: "Lakeside Meadows",
    guest: PARTY.efeNnamdi,
    host: PARTY.chikaEze,
    location: "Yaba Lagos",
    eventDate: "2025-09-08",
    amount: 600300,
    status: "cancelled",
  }),
  createBooking({
    id: "booking-7",
    bookingNumber: "BK-29486",
    spaceName: "Maplewood Grove",
    guest: PARTY.bolanleAdebayo,
    host: PARTY.kemiAdeyemi,
    location: "Ikoyi Lagos",
    eventDate: "2025-09-06",
    amount: 275000,
    status: "approved",
  }),
  createBooking({
    id: "booking-8",
    bookingNumber: "BK-29488",
    spaceName: "Pine Hill Commons",
    guest: PARTY.damilolaOgunleye,
    host: PARTY.seyiAjayi,
    location: "Ikeja Lagos",
    eventDate: "2025-09-09",
    amount: 120000,
    status: "pending",
  }),
  createBooking({
    id: "booking-9",
    bookingNumber: "BK-29481",
    spaceName: "Orchard Hill Plaza",
    guest: PARTY.adeyemiSteven,
    host: PARTY.ngoziChukwu,
    location: "Lekki Phase 1 Lagos",
    eventDate: "2025-09-01",
    amount: 310000,
    status: "disputed",
  }),
  createBooking({
    id: "booking-10",
    bookingNumber: "BK-29489",
    spaceName: "Garden Village Front",
    guest: PARTY.ibrahimBello,
    host: PARTY.bayoAkinola,
    location: "Festac Town Lagos",
    eventDate: "2025-09-07",
    amount: 410200,
    status: "completed",
  }),
];

export const MOCK_SKYLINE_PAVILION_BOOKING: Booking = createBooking({
  id: "booking-skyline",
  bookingNumber: "BK-29481",
  spaceName: "Skyline Pavilion",
  guest: PARTY.bamideleMark,
  host: PARTY.mikeJohnson,
  location: "Lekki Phase 1",
  capacityLabel: "50-100 guests",
  eventDate: "2025-10-02",
  eventTimeLabel: "10:00am - 2:00pm",
  paymentDate: "2025-09-09",
  amount: 354250,
  status: "approved",
  spaceFee: 250000,
  addOnsTotal: 48000,
  cautionFee: 50000,
  serviceFee: 6250,
  platformCommission: 6250,
  netPayoutHost: 342250,
});

export function getBookingPaymentLines(booking: Booking): BookingPaymentLine[] {
  return [
    { label: "Space Fee (50-100 guests)", amount: booking.spaceFee },
    { label: "Selected Add-ons", amount: booking.addOnsTotal },
    { label: "Refundable Caution Fee", amount: booking.cautionFee },
    { label: "Service Fee", amount: booking.serviceFee },
    { label: "Total charged to guest", amount: booking.amount, isTotal: true },
    { label: "Platform Commission (10%)", amount: booking.platformCommission, isDeduction: true },
    { label: "Net Payout Host", amount: booking.netPayoutHost, isTotal: true },
  ];
}