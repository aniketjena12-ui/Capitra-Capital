"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/ToastProvider";

const history = [
  { id: "PAY-001", date: "Jun 20, 2026", amount: "₹22,400", status: "Paid",    method: "NEFT" },
  { id: "PAY-002", date: "Jun 6, 2026",  amount: "₹18,600", status: "Paid",    method: "NEFT" },
  { id: "PAY-003", date: "May 22, 2026", amount: "₹31,200", status: "Paid",    method: "IMPS" },
  { id: "PAY-004", date: "May 8, 2026",  amount: "₹9,800",  status: "Pending", method: "—"    },
];

export default function PayoutsPage() {
  const { toast } = useToast();
  const [amount, setAmount]   = useState("");
  const [method, setMethod]   = useState("NEFT");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const available = 82300;

  function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    const val = Number(amount);
    if (!val || val < 1000) { toast("Minimum payout is ₹1,000.", "error"); return; }
    if (val > available)    { toast("Amount exceeds available profit.", "error"); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast("Payout request submitted! Processing in 1–3 business days.", "success");
    }, 1200);
  }

  const statusColor: Record<string, string> = { Paid: "badge-green", Pending: "badge-yellow" };

  return (
    <DashboardLayout title="Payouts" subtitle="Request withdrawals and view your payout history">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Available to Withdraw</div>
          <div className="dash-stat-value green">₹{available.toLocaleString("en-IN")}</div>
          <div className="dash-stat-delta">80% of ₹1,02,875 profit</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Withdrawn</div>
          <div className="dash-stat-value">₹{(22400 + 18600 + 31200).toLocaleString("en-IN")}</div>
          <div className="dash-stat-delta">3 successful payouts</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1.5rem", alignItems: "start" }}>
        {/* Request Form */}
        <div className="card">
          <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1.25rem" }}>Request Payout</div>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✅</div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.6 }}>
                Your payout request is submitted. You&apos;ll receive the funds within 1–3 business days.
              </p>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: "1rem" }} onClick={() => { setSubmitted(false); setAmount(""); }}>
                Make another request
              </button>
            </div>
          ) : (
            <form onSubmit={handleRequest} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input className="form-input" type="number" placeholder="e.g. 10000" min={1000} max={available} value={amount} onChange={e => setAmount(e.target.value)} required />
                <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>Min: ₹1,000 · Max: ₹{available.toLocaleString("en-IN")}</span>
              </div>

              <div className="form-group">
                <label className="form-label">Transfer Method</label>
                <select className="form-input" value={method} onChange={e => setMethod(e.target.value)} style={{ appearance: "none" }}>
                  <option>NEFT</option>
                  <option>IMPS</option>
                  <option>UPI</option>
                </select>
              </div>

              <div style={{ padding: "0.875rem", background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--text-3)", lineHeight: 1.5 }}>
                Payouts are sent to the bank account registered in Settings. Processing time: 1–3 business days.
              </div>

              <button type="submit" disabled={submitting} className="btn btn-blue btn-full">
                {submitting ? "Submitting…" : "Request Payout →"}
              </button>
            </form>
          )}
        </div>

        {/* History */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-soft)", fontSize: "0.875rem", fontWeight: 600 }}>
            Payout History
          </div>
          <table className="trades-table">
            <thead>
              <tr><th>ID</th><th>Date</th><th>Amount</th><th>Method</th><th>Status</th></tr>
            </thead>
            <tbody>
              {history.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--text-3)" }}>{p.id}</td>
                  <td>{p.date}</td>
                  <td style={{ fontWeight: 600, color: "var(--text-1)" }}>{p.amount}</td>
                  <td>{p.method}</td>
                  <td><span className={`badge ${statusColor[p.status]}`} style={{ fontSize: "0.625rem" }}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
