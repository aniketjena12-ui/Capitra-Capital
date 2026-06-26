import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiError, withHandler, requireAuth, ok, parseBody } from "@/lib/api";
import {
  profileUpdateSchema,
  bankUpdateSchema,
  notifsUpdateSchema,
  changePasswordSchema,
} from "@/lib/schemas";
import bcryptjs from "bcryptjs";
import { z } from "zod";

export const GET = withHandler(async () => {
  const { userId } = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      phone: true,
      emailVerified: true,
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

const actionSchema = z.object({ action: z.enum(["profile", "bank", "notifs", "password"]) });

export const POST = withHandler(async (req: NextRequest) => {
  const { userId } = await requireAuth();

  // Peek at action first (clone body for re-reading)
  const rawBody = await req.json();
  const actionResult = actionSchema.safeParse(rawBody);
  if (!actionResult.success) {
    throw ApiError.badRequest("Invalid or missing action.");
  }
  const { action } = actionResult.data;

  if (action === "profile") {
    const { name, phone } = profileUpdateSchema.parse(rawBody);
    await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
    });
    return ok({ success: true, message: "Profile updated successfully." });
  }

  if (action === "bank") {
    const { accountName, accountNo, ifsc, bankName } = bankUpdateSchema.parse(rawBody);
    await prisma.user.update({
      where: { id: userId },
      data: { accountName, accountNo, ifsc, bankName },
    });
    return ok({ success: true, message: "Bank details saved." });
  }

  if (action === "notifs") {
    const { emailNotif, drawdownNotif, payoutNotif, newsNotif } = notifsUpdateSchema.parse(rawBody);
    await prisma.user.update({
      where: { id: userId },
      data: { emailNotif, drawdownNotif, payoutNotif, newsNotif },
    });
    return ok({ success: true, message: "Preferences updated." });
  }

  if (action === "password") {
    const { currentPassword, newPassword } = changePasswordSchema.parse(rawBody);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw ApiError.notFound("User not found.");
    }

    const isValid = await bcryptjs.compare(currentPassword, user.password);
    if (!isValid) {
      throw ApiError.badRequest("Incorrect current password.");
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
