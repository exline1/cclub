import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // getToken handles extracting the token from cookies securely
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "cclub-super-secret-key-2026" });

  const { pathname } = req.nextUrl;

  // Protect Admin Routes
  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "ADMIN") {
      // Redirect to login if not logged in or not an ADMIN
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect Super Admin Routes
  if (pathname.startsWith("/super-admin")) {
    if (!token || token.role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Example for Club Owner routes
  if (pathname.startsWith("/klub-panel")) {
    if (!token || (token.role !== "CLUB_OWNER" && token.role !== "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/super-admin/:path*", "/klub-panel/:path*"],
};
