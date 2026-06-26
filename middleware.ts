import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_EMAIL = "admin@capitracapital.com";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET || "capitra-capital-secret-key",
    });

    // Not logged in → go to login
    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Logged in but not admin → go to dashboard
    if (token.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
