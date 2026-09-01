"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIDEBAR_NAV_ITEMS, LOGOUT_ITEM } from "@/constants/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader
} from "@/components/ui/sheet";

/** MUST match the static `id=` rendered on the hamburger button in Server layout.tsx */
const MOBILE_NAV_TOGGLE_ID = "mobile-nav-toggle";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };
  const LogoutIcon = LOGOUT_ITEM.icon;


  React.useEffect(() => {
    let attached = false;
    let btn: HTMLElement | null = null;

    const openSheet = () => {
      setMobileOpen(true);
      if (btn) {
        btn.setAttribute("aria-expanded", "true");
      }
    };

    const attach = () => {
      btn = document.getElementById(MOBILE_NAV_TOGGLE_ID);
      if (!btn || attached) return;
      attached = true;
      btn.addEventListener("click", openSheet);
    };

    attach();


    const timeoutId = window.setTimeout(attach, 0);

    return () => {
      window.clearTimeout(timeoutId);
      if (btn && attached) {
        btn.removeEventListener("click", openSheet);
        btn.setAttribute("aria-expanded", "false");
      }
    };
  }, []);


  const handleMobileOpenChange = React.useCallback(
    (next: boolean) => {
      setMobileOpen(next);
      const btn = document.getElementById(MOBILE_NAV_TOGGLE_ID);
      if (btn) {
        btn.setAttribute("aria-expanded", next ? "true" : "false");
      }
    },
    []
  );

  const handleLogoutClick = React.useCallback(() => {
        
    setMobileOpen(false);
    router.replace("/login");
  }, [router]);



  const renderSidebarInner = (
    variant: "desktop" | "mobile",
    onNavigate?: () => void
  ) => (
    <>

      <div
        className={cn(
          "flex flex-col justify-center space-y-2 border-b border-sidebar-border",
          variant === "desktop" ? "h-20 px-5 pt-6 pb-5" : "px-5 pt-6 pb-5"
        )}
      >
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2 shrink-0"
        >
          <span className="font-bold text-lg lg:text-[15px] text-primary tracking-tight">
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
      <nav
        className={cn(
          "flex-1 px-3 space-y-0.5 overflow-y-auto",
          variant === "desktop" ? "py-2" : "py-4"
        )}
      >
        {SIDEBAR_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[15px] lg:text-[13px] font-medium transition-colors",
                active
                  ? "text-primary font-bold md:bg-primary md:text-primary-foreground md:shadow-[0_4px_12px_-4px_rgba(98,0,238,0.4)]"
                  : "text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon
                size={17}
                className={cn(
                  "shrink-0",
                  active
                    ? "md:text-primary-foreground"
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
          onClick={handleLogoutClick}   
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
        >
          <LogoutIcon size={17} className="shrink-0" />
          <span>{LOGOUT_ITEM.label}</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar (hidden below md) */}
      <aside
        data-slot="sidebar-desktop"
        className="hidden lg:flex lg:flex-col w-60 lg:w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-sidebar-border"
      >
        {renderSidebarInner("desktop")}
      </aside>

      {/* Mobile drawer sheet (below md breakpoint) */}
      <Sheet open={mobileOpen} onOpenChange={handleMobileOpenChange}>
        <SheetContent
          id="mobile-sidebar-sheet"
          side="left"
          showCloseButton
          className="w-[82vw] !max-w-[340px] rounded-r-2xl border-r-sidebar-border bg-white p-0 flex flex-col h-full duration-500 transition-all"
          aria-label="Main navigation"
        >
          <SheetHeader className="sr-only">
            <h2>SpaceShare Admin Navigation</h2>
          </SheetHeader>
          <div className="flex h-full flex-col overflow-hidden">
            {renderSidebarInner("mobile", () => setMobileOpen(false))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}