import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | SpaceShare Admin" },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <PageContainer paddingY="md" className="pt-6 sm:pt-8">
          {children}
        </PageContainer>
      </main>
    </div>
  );
}