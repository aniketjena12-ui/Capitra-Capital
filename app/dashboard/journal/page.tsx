"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/ToastProvider";

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
  const [filter, setFilter] = useState<"all" | "win" | "loss">("all");

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

  const visible = trades.filter(t =>
    filter === "all" ? true : filter === "win" ? t.isProfit : !t.isProfit
  );

  const wins = trades.filter(t => t.isProfit).length;
  const total = trades.length;

  return (
    <DashboardLayout title="Trade Journal" subtitle="Log and review all your trades for continuous improvement">
      {/* Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1rem" }}>
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
            <div key={t.id} className="card" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "1.25rem", alignItems: "center" }}>
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
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
