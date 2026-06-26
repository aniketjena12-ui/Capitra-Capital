"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("No reset token found. Please request a new password reset link.");
    }
  }, [token]);

  function validate() {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[a-zA-Z]/.test(password)) return "Password must contain at least one letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (password !== confirm) return "Passwords do not match.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password. The link may have expired.");
        return;
      }

      setDone(true);
      toast("Password reset successfully!", "success");
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Something went wrong. Please try again.");
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

        {done ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>✅</div>
            <h1 className="login-title">Password updated!</h1>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.6, marginTop: "0.5rem" }}>
              Your password has been changed. Redirecting you to sign in...
            </p>
          </div>
        ) : (
          <>
            <h1 className="login-title">Set new password</h1>
            <p className="login-sub">Choose a strong password for your account.</p>

            <form className="login-form" onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  required
                  disabled={!token}
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                  required
                  disabled={!token}
                  autoComplete="new-password"
                />
              </div>

              {/* Password strength hints */}
              <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", lineHeight: 1.6 }}>
                Requirements: 8+ characters, at least one letter and one number.
              </div>

              {error && <div className="login-error">{error}</div>}

              <button
                type="submit"
                disabled={loading || !token}
                className="btn btn-blue btn-full"
                style={{ marginTop: "0.25rem", padding: "0.75rem" }}
              >
                {loading ? "Updating..." : "Update Password →"}
              </button>
            </form>

            <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.8125rem", color: "var(--text-3)" }}>
              <Link href="/forgot-password" style={{ color: "var(--blue-400)", textDecoration: "none" }}>
                Request a new reset link
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="login-page">
        <div className="login-glow" />
        <div className="login-card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-3)" }}>Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
