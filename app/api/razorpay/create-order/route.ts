import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rateLimit, getIp } from "@/lib/rateLimit";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  // Auth check — only logged-in users can initiate payments
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit — 10 order attempts per IP per 15 minutes
  const ip = getIp(req);
  const limit = rateLimit(`create-order:${ip}`, { limit: 10, windowSeconds: 15 * 60 });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before trying again." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { amount, planName } = body;

    if (!amount || !planName) {
      return NextResponse.json({ error: "Amount and plan name are required." }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `capitra_${planName}_${Date.now()}`,
      notes: { plan: planName },
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json({ error: "Failed to create order." }, { status: 500 });
  }
}
