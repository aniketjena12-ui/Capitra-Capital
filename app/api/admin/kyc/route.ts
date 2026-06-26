import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailKycVerified } from "@/lib/email";
import { ApiError, withHandler, requireAdmin, ok } from "@/lib/api";

// GET — list all users with KYC data (admin only)
export const GET = withHandler(async (req: NextRequest) => {
  await requireAdmin();

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

  return ok({ users });
});

// POST — approve or reject KYC (admin only)
export const POST = withHandler(async (req: NextRequest) => {
  await requireAdmin();

  const { userId, action, notes } = await req.json();
  if (!userId || !["APPROVE", "REJECT"].includes(action)) {
    throw ApiError.badRequest("Invalid request.");
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
      await sendEmail({ to: trader.email, subject, html }).catch(err => {
        console.error("Failed to send KYC approval email:", err);
      });
    }
  }

  return ok({
    message: `KYC ${action === "APPROVE" ? "approved" : "rejected"} successfully.`,
  });
});
