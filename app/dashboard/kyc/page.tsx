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

  // State for files selected for upload
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [idLocalPreview, setIdLocalPreview] = useState<string>("");
  const [selfieLocalPreview, setSelfieLocalPreview] = useState<string>("");

  // State for displaying existing uploaded documents from the server (Base64 data URIs)
  const [idPreviewUrl, setIdPreviewUrl] = useState<string>("");
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState<string>("");

  useEffect(() => {
    fetchKyc();
  }, []);

  async function fetchKyc() {
    try {
      const res = await fetch("/api/kyc");
      const data = await res.json();
      if (res.ok && data.kyc) {
        const status = data.kyc.kycStatus as KycStatus;
        setKycStatus(status);
        setKycNotes(data.kyc.kycNotes || null);
        setForm({
          kycIdUrl: data.kyc.kycIdUrl || "",
          kycSelfieUrl: data.kyc.kycSelfieUrl || "",
          kycDocType: data.kyc.kycDocType || "",
        });

        if (status === "PENDING" || status === "VERIFIED") {
          fetchPreviews();
        }
      }
    } catch {
      toast("Failed to load KYC status.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPreviews() {
    try {
      const [idRes, selfieRes] = await Promise.all([
        fetch("/api/kyc/view?doc=id"),
        fetch("/api/kyc/view?doc=selfie"),
      ]);
      if (idRes.ok) {
        const idData = await idRes.json();
        setIdPreviewUrl(idData.url);
      }
      if (selfieRes.ok) {
        const selfieData = await selfieRes.json();
        setSelfiePreviewUrl(selfieData.url);
      }
    } catch (err) {
      console.error("Failed to load document previews:", err);
    }
  }

  // Convert File object to Base64 Data URI
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  async function handleIdFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast("File size exceeds 4MB limit.", "error");
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        setIdFile(file);
        setIdLocalPreview(base64);
      } catch (err) {
        toast("Failed to read ID document file.", "error");
      }
    }
  }

  async function handleSelfieFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast("File size exceeds 4MB limit.", "error");
        return;
      }
      try {
        const base64 = await fileToBase64(file);
        setSelfieFile(file);
        setSelfieLocalPreview(base64);
      } catch (err) {
        toast("Failed to read selfie file.", "error");
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.kycDocType) {
      toast("Please select your document type.", "error");
      return;
    }
    if (!idLocalPreview || !selfieLocalPreview) {
      toast("Please select both Government ID and Selfie files.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kycIdUrl: idLocalPreview,
          kycSelfieUrl: selfieLocalPreview,
          kycDocType: form.kycDocType,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast(data.message || "KYC submitted successfully.", "success");
        setKycStatus("PENDING");
        setForm({
          kycIdUrl: idLocalPreview,
          kycSelfieUrl: selfieLocalPreview,
          kycDocType: form.kycDocType,
        });
        // Reset selections
        setIdFile(null);
        setSelfieFile(null);
        setIdLocalPreview("");
        setSelfieLocalPreview("");
        // Reload previews
        fetchPreviews();
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

        {/* Submitted Previews (Only shown if user has submitted files before) */}
        {kycStatus !== "UNVERIFIED" && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1rem", color: "var(--text-1)" }}>
              📄 Submitted Documents
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>
                <strong style={{ color: "var(--text-1)" }}>Document Type: </strong>
                {docTypeOptions.find(d => d.value === form.kycDocType)?.label || form.kycDocType || "—"}
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="mobile-1col">
                {/* Government ID Preview */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-2)" }}>Government ID:</span>
                  {idPreviewUrl ? (
                    idPreviewUrl.startsWith("data:application/pdf") ? (
                      <a 
                        href={idPreviewUrl} 
                        download={`kyc_id_${form.kycDocType.toLowerCase()}.pdf`}
                        className="btn btn-ghost btn-sm" 
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", padding: "1.5rem", textDecoration: "none" }}
                      >
                        <span>📄</span> Download ID (PDF)
                      </a>
                    ) : (
                      <a href={idPreviewUrl} target="_blank" rel="noreferrer" style={{ display: "block", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border-soft)", background: "rgba(255,255,255,0.02)" }}>
                        <img 
                          src={idPreviewUrl} 
                          alt="Government ID" 
                          style={{ width: "100%", maxHeight: "150px", objectFit: "contain", transition: "transform 0.2s" }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                        />
                      </a>
                    )
                  ) : (
                    <div style={{ fontSize: "0.75rem", color: "var(--text-3)", padding: "2rem", textAlign: "center", border: "1px solid var(--border-soft)", borderRadius: "var(--radius-sm)" }}>
                      Loading document...
                    </div>
                  )}
                </div>

                {/* Selfie Preview */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-2)" }}>Selfie holding ID:</span>
                  {selfiePreviewUrl ? (
                    selfiePreviewUrl.startsWith("data:application/pdf") ? (
                      <a 
                        href={selfiePreviewUrl} 
                        download="kyc_selfie.pdf"
                        className="btn btn-ghost btn-sm" 
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", padding: "1.5rem", textDecoration: "none" }}
                      >
                        <span>📄</span> Download Selfie (PDF)
                      </a>
                    ) : (
                      <a href={selfiePreviewUrl} target="_blank" rel="noreferrer" style={{ display: "block", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "1px solid var(--border-soft)", background: "rgba(255,255,255,0.02)" }}>
                        <img 
                          src={selfiePreviewUrl} 
                          alt="Selfie" 
                          style={{ width: "100%", maxHeight: "150px", objectFit: "contain", transition: "transform 0.2s" }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                        />
                      </a>
                    )
                  ) : (
                    <div style={{ fontSize: "0.75rem", color: "var(--text-3)", padding: "2rem", textAlign: "center", border: "1px solid var(--border-soft)", borderRadius: "var(--radius-sm)" }}>
                      Loading document...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {kycStatus !== "VERIFIED" && (
          <div className="card">
            <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              {kycStatus === "PENDING" ? "Resubmit Documents" : "Submit Your Documents"}
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginBottom: "1.25rem", lineHeight: 1.5 }}>
              {kycStatus === "PENDING"
                ? "Your documents are being reviewed. You may resubmit below to update them."
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

              {/* Government ID Upload Container */}
              <div className="form-group">
                <label className="form-label">
                  🪪 Government ID (front &amp; back) <span style={{ color: "var(--red)" }}>*</span>
                </label>
                
                <div 
                  style={{
                    border: "2px dashed var(--border-bright)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.5rem",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.01)",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--blue-400)";
                    e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-bright)";
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.01)";
                  }}
                  onClick={() => document.getElementById("id-file-input")?.click()}
                >
                  <input
                    id="id-file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleIdFileChange}
                    style={{ display: "none" }}
                  />
                  
                  {idLocalPreview ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }} onClick={(e) => e.stopPropagation()}>
                      {idFile?.type === "application/pdf" ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-sm)" }}>
                          <span style={{ fontSize: "2rem" }}>📄</span>
                          <div style={{ textAlign: "left" }}>
                            <div style={{ fontSize: "0.8125rem", color: "var(--text-1)", fontWeight: 500 }}>{idFile.name}</div>
                            <div style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>{(idFile.size / 1024 / 1024).toFixed(2)} MB (PDF)</div>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={idLocalPreview} 
                          alt="ID Preview" 
                          style={{ maxHeight: "150px", maxWidth: "100%", borderRadius: "var(--radius-sm)", objectFit: "contain", border: "1px solid var(--border-soft)" }}
                        />
                      )}
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button 
                          type="button" 
                          className="btn btn-ghost btn-sm" 
                          style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}
                          onClick={() => document.getElementById("id-file-input")?.click()}
                        >
                          Change
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-ghost btn-sm" 
                          style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem", color: "var(--red)", borderColor: "var(--red)" }}
                          onClick={() => {
                            setIdFile(null);
                            setIdLocalPreview("");
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>📤</span>
                      <span style={{ fontSize: "0.8125rem", color: "var(--text-1)", fontWeight: 500, display: "block" }}>
                        Click to upload Government ID
                      </span>
                      <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", display: "block", marginTop: "0.25rem" }}>
                        Supports JPG, PNG, WebP, PDF (Max 4MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Selfie holding ID Upload Container */}
              <div className="form-group">
                <label className="form-label">
                  🤳 Selfie holding your ID <span style={{ color: "var(--red)" }}>*</span>
                </label>
                
                <div 
                  style={{
                    border: "2px dashed var(--border-bright)",
                    borderRadius: "var(--radius-md)",
                    padding: "1.5rem",
                    textAlign: "center",
                    background: "rgba(255, 255, 255, 0.01)",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--blue-400)";
                    e.currentTarget.style.backgroundColor = "rgba(59, 130, 246, 0.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-bright)";
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.01)";
                  }}
                  onClick={() => document.getElementById("selfie-file-input")?.click()}
                >
                  <input
                    id="selfie-file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleSelfieFileChange}
                    style={{ display: "none" }}
                  />
                  
                  {selfieLocalPreview ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }} onClick={(e) => e.stopPropagation()}>
                      {selfieFile?.type === "application/pdf" ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-sm)" }}>
                          <span style={{ fontSize: "2rem" }}>📄</span>
                          <div style={{ textAlign: "left" }}>
                            <div style={{ fontSize: "0.8125rem", color: "var(--text-1)", fontWeight: 500 }}>{selfieFile.name}</div>
                            <div style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>{(selfieFile.size / 1024 / 1024).toFixed(2)} MB (PDF)</div>
                          </div>
                        </div>
                      ) : (
                        <img 
                          src={selfieLocalPreview} 
                          alt="Selfie Preview" 
                          style={{ maxHeight: "150px", maxWidth: "100%", borderRadius: "var(--radius-sm)", objectFit: "contain", border: "1px solid var(--border-soft)" }}
                        />
                      )}
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button 
                          type="button" 
                          className="btn btn-ghost btn-sm" 
                          style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}
                          onClick={() => document.getElementById("selfie-file-input")?.click()}
                        >
                          Change
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-ghost btn-sm" 
                          style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem", color: "var(--red)", borderColor: "var(--red)" }}
                          onClick={() => {
                            setSelfieFile(null);
                            setSelfieLocalPreview("");
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span style={{ fontSize: "2rem", display: "block", marginBottom: "0.5rem" }}>📤</span>
                      <span style={{ fontSize: "0.8125rem", color: "var(--text-1)", fontWeight: 500, display: "block" }}>
                        Click to upload Selfie holding ID
                      </span>
                      <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", display: "block", marginTop: "0.25rem" }}>
                        Supports JPG, PNG, WebP, PDF (Max 4MB)
                      </span>
                    </div>
                  )}
                </div>
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
                  ? "Submitting KYC..."
                  : kycStatus === "PENDING"
                  ? "Resubmit Documents"
                  : "Submit for Verification →"}
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
