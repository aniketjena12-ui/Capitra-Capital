import { NextResponse } from "next/server";

/**
 * Razorpay promo code validation is not yet active.
 * This route will be enabled once Razorpay integration is configured.
 */
export async function POST() {
  return NextResponse.json(
    { valid: false, error: "Payment gateway is not configured yet." },
    { status: 503 }
  );
}
