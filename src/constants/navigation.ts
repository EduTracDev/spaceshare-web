import {
  LayoutDashboard,
  UsersRound,
  Warehouse,
  CalendarDays,
  CreditCard,
  ShieldAlert,
  MessageSquareWarning,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

/** Matches Figma sidebar. Order is strict. */
export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard",        href: "/dashboard",   icon: LayoutDashboard },
  { label: "User Management",  href: "/users",       icon: UsersRound },
  { label: "Space Listings",   href: "/listings",    icon: Warehouse },
  { label: "Bookings",         href: "/bookings",    icon: CalendarDays },
  { label: "Transactions",     href: "/transactions",icon: CreditCard },
  { label: "Disputes",         href: "/disputes",    icon: ShieldAlert },
  { label: "Reported Reviews", href: "/reviews",     icon: MessageSquareWarning },
  { label: "Audit Log",        href: "/audit",       icon: ClipboardList },
  { label: "Settings",         href: "/settings",    icon: Settings },
];

export const LOGOUT_ITEM = { label: "Logout", icon: LogOut } as const;