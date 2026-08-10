import type {
  Dispute,
  DisputeEvidenceFile,
  DisputeRaisedParty,
} from "@/features/disputes/types/dispute.types";

const PARTIES: DisputeRaisedParty[] = [
  { id: "p-1", fullName: "Ifeoma Nwosu", email: "ifeoma.nwosu@example.com" },
  { id: "p-2", fullName: "Ngozi Chukwu", email: "ngozi.chukwu@example.com" },
  { id: "p-3", fullName: "Chinedu Umeh", email: "chinedu.umeh@example.com" },
  { id: "p-4", fullName: "Emeka Obi", email: "emeka.obi@example.com" },
  { id: "p-5", fullName: "Amaka Nwafor", email: "amaka.nwafor@example.com" },
  { id: "p-6", fullName: "Ify Uzo", email: "ify.uzo@example.com" },
  { id: "p-7", fullName: "Jide Afolayan", email: "jide.afolayan@example.com" },
  { id: "p-8", fullName: "Tunde Bakare", email: "tunde.bakare@example.com" },
  { id: "p-9", fullName: "Adaeze Okeke", email: "adaeze.okeke@example.com" },
  { id: "p-10", fullName: "Ngozi Okpara", email: "ngozi.okpara@example.com" },
  { id: "p-11", fullName: "Olumide Balogun", email: "olumide.balogun@example.com" },
  { id: "p-12", fullName: "Chika Eze", email: "chika.eze@example.com" },
  { id: "p-13", fullName: "Folake Akinbiyi", email: "folake.akinbiyi@example.com" },
  { id: "p-14", fullName: "Kemi Adeyemi", email: "kemi.adeyemi@example.com" },
  { id: "p-15", fullName: "Tosin Bello", email: "tosin.bello@example.com" },
  { id: "p-16", fullName: "Seyi Ajayi", email: "seyi.ajayi@example.com" },
  { id: "p-17", fullName: "Bayo Akinola", email: "bayo.akinola@example.com" },
  { id: "p-18", fullName: "Mike Johnson", email: "mikejohnson@gmail.com" },
  { id: "p-19", fullName: "Bamidele Mark", email: "bamark@gmail.com" },
];

const EVIDENCE: DisputeEvidenceFile[] = [
  {
    id: "ev-1",
    name: "transaction_history.pdf",
    sizeLabel: "1.2 MB",
    kind: "document",
    downloadUrl: "#",
  },
  {
    id: "ev-2",
    name: "payment_receipt.png",
    sizeLabel: "346 KB",
    kind: "image",
    downloadUrl: "#",
  },
];

const SPACES = [
  "Garden Village Front",
  "Cedar Valley Heights",
  "Mountain View Terrace",
  "Sunset Ridge Park",
  "Willow Creek Estates",
  "Lakeside Meadows",
  "Maplewood Grove",
  "Pine Hill Commons",
  "Orchard Hill Plaza",
];

function createDispute(input: {
  id: string;
  disputeNumber: string;
  bookingNumber: string;
  guest: DisputeRaisedParty;
  host: DisputeRaisedParty;
  spaceName: string;
  dateFiled: string;
  dateTimeFiled: string;
  status: Dispute["status"];
  raisedBy: Dispute["raisedBy"];
  reason: string;
  evidence?: DisputeEvidenceFile[];
}): Dispute {
  const raisedByParty = input.raisedBy === "host" ? input.host : input.guest;
  return {
    id: input.id,
    disputeNumber: input.disputeNumber,
    bookingNumber: input.bookingNumber,
    guest: input.guest,
    host: input.host,
    spaceName: input.spaceName,
    dateFiled: input.dateFiled,
    dateTimeFiled: input.dateTimeFiled,
    status: input.status,
    raisedBy: input.raisedBy,
    raisedByParty,
    reason: input.reason,
    evidence: input.evidence ?? [],
  };
}

