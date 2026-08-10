import type {
  AuditLog,
  AuditLogActor,
  AuditLogAction,
} from "@/features/audit-logs/types/audit-log.types";

const ACTORS: AuditLogActor[] = [
  {
    id: "u-1",
    fullName: "Rukayat Bello",
    email: "rukayatbello@gmail.com",
  },
  {
    id: "u-2",
    fullName: "Ibrahim Suleiman",
    email: "ibrahim.suleiman@gmail.com",
  },
  {
    id: "u-3",
    fullName: "Tunde Adebayo",
    email: "tunde.adebayo@gmail.com",
  },
  {
    id: "u-4",
    fullName: "Adeola Femi",
    email: "adeola.femi@outlook.com",
  },
  {
    id: "u-5",
    fullName: "Chioma Eze",
    email: "chioma.eze@hotmail.com",
  },
  {
    id: "u-6",
    fullName: "Fatima Musa",
    email: "fatima.musa@mail.com",
  },
  {
    id: "u-7",
    fullName: "Emmanuel Okoro",
    email: "emmanuel.okoro@yahoo.com",
  },
  {
    id: "u-8",
    fullName: "Yemi Johnson",
    email: "yemi.johnson@yahoo.com",
  },
  {
    id: "u-9",
    fullName: "Amina Abdullahi",
    email: "amina.abdullahi@hotmail.com",
  },
];

const ACTIONS: AuditLogAction[] = [
  "Admin login",
  "Admin Logout",
  "Admin suspend user",
  "Invited admin user",
  "Resent admin invitation",
  "Cancelled admin invitation",
  "Suspended admin user",
  "Restored admin access",
  "Approved space listing",
  "Rejected space listing",
  "Removed review",
];

const DESCRIPTIONS_BY_ACTION: Record<AuditLogAction, string[]> = {
  "Admin login": [
    "Rukayat logged in to the system",
    "Emmanuel logged in from the Lagos office IP",
    "Tunde completed two-factor verification",
  ],
  "Admin Logout": [
    "Chinedu changed his account password",
    "Chioma ended her session after 4 hours",
    "Aminat logged out following the audit sweep",
  ],
  "Admin suspend user": [
    "Sarah Johnson suspended host John Doe",
    "Kemi suspended guest Chidi Okoro for policy breach",
    "Platform automation suspended user for suspicious activity",
  ],
  "Invited admin user": [
    "Tunde uploaded the quarterly report",
    "Adebayo invited two finance ops admins",
    "Product team invited Chidi to the ops workspace",
  ],
  "Resent admin invitation": [
    "Emeka scheduled a team meeting",
    "Favour resent the invite to the onboarding lead",
    "Admin invitation was retried after previous bounce",
  ],
  "Cancelled admin invitation": [
    "Adewale updated his profile information",
    "Operations cancelled the stale invite for Seyi",
    "Invite revoked after the role was reassigned",
  ],
  "Suspended admin user": [
    "Bola downloaded the latest software update",
    "Musa admin account suspended after failed logins",
    "Account access was revoked pending review",
  ],
  "Restored admin access": [
    "Rukayat logged in to the system",
    "Operations restored Funmi's admin permissions",
    "Access reinstated after policy appeal passed",
  ],
  "Approved space listing": [
    "Femi logged out after reviewing notifications",
    "Approved Garden Village Front listing",
    "Approved Skyline Pavilion listing after inspection",
  ],
  "Rejected space listing": [
    "Sade completed the onboarding checklist",
    "Rejected Sunset Pavilion listing (images missing)",
    "Rejected Orchard Hill Plaza listing for incomplete docs",
  ],
  "Removed review": [
    "Kemi submitted a new support ticket",
    "Review removed after moderators reviewed report",
    "Removed duplicate review from booking BK-29486",
  ],
};

const TIMESTAMPS = [
  "2025-09-01T13:23:00.000Z",
  "2025-09-05T16:55:00.000Z",
  "2025-09-03T11:10:00.000Z",
  "2025-09-04T09:30:00.000Z",
  "2025-09-02T14:45:00.000Z",
  "2025-09-06T07:20:00.000Z",
  "2025-09-01T13:23:00.000Z",
  "2025-09-07T12:00:00.000Z",
  "2025-09-08T15:00:00.000Z",
  "2025-09-09T09:30:00.000Z",
  "2025-09-10T08:12:00.000Z",
  "2025-09-11T18:33:00.000Z",
  "2025-09-12T10:20:00.000Z",
  "2025-09-13T16:14:00.000Z",
  "2025-09-14T12:05:00.000Z",
  "2025-09-15T09:02:00.000Z",
  "2025-09-16T14:50:00.000Z",
  "2025-09-17T11:41:00.000Z",
  "2025-09-18T08:28:00.000Z",
  "2025-09-19T20:17:00.000Z",
  "2025-09-20T06:55:00.000Z",
  "2025-09-21T15:34:00.000Z",
  "2025-09-22T12:00:00.000Z",
  "2025-09-23T09:44:00.000Z",
  "2025-09-24T17:22:00.000Z",
  "2025-09-25T13:05:00.000Z",
  "2025-09-26T10:40:00.000Z",
  "2025-09-27T07:15:00.000Z",
  "2025-09-28T19:02:00.000Z",
  "2025-09-29T14:48:00.000Z",
  "2025-09-30T11:21:00.000Z",
  "2025-10-01T08:05:00.000Z",
  "2025-10-02T16:30:00.000Z",
  "2025-10-03T13:44:00.000Z",
  "2025-10-04T09:15:00.000Z",
  "2025-10-05T15:52:00.000Z",
  "2025-10-06T12:17:00.000Z",
  "2025-10-07T10:30:00.000Z",
  "2025-10-08T08:20:00.000Z",
  "2025-10-09T17:41:00.000Z",
];

function seededPick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function createAuditLogs(count: number): AuditLog[] {
  const logs: AuditLog[] = [];

  for (let i = 0; i < count; i += 1) {
    const action = seededPick(ACTIONS, i * 3 + 7);
    const actor = seededPick(ACTORS, i * 5 + 11);
    const description = seededPick(DESCRIPTIONS_BY_ACTION[action], i * 2 + 3);
    const timestamp = seededPick(TIMESTAMPS, i);

    logs.push({
      id: `al-${1000 + i}`,
      actor,
      timestamp,
      action,
      description,
      ipAddress: `192.168.10.${(i % 254) + 1}`,
    });
  }

  return logs;
}

export const MOCK_AUDIT_LOGS: AuditLog[] = createAuditLogs(100);