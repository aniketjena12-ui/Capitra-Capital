import { NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit, getIp } from "@/lib/rateLimit";
import { ApiError, withHandler, created } from "@/lib/api";

export const POST = withHandler(async (req: NextRequest) => {
  // Rate limit — max 5 registrations per IP per hour
  const ip = getIp(req);
  const limit = rateLimit(`register:${ip}`, { limit: 5, windowSeconds: 60 * 60 });
  if (!limit.success) {
    throw ApiError.tooManyRequests("Too many registration attempts. Please try again later.");
  }

  const body = await req.json();
  const { name, email, password } = body;

  if (!name || !email || !password) {
    throw ApiError.badRequest("All fields are required.");
  }

  if (password.length < 8) {
    throw ApiError.badRequest("Password must be at least 8 characters.");
  }

  // Must contain at least one letter and one number
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    throw ApiError.badRequest("Password must contain at least one letter and one number.");
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  
  if (existing) {
    throw ApiError.conflict("An account with this email already exists.");
  }

  const passwordHash = await bcryptjs.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: passwordHash,
    },
  });

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "Welcome to Capitra Capital!",
      message: "Congratulations on signing up. Choose a challenge evaluation tier and start trading.",
      type: "SUCCESS",
    },
  });

  return created({ message: "Account created successfully.", userId: user.id });
});
