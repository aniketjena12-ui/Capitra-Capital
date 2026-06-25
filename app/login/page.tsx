"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="login-page">
      <div className="login-glow" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo-text">
            CAPITRA<span className="login-logo-dot" />CAPITAL
          </span>
        </div>

        <h1 className="login-title">Welcome back</h1>
        <p className="login-sub">Sign in to access your trader dashboard</p>

        <form className="login-form" onSubmit={handleLogin}>
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

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-blue btn-full"
            style={{ marginTop: "0.25rem", padding: "0.75rem" }}
          >
            {loading ? (
              <span style={{ opacity: 0.7 }}>Signing in...</span>
            ) : (
              "Sign In →"
            )}
          </button>
        </form>

        <div className="login-hint">
          <span style={{ color: "var(--text-3)" }}>Demo: </span>
          admin@capitracapital.com &nbsp;/&nbsp; 123456
        </div>

        <div style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "0.8125rem", color: "var(--text-3)" }}>
          Don't have an account?{" "}
          <Link href="/challenges" style={{ color: "var(--blue-400)", textDecoration: "none" }}>
            Start a challenge
          </Link>
        </div>
      </div>
    </div>
  );
}