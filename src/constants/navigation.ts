import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Warehouse,
  CalendarDays,
  Wallet,
  ShieldAlert,
  MessageSquareWarning,
  ClipboardList,
  Settings,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/users", icon: Users },
  { label: "Listings", href: "/listings", icon: Warehouse },
  { label: "Bookings", href: "/bookings", icon: CalendarDays },
  { label: "Payouts", href: "/payouts", icon: Wallet },
  { label: "Disputes", href: "/disputes", icon: ShieldAlert, badge: "3" },
  { label: "Reviews", href: "/reviews", icon: MessageSquareWarning },
  { label: "Audit Log", href: "/audit", icon: ClipboardList },
  { label: "Settings", href: "/settings", icon: Settings },
];