import { prisma } from "@/lib/prisma";

function parsePnl(pnlStr: string): number {
  let clean = pnlStr.replace(/[₹\s,]/g, "");
  clean = clean.replace(/[–—-]/g, "-");
  const value = parseFloat(clean);
  return isNaN(value) ? 0 : value;
}

export async function checkAccountRules(accountId: string) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!account) {
    throw new Error(`Account with ID ${accountId} not found.`);
  }

  const { initialBalance, balance: currentBalance } = account;

  // 1. Overall Drawdown Calculation
  const overallLoss = initialBalance - currentBalance;
  const overallLossPct = overallLoss > 0
    ? parseFloat(((overallLoss / initialBalance) * 100).toFixed(2))
    : 0;

  // 2. Daily Drawdown Calculation
  // Get today's date in local timezone (YYYY-MM-DD)
  const tzOffset = new Date().getTimezoneOffset() * 60000;
  const localISOTime = new Date(Date.now() - tzOffset).toISOString();
  const todayStr = localISOTime.split("T")[0];

  const todaysTrades = await prisma.trade.findMany({
    where: { accountId, date: todayStr },
  });

  const todaysPnl = todaysTrades.reduce((sum, t) => sum + parsePnl(t.pnl), 0);
  const dailyLossPct = todaysPnl < 0
    ? parseFloat(((Math.abs(todaysPnl) / initialBalance) * 100).toFixed(2))
    : 0;

  // 3. Distinct Trading Days
  const distinctDays = await prisma.trade.groupBy({
    by: ["date"],
    where: { accountId },
  });
  const tradingDaysCount = distinctDays.length;

  // Target Metrics
  const currentProfitPct = currentBalance > initialBalance
    ? parseFloat((((currentBalance - initialBalance) / initialBalance) * 100).toFixed(2))
    : 0;

  // Evaluation Rule Limits
  const DAILY_LOSS_LIMIT = 4;     // 4%
  const OVERALL_LOSS_LIMIT = 8;   // 8%
  const PROFIT_TARGET_LIMIT = 8;  // 8%
  const MIN_TRADING_DAYS = 5;

  const isDailyViolation = dailyLossPct >= DAILY_LOSS_LIMIT;
  const isOverallViolation = overallLossPct >= OVERALL_LOSS_LIMIT;
  const isDrawdownViolation = isDailyViolation || isOverallViolation;

  const isPassed = currentProfitPct >= PROFIT_TARGET_LIMIT && tradingDaysCount >= MIN_TRADING_DAYS && !isDrawdownViolation;

  let newStatus = account.status;
  if (isDrawdownViolation) {
    newStatus = "FAILED";
  } else if (isPassed) {
    newStatus = "PASSED";
  }

  if (newStatus !== account.status) {
    await prisma.account.update({
      where: { id: accountId },
      data: { status: newStatus },
    });

    await prisma.notification.create({
      data: {
        userId: account.userId,
        title: newStatus === "PASSED" ? "Evaluation Passed!" : "Evaluation Failed",
        message: newStatus === "PASSED"
          ? `Congratulations! Your ${account.planName} account has passed evaluation rules. You are now eligible for live payouts.`
          : `Your ${account.planName} account has violated rules (drawdown) and failed evaluation.`,
        type: newStatus === "PASSED" ? "SUCCESS" : "ERROR",
      },
    });
  }

  return {
    status: newStatus,
    dailyLossPct,
    overallLossPct,
    tradingDaysCount,
    isDrawdownViolation,
    isPassed,
  };
}
