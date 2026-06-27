"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/ToastProvider";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

interface Trade {
  id: string;
  date: string;
  symbol: string;
  direction: "BUY" | "SELL";
  entry: string;
  exit: string;
  pnl: string;
  isProfit: boolean;
  notes: string;
}

const blank: { date: string; symbol: string; direction: "BUY" | "SELL"; entry: string; exit: string; pnl: string; notes: string } = { date: "", symbol: "", direction: "BUY", entry: "", exit: "", pnl: "", notes: "" };

export default function JournalPage() {
  const { toast } = useToast();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [activeAccount, setActiveAccount] = useState<{ status: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blank);
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "win" | "loss">("all");
  const [tab, setTab] = useState<"logs" | "analytics">("logs");

  useEffect(() => {
    fetchTrades();
  }, []);

  async function fetchTrades() {
    try {
      const res = await fetch("/api/trades");
      const data = await res.json();
      if (res.ok) {
        setTrades(data.trades || []);
        setActiveAccount(data.activeAccount || null);
      } else {
        toast(data.error || "Failed to load trades.", "error");
      }
    } catch {
      toast("Error fetching trades.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.symbol || !form.entry || !form.exit || !form.pnl) {
      toast("Fill in all required fields.", "error"); return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast("Trade logged successfully.", "success");
        setForm(blank);
        setAdding(false);
        fetchTrades();
      } else {
        toast(data.error || "Failed to save trade.", "error");
      }
    } catch {
      toast("Server error saving trade.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this trade? The P&L will be reversed on your account balance.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/trades?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast("Trade deleted and balance adjusted.", "success");
        fetchTrades();
      } else {
        toast(data.error || "Failed to delete trade.", "error");
      }
    } catch {
      toast("Server error deleting trade.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  const visible = trades.filter(t =>
    filter === "all" ? true : filter === "win" ? t.isProfit : !t.isProfit
  );

  const wins = trades.filter(t => t.isProfit).length;
  const total = trades.length;

  return (
    <DashboardLayout title="Trade Journal" subtitle="Log and review all your trades for continuous improvement">
      
      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--border-soft)", marginBottom: "1.5rem" }}>
        <button 
          onClick={() => setTab("logs")}
          style={{
            background: "transparent",
            border: "none",
            color: tab === "logs" ? "var(--blue-400)" : "var(--text-3)",
            borderBottom: tab === "logs" ? "2px solid var(--blue-400)" : "2px solid transparent",
            padding: "0.5rem 1.25rem",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Trade Logs
        </button>
        <button 
          onClick={() => setTab("analytics")}
          style={{
            background: "transparent",
            border: "none",
            color: tab === "analytics" ? "var(--blue-400)" : "var(--text-3)",
            borderBottom: tab === "analytics" ? "2px solid var(--blue-400)" : "2px solid transparent",
            padding: "0.5rem 1.25rem",
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          Performance Analytics
        </button>
      </div>

      {tab === "logs" ? (
        <>
          {/* Stats bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Total Trades", val: total },
              { label: "Wins",         val: wins,           color: "var(--green)" },
              { label: "Losses",       val: total - wins,   color: "var(--red)" },
              { label: "Win Rate",     val: total ? `${Math.round((wins / total) * 100)}%` : "—", color: wins / total > 0.5 ? "var(--green)" : "var(--yellow)" },
            ].map((s) => (
              <div key={s.label} className="dash-stat-card">
                <div className="dash-stat-label">{s.label}</div>
                <div className="dash-stat-value" style={{ color: s.color || "var(--text-1)", fontSize: "1.5rem" }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Add trade */}
          {adding ? (
            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1.25rem" }}>Log New Trade</div>
              <form onSubmit={handleAdd}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Symbol</label>
                    <input className="form-input" placeholder="e.g. NIFTY 50" value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Direction</label>
                    <select className="form-input" value={form.direction} onChange={e => setForm(f => ({ ...f, direction: e.target.value as "BUY" | "SELL" }))} style={{ appearance: "none" }}>
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Entry Price</label>
                    <input className="form-input" placeholder="23,450" value={form.entry} onChange={e => setForm(f => ({ ...f, entry: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Exit Price</label>
                    <input className="form-input" placeholder="23,620" value={form.exit} onChange={e => setForm(f => ({ ...f, exit: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">P&L (e.g. +₹5,000)</label>
                    <input className="form-input" placeholder="+₹12,400" value={form.pnl} onChange={e => setForm(f => ({ ...f, pnl: e.target.value }))} required />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label className="form-label">Notes / Reasoning</label>
                  <textarea className="form-input" placeholder="Why did you take this trade? What did you learn?" rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button type="submit" disabled={submitting} className="btn btn-blue btn-sm">
                    {submitting ? "Saving..." : "Save Trade"}
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAdding(false)}>Cancel</button>
                </div>
              </form>
            </div>
          ) : activeAccount?.status === "FAILED" ? (
            <div style={{ marginBottom: "1.25rem", padding: "1rem", background: "rgba(220,38,38,0.1)", border: "1px solid var(--red)", borderRadius: "var(--radius-sm)", fontSize: "0.8125rem", color: "var(--red)" }}>
              🔒 Trade logging is locked because this challenge account has breached drawdown limits.
            </div>
          ) : activeAccount?.status === "PASSED" ? (
            <div style={{ marginBottom: "1.25rem", padding: "1rem", background: "rgba(22,163,74,0.1)", border: "1px solid var(--green)", borderRadius: "var(--radius-sm)", fontSize: "0.8125rem", color: "var(--green)" }}>
              🔒 Trade logging is locked because this challenge account has successfully passed.
            </div>
          ) : (
            <div style={{ marginBottom: "1.25rem" }}>
              <button className="btn btn-blue btn-sm" onClick={() => setAdding(true)}>+ Log Trade</button>
            </div>
          )}

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            {(["all", "win", "loss"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? "btn-blue" : "btn-ghost"}`} style={{ textTransform: "capitalize" }}>
                {f === "all" ? "All Trades" : f === "win" ? "Wins" : "Losses"}
              </button>
            ))}
          </div>

          {/* Trades list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {loading ? (
              <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-3)" }}>
                Loading trades...
              </div>
            ) : visible.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--text-3)" }}>
                No trades logged yet. Click &quot;Log Trade&quot; to add your first entry.
              </div>
            ) : (
              visible.map((t) => (
                <div key={t.id} className="card trade-card-grid" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: "1.25rem", alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <span className={`badge ${t.direction === "BUY" ? "badge-green" : "badge-red"}`} style={{ fontSize: "0.625rem", marginBottom: "0.25rem", display: "block" }}>{t.direction}</span>
                    <div style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>{t.date}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-1)", marginBottom: "0.25rem" }}>{t.symbol}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Entry {t.entry} → Exit {t.exit}</div>
                    {t.notes && <div style={{ fontSize: "0.75rem", color: "var(--text-2)", marginTop: "0.375rem", fontStyle: "italic" }}>&quot;{t.notes}&quot;</div>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "1.125rem", fontWeight: 700, color: t.isProfit ? "var(--green)" : "var(--red)" }}>{t.pnl}</div>
                    <span className={`badge ${t.isProfit ? "badge-green" : "badge-red"}`} style={{ fontSize: "0.5625rem" }}>{t.isProfit ? "WIN" : "LOSS"}</span>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={deletingId === t.id}
                      title="Delete trade"
                      style={{
                        background: "transparent",
                        border: "1px solid rgba(220,38,38,0.3)",
                        borderRadius: "var(--radius-sm)",
                        color: deletingId === t.id ? "var(--text-3)" : "var(--red)",
                        cursor: deletingId === t.id ? "not-allowed" : "pointer",
                        fontSize: "0.75rem",
                        padding: "0.3rem 0.5rem",
                        opacity: deletingId === t.id ? 0.5 : 1,
                        transition: "opacity 0.2s, border-color 0.2s",
                      }}
                    >
                      {deletingId === t.id ? "…" : "🗑"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <AnalyticsView trades={trades} />
      )}
    </DashboardLayout>
  );
}

// Subcomponent for analytics to prevent hydration warning & layout shifts
function AnalyticsView({ trades }: { trades: Trade[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        style={{ 
          height: 300, 
          width: "100%", 
          background: "var(--bg-elevated)", 
          borderRadius: "var(--radius-lg)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "var(--text-3)",
          fontSize: "0.875rem"
        }}
      >
        Loading charts and metrics...
      </div>
    );
  }

  // Parse helper
  function parsePnl(pnlStr: string): number {
    let clean = pnlStr.replace(/[₹\s,]/g, "");
    clean = clean.replace(/[–—-]/g, "-");
    const value = parseFloat(clean);
    return isNaN(value) ? 0 : value;
  }

  const parsedTrades = trades.map(t => ({
    ...t,
    pnlAmt: parsePnl(t.pnl)
  }));

  const total = parsedTrades.length;
  const wins = parsedTrades.filter(t => t.isProfit);
  const losses = parsedTrades.filter(t => !t.isProfit);

  // 1. Pie Chart
  const pieData = [
    { name: "Wins", value: wins.length, color: "var(--green)" },
    { name: "Losses", value: losses.length, color: "var(--red)" }
  ];

  // 2. Asset Performance
  const assetMap: Record<string, number> = {};
  parsedTrades.forEach(t => {
    const symbol = t.symbol.toUpperCase().trim();
    assetMap[symbol] = (assetMap[symbol] || 0) + t.pnlAmt;
  });
  const barDataAsset = Object.keys(assetMap).map(symbol => ({
    asset: symbol,
    pnl: assetMap[symbol]
  })).sort((a, b) => b.pnl - a.pnl);

  // 3. Directional Performance
  let longPnl = 0;
  let shortPnl = 0;
  parsedTrades.forEach(t => {
    if (t.direction === "BUY") longPnl += t.pnlAmt;
    else if (t.direction === "SELL") shortPnl += t.pnlAmt;
  });
  const barDataDirection = [
    { direction: "Long (BUY)", pnl: longPnl, color: longPnl >= 0 ? "var(--green)" : "var(--red)" },
    { direction: "Short (SELL)", pnl: shortPnl, color: shortPnl >= 0 ? "var(--green)" : "var(--red)" }
  ];

  // 4. RR stats
  const avgWin = wins.length > 0 ? wins.reduce((sum, t) => sum + t.pnlAmt, 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, t) => sum + t.pnlAmt, 0) / losses.length) : 0;
  const rrRatio = avgLoss > 0 ? (avgWin / avgLoss).toFixed(2) : "—";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* Metric Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        {[
          { 
            label: "Average Win Size", 
            value: `₹${Math.round(avgWin).toLocaleString("en-IN")}`, 
            color: "var(--green)", 
            sub: `${wins.length} winning trades` 
          },
          { 
            label: "Average Loss Size", 
            value: `₹${Math.round(avgLoss).toLocaleString("en-IN")}`, 
            color: "var(--red)", 
            sub: `${losses.length} losing trades` 
          },
          { 
            label: "Risk-to-Reward Ratio", 
            value: rrRatio, 
            color: parseFloat(rrRatio) >= 1.5 ? "var(--green)" : parseFloat(rrRatio) >= 1.0 ? "var(--yellow)" : "var(--text-1)", 
            sub: "Average Win / Average Loss" 
          }
        ].map((m) => (
          <div key={m.label} className="card">
            <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-3)", fontWeight: 600, marginBottom: "0.5rem" }}>
              {m.label}
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: m.color, marginBottom: "0.25rem" }}>
              {m.value}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {total === 0 ? (
        <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-3)" }}>
          <span style={{ fontSize: "2rem", display: "block", marginBottom: "1rem" }}>📊</span>
          Log your trades first to view performance analytics.
        </div>
      ) : (
        <>
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
            
            {/* Win/Loss Split */}
            <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1rem", alignSelf: "flex-start" }}>Win/Loss Split</div>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ background: "rgba(17,24,39,0.9)", border: "1px solid var(--border-soft)", borderRadius: "var(--radius-sm)" }}
                      itemStyle={{ color: "var(--text-1)" }}
                    />
                    <Legend formatter={(value) => <span style={{ color: "var(--text-2)", fontSize: "0.75rem" }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Long vs Short P&L */}
            <div className="card">
              <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1rem" }}>Long vs Short P&L</div>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barDataDirection} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                    <XAxis dataKey="direction" stroke="var(--text-3)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-3)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: "rgba(255,255,255,0.01)" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div style={{ background: "rgba(17,24,39,0.9)", border: "1px solid var(--border-soft)", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.75rem" }}>
                              <div style={{ fontWeight: 600, color: "var(--text-1)", marginBottom: "0.25rem" }}>{data.direction}</div>
                              <div style={{ color: data.pnl >= 0 ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                                Net P&L: {data.pnl >= 0 ? "+" : ""}₹{data.pnl.toLocaleString("en-IN")}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                      {barDataDirection.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Row 2: Asset wise P&L */}
          <div className="card">
            <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1rem" }}>Net Profit by Asset Symbol</div>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barDataAsset} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="asset" stroke="var(--text-3)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-3)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: "rgba(255,255,255,0.01)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div style={{ background: "rgba(17,24,39,0.9)", border: "1px solid var(--border-soft)", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.75rem" }}>
                            <div style={{ fontWeight: 600, color: "var(--text-1)", marginBottom: "0.25rem" }}>{data.asset}</div>
                            <div style={{ color: data.pnl >= 0 ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                              Net P&L: {data.pnl >= 0 ? "+" : ""}₹{data.pnl.toLocaleString("en-IN")}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                    {barDataAsset.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? "var(--green)" : "var(--red)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
