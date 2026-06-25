"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/ToastProvider";

export default function SettingsPage() {
  const { toast } = useToast();

  const [profile, setProfile] = useState({ name: "Demo Trader", email: "admin@capitracapital.com", phone: "+91 98765 43210" });
  const [bank, setBank]       = useState({ accountName: "Demo Trader", accountNo: "1234567890", ifsc: "HDFC0001234", bankName: "HDFC Bank" });
  const [notifs, setNotifs]   = useState({ email: true, drawdown: true, payout: true, news: false });
  const [pwForm, setPwForm]   = useState({ current: "", next: "", confirm: "" });

  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    toast("Profile updated successfully.", "success");
  }
  function saveBank(e: React.FormEvent) {
    e.preventDefault();
    toast("Bank details saved.", "success");
  }
  function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.next.length < 6)       { toast("Password must be at least 6 characters.", "error"); return; }
    if (pwForm.next !== pwForm.confirm){ toast("Passwords do not match.", "error"); return; }
    toast("Password updated.", "success");
    setPwForm({ current: "", next: "", confirm: "" });
  }

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account, bank details, and preferences">
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 680 }}>

        {/* Profile */}
        <div className="card">
          <div className="settings-section-title">Profile Information</div>
          <form onSubmit={saveProfile} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={profile.email} disabled style={{ opacity: 0.5 }} />
              <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", marginTop: "0.25rem" }}>Email cannot be changed. Contact support.</span>
            </div>
            <div><button type="submit" className="btn btn-blue btn-sm">Save Profile</button></div>
          </form>
        </div>

        {/* Bank Details */}
        <div className="card">
          <div className="settings-section-title">Bank Account Details</div>
          <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", margin: "0.5rem 0 1rem" }}>Used for profit payouts. Ensure details are accurate.</p>
          <form onSubmit={saveBank} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Account Holder Name</label>
                <input className="form-input" value={bank.accountName} onChange={e => setBank(b => ({ ...b, accountName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input className="form-input" value={bank.bankName} onChange={e => setBank(b => ({ ...b, bankName: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input className="form-input" value={bank.accountNo} onChange={e => setBank(b => ({ ...b, accountNo: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">IFSC Code</label>
                <input className="form-input" value={bank.ifsc} onChange={e => setBank(b => ({ ...b, ifsc: e.target.value }))} style={{ textTransform: "uppercase" }} />
              </div>
            </div>
            <div><button type="submit" className="btn btn-blue btn-sm">Save Bank Details</button></div>
          </form>
        </div>

        {/* Password */}
        <div className="card">
          <div className="settings-section-title">Change Password</div>
          <form onSubmit={savePassword} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} placeholder="Min. 6 characters" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input className="form-input" type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" />
              </div>
            </div>
            <div><button type="submit" className="btn btn-blue btn-sm">Update Password</button></div>
          </form>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="settings-section-title">Notification Preferences</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            {([
              { key: "email",    label: "Email digest",        desc: "Daily summary of your account performance" },
              { key: "drawdown", label: "Drawdown warnings",   desc: "Alert when within 1% of daily or overall limit" },
              { key: "payout",   label: "Payout notifications",desc: "Confirm when a payout has been processed" },
              { key: "news",     label: "Platform news",       desc: "Updates about new features and changes" },
            ] as const).map((n) => (
              <div key={n.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.2rem" }}>{n.label}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{n.desc}</div>
                </div>
                <button
                  onClick={() => { setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] })); toast(`${n.label} ${notifs[n.key] ? "disabled" : "enabled"}.`, "info"); }}
                  style={{
                    width: 42, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                    background: notifs[n.key] ? "var(--blue-500)" : "var(--bg-elevated)",
                    transition: "background 0.2s",
                    position: "relative", flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: "absolute", top: 3, left: notifs[n.key] ? 21 : 3,
                    width: 18, height: 18, borderRadius: "50%", background: "white",
                    transition: "left 0.2s",
                  }} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
