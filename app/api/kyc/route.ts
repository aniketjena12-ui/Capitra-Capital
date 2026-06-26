import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, withHandler, requireAuth, ok } from "@/lib/api";

// GET — fetch current user's KYC status
export const GET = withHandler(async () => {
  const { userId } = await requireAuth();
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { kycStatus: true, kycIdUrl: true, kycSelfieUrl: true, kycNotes: true },
  });

  return ok({ kyc: user });
});

// POST — submit KYC
export const POST = withHandler(async (req: NextRequest) => {
  const { userId } = await requireAuth();
  const body = await req.json();
  const { kycIdUrl, kycSelfieUrl } = body;

  if (!kycIdUrl || !kycSelfieUrl) {
    throw ApiError.badRequest("Both Government ID and Selfie are required.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      kycStatus: "PENDING",
      kycIdUrl,
      kycSelfieUrl,
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
