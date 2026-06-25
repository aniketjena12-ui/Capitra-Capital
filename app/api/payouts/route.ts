import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    
    const payouts = await prisma.payoutRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const activeAccount = await prisma.account.findFirst({
      where: { userId, status: "ACTIVE" },
    });

    return NextResponse.json({ payouts, activeAccount });
  } catch (error) {
    console.error("GET payouts error:", error);
    return NextResponse.json({ error: "Failed to fetch payouts." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { amount, method } = body;

    if (!amount || !method) {
      return NextResponse.json({ error: "Amount and method are required." }, { status: 400 });
    }

    const activeAccount = await prisma.account.findFirst({
      where: { userId, status: "ACTIVE" },
    });

    if (!activeAccount) {
      return NextResponse.json({ error: "No active challenge account found." }, { status: 404 });
    }

    const val = Number(amount);
    const profit = activeAccount.balance - activeAccount.initialBalance;
    const available = profit > 0 ? profit * 0.8 : 0;

    if (val < 1000) {
      return NextResponse.json({ error: "Minimum payout is ₹1,000." }, { status: 400 });
    }

    if (val > available) {
      return NextResponse.json({ error: "Amount exceeds available profit." }, { status: 400 });
    }

    // Deduct the payout amount from the account balance
    await prisma.account.update({
      where: { id: activeAccount.id },
      data: { balance: activeAccount.balance - val },
    });

    const payout = await prisma.payoutRequest.create({
      data: {
        userId,
        accountId: activeAccount.id,
        amount: val,
        method,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, payout });
  } catch (error) {
    console.error("POST payout error:", error);
    return NextResponse.json({ error: "Failed to submit payout request." }, { status: 500 });
  }
}
