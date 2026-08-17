import type {
  PaymentBreakdown,
  Transaction,
  TransactionHost,
  TransactionGuest,
} from "@/features/transactions/types/transaction.types";

const HOSTS: TransactionHost[] = [
  {
    id: "host-1",
    fullName: "Ngozi Chukwu",
    email: "ngozi.chukwu@spaceshare.example",
    bankName: "GTBank",
    accountNumber: "0123445678",
    accountName: "Ngozi Chukwu",
  },
  {
    id: "host-2",
    fullName: "Emeka Obi",
    email: "emeka.obi@spaceshare.example",
    bankName: "Zenith Bank",
    accountNumber: "0987654321",
    accountName: "Emeka Obi",
  },
  {
    id: "host-3",
    fullName: "Ify Uzo",
    email: "ify.uzo@spaceshare.example",
    bankName: "Access Bank",
    accountNumber: "2345678901",
    accountName: "Ify Uzo",
  },
  {
    id: "host-4",
    fullName: "Tunde Bakare",
    email: "tunde.bakare@spaceshare.example",
    bankName: "UBA",
    accountNumber: "3456789012",
    accountName: "Tunde Bakare",
  },
  {
    id: "host-5",
    fullName: "Ngozi Okpara",
    email: "ngozi.okpara@spaceshare.example",
    bankName: "First Bank",
    accountNumber: "4567890123",
    accountName: "Ngozi Okpara",
  },
  {
    id: "host-6",
    fullName: "Chika Eze",
    email: "chika.eze@spaceshare.example",
    bankName: "Fidelity Bank",
    accountNumber: "5678901234",
    accountName: "Chika Eze",
  },
  {
    id: "host-7",
    fullName: "Kemi Adeyemi",
    email: "kemi.adeyemi@spaceshare.example",
    bankName: "Stanbic IBTC",
    accountNumber: "6789012345",
    accountName: "Kemi Adeyemi",
  },
  {
    id: "host-8",
    fullName: "Seyi Ajayi",
    email: "seyi.ajayi@spaceshare.example",
    bankName: "Wema Bank",
    accountNumber: "7890123456",
    accountName: "Seyi Ajayi",
  },
  {
    id: "host-9",
    fullName: "Bayo Akinola",
    email: "bayo.akinola@spaceshare.example",
    bankName: "Union Bank",
    accountNumber: "8901234567",
    accountName: "Bayo Akinola",
  },
];

const GUEST_ABMI: TransactionGuest = {
  id: "guest-1",
  fullName: "Abdul Mikes",
  email: "abdulmikes123@gmail.com",
};

const GUEST_BIDEN: TransactionGuest = {
  id: "guest-2",
  fullName: "Biden Johnson",
  email: "biden.johnson@gmail.com",
};

const MIKE_HOST: TransactionHost = {
  id: "host-mike",
  fullName: "Mike Johnson",
  email: "mikejohnson@gmail.com",
  bankName: "GTBank",
  accountNumber: "01234456789",
  accountName: "Mike Johnson",
};

function makeBreakdown(input: {
  amountPaid: number;
  commission: number;
  netPayout: number;
}): PaymentBreakdown {
  const refundableCautionFee = 50000;
  return {
    grossBookingAmount: input.amountPaid,
    platformCommission: Math.abs(input.commission),
    refundableCautionFee,
    netPayoutHost: input.netPayout,
  };
}

