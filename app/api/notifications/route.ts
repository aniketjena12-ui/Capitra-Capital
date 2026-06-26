import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, read: false },
    });

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("GET notifications error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
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

    return NextResponse.json({ success: true, message: "Notifications marked as read." });
  } catch (error) {
    console.error("POST notifications error:", error);
    return NextResponse.json({ error: "Failed to update notifications." }, { status: 500 });
  }
}
