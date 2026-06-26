"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast("Enter a valid email address.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Always show the same message regardless of whether the email exists
      setSent(true);
    } catch {
      toast("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-glow" />
      <div className="login-card">
        <div className="login-logo">
          <span className="login-logo-text">
            CAPITRA<span className="login-logo-dot" />CAPITAL
          </span>
        </div>

        {sent ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📧</div>
            <h1 className="login-title">Check your email</h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.6, marginTop: "0.5rem" }}>
              If an account with <strong style={{ color: "var(--text-1)" }}>{email}</strong> exists,
              we&apos;ve sent a password reset link. It expires in 1 hour.
            </p>
            <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginTop: "1rem", lineHeight: 1.5 }}>
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button
                onClick={() => setSent(false)}
                style={{ background: "none", border: "none", color: "var(--blue-400)", cursor: "pointer", fontSize: "inherit", padding: 0 }}
              >
                try again
              </button>.
            </p>
            <Link href="/login" className="btn btn-ghost btn-sm" style={{ marginTop: "1.5rem", display: "inline-flex" }}>
              ← Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <h1 className="login-title">Reset your password</h1>
            <p className="login-sub">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form className="login-form" onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-blue btn-full"
                style={{ marginTop: "0.25rem", padding: "0.75rem" }}
              >
                {loading ? "Sending..." : "Send Reset Link →"}
              </button>
            </form>

            <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.8125rem", color: "var(--text-3)" }}>
              Remember your password?{" "}
              <Link href="/login" style={{ color: "var(--blue-400)", textDecoration: "none" }}>
                Sign in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
