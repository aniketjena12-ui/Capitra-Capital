import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — fetch current user's KYC status
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { kycStatus: true, kycIdUrl: true, kycSelfieUrl: true, kycNotes: true },
  });

  return NextResponse.json({ kyc: user });
}

// POST — submit KYC (stores file names; in production, store actual uploaded files)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as { id: string }).id;
  const body = await req.json();
  const { kycIdUrl, kycSelfieUrl } = body;

  if (!kycIdUrl || !kycSelfieUrl) {
    return NextResponse.json({ error: "Both Government ID and Selfie are required." }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      kycStatus: "PENDING",
      kycIdUrl,
      kycSelfieUrl,
    },
  });

  // Create in-app notification
  await prisma.notification.create({
    data: {
      userId,
      title: "KYC Submitted",
      message: "Your KYC documents have been submitted for review. We'll verify them within 1–2 business days.",
      type: "INFO",
    },
  });

  return NextResponse.json({ message: "KYC submitted successfully. Under review." });
}
