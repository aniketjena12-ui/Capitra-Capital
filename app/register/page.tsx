"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.includes("@")) e.email = "Enter a valid email.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast(data.error || "Registration failed.", "error");
        setLoading(false);
        return;
      }

      toast("Account created! Please check your email to verify your address.", "success");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      toast("Something went wrong. Try again.", "error");
      setLoading(false);
    }
  }

  function field(key: keyof typeof form) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
        setErrors((er) => ({ ...er, [key]: "" }));
      },
    };
  }

  return (
    <div className="login-page">
      <div className="login-glow" />
      <div className="login-card" style={{ maxWidth: 440 }}>
        <div className="login-logo">
          <span className="login-logo-text">CAPITRA<span className="login-logo-dot" />CAPITAL</span>
        </div>

        <h1 className="login-title">Create your account</h1>
        <p className="login-sub">Start your funded trading journey today</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Rahul Sharma" {...field("name")} required />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="rahul@email.com" {...field("email")} required />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Min. 6 characters" {...field("password")} required />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" placeholder="••••••••" {...field("confirm")} required />
            {errors.confirm && <span className="form-error">{errors.confirm}</span>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-blue btn-full" style={{ padding: "0.75rem", marginTop: "0.25rem" }}>
            {loading ? "Creating account..." : "Create Account →"}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.8125rem", color: "var(--text-3)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--blue-400)", textDecoration: "none" }}>Sign in</Link>
        </div>

        <p style={{ marginTop: "1rem", fontSize: "0.6875rem", color: "var(--text-3)", textAlign: "center", lineHeight: 1.5 }}>
          By creating an account, you agree to our{" "}
          <Link href="/terms" style={{ color: "var(--blue-400)", textDecoration: "none" }}>Terms of Service</Link> and{" "}
          <Link href="/privacy" style={{ color: "var(--blue-400)", textDecoration: "none" }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
