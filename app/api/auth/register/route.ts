import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
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

    return NextResponse.json(
      { message: "Account created successfully.", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register route error:", error);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
