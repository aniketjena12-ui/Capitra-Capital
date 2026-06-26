import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, withHandler, ok } from "@/lib/api";
import { isExpired } from "@/lib/tokens";

/**
 * GET /api/auth/verify-email?token=xxx
 * Verifies a user's email address using the token sent during registration.
 */
export const GET = withHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    throw ApiError.badRequest("Verification token is missing.");
  }

  const user = await prisma.user.findUnique({
    where: { emailVerifyToken: token },
    select: {
      id: true,
      emailVerified: true,
      emailVerifyExpiry: true,
    },
  });

  if (!user) {
    throw ApiError.badRequest("Invalid or already used verification link.");
  }

  if (user.emailVerified) {
    return ok({ message: "Email is already verified." });
  }

  if (isExpired(user.emailVerifyExpiry)) {
    throw ApiError.badRequest(
      "This verification link has expired. Please request a new one from the login page."
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      emailVerifyToken: null,
      emailVerifyExpiry: null,
    },
  });

  return ok({ message: "Email verified successfully. You can now sign in." });
});
