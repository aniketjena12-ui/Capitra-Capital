import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailPayoutApproved, emailPayoutRejected } from "@/lib/email";

const ADMIN_EMAIL = "admin@capitracapital.com";

// Check if user is admin
async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session && session.user && session.user.email === ADMIN_EMAIL;
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Access Denied: Admin privileges required." }, { status: 403 });
    }

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

    return NextResponse.json({ payouts });
  } catch (error) {
    console.error("GET admin payouts error:", error);
    return NextResponse.json({ error: "Failed to fetch payout requests." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Access Denied: Admin privileges required." }, { status: 403 });
    }

    const body = await req.json();
    const { payoutId, action } = body;

    if (!payoutId || !action) {
      return NextResponse.json({ error: "Payout ID and action are required." }, { status: 400 });
    }

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json({ error: "Invalid action. Must be APPROVE or REJECT." }, { status: 400 });
    }

    const payout = await prisma.payoutRequest.findUnique({
      where: { id: payoutId },
    });

    if (!payout) {
      return NextResponse.json({ error: "Payout request not found." }, { status: 404 });
    }

    if (payout.status !== "PENDING") {
      return NextResponse.json({ error: "Payout request has already been processed." }, { status: 400 });
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
        await sendEmail({ to: trader.email, subject, html });
      }

      return NextResponse.json({ success: true, message: "Payout request approved successfully." });
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
        await sendEmail({ to: trader.email, subject, html });
      }

      return NextResponse.json({ success: true, message: "Payout request rejected and balance refunded." });
    }
  } catch (error) {
    console.error("POST admin payouts error:", error);
    return NextResponse.json({ error: "Failed to process payout request." }, { status: 500 });
  }
}
