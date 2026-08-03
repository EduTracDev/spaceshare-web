import type { Metadata } from "next";
import { AuthLeftPanel } from "@/features/auth/components/AuthLeftPanel";

export const metadata: Metadata = {
  title: "Admin Access",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <AuthLeftPanel />
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 xl:p-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}