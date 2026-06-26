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

    await prisma.notification.create({
      data: {
        userId,
        title: "Trade Logged",
        message: `${direction} ${symbol} at ${entry} closed with P&L of ${pnl}.`,
        type: isProfit ? "SUCCESS" : "ERROR",
      },
    });

    return NextResponse.json({ success: true, trade });
  } catch (error) {
    console.error("POST trade error:", error);
    return NextResponse.json({ error: "Failed to save trade." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const tradeId = searchParams.get("id");

    if (!tradeId) {
      return NextResponse.json({ error: "Trade ID is required." }, { status: 400 });
    }

    // Fetch the trade and verify ownership
    const trade = await prisma.trade.findUnique({ where: { id: tradeId } });

    if (!trade) {
      return NextResponse.json({ error: "Trade not found." }, { status: 404 });
    }

    if (trade.userId !== userId) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // Reverse the PnL on the linked account
    if (trade.accountId) {
      const account = await prisma.account.findUnique({ where: { id: trade.accountId } });
      if (account && account.status === "ACTIVE") {
        const pnlValue = parsePnl(trade.pnl);
        await prisma.account.update({
          where: { id: trade.accountId },
          data: { balance: account.balance - pnlValue },
        });
      }
    }

    await prisma.trade.delete({ where: { id: tradeId } });

    // Re-run rules check to keep account status accurate
    if (trade.accountId) {
      await checkAccountRules(trade.accountId).catch(() => {});
    }

    return NextResponse.json({ success: true, message: "Trade deleted." });
  } catch (error) {
    console.error("DELETE trade error:", error);
    return NextResponse.json({ error: "Failed to delete trade." }, { status: 500 });
  }
}
