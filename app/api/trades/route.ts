import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAccountRules } from "@/lib/rulesCheck";
import { ApiError, withHandler, requireAuth, ok, parseBody } from "@/lib/api";
import { tradeCreateSchema } from "@/lib/schemas";

function parsePnl(pnlStr: string): number {
  let clean = pnlStr.replace(/[₹\s,]/g, "");
  // Replace en-dash '–', em-dash '—' or hyphen '-' with standard minus sign
  clean = clean.replace(/[–—-]/g, "-");
  const value = parseFloat(clean);
  return isNaN(value) ? 0 : value;
}

export const GET = withHandler(async () => {
  const { userId } = await requireAuth();

  const [trades, activeAccount] = await Promise.all([
    prisma.trade.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.account.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return ok({ trades, activeAccount });
});

export const POST = withHandler(async (req: NextRequest) => {
  const { userId } = await requireAuth();

  const { date, symbol, direction, entry, exit, pnl, notes } = await parseBody(req, tradeCreateSchema);

  // Get the most recent account
  const currentAccount = await prisma.account.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (currentAccount?.status === "FAILED") {
    throw new ApiError(
      403,
      "Your evaluation account has failed due to drawdown limits. You cannot log further trades.",
      "FORBIDDEN"
    );
  }
  if (currentAccount?.status === "PASSED") {
    throw new ApiError(
      403,
      "Congratulations! You have passed this evaluation. You cannot log further trades on this demo challenge.",
      "FORBIDDEN"
    );
  }

  const activeAccount =
    currentAccount && currentAccount.status === "ACTIVE" ? currentAccount : null;

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
    await prisma.account.update({
      where: { id: activeAccount.id },
      data: { balance: activeAccount.balance + pnlValue },
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

  return ok({ success: true, trade });
});

export const DELETE = withHandler(async (req: NextRequest) => {
  const { userId } = await requireAuth();

  const { searchParams } = new URL(req.url);
  const tradeId = searchParams.get("id");

  if (!tradeId) {
    throw ApiError.badRequest("Trade ID is required.");
  }

  const trade = await prisma.trade.findUnique({ where: { id: tradeId } });

  if (!trade) {
    throw ApiError.notFound("Trade not found.");
  }

  if (trade.userId !== userId) {
    throw ApiError.forbidden();
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

  return ok({ success: true, message: "Trade deleted." });
});
