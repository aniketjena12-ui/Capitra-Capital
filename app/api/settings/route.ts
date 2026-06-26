import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, withHandler, requireAuth, ok } from "@/lib/api";
import bcryptjs from "bcryptjs";

export const GET = withHandler(async () => {
  const { userId } = await requireAuth();
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      phone: true,
      accountName: true,
      accountNo: true,
      ifsc: true,
      bankName: true,
      emailNotif: true,
      drawdownNotif: true,
      payoutNotif: true,
      newsNotif: true,
    },
  });

  return ok({ user });
});

export const POST = withHandler(async (req: NextRequest) => {
  const { userId } = await requireAuth();
  const body = await req.json();
  const { action } = body;

  if (action === "profile") {
    const { name, phone } = body;
    await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
    });
    return ok({ success: true, message: "Profile updated successfully." });
  }

  if (action === "bank") {
    const { accountName, accountNo, ifsc, bankName } = body;
    await prisma.user.update({
      where: { id: userId },
      data: { accountName, accountNo, ifsc, bankName },
    });
    return ok({ success: true, message: "Bank details saved." });
  }

  if (action === "notifs") {
    const { emailNotif, drawdownNotif, payoutNotif, newsNotif } = body;
    await prisma.user.update({
      where: { id: userId },
      data: { emailNotif, drawdownNotif, payoutNotif, newsNotif },
    });
    return ok({ success: true, message: "Preferences updated." });
  }

  if (action === "password") {
    const { currentPassword, newPassword } = body;
    
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw ApiError.notFound("User not found.");
    }

    const isValid = await bcryptjs.compare(currentPassword, user.password);
    if (!isValid) {
      throw ApiError.badRequest("Incorrect current password.");
    }

    if (newPassword.length < 8) {
      throw ApiError.badRequest("Password must be at least 8 characters.");
    }

    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      throw ApiError.badRequest("Password must contain at least one letter and one number.");
    }

    const passwordHash = await bcryptjs.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: passwordHash },
    });

    return ok({ success: true, message: "Password updated." });
  }

  throw ApiError.badRequest("Invalid action.");
});
