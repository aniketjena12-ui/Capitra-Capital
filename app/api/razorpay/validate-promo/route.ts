import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rateLimit, getIp } from "@/lib/rateLimit";

/**
 * Server-side promo code store.
 * Keys are uppercase promo codes, values are discount percentages.
 *
 * In production, you can override these by setting PROMO_CODES env var as JSON:
 *   PROMO_CODES={"LAUNCH30":30,"VIP50":50}
 */
function getPromoCodes(): Record<string, number> {
  if (process.env.PROMO_CODES) {
    try {
      return JSON.parse(process.env.PROMO_CODES);
    } catch {
      console.error("[PromoCode] Failed to parse PROMO_CODES env var. Using defaults.");
    }
  }

  // Default codes — change or remove as needed
  return {
    CAPITRA10: 10,
    WELCOME20: 20,
    LAUNCH25: 25,
  };
}

/**
 * POST /api/razorpay/validate-promo
 * Validates a promo code server-side.
 * Requires authentication. Rate-limited to 20 attempts per IP per 15 minutes.
 */
export async function POST(req: NextRequest) {
  // Auth check — must be logged in to use promo codes
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limiting — prevent brute-forcing promo codes
  const ip = getIp(req);
  const limit = rateLimit(`promo:${ip}`, { limit: 20, windowSeconds: 15 * 60 });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait before trying again." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { code, planPrice } = body;

  if (!code || typeof code !== "string") {
    return NextResponse.json({ valid: false, error: "Promo code is required." }, { status: 400 });
  }

  if (!planPrice || typeof planPrice !== "number" || planPrice <= 0) {
    return NextResponse.json({ valid: false, error: "Invalid plan price." }, { status: 400 });
  }

  const promoCodes = getPromoCodes();
  const discountPct = promoCodes[code.trim().toUpperCase()];

  if (!discountPct) {
    return NextResponse.json({ valid: false, message: "Invalid or expired promo code." });
  }

  const discountedPrice = Math.round(planPrice * (1 - discountPct / 100));

  return NextResponse.json({
    valid: true,
    discountPct,
    discountedPrice,
    message: `${discountPct}% discount applied.`,
  });
}
