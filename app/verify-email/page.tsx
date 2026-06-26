"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type VerifyState = "loading" | "success" | "already_verified" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setState("error");
      setMessage("No verification token found. Please use the link from your email.");
      return;
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setState("error");
          setMessage(data.error || "Verification failed.");
        } else if (data.message === "Email is already verified.") {
          setState("already_verified");
          setMessage(data.message);
        } else {
          setState("success");
          setMessage(data.message || "Email verified successfully.");
        }
      })
      .catch(() => {
        setState("error");
        setMessage("Something went wrong. Please try again.");
      });
  }, [token]);

  const configs: Record<VerifyState, { icon: string; title: string; titleColor: string }> = {
    loading: { icon: "⏳", title: "Verifying your email...", titleColor: "var(--text-1)" },
    success: { icon: "✅", title: "Email Verified!", titleColor: "var(--green)" },
    already_verified: { icon: "✅", title: "Already Verified", titleColor: "var(--green)" },
    error: { icon: "❌", title: "Verification Failed", titleColor: "var(--red)" },
  };

  const cfg = configs[state];

  return (
    <div className="login-page">
      <div className="login-glow" />
      <div className="login-card" style={{ textAlign: "center" }}>
        <div className="login-logo">
          <span className="login-logo-text">
            CAPITRA<span className="login-logo-dot" />CAPITAL
          </span>
        </div>

        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{cfg.icon}</div>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: cfg.titleColor, marginBottom: "0.75rem" }}>
          {cfg.title}
        </h1>

        {state !== "loading" && (
          <p style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            {message}
          </p>
        )}

        {state === "success" && (
          <Link href="/login" className="btn btn-blue btn-sm">
            Sign In →
          </Link>
        )}

        {state === "already_verified" && (
          <Link href="/dashboard" className="btn btn-blue btn-sm">
            Go to Dashboard →
          </Link>
        )}

        {state === "error" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", alignItems: "center" }}>
            <Link href="/login" className="btn btn-ghost btn-sm">
              Back to Sign In
            </Link>
            <button
              onClick={async () => {
                setState("loading");
                const email = prompt("Enter your email to resend the verification link:");
                if (!email) { setState("error"); return; }
                const res = await fetch("/api/auth/resend-verification", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
                setState("success");
                setMessage("A new verification link has been sent to your email if your account is registered.");
              }}
              className="btn btn-ghost btn-sm"
            >
              Resend verification email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="login-page">
        <div className="login-glow" />
        <div className="login-card" style={{ textAlign: "center" }}>
          <div style={{ color: "var(--text-3)" }}>Loading...</div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
