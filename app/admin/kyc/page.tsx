"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/ToastProvider";

interface TraderKyc {
  id: string;
  name: string;
  email: string;
  kycStatus: "UNVERIFIED" | "PENDING" | "VERIFIED";
  kycIdUrl: string | null;
  kycSelfieUrl: string | null;
  kycDocType: string | null;
  kycNotes: string | null;
  createdAt: string;
}

const docTypeLabels: Record<string, string> = {
  AADHAAR: "Aadhaar Card",
  PAN: "PAN Card",
  PASSPORT: "Passport",
  VOTER_ID: "Voter ID",
  DRIVING_LICENSE: "Driving License",
};

export default function AdminKycPage() {
  const { data: session, status: sessionStatus } = useSession();
  const { toast } = useToast();

  const [traders, setTraders] = useState<TraderKyc[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL"); // ALL, PENDING, VERIFIED, UNVERIFIED

  // Modal State for viewing Base64 documents
  const [modalDocUrl, setModalDocUrl] = useState<string>("");
  const [modalTitle, setModalTitle] = useState<string>("");

  useEffect(() => {
    if (session && session.user?.email === "admin@capitracapital.com") {
      fetchTraders();
    }
  }, [session]);

  async function fetchTraders() {
    try {
      const res = await fetch("/api/admin/kyc");
      const data = await res.json();
      if (res.ok) {
        setTraders(data.users || []);
      } else {
        toast(data.error || "Failed to load KYC queue.", "error");
      }
    } catch {
      toast("Error loading KYC queue data.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleViewDoc(userId: string, name: string, doc: "id" | "selfie") {
    try {
      const res = await fetch(`/api/admin/kyc/view?userId=${userId}&doc=${doc}`);
      const data = await res.json();
      if (res.ok && data.url) {
        setModalDocUrl(data.url);
        setModalTitle(`${name}'s ${doc === "id" ? "Government ID" : "Selfie"}`);
      } else {
        toast(data.error || "Failed to retrieve document preview.", "error");
      }
    } catch {
      toast("Error retrieving document preview.", "error");
    }
  }

  async function handleAction(userId: string, action: "APPROVE" | "REJECT") {
    let notes = "";
    if (action === "REJECT") {
      const reason = window.prompt(
        "Enter reason for rejection (this will be shown to the trader):",
        "Documents are blurry or unreadable. Please upload clear photos."
      );
      if (reason === null) return; // User cancelled
      notes = reason.trim();
    } else {
      if (!window.confirm("Are you sure you want to APPROVE this KYC submission?")) {
        return;
      }
    }

    setProcessingId(userId);
    try {
      const res = await fetch("/api/admin/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, notes }),
      });
      const data = await res.json();
      if (res.ok) {
        toast(data.message || "KYC processed successfully.", "success");
        fetchTraders();
      } else {
        toast(data.error || "Failed to process KYC.", "error");
      }
    } catch {
      toast("Server error processing KYC action.", "error");
    } finally {
      setProcessingId(null);
    }
  }

  // Session checks
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

  // Metrics calculation
  const totalSubmissions = traders.filter(t => t.kycStatus !== "UNVERIFIED" || t.kycIdUrl).length;
  const pendingCount = traders.filter(t => t.kycStatus === "PENDING").length;
  const verifiedCount = traders.filter(t => t.kycStatus === "VERIFIED").length;

  // Filter list
  const filteredTraders = traders.filter((t) => {
    if (filter === "ALL") return true;
    return t.kycStatus === filter;
  });

  const statusColor: Record<string, string> = {
    VERIFIED: "badge-green",
    PENDING: "badge-yellow",
    UNVERIFIED: "badge-red",
  };

  const statusLabels: Record<string, string> = {
    VERIFIED: "Verified",
    PENDING: "Pending Review",
    UNVERIFIED: "Not Verified",
  };

  return (
    <DashboardLayout title="Admin KYC Management" subtitle="Review and approve trader identity verification documents">
      
      {/* Metrics Bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "1.5rem" }} className="mobile-1col">
        <div className="dash-stat-card">
          <div className="dash-stat-label">Pending Reviews</div>
          <div className="dash-stat-value yellow">{pendingCount} pending</div>
          <div className="dash-stat-delta">Requires admin review</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Verified Traders</div>
          <div className="dash-stat-value green">{verifiedCount} verified</div>
          <div className="dash-stat-delta">Unlocked for payout requests</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-label">Total Submissions</div>
          <div className="dash-stat-value">{totalSubmissions} lifetime</div>
          <div className="dash-stat-delta">Traders submitted identity proof</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", borderBottom: "1px solid var(--border-soft)", paddingBottom: "0.75rem" }}>
        {[
          { key: "ALL", label: `All Traders (${traders.length})` },
          { key: "PENDING", label: `Pending (${pendingCount})` },
          { key: "VERIFIED", label: `Verified (${verifiedCount})` },
          { key: "UNVERIFIED", label: `Unverified (${traders.filter(t => t.kycStatus === "UNVERIFIED").length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="btn btn-sm"
            style={{
              background: filter === tab.key ? "var(--blue-400)" : "transparent",
              color: filter === tab.key ? "white" : "var(--text-2)",
              border: filter === tab.key ? "1px solid var(--blue-400)" : "1px solid var(--border-soft)",
              borderRadius: "var(--radius-sm)",
              padding: "0.35rem 0.75rem",
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Traders Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-soft)", fontSize: "0.875rem", fontWeight: 600 }}>
          Traders KYC Queue
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="trades-table">
            <thead>
              <tr>
                <th>Trader</th>
                <th>Doc Type</th>
                <th>Submitted Date</th>
                <th>Status</th>
                <th>Documents</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-3)" }}>
                    Loading KYC verification queue...
                  </td>
                </tr>
              ) : filteredTraders.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-3)" }}>
                    No traders found matching this status filter.
                  </td>
                </tr>
              ) : (
                filteredTraders.map((t) => {
                  const dateStr = new Date(t.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric"
                  });
                  const hasDocuments = !!(t.kycIdUrl && t.kycSelfieUrl);
                  
                  return (
                    <tr key={t.id}>
                      <td>
                        <div style={{ fontWeight: 500, color: "var(--text-1)" }}>{t.name}</div>
                        <div style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>{t.email}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.8125rem", color: "var(--text-1)" }}>
                          {t.kycDocType ? (docTypeLabels[t.kycDocType] || t.kycDocType) : "—"}
                        </div>
                      </td>
                      <td style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>{dateStr}</td>
                      <td>
                        <span className={`badge ${statusColor[t.kycStatus] || "badge-yellow"}`} style={{ fontSize: "0.625rem" }}>
                          {statusLabels[t.kycStatus]}
                        </span>
                        {t.kycNotes && t.kycStatus === "UNVERIFIED" && (
                          <div style={{ fontSize: "0.625rem", color: "var(--red)", marginTop: "0.25rem", maxWidth: "200px", whiteSpace: "normal" }}>
                            Rejection Note: {t.kycNotes}
                          </div>
                        )}
                      </td>
                      <td>
                        {hasDocuments ? (
                          <div style={{ display: "flex", gap: "0.35rem" }}>
                            <button
                              onClick={() => handleViewDoc(t.id, t.name, "id")}
                              className="btn btn-ghost btn-sm"
                              style={{ padding: "0.2rem 0.5rem", fontSize: "0.6875rem", border: "1px solid var(--border-bright)" }}
                            >
                              🪪 ID
                            </button>
                            <button
                              onClick={() => handleViewDoc(t.id, t.name, "selfie")}
                              className="btn btn-ghost btn-sm"
                              style={{ padding: "0.2rem 0.5rem", fontSize: "0.6875rem", border: "1px solid var(--border-bright)" }}
                            >
                              🤳 Selfie
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>No files</span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                          {t.kycStatus === "PENDING" && (
                            <>
                              <button
                                disabled={processingId === t.id}
                                onClick={() => handleAction(t.id, "APPROVE")}
                                className="btn btn-sm"
                                style={{
                                  padding: "0.25rem 0.625rem",
                                  fontSize: "0.75rem",
                                  background: "var(--green)",
                                  border: "none",
                                  color: "white",
                                }}
                              >
                                Approve
                              </button>
                              <button
                                disabled={processingId === t.id}
                                onClick={() => handleAction(t.id, "REJECT")}
                                className="btn btn-ghost btn-sm"
                                style={{
                                  padding: "0.25rem 0.625rem",
                                  fontSize: "0.75rem",
                                  color: "var(--red)",
                                  borderColor: "var(--red)",
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {t.kycStatus === "VERIFIED" && (
                            <button
                              disabled={processingId === t.id}
                              onClick={() => handleAction(t.id, "REJECT")}
                              className="btn btn-ghost btn-sm"
                              style={{
                                  padding: "0.25rem 0.625rem",
                                  fontSize: "0.75rem",
                                  color: "var(--red)",
                                  borderColor: "var(--red)",
                              }}
                            >
                              Revoke
                            </button>
                          )}
                          {t.kycStatus === "UNVERIFIED" && hasDocuments && (
                            <button
                              disabled={processingId === t.id}
                              onClick={() => handleAction(t.id, "APPROVE")}
                              className="btn btn-sm"
                              style={{
                                padding: "0.25rem 0.625rem",
                                fontSize: "0.75rem",
                                background: "var(--blue-400)",
                                border: "none",
                                color: "white",
                              }}
                            >
                              Approve Manually
                            </button>
                          )}
                          {t.kycStatus === "UNVERIFIED" && !hasDocuments && (
                            <span style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>No submission</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay for viewing document */}
      {modalDocUrl && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(6, 8, 16, 0.85)",
          backdropFilter: "blur(8px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "2rem",
        }}>
          <div style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border-bright)",
            borderRadius: "var(--radius-lg)",
            width: "100%",
            maxWidth: "750px",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          }}>
            {/* Header */}
            <div style={{
              padding: "1rem 1.5rem",
              borderBottom: "1px solid var(--border-soft)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ fontWeight: 600, color: "var(--text-1)", fontSize: "0.9375rem" }}>{modalTitle}</span>
              <button 
                className="btn btn-ghost btn-sm" 
                style={{ padding: "0.25rem 0.5rem", border: "1px solid var(--border-soft)" }}
                onClick={() => setModalDocUrl("")}
              >
                ✕ Close
              </button>
            </div>
            {/* Body */}
            <div style={{ padding: "1.5rem", display: "flex", justifyContent: "center", alignItems: "center", overflowY: "auto", flexGrow: 1, minHeight: "350px", background: "#060810" }}>
              {modalDocUrl.startsWith("data:application/pdf") ? (
                <object data={modalDocUrl} type="application/pdf" style={{ width: "100%", height: "60vh" }}>
                  <div style={{ textAlign: "center", padding: "2rem" }}>
                    <p style={{ color: "var(--text-3)", fontSize: "0.8125rem", marginBottom: "1rem" }}>
                      PDF preview not supported in this browser inline.
                    </p>
                    <a href={modalDocUrl} download="kyc_document.pdf" className="btn btn-blue btn-sm" style={{ textDecoration: "none" }}>
                      Download PDF to view
                    </a>
                  </div>
                </object>
              ) : (
                <img src={modalDocUrl} alt="Document" style={{ maxWidth: "100%", maxHeight: "60vh", objectFit: "contain", borderRadius: "var(--radius-sm)" }} />
              )}
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
