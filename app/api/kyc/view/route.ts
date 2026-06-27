import { NextRequest } from "next/server";
import { ApiError, withHandler, requireAuth, ok } from "@/lib/api";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/kyc/view?doc=id|selfie
 *
 * Returns the Base64 data URI of the user's own KYC document.
 */
export const GET = withHandler(async (req: NextRequest) => {
  const { userId } = await requireAuth();

  const { searchParams } = new URL(req.url);
  const doc = searchParams.get("doc");

  if (doc !== "id" && doc !== "selfie") {
    throw ApiError.badRequest("doc must be 'id' or 'selfie'.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { kycIdUrl: true, kycSelfieUrl: true },
  });

  const base64Data = doc === "id" ? user?.kycIdUrl : user?.kycSelfieUrl;

  if (!base64Data) {
    throw ApiError.notFound("Document not found. Please upload your documents first.");
  }

  return ok({ url: base64Data });
});