function createTransaction(
  partial: Partial<Transaction> & Pick<Transaction, "id" | "bookingNumber" | "host" | "status" | "amountPaid" | "commission" | "netPayout">
): Transaction {
  const payout = partial.payout ?? makeBreakdown({
    amountPaid: partial.amountPaid,
    commission: partial.commission,
    netPayout: partial.netPayout,
  });

  return {
    id: partial.id,
    bookingNumber: partial.bookingNumber,
    payoutNumber: partial.payoutNumber ?? `PO-${Math.floor(9000 + Math.random() * 999)}`,
    spaceName: partial.spaceName ?? "Skyline Pavilion",
    host: partial.host,
    guest: partial.guest,
    eventDate: partial.eventDate ?? "2025-10-02",
    paymentDate: partial.paymentDate ?? "2025-10-02T11:00:00.000Z",
    amountPaid: partial.amountPaid,
    commission: partial.commission,
    netPayout: partial.netPayout,
    status: partial.status,
    payout,
    cancellation: partial.cancellation,
    refund: partial.refund,
  };
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  createTransaction({
    id: "tx-1",
    bookingNumber: "BK-29481",
    host: HOSTS[0],
    eventDate: "2025-09-01",
    amountPaid: 310000,
    commission: 56000,
    netPayout: 256000,
    status: "paid",
  }),
  createTransaction({
    id: "tx-2",
    bookingNumber: "BK-29487",
    host: HOSTS[1],
    eventDate: "2025-09-04",
    amountPaid: 290450,
    commission: 5750,
    netPayout: 150000,
    status: "pending",
  }),
  createTransaction({
    id: "tx-3",
    bookingNumber: "BK-29482",
    host: HOSTS[2],
    eventDate: "2025-09-03",
    amountPaid: 450500,
    commission: 89300,
    netPayout: 340500,
    status: "failed",
  }),
  createTransaction({
    id: "tx-4",
    bookingNumber: "BK-29484",
    host: HOSTS[3],
    eventDate: "2025-09-05",
    amountPaid: 500000,
    commission: 78900,
    netPayout: 478200,
    status: "pending",
  }),
  createTransaction({
    id: "tx-5",
    bookingNumber: "BK-29483",
    host: HOSTS[4],
    eventDate: "2025-09-02",
    amountPaid: 385750,
    commission: 10000,
    netPayout: 125750,
    status: "success",
  }),
  createTransaction({
    id: "tx-6",
    bookingNumber: "BK-29485",
    host: HOSTS[5],
    eventDate: "2025-09-08",
    amountPaid: 600300,
    commission: 23450,
    netPayout: 89900,
    status: "cancelled",
    cancellation: {
      byName: "Mike Johnson",
      byEmail: "mikejohnson@example.com",
      timestamp: "2025-09-06T09:00:00.000Z",
      reason: "The event has to be after you pay but since it spent some urgent preparation",
    },
    refund: {
      hostPayoutAmount: 2100,
      refundAmount: 42250,
    },
  }),
  createTransaction({
    id: "tx-7",
    bookingNumber: "BK-29486",
    host: HOSTS[6],
    eventDate: "2025-09-06",
    amountPaid: 275000,
    commission: 86000,
    netPayout: 312450,
    status: "paid",
  }),
  createTransaction({
    id: "tx-8",
    bookingNumber: "BK-29488",
    host: HOSTS[7],
    eventDate: "2025-09-09",
    amountPaid: 120000,
    commission: 43200,
    netPayout: 520300,
    status: "pending",
  }),
  createTransaction({
    id: "tx-9",
    bookingNumber: "BK-29481",
    host: HOSTS[0],
    eventDate: "2025-09-01",
    amountPaid: 310000,
    commission: 12500,
    netPayout: 256000,
    status: "failed",
  }),
  createTransaction({
    id: "tx-10",
    bookingNumber: "BK-29489",
    host: HOSTS[8],
    eventDate: "2025-09-07",
    amountPaid: 410200,
    commission: 12600,
    netPayout: 275600,
    status: "success",
  }),
];

export const MOCK_SKYLINE_TRANSACTIONS: Record<
  "pending" | "failed" | "success" | "completed" | "paid" | "cancelled",
  Transaction
> = {
  pending: createTransaction({
    id: "tx-skyline-pending",
    bookingNumber: "BK-29481",
    payoutNumber: "PO-9908",
    spaceName: "Skyline Pavilion",
    host: MIKE_HOST,
    eventDate: "2025-10-02",
    paymentDate: "2025-10-02T11:00:00.000Z",
    amountPaid: 348250,
    commission: 6250,
    netPayout: 342250,
    status: "pending",
  }),
  failed: createTransaction({
    id: "tx-skyline-failed",
    bookingNumber: "BK-29481",
    payoutNumber: "PO-9908",
    spaceName: "Skyline Pavilion",
    host: MIKE_HOST,
    eventDate: "2025-10-02",
    paymentDate: "2025-10-02T11:00:00.000Z",
    amountPaid: 348250,
    commission: 6250,
    netPayout: 342250,
    status: "failed",
  }),
  success: createTransaction({
    id: "tx-skyline-success",
    bookingNumber: "BK-29481",
    payoutNumber: "PO-9908",
    spaceName: "Skyline Pavilion",
    host: MIKE_HOST,
    guest: GUEST_BIDEN,
    eventDate: "2025-10-02",
    paymentDate: "2025-10-02T11:00:00.000Z",
    amountPaid: 348250,
    commission: 6250,
    netPayout: 342250,
    status: "success",
  }),
  completed: createTransaction({
    id: "tx-skyline-completed",
    bookingNumber: "BK-29481",
    payoutNumber: "PO-9908",
    spaceName: "Skyline Pavilion",
    host: MIKE_HOST,
    guest: GUEST_ABMI,
    eventDate: "2025-10-02",
    paymentDate: "2025-10-02T11:00:00.000Z",
    amountPaid: 348250,
    commission: 6250,
    netPayout: 342250,
    status: "success",
  }),
  paid: createTransaction({
    id: "tx-skyline-paid",
    bookingNumber: "BK-29481",
    payoutNumber: "PO-9908",
    spaceName: "Skyline Pavilion",
    host: MIKE_HOST,
    guest: GUEST_BIDEN,
    eventDate: "2025-10-02",
    paymentDate: "2025-10-02T11:00:00.000Z",
    amountPaid: 348250,
    commission: 6250,
    netPayout: 342250,
    status: "paid",
  }),
  cancelled: createTransaction({
    id: "tx-skyline-cancelled",
    bookingNumber: "BK-29481",
    payoutNumber: "PO-9908",
    spaceName: "Skyline Pavilion",
    host: MIKE_HOST,
    guest: GUEST_BIDEN,
    eventDate: "2025-10-02",
    paymentDate: "2025-10-02T11:00:00.000Z",
    amountPaid: 348250,
    commission: 6250,
    netPayout: 342250,
    status: "cancelled",
    cancellation: {
      byName: "Mike Johnson",
      byEmail: "mikejohnson@gmail.com",
      timestamp: "2025-09-06T09:00:00.000Z",
      reason: "The event has to be after you pay but since it spent some urgent preparation",
    },
    refund: {
      hostPayoutAmount: 2100,
      refundAmount: 42250,
    },
  }),
};