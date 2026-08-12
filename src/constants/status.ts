export const STATUS_VARIANTS = {
  active: { label: "Active", className: "bg-green-50 text-green-700 border-green-200" },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
  suspended: { label: "Suspended", className: "bg-red-50 text-red-700 border-red-200" },
  cancelled: { label: "Cancelled", className: "bg-gray-50 text-gray-700 border-gray-200" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  closed: { label: "Closed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  upcoming: { label: "Upcoming", className: "bg-blue-50 text-blue-700 border-blue-200" },
  ongoing: { label: "Ongoing", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  approved: { label: "Approved", className: "bg-green-50 text-green-700 border-green-200" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border-red-200" },
  paid: { label: "Paid", className: "bg-green-50 text-green-700 border-green-200" },
  failed: { label: "Failed", className: "bg-red-50 text-red-700 border-red-200" },
  new: { label: "New", className: "bg-blue-50 text-blue-700 border-blue-200" },
  resolved: { label: "Resolved", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  in_progress: { label: "In Progress", className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  open: { label: "Open", className: "bg-orange-50 text-orange-700 border-orange-200" },
  hidden: { label: "Hidden", className: "bg-gray-50 text-gray-700 border-gray-200" },
  pending_invite: { label: "Invite Pending", className: "bg-purple-50 text-purple-700 border-purple-200" },
} as const;

export type StatusKey = keyof typeof STATUS_VARIANTS;

export const THEME_COLORS = {
  brand: "#6200EE",
  brandHover: "#5400D0",
  brandLight: "#EDE9FE",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
} as const;