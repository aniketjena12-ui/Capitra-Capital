"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/ToastProvider";

export default function SettingsPage() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [bank, setBank]       = useState({ accountName: "", accountNo: "", ifsc: "", bankName: "" });
  const [notifs, setNotifs]   = useState({ emailNotif: true, drawdownNotif: true, payoutNotif: true, newsNotif: false });
  const [pwForm, setPwForm]   = useState({ current: "", next: "", confirm: "" });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (res.ok && data.user) {
        setProfile({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
        });
        setBank({
          accountName: data.user.accountName || "",
          accountNo: data.user.accountNo || "",
          ifsc: data.user.ifsc || "",
          bankName: data.user.bankName || "",
        });
        setNotifs({
          emailNotif: data.user.emailNotif ?? true,
          drawdownNotif: data.user.drawdownNotif ?? true,
          payoutNotif: data.user.payoutNotif ?? true,
          newsNotif: data.user.newsNotif ?? false,
        });
      } else {
        toast(data.error || "Failed to load settings.", "error");
      }
    } catch {
      toast("Error loading settings data.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "profile", name: profile.name, phone: profile.phone }),
      });
      const data = await res.json();
      if (res.ok) {
        toast(data.message || "Profile updated.", "success");
      } else {
        toast(data.error || "Failed to update profile.", "error");
      }
    } catch {
      toast("Server error updating profile.", "error");
    }
  }

  async function saveBank(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bank", ...bank }),
      });
      const data = await res.json();
      if (res.ok) {
        toast(data.message || "Bank details saved.", "success");
      } else {
        toast(data.error || "Failed to save bank details.", "error");
      }
    } catch {
      toast("Server error saving bank details.", "error");
    }
  }

  async function updateNotif(key: keyof typeof notifs, value: boolean) {
    const updated = { ...notifs, [key]: value };
    setNotifs(updated);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "notifs", ...updated }),
      });
      const data = await res.json();
      if (res.ok) {
        toast(data.message || "Preferences updated.", "info");
      } else {
        toast(data.error || "Failed to update preferences.", "error");
      }
    } catch {
      toast("Server error updating preferences.", "error");
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pwForm.next.length < 6) { toast("Password must be at least 6 characters.", "error"); return; }
    if (pwForm.next !== pwForm.confirm) { toast("Passwords do not match.", "error"); return; }
    
    setSavingPassword(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "password", 
          currentPassword: pwForm.current, 
          newPassword: pwForm.next 
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast("Password updated successfully.", "success");
        setPwForm({ current: "", next: "", confirm: "" });
      } else {
        toast(data.error || "Failed to update password.", "error");
      }
    } catch {
      toast("Server error updating password.", "error");
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Settings" subtitle="Manage your account, bank details, and preferences">
        <div style={{ color: "var(--text-3)", padding: "3rem", textAlign: "center" }}>
          Loading your preferences...
        </div>
      </DashboardLayout>
    );
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
                <input className="form-input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} required />
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
                <input className="form-input" value={bank.accountName} onChange={e => setBank(b => ({ ...b, accountName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input className="form-input" value={bank.bankName} onChange={e => setBank(b => ({ ...b, bankName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Account Number</label>
                <input className="form-input" value={bank.accountNo} onChange={e => setBank(b => ({ ...b, accountNo: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">IFSC Code</label>
                <input className="form-input" value={bank.ifsc} onChange={e => setBank(b => ({ ...b, ifsc: e.target.value.toUpperCase() }))} style={{ textTransform: "uppercase" }} required />
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
              <input className="form-input" type="password" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} placeholder="Min. 6 characters" required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input className="form-input" type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" required />
              </div>
            </div>
            <div>
              <button type="submit" disabled={savingPassword} className="btn btn-blue btn-sm">
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="settings-section-title">Notification Preferences</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            {[
              { key: "emailNotif",    label: "Email digest",        desc: "Daily summary of your account performance" },
              { key: "drawdownNotif", label: "Drawdown warnings",   desc: "Alert when within 1% of daily or overall limit" },
              { key: "payoutNotif",   label: "Payout notifications",desc: "Confirm when a payout has been processed" },
              { key: "newsNotif",     label: "Platform news",       desc: "Updates about new features and changes" },
            ].map((n) => {
              const notifKey = n.key as keyof typeof notifs;
              const isEnabled = notifs[notifKey];
              return (
                <div key={n.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.2rem" }}>{n.label}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{n.desc}</div>
                  </div>
                  <button
                    onClick={() => updateNotif(notifKey, !isEnabled)}
                    style={{
                      width: 42, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                      background: isEnabled ? "var(--blue-500)" : "var(--bg-elevated)",
                      transition: "background 0.2s",
                      position: "relative", flexShrink: 0,
                    }}
                  >
                    <span style={{
                      position: "absolute", top: 3, left: isEnabled ? 21 : 3,
                      width: 18, height: 18, borderRadius: "50%", background: "white",
                      transition: "left 0.2s",
                    }} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
