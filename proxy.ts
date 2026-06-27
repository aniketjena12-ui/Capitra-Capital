import { NextRequest, NextResponse } from "next/server";
import { jwtDecrypt } from "jose";
import hkdf from "@panva/hkdf";
import { ADMIN_EMAIL } from "@/lib/constants";

// Helper to derive the exact encryption key NextAuth uses
async function getDerivedEncryptionKey(secret: string, salt: string) {
  return await hkdf(
    "sha256",
    secret,
    salt,
    `NextAuth.js Generated Encryption Key${salt ? ` (${salt})` : ""}`,
    32
  );
}

// Helper to decrypt NextAuth JWE token
async function decryptToken(token: string, secret: string, salt: string) {
  const encryptionSecret = await getDerivedEncryptionKey(secret, salt);
  const { payload } = await jwtDecrypt(token, encryptionSecret, {
    clockTolerance: 15,
  });
  return payload;
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      console.error("NEXTAUTH_SECRET is missing in proxy.");
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Determine cookie name based on secure protocol
    const secureCookie = req.nextUrl.protocol === "https:";
    const primaryCookieName = secureCookie
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";
    const fallbackCookieName = secureCookie
      ? "next-auth.session-token"
      : "__Secure-next-auth.session-token";

    let tokenVal = "";
    let usedCookieName = primaryCookieName;

    // Check primary cookie name (first try chunked, then single)
    let chunkIndex = 0;
    while (true) {
      const chunk = req.cookies.get(`${primaryCookieName}.${chunkIndex}`)?.value;
      if (!chunk) break;
      tokenVal += chunk;
      chunkIndex++;
    }

    if (!tokenVal) {
      const single = req.cookies.get(primaryCookieName)?.value;
      if (single) {
        tokenVal = single;
      }
    }

    // If primary failed, check fallback cookie name
    if (!tokenVal) {
      usedCookieName = fallbackCookieName;
      chunkIndex = 0;
      while (true) {
        const chunk = req.cookies.get(`${fallbackCookieName}.${chunkIndex}`)?.value;
        if (!chunk) break;
        tokenVal += chunk;
        chunkIndex++;
      }

      if (!tokenVal) {
        const single = req.cookies.get(fallbackCookieName)?.value;
        if (single) {
          tokenVal = single;
        }
      }
    }

    let token: any = null;

    if (tokenVal) {
      try {
        token = await decryptToken(tokenVal, secret, usedCookieName);
      } catch (err) {
        console.error("Failed to decrypt session token in proxy:", err);
      }
    }

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
