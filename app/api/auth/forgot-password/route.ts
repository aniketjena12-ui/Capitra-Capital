import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, withHandler, ok, parseBody } from "@/lib/api";
import { generateToken, expiresInMinutes } from "@/lib/tokens";
import { sendEmail, emailPasswordReset } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { forgotPasswordSchema } from "@/lib/schemas";

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 * Sends a password-reset link to the provided email.
 * Always returns 200 to prevent user enumeration.
 */
export const POST = withHandler(async (req: NextRequest) => {
  const ip = getIp(req);
  const limit = rateLimit(`forgot-password:${ip}`, { limit: 5, windowSeconds: 60 * 60 });
  if (!limit.success) {
    throw ApiError.tooManyRequests();
  }

  const { email } = await parseBody(req, forgotPasswordSchema);

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, name: true, email: true },
  });

  // Always return 200 — don't reveal whether the email exists
  if (!user) {
    return ok({ message: "If an account with that email exists, a reset link has been sent." });
  }

  const token = generateToken();
  const expiry = expiresInMinutes(60); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: token,
      passwordResetExpiry: expiry,
    },
  });

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const resetUrl = `${appUrl}/reset-password?token=${token}`;
  const { subject, html } = emailPasswordReset(user.name, resetUrl);
  await sendEmail({ to: user.email, subject, html }).catch((err) => {
    console.error("[forgot-password] Failed to send email:", err);
  });

  return ok({ message: "If an account with that email exists, a reset link has been sent." });
});
