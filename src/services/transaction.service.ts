import { MOCK_SKYLINE_TRANSACTIONS, MOCK_TRANSACTIONS } from "@/mocks/transactions.mock";
import type {
  PaginatedTransactions,
  Transaction,
  TransactionQueryParams,
  TransactionStatus,
} from "@/features/transactions/types/transaction.types";

const wait = (ms = 450) => new Promise((resolve) => setTimeout(resolve, ms));

const transactionsDb: Transaction[] = JSON.parse(JSON.stringify(MOCK_TRANSACTIONS)) as Transaction[];

function sortTransactions(
  items: Transaction[],
  sortBy?: TransactionQueryParams["sortBy"],
  sortOrder: TransactionQueryParams["sortOrder"] = "asc"
) {
  if (!sortBy) return items;

  const factor = sortOrder === "desc" ? -1 : 1;

  return [...items].sort((a, b) => {
    if (sortBy === "hostName") {
      return a.host.fullName.localeCompare(b.host.fullName) * factor;
    }

    if (sortBy === "eventDate") {
      return (new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()) * factor;
    }

    if (sortBy === "amountPaid") {
      return (a.amountPaid - b.amountPaid) * factor;
    }

    if (sortBy === "commission") {
      return (a.commission - b.commission) * factor;
    }

    if (sortBy === "netPayout") {
      return (a.netPayout - b.netPayout) * factor;
    }

    if (sortBy === "bookingNumber") {
      return a.bookingNumber.localeCompare(b.bookingNumber) * factor;
    }

    if (sortBy === "status") {
      return a.status.localeCompare(b.status) * factor;
    }

    return 0;
  });
}

export const transactionService = {
  async getTransactions(params: TransactionQueryParams = {}): Promise<PaginatedTransactions> {
    await wait();

    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;

    let filtered = [...transactionsDb];

    if (params.search) {
      const term = params.search.toLowerCase();
      filtered = filtered.filter((tx) =>
        [tx.bookingNumber, tx.host.fullName, tx.payoutNumber].some((value) =>
          value.toLowerCase().includes(term)
        )
      );
    }

    if (params.status) {
      filtered = filtered.filter((tx) => tx.status === params.status);
    }

    filtered = sortTransactions(filtered, params.sortBy, params.sortOrder);

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

  async getTransactionById(id: string): Promise<Transaction> {
    await wait(250);

    const skylineValues = Object.values(MOCK_SKYLINE_TRANSACTIONS).find((tx) => tx.id === id);
    if (skylineValues) {
      return JSON.parse(JSON.stringify(skylineValues)) as Transaction;
    }

    const tx = transactionsDb.find((item) => item.id === id);
    if (!tx) {
      throw new Error("Transaction not found");
    }

    return JSON.parse(JSON.stringify(tx)) as Transaction;
  },

  async markAsPaid(id: string) {
    await wait(500);

    const index = transactionsDb.findIndex((item) => item.id === id);
    if (index >= 0) {
      transactionsDb[index] = {
        ...transactionsDb[index],
        status: "paid",
      };
    }

    return {
      message: "Mark payout as Paid successfully",
    };
  },

  async markAsRefunded(id: string) {
    await wait(500);

    const index = transactionsDb.findIndex((item) => item.id === id);
    if (index >= 0) {
      transactionsDb[index] = {
        ...transactionsDb[index],
        status: "success",
      };
    }

    return {
      message: "Mark Refund as Successful successfully",
    };
  },
};