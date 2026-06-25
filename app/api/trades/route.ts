import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkAccountRules } from "@/lib/rulesCheck";

function parsePnl(pnlStr: string): number {
  let clean = pnlStr.replace(/[₹\s,]/g, "");
  // Replace en-dash '–', em-dash '—' or hyphen '-' with standard minus sign
  clean = clean.replace(/[–—-]/g, "-");
  const value = parseFloat(clean);
  return isNaN(value) ? 0 : value;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const activeAccount = await prisma.account.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ trades, activeAccount });
  } catch (error) {
    console.error("GET trades error:", error);
    return NextResponse.json({ error: "Failed to fetch trades." }, { status: 500 });
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
    const { date, symbol, direction, entry, exit, pnl, notes } = body;

    if (!date || !symbol || !direction || !entry || !exit || !pnl) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Get the most recent account
    const currentAccount = await prisma.account.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (currentAccount) {
      if (currentAccount.status === "FAILED") {
        return NextResponse.json(
          { error: "Your evaluation account has failed due to drawdown limits. You cannot log further trades." },
          { status: 403 }
        );
      }
      if (currentAccount.status === "PASSED") {
        return NextResponse.json(
          { error: "Congratulations! You have passed this evaluation. You cannot log further trades on this demo challenge." },
          { status: 403 }
        );
      }
    }

    const activeAccount = currentAccount && currentAccount.status === "ACTIVE" ? currentAccount : null;

    const isProfit = pnl.trim().startsWith("+");
    const pnlValue = parsePnl(pnl);

    const trade = await prisma.trade.create({
      data: {
        userId,
        accountId: activeAccount?.id || null,
        date,
        symbol,
        direction,
        entry: String(entry),
        exit: String(exit),
        pnl,
        isProfit,
        notes,
      },
    });

    if (activeAccount) {
      const newBalance = activeAccount.balance + pnlValue;
      await prisma.account.update({
        where: { id: activeAccount.id },
        data: { balance: newBalance },
      });

      // Recalculate drawdown limits and evaluate pass/fail
      await checkAccountRules(activeAccount.id);
    }

    return NextResponse.json({ success: true, trade });
  } catch (error) {
    console.error("POST trade error:", error);
    return NextResponse.json({ error: "Failed to save trade." }, { status: 500 });
  }
}
