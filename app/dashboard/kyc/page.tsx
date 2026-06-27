"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/ToastProvider";

type KycStatus = "UNVERIFIED" | "PENDING" | "VERIFIED";

const statusConfig: Record<KycStatus, { label: string; color: string; icon: string; badge: string }> = {
  UNVERIFIED: { label: "Not Submitted", color: "var(--yellow)", icon: "⚠️", badge: "badge-yellow" },
  PENDING:    { label: "Under Review",  color: "var(--blue-400)", icon: "🔄", badge: "badge-blue" },
  VERIFIED:   { label: "Verified",      color: "var(--green)",   icon: "✅", badge: "badge-green" },
};

const docTypeOptions = [
  { value: "AADHAAR",         label: "Aadhaar Card" },
  { value: "PAN",             label: "PAN Card" },
  { value: "PASSPORT",        label: "Passport" },
  { value: "VOTER_ID",        label: "Voter ID" },
  { value: "DRIVING_LICENSE", label: "Driving License" },
];

export default function KycPage() {
  const { toast } = useToast();
  const [kycStatus, setKycStatus] = useState<KycStatus>("UNVERIFIED");
  const [kycNotes, setKycNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    kycIdUrl: "",
    kycSelfieUrl: "",
    kycDocType: "",
  });

  useEffect(() => { fetchKyc(); }, []);

  async function fetchKyc() {
    try {
      const res = await fetch("/api/kyc");
      const data = await res.json();
      if (res.ok && data.kyc) {
        setKycStatus(data.kyc.kycStatus as KycStatus);
        setKycNotes(data.kyc.kycNotes || null);
        setForm({
          kycIdUrl: data.kyc.kycIdUrl || "",
          kycSelfieUrl: data.kyc.kycSelfieUrl || "",
          kycDocType: data.kyc.kycDocType || "",
        });
      }
    } catch {
      toast("Failed to load KYC status.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.kycIdUrl.trim() || !form.kycSelfieUrl.trim()) {
      toast("Please fill in both document fields.", "error");
      return;
    }
    if (!form.kycDocType) {
      toast("Please select your document type.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast(data.message || "KYC submitted successfully.", "success");
        setKycStatus("PENDING");
      } else {
        toast(data.error || "Failed to submit KYC.", "error");
      }
    } catch {
      toast("Server error submitting KYC.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const cfg = statusConfig[kycStatus];

  if (loading) {
    return (
      <DashboardLayout title="KYC Verification" subtitle="Identity verification required for payouts">
        <div style={{ color: "var(--text-3)", padding: "3rem", textAlign: "center" }}>Loading KYC status...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="KYC Verification" subtitle="Identity verification required for payouts">
      <div style={{ maxWidth: 680 }}>

        {/* Status Banner */}
        <div
          className="card"
          style={{
            marginBottom: "1.5rem",
            padding: "1.5rem",
            background:
              kycStatus === "VERIFIED"
                ? "rgba(22,163,74,0.08)"
                : kycStatus === "PENDING"
                ? "rgba(37,99,235,0.08)"
                : "rgba(234,179,8,0.07)",
            border: `1px solid ${cfg.color}30`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "2rem" }}>{cfg.icon}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.3rem" }}>
                <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-1)" }}>
                  KYC Status:
                </span>
                <span className={`badge ${cfg.badge}`}>{cfg.label}</span>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.5 }}>
                {kycStatus === "VERIFIED" && "Your identity is verified. You are eligible to request payouts."}
                {kycStatus === "PENDING" && "Your documents are under review. This typically takes 1–2 business days."}
                {kycStatus === "UNVERIFIED" && "Please submit your identity documents below to unlock payout requests."}
              </p>
              {kycNotes && kycStatus === "UNVERIFIED" && (
                <div
                  style={{
                    marginTop: "0.625rem",
                    padding: "0.5rem 0.75rem",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.25)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.75rem",
                    color: "#fca5a5",
                  }}
                >
                  <strong>Admin note:</strong> {kycNotes}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Why KYC */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1rem" }}>Why is KYC required?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }} className="mobile-1col">
            {[
              { icon: "💸", text: "Required before your first payout is processed" },
              { icon: "🔒", text: "Prevents fraud and protects your earnings" },
              { icon: "🏦", text: "Ensures payouts go to the correct person" },
              { icon: "📋", text: "Regulatory compliance for financial transactions" },
            ].map((i) => (
              <div key={i.text} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", fontSize: "0.8125rem", color: "var(--text-2)" }}>
                <span style={{ flexShrink: 0 }}>{i.icon}</span>
                <span>{i.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        {kycStatus !== "VERIFIED" && (
          <div className="card">
            <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              {kycStatus === "PENDING" ? "Documents Submitted" : "Submit Your Documents"}
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
              {kycStatus === "PENDING"
                ? "Your documents are being reviewed. You may resubmit to update them."
                : "Upload your government-issued ID and a selfie holding the document."}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Document Type */}
              <div className="form-group">
                <label className="form-label">
                  📄 Document Type <span style={{ color: "var(--red)" }}>*</span>
                </label>
                <select
                  className="form-input"
                  value={form.kycDocType}
                  onChange={(e) => setForm((f) => ({ ...f, kycDocType: e.target.value }))}
                  required
                  style={{ appearance: "none" }}
                >
                  <option value="">Select document type...</option>
                  {docTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Government ID */}
              <div className="form-group">
                <label className="form-label">
                  🪪 Government ID (front &amp; back) <span style={{ color: "var(--red)" }}>*</span>
                </label>
                <input
                  className="form-input"
                  placeholder="File path or URL (e.g. aadhaar_front.jpg or https://...)"
                  value={form.kycIdUrl}
                  onChange={(e) => setForm((f) => ({ ...f, kycIdUrl: e.target.value }))}
                  required
                />
                <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginTop: "0.25rem", display: "block" }}>
                  Clear, readable photo of your selected document (both sides if applicable).
                </span>
              </div>

              {/* Selfie */}
              <div className="form-group">
                <label className="form-label">
                  🤳 Selfie holding your ID <span style={{ color: "var(--red)" }}>*</span>
                </label>
                <input
                  className="form-input"
                  placeholder="File path or URL (e.g. selfie_with_id.jpg or https://...)"
                  value={form.kycSelfieUrl}
                  onChange={(e) => setForm((f) => ({ ...f, kycSelfieUrl: e.target.value }))}
                  required
                />
                <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginTop: "0.25rem", display: "block" }}>
                  A clear photo of your face holding the document — no filters.
                </span>
              </div>

              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(37,99,235,0.07)",
                  border: "1px solid rgba(59,130,246,0.18)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.75rem",
                  color: "var(--text-3)",
                  lineHeight: 1.5,
                }}
              >
                🔒 Your documents are stored securely and used only for identity verification. We never share them with third parties.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-blue btn-sm"
                style={{ alignSelf: "flex-start" }}
              >
                {submitting
                  ? "Submitting…"
                  : kycStatus === "PENDING"
                  ? "Resubmit Documents"
                  : "Submit for Verification →"}
              </button>
            </form>
          </div>
        )}

        {/* Verified — show what was submitted */}
        {kycStatus === "VERIFIED" && (
          <div className="card" style={{ background: "rgba(22,163,74,0.05)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1rem", color: "var(--green)" }}>
              ✅ Verified Documents
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>
                <strong style={{ color: "var(--text-1)" }}>Document type: </strong>
                {docTypeOptions.find(d => d.value === form.kycDocType)?.label || form.kycDocType || "—"}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-3)" }}>
                Your identity has been verified. No further action required.
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
