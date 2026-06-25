import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

function parsePnl(pnlStr: string): number {
  let clean = pnlStr.replace(/[₹\s,]/g, "");
  clean = clean.replace(/[–—-]/g, "-");
  const value = parseFloat(clean);
  return isNaN(value) ? 0 : value;
}

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/login");

  const userId = (session.user as any).id;

  // Fetch user details and active trading account
  const activeAccount = await prisma.account.findFirst({
    where: { userId, status: "ACTIVE" },
  });

  // Fetch recent trades
  const recentTrades = await prisma.trade.findMany({
    where: { userId, accountId: activeAccount?.id || undefined },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Calculate distinct trading days
  const distinctDays = await prisma.trade.groupBy({
    by: ["date"],
    where: { userId, accountId: activeAccount?.id || undefined },
  });
  const tradingDaysCount = distinctDays.length;

  // Default mock values if no active account exists
  const hasAccount = !!activeAccount;
  const initialBalance = activeAccount?.initialBalance || 500000;
  const currentBalance = activeAccount?.balance || initialBalance;
  const planName = activeAccount?.planName || "No Plan";
  const profit = currentBalance - initialBalance;
  const profitPct = (profit / initialBalance) * 100;

  // Rule 1: Profit Target (8%)
  const profitTargetPct = 8;
  const currentProfitPct = Math.max(0, parseFloat(profitPct.toFixed(2)));

  // Rule 2: Overall Loss Used (Limit: 8%)
  const overallLossPct = currentBalance < initialBalance 
    ? parseFloat((((initialBalance - currentBalance) / initialBalance) * 100).toFixed(2))
    : 0;

  // Rule 3: Daily Loss Used (Limit: 4%)
  // Sum today's trades to see if they're in daily drawdown
  const todayStr = new Date().toISOString().split("T")[0];
  const todaysTrades = await prisma.trade.findMany({
    where: { userId, accountId: activeAccount?.id || undefined, date: todayStr },
  });
  const todaysPnl = todaysTrades.reduce((sum, t) => sum + parsePnl(t.pnl), 0);
  const dailyLossPct = todaysPnl < 0
    ? parseFloat((((Math.abs(todaysPnl)) / initialBalance) * 100).toFixed(2))
    : 0;

  // Dashboard Stats array
  const topStats = [
    { 
      label: "Account Balance", 
      value: `₹${currentBalance.toLocaleString("en-IN")}`, 
      color: currentBalance >= initialBalance ? "green" : "red", 
      delta: `${planName} tier` 
    },
    { 
      label: "Total Profit/Loss", 
      value: `${profit >= 0 ? "+" : ""}₹${profit.toLocaleString("en-IN")}`, 
      color: profit >= 0 ? "green" : "red", 
      delta: `${profitPct >= 0 ? "+" : ""}${profitPct.toFixed(1)}% performance` 
    },
    { 
      label: "Current Drawdown", 
      value: `${overallLossPct}%`, 
      color: overallLossPct > 6 ? "red" : overallLossPct > 4 ? "yellow" : "green", 
      delta: "8% max limit" 
    },
    { 
      label: "Challenge Progress", 
      value: hasAccount ? `${Math.min(100, Math.round((currentProfitPct / profitTargetPct) * 100))}%` : "0%", 
      color: "blue", 
      delta: "Phase 1 of 1" 
    },
  ];

  const ruleProgress = [
    { label: "Profit Target (8%)",  current: currentProfitPct, limit: profitTargetPct, unit: "%" },
    { label: "Daily Loss Used",     current: dailyLossPct,     limit: 4,               unit: "%" },
    { label: "Overall Loss Used",   current: overallLossPct,   limit: 8,               unit: "%" },
    { label: "Trading Days",        current: tradingDaysCount, limit: 5,               unit: " days", done: tradingDaysCount >= 5 },
  ];

  // Dynamic Equity Chart Bars (Last 12 trades)
  const lastTrades = await prisma.trade.findMany({
    where: { userId, accountId: activeAccount?.id || undefined },
    orderBy: { createdAt: "asc" },
    take: 12,
  });

  let runningBalance = initialBalance;
  const balancePoints = [runningBalance];
  for (const t of lastTrades) {
    runningBalance += parsePnl(t.pnl);
    balancePoints.push(runningBalance);
  }

  const chartMax = Math.max(...balancePoints, initialBalance) * 1.01;
  const chartMin = Math.min(...balancePoints, initialBalance) * 0.99;
  const chartRange = chartMax - chartMin || 1;

  const equityBars = balancePoints.map(b => {
    const pct = ((b - chartMin) / chartRange) * 100;
    return Math.max(10, Math.round(pct));
  });

  // Account status from database
  const status = activeAccount?.status || "INACTIVE";
  const isFailed = status === "FAILED";
  const isPassed = status === "PASSED";
  const statusLabel = isPassed 
    ? "Passed" 
    : isFailed 
      ? "Failed" 
      : hasAccount 
        ? "On Track" 
        : "No Active Account";
  
  const statusColorClass = isPassed
    ? "badge-green"
    : isFailed
      ? "badge-red"
      : hasAccount
        ? "badge-green"
        : "badge-yellow";

  return (
    <DashboardLayout activePlan={activeAccount}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.2rem" }}>Overview</h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-3)" }}>Welcome back, {session.user.name}</p>
        </div>
        <span className={`badge ${statusColorClass}`}>
          <span style={{ 
            width: 6, height: 6, 
            background: isPassed ? "var(--green)" : isFailed ? "var(--red)" : hasAccount ? "var(--green)" : "var(--yellow)", 
            borderRadius: "50%", display: "inline-block", marginRight: "4px" 
          }} />
          {statusLabel}
        </span>
      </div>

      {isFailed && (
        <div className="card" style={{ marginBottom: "1.5rem", padding: "1.5rem", background: "rgba(220,38,38,0.1)", border: "1px solid var(--red)" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontSize: "1.25rem" }}>⚠️</span>
            <div>
              <h4 style={{ fontWeight: 600, color: "var(--red)", marginBottom: "0.25rem" }}>Evaluation Failed</h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.4 }}>
                This challenge account has breached the maximum daily drawdown (4%) or overall drawdown (8%) limit. Further trading is locked. You can purchase a new evaluation to start a fresh challenge.
              </p>
            </div>
          </div>
        </div>
      )}

      {isPassed && (
        <div className="card" style={{ marginBottom: "1.5rem", padding: "1.5rem", background: "rgba(22,163,74,0.1)", border: "1px solid var(--green)" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontSize: "1.25rem" }}>🎉</span>
            <div>
              <h4 style={{ fontWeight: 600, color: "var(--green)", marginBottom: "0.25rem" }}>Evaluation Passed!</h4>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.4 }}>
                Congratulations! You have successfully met the profit target of 8% and completed the minimum of 5 trading days. Your credentials for the funded account are being generated and will be sent to your email.
              </p>
            </div>
          </div>
        </div>
      )}

      {!hasAccount && (
        <div className="card" style={{ marginBottom: "1.5rem", padding: "2rem", textAlign: "center", background: "rgba(37,99,235,0.1)", border: "1px solid var(--blue-500)" }}>
          <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🚀</div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--text-1)", marginBottom: "0.5rem" }}>Start Your Evaluation Challenge</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-3)", maxWidth: "480px", margin: "0 auto 1.25rem", lineHeight: 1.5 }}>
            You don&apos;t have an active challenge account yet. Purchase an evaluation tier to prove your trading edge and manage up to ₹10,00,000 in capital.
          </p>
          <Link href="/challenges" className="btn btn-blue btn-sm">
            Browse Challenges →
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="dash-grid-4">
        {topStats.map((s) => (
          <div key={s.label} className="dash-stat-card">
            <div className="dash-stat-label">{s.label}</div>
            <div className={`dash-stat-value ${s.color}`}>{s.value}</div>
            <div className="dash-stat-delta">{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Chart + Rules */}
      <div className="dash-grid-2">
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.2rem" }}>Equity Curve</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Performance based on logged trades</div>
            </div>
            <span className={`badge ${profitPct >= 0 ? "badge-green" : "badge-red"}`}>
              {profitPct >= 0 ? "+" : ""}{profitPct.toFixed(1)}%
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "120px" }}>
            {equityBars.map((h, i) => (
              <div key={i} style={{
                flex: 1, height: `${h}%`, borderRadius: "3px 3px 0 0",
                background: h > 75 ? "linear-gradient(to top,#16a34a,#22c55e)" : h > 55 ? "linear-gradient(to top,#1d4ed8,#3b82f6)" : "var(--bg-elevated)",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.625rem", fontSize: "0.625rem", color: "var(--text-3)" }}>
            <span>{balancePoints.length} updates</span><span>Today</span>
          </div>
        </div>

        <div className="card">
          <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1.25rem" }}>Challenge Rules</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {ruleProgress.map((r) => {
              const pct = Math.min((r.current / r.limit) * 100, 100);
              const isDanger = pct > 75;
              return (
                <div key={r.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.35rem" }}>
                    <span style={{ color: "var(--text-2)" }}>{r.label}</span>
                    <span style={{ color: r.done ? "var(--green)" : isDanger ? "var(--yellow)" : "var(--text-1)", fontWeight: 500 }}>
                      {r.current}{r.unit} {r.done ? "✓" : `/ ${r.limit}${r.unit}`}
                    </span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{
                      width: `${pct}%`,
                      background: r.done 
                        ? "linear-gradient(90deg,#16a34a,#22c55e)" 
                        : (r.label.includes("Loss") && isDanger) 
                          ? "linear-gradient(90deg,#dc2626,#ef4444)" 
                          : isDanger 
                            ? "linear-gradient(90deg,#ca8a04,#eab308)" 
                            : undefined,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trades */}
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 600 }}>Recent Trades</div>
          <a href="/dashboard/journal" style={{ fontSize: "0.75rem", color: "var(--blue-400)", textDecoration: "none" }}>View all →</a>
        </div>
        <div style={{ overflowX: "auto" }}>
          {recentTrades.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-3)", fontSize: "0.875rem" }}>
              No recent trades logged. Go to the <a href="/dashboard/journal" style={{ color: "var(--blue-400)" }}>Journal</a> page to log your first trade.
            </div>
          ) : (
            <table className="trades-table">
              <thead>
                <tr><th>Symbol</th><th>Type</th><th>Entry</th><th>P&L</th><th>Result</th><th>Date</th></tr>
              </thead>
              <tbody>
                {recentTrades.map((t, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500, color: "var(--text-1)" }}>{t.symbol}</td>
                    <td><span className={`badge ${t.direction === "BUY" ? "badge-green" : "badge-red"}`} style={{ fontSize: "0.625rem" }}>{t.direction}</span></td>
                    <td>{t.entry}</td>
                    <td style={{ color: t.isProfit ? "var(--green)" : "var(--red)", fontWeight: 600 }}>{t.pnl}</td>
                    <td><span className={`badge ${t.isProfit ? "badge-green" : "badge-red"}`} style={{ fontSize: "0.625rem" }}>{t.isProfit ? "Win" : "Loss"}</span></td>
                    <td style={{ color: "var(--text-3)" }}>{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}