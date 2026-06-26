import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailPayoutApproved, emailPayoutRejected } from "@/lib/email";
import { ApiError, withHandler, requireAdmin, ok } from "@/lib/api";

export const GET = withHandler(async () => {
  await requireAdmin();

  const payouts = await prisma.payoutRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      account: {
        select: {
          planName: true,
          initialBalance: true,
        },
      },
    },
  });

  return ok({ payouts });
});

export const POST = withHandler(async (req: NextRequest) => {
  await requireAdmin();

  const body = await req.json();
  const { payoutId, action } = body;

  if (!payoutId || !action) {
    throw ApiError.badRequest("Payout ID and action are required.");
  }

  if (action !== "APPROVE" && action !== "REJECT") {
    throw ApiError.badRequest("Invalid action. Must be APPROVE or REJECT.");
  }

  const payout = await prisma.payoutRequest.findUnique({
    where: { id: payoutId },
  });

  if (!payout) {
    throw ApiError.notFound("Payout request not found.");
  }

  if (payout.status !== "PENDING") {
    throw ApiError.badRequest("Payout request has already been processed.");
  }

  if (action === "APPROVE") {
    await prisma.payoutRequest.update({
      where: { id: payoutId },
      data: { status: "PAID" },
    });

    await prisma.notification.create({
      data: {
        userId: payout.userId,
        title: "Withdrawal Approved! 🎉",
        message: `Your withdrawal request of ₹${payout.amount.toLocaleString("en-IN")} via ${payout.method} has been approved. Funds are on the way.`,
        type: "SUCCESS",
      },
    });

    // Send email notification
    const trader = await prisma.user.findUnique({ where: { id: payout.userId }, select: { name: true, email: true } });
    if (trader?.email) {
      const { subject, html } = emailPayoutApproved(trader.name, payout.amount);
      await sendEmail({ to: trader.email, subject, html }).catch(err => {
        console.error("Failed to send payout approval email:", err);
      });
    }

    return ok({ success: true, message: "Payout request approved successfully." });
  } else {
    // REJECT - refund user balance in a transaction
    await prisma.$transaction([
      prisma.payoutRequest.update({
        where: { id: payoutId },
        data: { status: "REJECTED" },
      }),
      prisma.account.update({
        where: { id: payout.accountId },
        data: {
          balance: {
            increment: payout.amount,
          },
        },
      }),
    ]);

    await prisma.notification.create({
      data: {
        userId: payout.userId,
        title: "Withdrawal Rejected",
        message: `Your withdrawal request of ₹${payout.amount.toLocaleString("en-IN")} has been rejected. The full amount has been refunded to your account balance.`,
        type: "WARNING",
      },
    });

    // Send email notification
    const trader = await prisma.user.findUnique({ where: { id: payout.userId }, select: { name: true, email: true } });
    if (trader?.email) {
      const { subject, html } = emailPayoutRejected(trader.name);
      await sendEmail({ to: trader.email, subject, html }).catch(err => {
        console.error("Failed to send payout rejection email:", err);
      });
    }

    return ok({ success: true, message: "Payout request rejected and balance refunded." });
  }
});
