"use client";

import { useState } from "react";
import { useToast } from "@/components/ToastProvider";

export default function SimulatorCard({ hasAccount, accountStatus }: { hasAccount: boolean; accountStatus: string }) {
  const { toast } = useToast();
  const [symbol, setSymbol] = useState("NIFTY 50");
  const [direction, setDirection] = useState<"BUY" | "SELL">("BUY");
  const [isWin, setIsWin] = useState(true);
  const [pnlAmt, setPnlAmt] = useState("10000");
  const [notes, setNotes] = useState("Simulated trade execution.");
  const [executing, setExecuting] = useState(false);

  const disabled = !hasAccount || accountStatus !== "ACTIVE";

  async function handleSimulate(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(pnlAmt);
    if (isNaN(amount) || amount <= 0) {
      toast("Please enter a valid positive amount.", "error");
      return;
    }

    setExecuting(true);
    try {
      const dateStr = new Date().toISOString().split("T")[0];
      const entryPrice = "23,400";
      const exitPrice = isWin ? "23,600" : "23,200";
      const pnlFormatted = `${isWin ? "+" : "–"}₹${amount.toLocaleString("en-IN")}`;

      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          symbol,
          direction,
          entry: entryPrice,
          exit: exitPrice,
          pnl: pnlFormatted,
          notes: notes || `Simulated ${isWin ? "Win" : "Loss"} trade.`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast(`Simulated trade executed! P&L: ${pnlFormatted}`, "success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast(data.error || "Execution failed.", "error");
      }
    } catch (e) {
      toast("Server error executing mock trade.", "error");
    } finally {
      setExecuting(false);
    }
  }

  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1rem" }}>⚡</span> Mock Trading Simulator
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--text-3)", marginBottom: "1rem" }}>
          Simulate real-time trades to test drawdown calculations and evaluation limits.
        </p>
      </div>

      {disabled ? (
        <div style={{ padding: "1.5rem 1rem", background: "rgba(255,255,255,0.01)", border: "1px dashed var(--border-soft)", borderRadius: "var(--radius-sm)", textAlign: "center", fontSize: "0.75rem", color: "var(--text-3)" }}>
          {accountStatus === "FAILED" 
            ? "🔒 Simulator locked: Evaluation FAILED." 
            : accountStatus === "PASSED" 
              ? "🔒 Simulator locked: Evaluation PASSED!" 
              : "🔒 Simulator locked: Purchase a challenge first."}
        </div>
      ) : (
        <form onSubmit={handleSimulate} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: "0.6875rem" }}>Symbol</label>
              <select className="form-input" style={{ fontSize: "0.75rem", padding: "0.5rem" }} value={symbol} onChange={e => setSymbol(e.target.value)}>
                <option value="NIFTY 50">NIFTY 50</option>
                <option value="BANKNIFTY">BANKNIFTY</option>
                <option value="BTC/USDT">BTC/USDT</option>
                <option value="ETH/USDT">ETH/USDT</option>
                <option value="RELIANCE">RELIANCE</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label" style={{ fontSize: "0.6875rem" }}>Direction</label>
              <div style={{ display: "flex", gap: "0.25rem", height: "32px" }}>
                <button
                  type="button"
                  onClick={() => setDirection("BUY")}
                  className={`btn btn-sm ${direction === "BUY" ? "btn-blue" : "btn-ghost"}`}
                  style={{ flex: 1, fontSize: "0.6875rem", padding: 0 }}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setDirection("SELL")}
                  className={`btn btn-sm ${direction === "SELL" ? "btn-blue" : "btn-ghost"}`}
                  style={{ flex: 1, fontSize: "0.6875rem", padding: 0 }}
                >
                  SELL
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: "0.6875rem" }}>Trade Outcome</label>
              <div style={{ display: "flex", gap: "0.25rem", height: "32px" }}>
                <button
                  type="button"
                  onClick={() => setIsWin(true)}
                  style={{ 
                    flex: 1, 
                    fontSize: "0.6875rem", 
                    padding: 0,
                    background: isWin ? "rgba(34,197,94,0.15)" : "transparent",
                    color: isWin ? "var(--green)" : "var(--text-3)",
                    border: isWin ? "1px solid rgba(34,197,94,0.4)" : "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer"
                  }}
                >
                  WIN
                </button>
                <button
                  type="button"
                  onClick={() => setIsWin(false)}
                  style={{ 
                    flex: 1, 
                    fontSize: "0.6875rem", 
                    padding: 0,
                    background: !isWin ? "rgba(239,68,68,0.15)" : "transparent",
                    color: !isWin ? "var(--red)" : "var(--text-3)",
                    border: !isWin ? "1px solid rgba(239,68,68,0.4)" : "1px solid var(--border-soft)",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer"
                  }}
                >
                  LOSS
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: "0.6875rem" }}>Amount (₹)</label>
              <input
                className="form-input"
                style={{ fontSize: "0.75rem", padding: "0.5rem" }}
                type="number"
                value={pnlAmt}
                onChange={e => setPnlAmt(e.target.value)}
                placeholder="₹10,000"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={executing} className="btn btn-blue btn-full btn-sm" style={{ marginTop: "0.25rem", fontSize: "0.75rem" }}>
            {executing ? "Executing Sim..." : `Execute Simulated ${direction} Trade`}
          </button>
        </form>
      )}
    </div>
  );
}
