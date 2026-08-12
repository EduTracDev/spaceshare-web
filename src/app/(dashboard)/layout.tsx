import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | SpaceShare Admin" },
};


const MOBILE_NAV_TOGGLE_ID = "mobile-nav-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0 bg-sidebar">
        <div className="flex items-center border-b border-sidebar-border bg-background px-4 py-3 lg:hidden">
          <button
            id={MOBILE_NAV_TOGGLE_ID}
            type="button"
            aria-label="Open navigation menu"
            aria-controls="mobile-sidebar-sheet"
            aria-expanded="false"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary border border-border bg-card text-foreground hover:bg-muted hover:text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>

          <div className="ml-3 flex items-center gap-2">
            <span className="font-bold text-xl text-primary tracking-tight">
              SpaceShare
            </span>
          </div>
        </div>

        <PageContainer paddingY="md">
          {children}
        </PageContainer>
      </main>
    </div>
  );
}