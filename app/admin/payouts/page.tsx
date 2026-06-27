"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/ToastProvider";

interface PayoutRequest {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  account: {
    planName: string;
    initialBalance: number;
  };
}

export default function AdminPayoutsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { toast } = useToast();

  const [payouts, setPayouts] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (session && session.user?.email === "admin@capitracapital.com") {
      fetchPayouts();
    }
  }, [session]);

  async function fetchPayouts() {
    try {
      const res = await fetch("/api/admin/payouts");
      const data = await res.json();
      if (res.ok) {
        setPayouts(data.payouts || []);
      } else {
        toast(data.error || "Failed to load admin payouts.", "error");
      }
    } catch {
      toast("Error loading admin payouts data.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(payoutId: string, action: "APPROVE" | "REJECT") {
    if (window.confirm(`Are you sure you want to ${action.toLowerCase()} this payout request?`)) {
      setProcessingId(payoutId);
      try {
        const res = await fetch("/api/admin/payouts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payoutId, action }),
        });
        const data = await res.json();
        if (res.ok) {
          toast(data.message || "Payout processed successfully.", "success");
          fetchPayouts();
        } else {
          toast(data.error || "Failed to process payout.", "error");
        }
      } catch {
        toast("Server error processing payout.", "error");
      } finally {
        setProcessingId(null);
      }
    }
  }

  // Session state checks
  if (sessionStatus === "loading") {
    return (
      <div style={{ color: "var(--text-3)", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Loading credentials...
      </div>
    );
  }

  if (!session || session.user?.email !== "admin@capitracapital.com") {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80vh", gap: "1rem" }}>
        <span style={{ fontSize: "3rem" }}>🚫</span>
        <h2 style={{ color: "var(--red)", fontWeight: 600 }}>Access Denied</h2>
        <p style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>Admin privileges are required to view this console.</p>
        <a href="/dashboard" className="btn btn-blue btn-sm" style={{ textDecoration: "none" }}>Go to My Dashboard</a>
      </div>
    );
  }

  // Metrics
  const totalRequests = payouts.length;
  const pendingRequests = payouts.filter((p) => p.status === "PENDING").length;
  const totalDisbursed = payouts
    .filter((p) => p.status === "PAID" || p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  const statusColor: Record<string, string> = { 
    Paid: "badge-green", 
    COMPLETED: "badge-green", 
    PAID: "badge-green", 
    Pending: "badge-yellow", 
    PENDING: "badge-yellow", 
    REJECTED: "badge-red" 
  };

  return (
    <DashboardLayout title="Admin Payout Management" subtitle="Review, approve, or reject trader withdrawal requests">
      {/* Metrics Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }} className="mobile-1col">
        <div className="dash-stat-card">
          <div className="dash-stat-label">Pending Requests</div>
          <div className="dash-stat-value yellow">{pendingRequests} review needed</div>
          <div className="dash-stat-delta">Out of {totalRequests} total requests</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Disbursed</div>
          <div className="dash-stat-value green">₹{totalDisbursed.toLocaleString("en-IN")}</div>
          <div className="dash-stat-delta">Successful payouts sent</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Volume</div>
          <div className="dash-stat-value">
            ₹{payouts.reduce((sum, p) => sum + p.amount, 0).toLocaleString("en-IN")}
          </div>
          <div className="dash-stat-delta">Lifetime withdrawal requests</div>
        </div>
      </div>

      {/* Requests table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-soft)", fontSize: "0.875rem", fontWeight: 600 }}>
          Withdrawal Requests Queue
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="trades-table">
            <thead>
              <tr>
                <th>Trader</th>
                <th>Challenge Plan</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Request Date</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-3)" }}>
                    Loading withdrawal requests queue...
                  </td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-3)" }}>
                    No payout requests found in the queue.
                  </td>
                </tr>
              ) : (
                payouts.map((p) => {
                  const dateStr = new Date(p.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                  });
                  const isPending = p.status === "PENDING";
                  return (
                    <tr key={p.id}>
                      <td>
                        <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{p.user.name}</div>
                        <div style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>{p.user.email}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.8125rem", color: "var(--text-1)" }}>{p.account.planName}</div>
                        <div style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>₹{p.account.initialBalance.toLocaleString("en-IN")} size</div>
                      </td>
                      <td style={{ fontWeight: 600, color: "var(--text-1)" }}>
                        ₹{p.amount.toLocaleString("en-IN")}
                      </td>
                      <td>{p.method}</td>
                      <td style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>{dateStr}</td>
                      <td>
                        <span className={`badge ${statusColor[p.status] || "badge-yellow"}`} style={{ fontSize: "0.625rem" }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {isPending ? (
                          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                            <button
                              disabled={processingId === p.id}
                              onClick={() => handleAction(p.id, "APPROVE")}
                              className="btn btn-blue btn-sm"
                              style={{ 
                                padding: "0.25rem 0.625rem", fontSize: "0.75rem", 
                                background: "var(--green)", border: "none", color: "white" 
                              }}
                            >
                              Approve
                            </button>
                            <button
                              disabled={processingId === p.id}
                              onClick={() => handleAction(p.id, "REJECT")}
                              className="btn btn-ghost btn-sm"
                              style={{ 
                                padding: "0.25rem 0.625rem", fontSize: "0.75rem", 
                                color: "var(--red)", borderColor: "var(--red)" 
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Processed</span>
                        )}
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
