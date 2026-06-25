import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields." }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
    }

    // TODO: persist payment record to DB, activate challenge account
    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      message: "Payment verified. Your challenge account is being activated.",
    });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return NextResponse.json({ error: "Verification error." }, { status: 500 });
  }
}
