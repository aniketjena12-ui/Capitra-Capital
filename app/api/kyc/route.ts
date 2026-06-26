import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, withHandler, requireAuth, ok, parseBody } from "@/lib/api";
import { kycSubmitSchema } from "@/lib/schemas";

// GET — fetch current user's KYC status
export const GET = withHandler(async () => {
  const { userId } = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      kycStatus: true,
      kycIdUrl: true,
      kycSelfieUrl: true,
      kycDocType: true,
      kycNotes: true,
    },
  });

  return ok({ kyc: user });
});

// POST — submit or resubmit KYC documents
export const POST = withHandler(async (req: NextRequest) => {
  const { userId } = await requireAuth();

  // Check current KYC status — don't allow resubmission if already VERIFIED
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { kycStatus: true },
  });

  if (user?.kycStatus === "VERIFIED") {
    throw ApiError.badRequest("Your identity is already verified. No further submission is needed.");
  }

  const { kycIdUrl, kycSelfieUrl, kycDocType } = await parseBody(req, kycSubmitSchema);

  await prisma.user.update({
    where: { id: userId },
    data: {
      kycStatus: "PENDING",
      kycIdUrl,
      kycSelfieUrl,
      kycDocType,
      kycNotes: null, // Clear previous rejection notes on resubmission
    },
  });

  // Create in-app notification
  await prisma.notification.create({
    data: {
      userId,
      title: "KYC Submitted",
      message: "Your KYC documents have been submitted for review. We'll verify them within 1–2 business days.",
      type: "INFO",
    },
  });

  return ok({ message: "KYC submitted successfully. Under review." });
});
