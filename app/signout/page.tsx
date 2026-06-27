"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function SignOutPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="login-page">
      <div className="login-glow" />

      <div className="login-card" style={{ textAlign: "center" }}>
        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo-text">
            CAPITRA<span className="login-logo-dot" />CAPITAL
          </span>
        </div>

        {/* Icon */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.75rem",
            margin: "0 auto 1.5rem",
          }}
        >
          🚪
        </div>

        <h1 className="login-title" style={{ marginBottom: "0.5rem" }}>
          Sign out?
        </h1>

        {session?.user && (
          <p style={{ fontSize: "0.8125rem", color: "var(--text-3)", marginBottom: "0.25rem" }}>
            Signed in as
          </p>
        )}
        {session?.user?.email && (
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--text-1)",
              marginBottom: "1.75rem",
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-soft)",
              borderRadius: "var(--radius-sm)",
              padding: "0.5rem 1rem",
              display: "inline-block",
            }}
          >
            {session.user.email}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="btn btn-full"
            style={{
              background: loading ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.12)",
              color: "#f87171",
              border: "1px solid rgba(239,68,68,0.3)",
              padding: "0.75rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s, border-color 0.2s",
            }}
          >
            {loading ? "Signing out..." : "Yes, sign me out"}
          </button>

          <Link
            href="/dashboard"
            className="btn btn-ghost btn-full"
            style={{ padding: "0.75rem" }}
          >
            ← Stay in dashboard
          </Link>
        </div>

        <p
          style={{
            marginTop: "1.75rem",
            fontSize: "0.6875rem",
            color: "var(--text-3)",
            lineHeight: 1.5,
          }}
        >
          Your session will be cleared and you will be redirected to the home page.
        </p>
      </div>
    </div>
  );
}
