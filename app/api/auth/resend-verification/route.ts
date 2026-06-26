import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, withHandler, ok, parseBody } from "@/lib/api";
import { generateToken, expiresInMinutes } from "@/lib/tokens";
import { sendEmail, emailVerifyEmail } from "@/lib/email";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { forgotPasswordSchema } from "@/lib/schemas";

/**
 * POST /api/auth/resend-verification
 * Body: { email }
 * Resends the email verification link. Rate-limited.
 * Always returns 200 to avoid user enumeration.
 */
export const POST = withHandler(async (req: NextRequest) => {
  const ip = getIp(req);
  const limit = rateLimit(`resend-verify:${ip}`, { limit: 3, windowSeconds: 60 * 60 });
  if (!limit.success) {
    throw ApiError.tooManyRequests();
  }

  const { email } = await parseBody(req, forgotPasswordSchema);

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, name: true, email: true, emailVerified: true },
  });

  // Always return 200 — don't reveal whether the email exists
  if (!user || user.emailVerified) {
    return ok({ message: "If that email is registered and unverified, we've sent a new verification link." });
  }

  const token = generateToken();
  const expiry = expiresInMinutes(24 * 60); // 24 hours

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerifyToken: token, emailVerifyExpiry: expiry },
  });

  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verifyUrl = `${appUrl}/verify-email?token=${token}`;
  const { subject, html } = emailVerifyEmail(user.name, verifyUrl);
  await sendEmail({ to: user.email, subject, html }).catch((err) => {
    console.error("[resend-verification] Failed to send email:", err);
  });

  return ok({ message: "If that email is registered and unverified, we've sent a new verification link." });
});
