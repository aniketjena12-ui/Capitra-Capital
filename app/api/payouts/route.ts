import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, withHandler, requireAuth, ok } from "@/lib/api";

export const GET = withHandler(async () => {
  const { userId } = await requireAuth();
  
  const [payouts, activeAccount] = await Promise.all([
    prisma.payoutRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.account.findFirst({
      where: { userId, status: "ACTIVE" },
    }),
  ]);

  return ok({ payouts, activeAccount });
});

export const POST = withHandler(async (req: NextRequest) => {
  const { userId } = await requireAuth();
  const body = await req.json();
  const { amount, method } = body;

  if (!amount || !method) {
    throw ApiError.badRequest("Amount and method are required.");
  }

  const activeAccount = await prisma.account.findFirst({
    where: { userId, status: "ACTIVE" },
  });

  if (!activeAccount) {
    throw ApiError.notFound("No active challenge account found.");
  }

  const val = Number(amount);
  const profit = activeAccount.balance - activeAccount.initialBalance;
  const available = profit > 0 ? profit * 0.8 : 0;

  if (val < 1000) {
    throw ApiError.badRequest("Minimum payout is ₹1,000.");
  }

  if (val > available) {
    throw ApiError.badRequest("Amount exceeds available profit.");
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

  await prisma.notification.create({
    data: {
      userId,
      title: "Payout Request Submitted",
      message: `Your withdrawal request of ₹${val.toLocaleString("en-IN")} via ${method} has been submitted for review.`,
      type: "INFO",
    },
  });

  return ok({ success: true, payout });
});
