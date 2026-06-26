import { NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ApiError, withHandler, ok, parseBody } from "@/lib/api";
import { isExpired } from "@/lib/tokens";
import { resetPasswordSchema } from "@/lib/schemas";

/**
 * POST /api/auth/reset-password
 * Body: { token, password }
 * Validates the reset token and updates the user's password.
 */
export const POST = withHandler(async (req: NextRequest) => {
  const { token, password } = await parseBody(req, resetPasswordSchema);

  const user = await prisma.user.findUnique({
    where: { passwordResetToken: token },
    select: { id: true, passwordResetExpiry: true },
  });

  if (!user) {
    throw ApiError.badRequest("This reset link is invalid or has already been used.");
  }

  if (isExpired(user.passwordResetExpiry)) {
    throw ApiError.badRequest(
      "This reset link has expired. Please request a new one."
    );
  }

  const passwordHash = await bcryptjs.hash(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: passwordHash,
      passwordResetToken: null,
      passwordResetExpiry: null,
    },
  });

  return ok({ message: "Password updated successfully. You can now sign in with your new password." });
});
