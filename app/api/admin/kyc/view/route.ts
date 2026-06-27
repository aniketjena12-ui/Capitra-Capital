import { NextRequest } from "next/server";
import { ApiError, withHandler, requireAdmin, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/kyc/view?userId=xxx&doc=id|selfie
 *
 * Admin-only. Returns the Base64 document data URI of the target user's KYC document.
 */
export const GET = withHandler(async (req: NextRequest) => {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get("userId");
  const doc = searchParams.get("doc");

  if (!targetUserId) {
    throw ApiError.badRequest("userId is required.");
  }
  if (doc !== "id" && doc !== "selfie") {
    throw ApiError.badRequest("doc must be 'id' or 'selfie'.");
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { kycIdUrl: true, kycSelfieUrl: true, name: true },
  });

  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  const base64Data = doc === "id" ? user.kycIdUrl : user.kycSelfieUrl;

  if (!base64Data) {
    throw ApiError.notFound(`No ${doc === "id" ? "ID document" : "selfie"} uploaded for this user.`);
  }

  return ok({ url: base64Data, name: user.name });
});
