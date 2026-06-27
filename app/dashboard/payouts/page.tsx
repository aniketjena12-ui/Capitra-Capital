"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/ToastProvider";

interface Payout {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

interface ActiveAccount {
  balance: number;
  initialBalance: number;
}

export default function PayoutsPage() {
  const { toast } = useToast();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [activeAccount, setActiveAccount] = useState<ActiveAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("NEFT");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [kycStatus, setKycStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchPayouts();
    fetchKycStatus();
  }, []);

  async function fetchKycStatus() {
    try {
      const res = await fetch("/api/kyc");
      const data = await res.json();
      if (res.ok && data.kyc) {
        setKycStatus(data.kyc.kycStatus);
      }
    } catch {
      // non-critical — silently fail
    }
  }

  async function fetchPayouts() {
    try {
      const res = await fetch("/api/payouts");
      const data = await res.json();
      if (res.ok) {
        setPayouts(data.payouts || []);
        setActiveAccount(data.activeAccount || null);
      } else {
        toast(data.error || "Failed to load payouts.", "error");
      }
    } catch {
      toast("Error loading payouts data.", "error");
    } finally {
      setLoading(false);
    }
  }

  const profit = activeAccount ? activeAccount.balance - activeAccount.initialBalance : 0;
  const available = profit > 0 ? profit * 0.8 : 0;
  
  const totalWithdrawn = payouts
    .filter(p => p.status === "PAID" || p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    const val = Number(amount);
    if (!val || val < 1000) { toast("Minimum payout is ₹1,000.", "error"); return; }
    if (val > available)    { toast("Amount exceeds available profit.", "error"); return; }
    
    setSubmitting(true);
    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: val, method }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        toast("Payout request submitted! Processing in 1–3 business days.", "success");
        fetchPayouts();
      } else {
        toast(data.error || "Failed to submit request.", "error");
      }
    } catch {
      toast("Server error submitting request.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const statusColor: Record<string, string> = { 
    Paid: "badge-green", 
    COMPLETED: "badge-green", 
    PAID: "badge-green", 
    Pending: "badge-yellow", 
    PENDING: "badge-yellow", 
    REJECTED: "badge-red" 
  };

  return (
    <DashboardLayout title="Payouts" subtitle="Request withdrawals and view your payout history">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }} className="payouts-stats-grid">
        <div className="dash-stat-card">
          <div className="dash-stat-label">Available to Withdraw</div>
          <div className="dash-stat-value green">₹{available.toLocaleString("en-IN")}</div>
          <div className="dash-stat-delta">
            {profit > 0 ? `80% of ₹${profit.toLocaleString("en-IN")} profit` : "No profit accrued yet"}
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Withdrawn</div>
          <div className="dash-stat-value">₹{totalWithdrawn.toLocaleString("en-IN")}</div>
          <div className="dash-stat-delta">{payouts.filter(p => p.status === "PAID" || p.status === "COMPLETED").length} successful payouts</div>
        </div>
      </div>

      {/* KYC Gate Banner */}
      {kycStatus !== null && kycStatus !== "VERIFIED" && (
        <div
          className="card"
          style={{
            marginBottom: "1.5rem",
            padding: "1.25rem 1.5rem",
            background: kycStatus === "PENDING" ? "rgba(37,99,235,0.08)" : "rgba(234,179,8,0.07)",
            border: `1px solid ${kycStatus === "PENDING" ? "rgba(59,130,246,0.3)" : "rgba(234,179,8,0.3)"}`,
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>
            {kycStatus === "PENDING" ? "🔄" : "⚠️"}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-1)", marginBottom: "0.25rem" }}>
              {kycStatus === "PENDING" ? "KYC Under Review" : "KYC Verification Required"}
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.5 }}>
              {kycStatus === "PENDING"
                ? "Your identity documents are being reviewed. Payouts will be enabled once verification is complete (1–2 business days)."
                : "You must complete KYC verification before requesting a payout. This protects your earnings."}
            </p>
          </div>
          {kycStatus !== "PENDING" && (
            <a href="/dashboard/kyc" className="btn btn-blue btn-sm" style={{ flexShrink: 0 }}>
              Verify Now →
            </a>
          )}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1.5rem", alignItems: "start" }} className="payouts-main-grid">
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
                <input
                  className="form-input"
                  type="number"
                  placeholder="e.g. 10000"
                  min={1000}
                  max={available || 1000}
                  disabled={available < 1000 || kycStatus !== "VERIFIED"}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  required
                />
                <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>
                  Min: ₹1,000 · Max: ₹{available.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Transfer Method</label>
                <select className="form-input" value={method} onChange={e => setMethod(e.target.value)} style={{ appearance: "none" }} disabled={available < 1000 || kycStatus !== "VERIFIED"}>
                  <option value="NEFT">NEFT</option>
                  <option value="IMPS">IMPS</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              <div style={{ padding: "0.875rem", background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--text-3)", lineHeight: 1.5 }}>
                Payouts are sent to the bank account registered in Settings. Processing time: 1–3 business days.
              </div>

              <button type="submit" disabled={submitting || available < 1000 || kycStatus !== "VERIFIED"} className="btn btn-blue btn-full">
                {submitting
                  ? "Submitting…"
                  : kycStatus === "PENDING"
                  ? "Awaiting KYC Approval"
                  : kycStatus !== "VERIFIED"
                  ? "KYC Required — Verify Identity"
                  : available < 1000
                  ? "Insufficient Profit for Payout"
                  : "Request Payout →"}
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
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-3)" }}>
                    Loading history...
                  </td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "var(--text-3)" }}>
                    No payout history found.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => {
                  const dateStr = new Date(p.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  });
                  return (
                    <tr key={p.id}>
                      <td style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "var(--text-3)" }}>
                        {p.id.substring(0, 8).toUpperCase()}
                      </td>
                      <td>{dateStr}</td>
                      <td style={{ fontWeight: 600, color: "var(--text-1)" }}>
                        ₹{p.amount.toLocaleString("en-IN")}
                      </td>
                      <td>{p.method}</td>
                      <td>
                        <span className={`badge ${statusColor[p.status] || "badge-yellow"}`} style={{ fontSize: "0.625rem" }}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
