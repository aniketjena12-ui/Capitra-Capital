import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

const PLAN_BALANCES: Record<string, number> = {
  "Starter": 100000,
  "Professional": 500000,
  "Elite": 1000000,
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

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

    let planName = "Professional";
    let amountVal = 2999;

    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const order = await (razorpay.orders as any).fetch(razorpay_order_id);
        if (order && order.notes && order.notes.plan) {
          planName = order.notes.plan;
          amountVal = Number(order.amount) / 100;
        }
      } catch (err) {
        console.warn("Failed to fetch Razorpay order details. Using defaults.", err);
      }
    }

    const initialBalance = PLAN_BALANCES[planName] || 500000;

    // Use a transaction to create the payment record and activate the challenge account
    await prisma.$transaction([
      prisma.payment.create({
        data: {
          id: razorpay_payment_id,
          orderId: razorpay_order_id,
          amount: amountVal,
          planName,
          userId,
          status: "COMPLETED",
        },
      }),
      prisma.account.create({
        data: {
          userId,
          planName,
          initialBalance,
          balance: initialBalance,
          status: "ACTIVE",
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      message: "Payment verified. Your challenge account is active.",
    });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return NextResponse.json({ error: "Verification error." }, { status: 500 });
  }
}
