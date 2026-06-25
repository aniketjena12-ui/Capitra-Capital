import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
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

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET settings error:", error);
    return NextResponse.json({ error: "Failed to fetch settings." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { action } = body;

    if (action === "profile") {
      const { name, phone } = body;
      await prisma.user.update({
        where: { id: userId },
        data: { name, phone },
      });
      return NextResponse.json({ success: true, message: "Profile updated successfully." });
    }

    if (action === "bank") {
      const { accountName, accountNo, ifsc, bankName } = body;
      await prisma.user.update({
        where: { id: userId },
        data: { accountName, accountNo, ifsc, bankName },
      });
      return NextResponse.json({ success: true, message: "Bank details saved." });
    }

    if (action === "notifs") {
      const { emailNotif, drawdownNotif, payoutNotif, newsNotif } = body;
      await prisma.user.update({
        where: { id: userId },
        data: { emailNotif, drawdownNotif, payoutNotif, newsNotif },
      });
      return NextResponse.json({ success: true, message: "Preferences updated." });
    }

    if (action === "password") {
      const { currentPassword, newPassword } = body;
      
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      const isValid = await bcryptjs.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: "Incorrect current password." }, { status: 400 });
      }

      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
      }

      const passwordHash = await bcryptjs.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: userId },
        data: { password: passwordHash },
      });

      return NextResponse.json({ success: true, message: "Password updated." });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST settings error:", error);
    return NextResponse.json({ error: "Failed to update settings." }, { status: 500 });
  }
}
