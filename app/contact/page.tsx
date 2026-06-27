"use client";

import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <div className="inner-hero">
        <div className="section-eyebrow">Get in Touch</div>
        <h1 className="inner-hero-title">Contact Us</h1>
        <p className="inner-hero-sub">
          Have a question or need help? Reach out — our team responds within a few hours.
        </p>
      </div>

      <div className="page-wrapper">
        <div className="contact-grid">
          {/* Left: Info */}
          <div>
            <div className="contact-info-item">
              <div className="contact-icon">📧</div>
              <div>
                <div className="contact-info-label">Email</div>
                <div className="contact-info-value">support@capitracapital.in</div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-icon">💬</div>
              <div>
                <div className="contact-info-label">Discord</div>
                <div className="contact-info-value">discord.gg/capitracapital</div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-icon">🕐</div>
              <div>
                <div className="contact-info-label">Support Hours</div>
                <div className="contact-info-value">24 × 7, including weekends</div>
              </div>
            </div>
            <div className="contact-info-item">
              <div className="contact-icon">📍</div>
              <div>
                <div className="contact-info-label">Location</div>
                <div className="contact-info-value">India (Remote-first team)</div>
              </div>
            </div>

            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-soft)",
              }}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>
                Response time
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { type: "General inquiries", time: "Under 4 hours" },
                  { type: "Account issues", time: "Under 2 hours" },
                  { type: "Payout support", time: "Under 1 hour" },
                ].map((r) => (
                  <div key={r.type} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem" }}>
                    <span style={{ color: "var(--text-2)" }}>{r.type}</span>
                    <span style={{ color: "var(--green)", fontWeight: 500 }}>{r.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  borderRadius: "var(--radius-lg)",
                  padding: "3rem 2rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✅</div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Message Sent!</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-2)" }}>
                  Thanks for reaching out. We'll get back to you within a few hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-soft)",
                  borderRadius: "var(--radius-lg)",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="mobile-1col">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Rahul Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="rahul@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select
                    className="form-input"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                    style={{ appearance: "none" }}
                  >
                    <option value="" disabled>Select a topic...</option>
                    <option>Challenge question</option>
                    <option>Account / login issue</option>
                    <option>Payout support</option>
                    <option>Partnership inquiry</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-input"
                    placeholder="Describe your question or issue in detail..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-blue btn-full" style={{ marginTop: "0.25rem" }}>
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}