import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all accounts with user and trades
    const dbAccounts = await prisma.account.findMany({
      include: {
        user: true,
        trades: true,
      }
    });

    const activeTraders = dbAccounts.map(acc => {
      const initialBalance = acc.initialBalance;
      const currentBalance = acc.balance;
      const profit = currentBalance - initialBalance;
      const pct = initialBalance > 0 ? parseFloat(((profit / initialBalance) * 100).toFixed(1)) : 0;
      
      const totalTrades = acc.trades.length;
      const winTrades = acc.trades.filter(t => t.isProfit).length;
      const winRate = totalTrades > 0 ? Math.round((winTrades / totalTrades) * 100) : 50;

      // Unique trading days
      const uniqueDays = new Set(acc.trades.map(t => t.date)).size;

      // Anonymize name: "Demo Trader" -> "D. Trader" or similar
      const nameParts = acc.user.name.split(" ");
      const name = nameParts.length > 1 ? `${nameParts[0][0]}. ${nameParts[nameParts.length - 1]}` : acc.user.name;

      return {
        name,
        plan: acc.planName,
        balance: currentBalance,
        profit,
        pct,
        winRate: `${winRate}%`,
        days: uniqueDays || 1,
      };
    });

    // Sort by profit pct descending
    activeTraders.sort((a, b) => b.pct - a.pct);

    // Mock templates to fill the remaining ranks (up to 10)
    const mockTemplates = [
      { name: "Trader_Apex92", plan: "Elite", balance: 1182400, profit: 182400, pct: 18.2, winRate: "74%", days: 28 },
      { name: "QuantEdge_47", plan: "Elite", balance: 1154200, profit: 154200, pct: 15.4, winRate: "71%", days: 32 },
      { name: "NiftyStar_IN", plan: "Professional", balance: 572100, profit: 72100, pct: 14.4, winRate: "68%", days: 21 },
      { name: "SwingKing_2026", plan: "Elite", balance: 1138900, profit: 138900, pct: 13.9, winRate: "65%", days: 45 },
      { name: "Scalper_Pro_X", plan: "Professional", balance: 567400, profit: 67400, pct: 13.5, winRate: "78%", days: 15 },
      { name: "BankNiftyBull", plan: "Professional", balance: 562000, profit: 62000, pct: 12.4, winRate: "62%", days: 38 },
      { name: "CryptoRider_v2", plan: "Elite", balance: 1120500, profit: 120500, pct: 12.1, winRate: "60%", days: 52 },
      { name: "IndexTrader99", plan: "Starter", balance: 111800, profit: 11800, pct: 11.8, winRate: "57%", days: 19 },
      { name: "PatienceIs_Key", plan: "Professional", balance: 557200, profit: 57200, pct: 11.4, winRate: "69%", days: 60 },
      { name: "RiskMgr_Elite", plan: "Elite", balance: 1110000, profit: 110000, pct: 11.0, winRate: "55%", days: 41 }
    ];

    // Combine real DB accounts and mock templates
    const combined = [...activeTraders];
    for (const mock of mockTemplates) {
      if (combined.length >= 10) break;
      if (!combined.some(c => c.name.toLowerCase() === mock.name.toLowerCase())) {
        combined.push(mock);
      }
    }

    // Sort combined by pct descending
    combined.sort((a, b) => b.pct - a.pct);

    // Re-rank and format output
    const ranked = combined.slice(0, 10).map((t, idx) => {
      let badge = "";
      if (idx === 0) badge = "🥇";
      else if (idx === 1) badge = "🥈";
      else if (idx === 2) badge = "🥉";
      
      const balanceStr = `₹${t.balance.toLocaleString("en-IN")}`;
      const profitStr = `${t.profit >= 0 ? "+" : ""}₹${t.profit.toLocaleString("en-IN")}`;
      const pctStr = `${t.pct >= 0 ? "+" : ""}${t.pct}%`;

      return {
        rank: idx + 1,
        name: t.name,
        plan: t.plan,
        balance: balanceStr,
        profit: profitStr,
        pct: pctStr,
        winRate: t.winRate,
        days: t.days,
        badge,
      };
    });

    return NextResponse.json({ traders: ranked });
  } catch (error) {
    console.error("GET leaderboard error:", error);
    return NextResponse.json({ error: "Failed to fetch leaderboard data." }, { status: 500 });
  }
}
