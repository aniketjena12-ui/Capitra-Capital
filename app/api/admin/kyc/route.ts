import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailKycVerified } from "@/lib/email";

function isAdmin(session: { user?: { email?: string | null } } | null) {
  return session?.user?.email === "admin@capitracapital.com";
}

// GET — list all users with KYC data (admin only)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const statusFilter = searchParams.get("status"); // PENDING, VERIFIED, UNVERIFIED, or null (all)

  const users = await prisma.user.findMany({
    where: statusFilter ? { kycStatus: statusFilter } : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      kycStatus: true,
      kycIdUrl: true,
      kycSelfieUrl: true,
      kycNotes: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

// POST — approve or reject KYC (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId, action, notes } = await req.json();
  if (!userId || !["APPROVE", "REJECT"].includes(action)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const newStatus = action === "APPROVE" ? "VERIFIED" : "UNVERIFIED";
  await prisma.user.update({
    where: { id: userId },
    data: { kycStatus: newStatus, kycNotes: notes || null },
  });

  // Notify the trader
  await prisma.notification.create({
    data: {
      userId,
      title: action === "APPROVE" ? "KYC Verified ✅" : "KYC Rejected",
      message:
        action === "APPROVE"
          ? "Your identity has been verified. You are now eligible to request payouts."
          : `Your KYC was not approved. Reason: ${notes || "Documents unclear. Please resubmit."}`,
      type: action === "APPROVE" ? "SUCCESS" : "ERROR",
    },
  });

  if (action === "APPROVE") {
    // Send email to trader
    const trader = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
    if (trader?.email) {
      const { subject, html } = emailKycVerified(trader.name);
      await sendEmail({ to: trader.email, subject, html });
    }
  }

  return NextResponse.json({
    message: `KYC ${action === "APPROVE" ? "approved" : "rejected"} successfully.`,
  });
}
