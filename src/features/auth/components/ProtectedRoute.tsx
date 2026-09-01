"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

/**
 * Wrap any route group layout (e.g. (dashboard)/layout.tsx) with this
 * to require authentication for every child page.
 *
 * Shows a centered loading spinner while token check is in flight.
 * Redirects to /login if no token is present.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  useAuthGuard();

  // During the first render (before useEffect has a chance to run),
  // window.localStorage may not be accessible in SSR / initial RSC payload.
  // Show a minimal loading state to avoid flashing dashboard chrome when
  // user is actually about to be redirected to login.
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  }

  return <>{children}</>;
}