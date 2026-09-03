import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";  // npm i jose   ← (NOT jsonwebtoken — jose works in Edge Runtime which middleware uses!)

// Routes that NEVER require auth (public pages like login, password reset, invitation accept)
const PUBLIC_PATHS = new Set([
  "/login",
  "/forgot-password",
  "/reset-password",
  "/admin/accept-invitation",
  "/favicon.ico",
  "/_next",
]);

// COOKIE NAME — MUST match exactly what we set in login step
const AUTH_COOKIE = "vybespace_jwt";

// JWT SECRET — loaded from .env.local because middleware runs on server too!
// MUST match backend's JWT_SECRET exactly.
// async function getJwtSecret() {
//   const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
//   if (!secret) {
//     // console.warn("⚠️  middleware: JWT_SECRET env missing, falling back to allow-all for dev");
//     return null;
//   }
//   return new TextEncoder().encode(secret);
// }

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* ---- 1) Public pages: bypass early ---- */
  for (const pub of PUBLIC_PATHS) {
    if (pathname === pub || pathname.startsWith(pub)) {
      return NextResponse.next();
    }
  }

  /* ---- 2) Dashboard/admin protected area: check cookie ---- */
  const tokenCookie = request.cookies.get(AUTH_COOKIE)?.value ?? "";
  if (!tokenCookie) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(redirectUrl);
  }

  /* ---- 3) Optional: Verify JWT signature + expiry in middleware (recommended — belt) ----
   * If JWT_SECRET available, use jose to verify. If fail -> redirect.
   * Pass through either way — backend will reject bad tokens on real API calls anyway.
   */
  // const secret = await getJwtSecret();
  // if (secret) {
  //   try {
  //     await jose.jwtVerify(tokenCookie, secret);
  //   } catch (err) {
  //     // Invalid JWT signature or expired
  //     console.warn("middleware rejecting invalid/expired JWT:", (err as Error).message);
  //     const redirectUrl = request.nextUrl.clone();
  //     redirectUrl.pathname = "/login";
  //     redirectUrl.search = `?next=${encodeURIComponent(pathname)}`;
  //     const res = NextResponse.redirect(redirectUrl);
  //     res.cookies.delete(AUTH_COOKIE);   // clean malformed cookie
  //     return res;
  //   }
  // }

  return NextResponse.next();
}

// Optional: Restrict middleware to run ONLY on dashboard routes (match all except /_next static, /favicon, /api (Next API routes if any))
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml)$).*)",
  ],
};