import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, withHandler, requireAuth, ok, parseBody } from "@/lib/api";
import { payoutRequestSchema } from "@/lib/schemas";

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

  const { amount, method } = await parseBody(req, payoutRequestSchema);

  // ── KYC Gate ────────────────────────────────────────────────────────────────
  // Require verified KYC before any payout can be requested.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { kycStatus: true },
  });

  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  if (user.kycStatus !== "VERIFIED") {
    const kycMsg =
      user.kycStatus === "PENDING"
        ? "Your KYC is currently under review. Payouts will be available once your identity is verified."
        : "You must complete KYC verification before requesting a payout. Go to the KYC page in your dashboard.";
    throw ApiError.forbidden(kycMsg);
  }
  // ────────────────────────────────────────────────────────────────────────────

  const activeAccount = await prisma.account.findFirst({
    where: { userId, status: "ACTIVE" },
  });

  if (!activeAccount) {
    throw ApiError.notFound("No active challenge account found.");
  }

  const profit = activeAccount.balance - activeAccount.initialBalance;
  const available = profit > 0 ? profit * 0.8 : 0;

  if (amount > available) {
    throw ApiError.badRequest(
      `Amount exceeds available profit. You can withdraw up to ₹${available.toLocaleString("en-IN")}.`
    );
  }

  // Deduct the payout amount from the account balance
  await prisma.account.update({
    where: { id: activeAccount.id },
    data: { balance: activeAccount.balance - amount },
  });

  const payout = await prisma.payoutRequest.create({
    data: {
      userId,
      accountId: activeAccount.id,
      amount,
      method,
      status: "PENDING",
    },
  });

  await prisma.notification.create({
    data: {
      userId,
      title: "Payout Request Submitted",
      message: `Your withdrawal request of ₹${amount.toLocaleString("en-IN")} via ${method} has been submitted for review.`,
      type: "INFO",
    },
  });

  return ok({ success: true, payout });
});
