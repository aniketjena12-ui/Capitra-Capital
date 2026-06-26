import { NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { ApiError, withHandler, created, parseBody } from "@/lib/api";
import { generateToken, expiresInMinutes } from "@/lib/tokens";
import { sendEmail, emailWelcome, emailVerifyEmail } from "@/lib/email";
import { registerSchema } from "@/lib/schemas";

export const POST = withHandler(async (req: NextRequest) => {
  // Rate limit — max 5 registrations per IP per hour
  const ip = getIp(req);
  const limit = rateLimit(`register:${ip}`, { limit: 5, windowSeconds: 60 * 60 });
  if (!limit.success) {
    throw ApiError.tooManyRequests("Too many registration attempts. Please try again later.");
  }

  const { name, email, password } = await parseBody(req, registerSchema);

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existing) {
    throw ApiError.conflict("An account with this email already exists.");
  }

  const passwordHash = await bcryptjs.hash(password, 10);

  // Generate email verification token
  const verifyToken = generateToken();
  const verifyExpiry = expiresInMinutes(24 * 60); // 24 hours

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: passwordHash,
      emailVerifyToken: verifyToken,
      emailVerifyExpiry: verifyExpiry,
      // emailVerified starts as null (unverified)
    },
  });

  // Send welcome + verification email (non-blocking)
  const appUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verifyUrl = `${appUrl}/verify-email?token=${verifyToken}`;

  Promise.all([
    sendEmail({ to: user.email, ...emailWelcome(user.name) }),
    sendEmail({ to: user.email, ...emailVerifyEmail(user.name, verifyUrl) }),
  ]).catch((err) => {
    console.error("[register] Failed to send welcome/verification email:", err);
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Welcome to Capitra Capital!",
      message: "Account created! Please check your email to verify your address.",
      type: "INFO",
    },
  });

  return created({ message: "Account created successfully. Please check your email to verify your address." });
});