export const MOCK_DISPUTES: Dispute[] = [
  createDispute({
    id: "dp-1",
    disputeNumber: "DP-081",
    bookingNumber: "BK-29482",
    guest: PARTIES[0],
    host: PARTIES[1],
    spaceName: SPACES[0],
    dateFiled: "2025-09-01",
    dateTimeFiled: "2025-10-02T11:00:00.000Z",
    status: "new",
    raisedBy: "host",
    reason:
      "\"When we arrived, the space had not been cleaned from the previous event and several amenities listed were missing. We had to delay our setup by 90 minutes and lost time with vendors.\"",
  }),
  createDispute({
    id: "dp-2",
    disputeNumber: "DP-086",
    bookingNumber: "BK-29486",
    guest: PARTIES[2],
    host: PARTIES[3],
    spaceName: SPACES[1],
    dateFiled: "2025-09-04",
    dateTimeFiled: "2025-10-02T11:00:00.000Z",
    status: "resolved",
    raisedBy: "guest",
    reason:
      "\"Venue was smaller than advertised; we had to turn guests away at the entrance.\"",
  }),
  createDispute({
    id: "dp-3",
    disputeNumber: "DP-084",
    bookingNumber: "BK-29485",
    guest: PARTIES[4],
    host: PARTIES[5],
    spaceName: SPACES[2],
    dateFiled: "2025-09-03",
    dateTimeFiled: "2025-10-02T11:00:00.000Z",
    status: "resolved",
    raisedBy: "guest",
    reason:
      "\"Sound system failed part way through the event and the host was unreachable.\"",
  }),
  createDispute({
    id: "dp-4",
    disputeNumber: "DP-088",
    bookingNumber: "BK-29484",
    guest: PARTIES[6],
    host: PARTIES[7],
    spaceName: SPACES[3],
    dateFiled: "2025-09-05",
    dateTimeFiled: "2025-10-02T11:00:00.000Z",
    status: "new",
    raisedBy: "guest",
    reason:
      "\"Power outage lasted 3 hours. Host offered no backup generator or partial refund.\"",
  }),
  createDispute({
    id: "dp-5",
    disputeNumber: "DP-083",
    bookingNumber: "BK-29487",
    guest: PARTIES[8],
    host: PARTIES[9],
    spaceName: SPACES[4],
    dateFiled: "2025-09-02",
    dateTimeFiled: "2025-10-02T11:00:00.000Z",
    status: "new",
    raisedBy: "host",
    reason:
      "\"Guest left venue in severe disrepair with broken furniture we need replaced.\"",
  }),
  createDispute({
    id: "dp-6",
    disputeNumber: "DP-085",
    bookingNumber: "BK-29488",
    guest: PARTIES[10],
    host: PARTIES[11],
    spaceName: SPACES[5],
    dateFiled: "2025-09-08",
    dateTimeFiled: "2025-10-02T11:00:00.000Z",
    status: "resolved",
    raisedBy: "guest",
    reason:
      "\"Catering partner listed in the add-ons was a no-show. Venue couldn't locate them.\"",
  }),
  createDispute({
    id: "dp-7",
    disputeNumber: "DP-082",
    bookingNumber: "BK-29483",
    guest: PARTIES[12],
    host: PARTIES[13],
    spaceName: SPACES[6],
    dateFiled: "2025-09-06",
    dateTimeFiled: "2025-10-02T11:00:00.000Z",
    status: "resolved",
    raisedBy: "host",
    reason:
      "\"Guest exceeded capacity by almost 40 people despite warnings in contract.\"",
  }),
  createDispute({
    id: "dp-8",
    disputeNumber: "DP-089",
    bookingNumber: "BK-29489",
    guest: PARTIES[14],
    host: PARTIES[15],
    spaceName: SPACES[7],
    dateFiled: "2025-09-09",
    dateTimeFiled: "2025-10-02T11:00:00.000Z",
    status: "resolved",
    raisedBy: "guest",
    reason:
      "\"Decoration items listed as included were not provided; we had to purchase day-of.\"",
  }),
  createDispute({
    id: "dp-9",
    disputeNumber: "DP-081",
    bookingNumber: "BK-29482",
    guest: PARTIES[3],
    host: PARTIES[1],
    spaceName: SPACES[8],
    dateFiled: "2025-09-01",
    dateTimeFiled: "2025-10-02T11:00:00.000Z",
    status: "new",
    raisedBy: "host",
    reason:
      "\"Caution fee dispute: several stained linens and broken glassware items need replacement.\"",
  }),
  createDispute({
    id: "dp-10",
    disputeNumber: "DP-087",
    bookingNumber: "BK-29490",
    guest: PARTIES[9],
    host: PARTIES[16],
    spaceName: SPACES[0],
    dateFiled: "2025-09-07",
    dateTimeFiled: "2025-10-02T11:00:00.000Z",
    status: "new",
    raisedBy: "guest",
    reason:
      "\"Cleaning was not performed prior to our event start; odor complaints from guests.\"",
  }),
];

export const MOCK_DISPUTE_D440: Dispute = createDispute({
  id: "dp-d440",
  disputeNumber: "D-440",
  bookingNumber: "BK-29481",
  guest: PARTIES[18],
  host: PARTIES[17],
  spaceName: "Skyline Pavilion",
  dateFiled: "2025-10-02",
  dateTimeFiled: "2025-10-02T11:00:00.000Z",
  status: "new",
  raisedBy: "host",
  reason:
    "\"When we arrived, the space had not been cleaned from the previous event and several amenities listed were missing. We had to delay our setup by 90 minutes and lost time with vendors.\"",
  evidence: EVIDENCE,
});