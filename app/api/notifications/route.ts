import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { withHandler, requireAuth, ok } from "@/lib/api";

export const GET = withHandler(async () => {
  const { userId } = await requireAuth();
  
  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.notification.count({
      where: { userId, read: false },
    }),
  ]);

  return ok({ notifications, unreadCount });
});

export const POST = withHandler(async (req: NextRequest) => {
  const { userId } = await requireAuth();
  const body = await req.json().catch(() => ({}));
  const { notificationId } = body;

  if (notificationId) {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  } else {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  return ok({ success: true, message: "Notifications marked as read." });
});
