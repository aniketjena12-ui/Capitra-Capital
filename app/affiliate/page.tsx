"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

const tiers = [
  { label: "Starter", trades: "1–5 referrals/mo", rate: "8%", color: "var(--text-2)" },
  { label: "Silver", trades: "6–15 referrals/mo", rate: "12%", color: "#94a3b8" },
  { label: "Gold", trades: "16–30 referrals/mo", rate: "16%", color: "#eab308" },
  { label: "Platinum", trades: "31+ referrals/mo", rate: "20%", color: "#93c5fd" },
];

const steps = [
  { icon: "📝", title: "Apply", desc: "Fill out the form below. No follower minimum — just a genuine presence." },
  { icon: "🔗", title: "Get Your Link", desc: "We send your unique referral link within 24 hours of approval." },
  { icon: "💸", title: "Earn", desc: "Earn 8–20% commission on every challenge purchase made via your link." },
  { icon: "🏦", title: "Get Paid", desc: "Payouts are processed monthly via bank transfer directly to your account." },
];

export default function AffiliatePage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", platform: "", audience: "", why: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.platform) {
      toast("Please fill in all required fields.", "error");
      return;
    }
    setSubmitting(true);
    // Simulate submission (no backend yet — form data logged)
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    toast("Application submitted! We'll review and contact you within 48 hours.", "success");
  }

  return (
    <>
      {/* Hero */}
      <div className="inner-hero">
        <div className="section-eyebrow">Partner Program</div>
        <h1 className="inner-hero-title">Earn up to 20% Per Referral</h1>
        <p className="inner-hero-sub">
          Join the Capitra Capital Affiliate Program. Share your unique link, grow our community,
          and earn recurring commissions — monthly, directly to your bank.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
          <a href="#apply" className="btn btn-blue btn-lg">Apply Now →</a>
          <a href="#how-it-works" className="btn btn-ghost btn-lg">How It Works</a>
        </div>
      </div>

      <div className="page-wrapper" style={{ paddingBottom: "5rem" }}>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "4rem",
          }}
        >
          {[
            { value: "8–20%", label: "Commission Rate" },
            { value: "30 days", label: "Cookie Duration" },
            { value: "Monthly", label: "Payout Cycle" },
            { value: "₹500", label: "Min. Payout" },
          ].map((s) => (
            <div key={s.label} className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--blue-400)", marginBottom: "0.3rem" }}>
                {s.value}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div id="how-it-works" style={{ marginBottom: "4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="section-eyebrow">Process</div>
            <h2 className="section-title" style={{ fontSize: "1.75rem" }}>How It Works</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
            {steps.map((s, i) => (
              <div key={s.title} className="card" style={{ position: "relative", padding: "1.75rem" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    color: "var(--text-3)",
                    background: "var(--bg-elevated)",
                    borderRadius: "4px",
                    padding: "0.15rem 0.4rem",
                  }}
                >
                  0{i + 1}
                </div>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{s.icon}</div>
                <div style={{ fontWeight: 600, marginBottom: "0.4rem", color: "var(--text-1)" }}>{s.title}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-3)", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Tiers */}
        <div style={{ marginBottom: "4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="section-eyebrow">Earnings</div>
            <h2 className="section-title" style={{ fontSize: "1.75rem" }}>Commission Tiers</h2>
            <p className="section-subtitle" style={{ margin: "0.75rem auto 0" }}>
              The more you refer, the higher your rate. Tiers reset monthly.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {tiers.map((t, i) => (
              <div
                key={t.label}
                className="card"
                style={{
                  textAlign: "center",
                  padding: "2rem 1.5rem",
                  background: i === 3 ? "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(37,99,235,0.05))" : undefined,
                  border: i === 3 ? "1px solid rgba(59,130,246,0.3)" : undefined,
                  position: "relative",
                }}
              >
                {i === 3 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-10px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "var(--blue-500)",
                      color: "white",
                      fontSize: "0.625rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "20px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    Top Earner
                  </div>
                )}
                <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: t.color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  {t.label}
                </div>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-1)", marginBottom: "0.25rem" }}>
                  {t.rate}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{t.trades}</div>
              </div>
            ))}
          </div>

          {/* Earnings calculator */}
          <div
            className="card"
            style={{
              marginTop: "1.5rem",
              padding: "1.5rem 2rem",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-soft)",
            }}
          >
            <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1rem" }}>💰 Example Earnings</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
              {[
                { referrals: 5, plan: "Professional (₹2,999)", commission: "₹1,200", rate: "8%" },
                { referrals: 15, plan: "Mixed plans avg ₹2,000", commission: "₹3,600", rate: "12%" },
                { referrals: 30, plan: "Mixed plans avg ₹2,000", commission: "₹9,600", rate: "16%" },
              ].map((e) => (
                <div key={e.referrals} style={{ fontSize: "0.8125rem", color: "var(--text-2)" }}>
                  <span style={{ color: "var(--blue-400)", fontWeight: 700 }}>{e.referrals} referrals</span> × {e.plan} × {e.rate} ={" "}
                  <span style={{ color: "var(--green)", fontWeight: 600 }}>{e.commission}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div id="apply" style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div className="section-eyebrow">Apply</div>
            <h2 className="section-title" style={{ fontSize: "1.75rem" }}>Join the Program</h2>
            <p className="section-subtitle" style={{ margin: "0.75rem auto 0" }}>
              Free to join. No minimum follower count. Applications reviewed within 48 hours.
            </p>
          </div>

          {submitted ? (
            <div
              className="card"
              style={{ textAlign: "center", padding: "3rem" }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
              <h3 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Application Received!</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-2)", marginBottom: "1.5rem" }}>
                We&apos;ll review your application and email you your referral link within 48 hours.
              </p>
              <Link href="/challenges" className="btn btn-blue btn-sm">
                Explore Challenges →
              </Link>
            </div>
          ) : (
            <div className="card">
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      className="form-input"
                      placeholder="Rahul Sharma"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="you@email.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Platform / Channel URL *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. youtube.com/yourchannel or instagram.com/yourhandle"
                    value={form.platform}
                    onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Approximate Audience Size</label>
                  <select
                    className="form-input"
                    value={form.audience}
                    onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))}
                    style={{ appearance: "none" }}
                  >
                    <option value="">Select range...</option>
                    <option value="<1000">Under 1,000</option>
                    <option value="1000-10000">1,000 – 10,000</option>
                    <option value="10000-50000">10,000 – 50,000</option>
                    <option value="50000+">50,000+</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Why do you want to partner with Capitra Capital?</label>
                  <textarea
                    className="form-input"
                    placeholder="Tell us about your audience and how you plan to promote the program..."
                    rows={4}
                    value={form.why}
                    onChange={(e) => setForm((f) => ({ ...f, why: e.target.value }))}
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn btn-blue btn-full" style={{ padding: "0.75rem" }}>
                  {submitting ? "Submitting…" : "Submit Application →"}
                </button>
                <p style={{ fontSize: "0.6875rem", color: "var(--text-3)", textAlign: "center", lineHeight: 1.5 }}>
                  By applying you agree to our{" "}
                  <Link href="/terms" style={{ color: "var(--blue-400)" }}>Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" style={{ color: "var(--blue-400)" }}>Privacy Policy</Link>.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
