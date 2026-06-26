import { NextResponse } from "next/server";

/**
 * Razorpay payment integration is not yet active.
 * This route will be enabled once Razorpay credentials are configured.
 */
export async function POST() {
  return NextResponse.json(
    { error: "Payment gateway is not configured yet. Please contact support." },
    { status: 503 }
  );
}
