// spaceshare-web/src/hooks/useAuthGuard.ts
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Client-side auth guard.
 * Checks for a JWT token in localStorage, redirects to /login if missing.
 * Runs once on mount.
 */
export function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      // Preserve the original destination so we can send user back after login
      const redirectTo = encodeURIComponent(pathname || "/dashboard");
      router.replace(`/login?next=${redirectTo}`);
    }
  }, [router, pathname]);
}