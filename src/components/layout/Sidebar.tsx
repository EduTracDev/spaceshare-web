"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIDEBAR_NAV_ITEMS, LOGOUT_ITEM } from "@/constants/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };
  const LogoutIcon = LOGOUT_ITEM.icon;

  return (
    <aside
      data-slot="sidebar"
      className="hidden md:flex md:flex-col w-60 lg:w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-sidebar-border"
    >
      {/* Logo + Admin label */}
      <div className="h-20 px-5 pt-6 pb-5 flex flex-col justify-center space-y-2 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-[15px] text-primary tracking-tight">
            SpaceShare
          </span>
        </Link>
        <div className="flex items-center gap-2 pt-1">
          <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <UserCircle2 size={14} strokeWidth={2.2} />
          </div>
          <span className="text-sm font-semibold text-sidebar-foreground/90">
            Admin
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-[0_4px_12px_-4px_rgba(98,0,238,0.4)]"
                  : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon
                size={17}
                className={cn(
                  "shrink-0",
                  active
                    ? "text-primary-foreground"
                    : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground"
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 pt-2 border-t border-sidebar-border">
        <button
          type="button"
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogoutIcon size={17} className="shrink-0" />
          <span>{LOGOUT_ITEM.label}</span>
        </button>
      </div>
    </aside>
  );
}