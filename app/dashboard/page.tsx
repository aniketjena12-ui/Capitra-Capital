"use client";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import DashboardLayout from "@/components/DashboardLayout";

const topStats = [
  { label: "Account Balance",     value: "₹5,42,000",  color: "green",  delta: "+₹42,000 this week" },
  { label: "Total Profit",        value: "+₹82,300",   color: "green",  delta: "+16.2% all time" },
  { label: "Current Drawdown",    value: "3.2%",       color: "yellow", delta: "4% limit" },
  { label: "Challenge Progress",  value: "68%",        color: "blue",   delta: "Phase 1 of 1" },
];

const equityBars = [38, 52, 42, 67, 58, 74, 69, 82, 76, 88, 84, 92];

const recentTrades = [
  { symbol: "NIFTY 50",  type: "BUY",  entry: "23,450", pnl: "+₹12,400", status: "Win",  date: "Today 10:32" },
  { symbol: "BANKNIFTY", type: "SELL", entry: "51,200", pnl: "–₹3,200",  status: "Loss", date: "Today 09:15" },
  { symbol: "BTC/USDT",  type: "BUY",  entry: "62,100", pnl: "+₹25,000", status: "Win",  date: "Yesterday"  },
  { symbol: "RELIANCE",  type: "BUY",  entry: "2,850",  pnl: "+₹5,600",  status: "Win",  date: "25 Jun"     },
  { symbol: "HDFC BANK", type: "SELL", entry: "1,720",  pnl: "–₹1,800",  status: "Loss", date: "24 Jun"     },
];

const ruleProgress = [
  { label: "Profit Target (8%)",  current: 6.2, limit: 8, unit: "%"     },
  { label: "Daily Loss Used",     current: 1.1, limit: 4, unit: "%"     },
  { label: "Overall Loss Used",   current: 3.2, limit: 8, unit: "%"     },
  { label: "Trading Days",        current: 9,   limit: 5, unit: " days", done: true },
];

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <DashboardLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem" }}>
        <div>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.2rem" }}>Overview</h1>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-3)" }}>Last active: Today, 10:45 AM</p>
        </div>
        <span className="badge badge-green">
          <span style={{ width: 6, height: 6, background: "var(--green)", borderRadius: "50%", display: "inline-block" }} />
          On Track
        </span>
      </div>

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
              <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Simulated performance</div>
            </div>
            <span className="badge badge-green">+16.2%</span>
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
            <span>12 trading days</span><span>Today</span>
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
                      background: r.done ? "linear-gradient(90deg,#16a34a,#22c55e)" : isDanger ? "linear-gradient(90deg,#ca8a04,#eab308)" : undefined,
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
          <table className="trades-table">
            <thead>
              <tr><th>Symbol</th><th>Type</th><th>Entry</th><th>P&L</th><th>Result</th><th>Date</th></tr>
            </thead>
            <tbody>
              {recentTrades.map((t, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 500, color: "var(--text-1)" }}>{t.symbol}</td>
                  <td><span className={`badge ${t.type === "BUY" ? "badge-green" : "badge-red"}`} style={{ fontSize: "0.625rem" }}>{t.type}</span></td>
                  <td>{t.entry}</td>
                  <td style={{ color: t.pnl.startsWith("+") ? "var(--green)" : "var(--red)", fontWeight: 600 }}>{t.pnl}</td>
                  <td><span className={`badge ${t.status === "Win" ? "badge-green" : "badge-red"}`} style={{ fontSize: "0.625rem" }}>{t.status}</span></td>
                  <td style={{ color: "var(--text-3)" }}>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}