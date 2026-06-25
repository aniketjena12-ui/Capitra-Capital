import Link from "next/link";

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; paymentId?: string }>;
}) {
  const { plan = "professional", paymentId = "demo_payment" } = await searchParams;

  const planNames: Record<string, string> = {
    starter: "Starter",
    professional: "Professional",
    elite: "Elite",
  };

  return (
    <div className="page-wrapper" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        {/* Success Icon */}
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "rgba(34,197,94,0.1)", border: "2px solid rgba(34,197,94,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem", margin: "0 auto 2rem",
        }}>
          ✅
        </div>

        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
          Payment Successful!
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--text-2)", marginBottom: "2.5rem", lineHeight: 1.65 }}>
          Your <strong style={{ color: "var(--text-1)" }}>{planNames[plan] || "Professional"} Challenge</strong> account is being set up.
          You'll receive credentials on your email within 5 minutes.
        </p>

        {/* Order Details */}
        <div className="card" style={{ textAlign: "left", marginBottom: "2rem" }}>
          <div style={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-3)", marginBottom: "1rem" }}>
            Order Details
          </div>
          {[
            { label: "Plan",       val: `${planNames[plan] || "Professional"} Challenge` },
            { label: "Payment ID", val: paymentId },
            { label: "Status",     val: "✅ Confirmed" },
            { label: "Account",    val: "Will be active in 5 minutes" },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.625rem 0", borderBottom: "1px solid var(--border-soft)", fontSize: "0.875rem" }}>
              <span style={{ color: "var(--text-3)" }}>{row.label}</span>
              <span style={{ color: "var(--text-1)", fontWeight: 500 }}>{row.val}</span>
            </div>
          ))}
        </div>

        {/* Next Steps */}
        <div className="card" style={{ textAlign: "left", marginBottom: "2.5rem" }}>
          <div style={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-3)", marginBottom: "1rem" }}>
            Next Steps
          </div>
          {[
            { num: "01", text: "Check your email for account credentials" },
            { num: "02", text: "Log in to your trader dashboard" },
            { num: "03", text: "Read the challenge rules carefully" },
            { num: "04", text: "Start trading and hit that profit target! 🎯" },
          ].map((s) => (
            <div key={s.num} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.875rem", fontSize: "0.875rem" }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8, background: "var(--blue-dim)",
                border: "1px solid rgba(59,130,246,0.25)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "0.6875rem", fontWeight: 700, color: "var(--blue-400)", flexShrink: 0,
              }}>{s.num}</span>
              <span style={{ color: "var(--text-2)" }}>{s.text}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/dashboard" className="btn btn-blue btn-lg">
            Go to Dashboard →
          </Link>
          <Link href="/rules" className="btn btn-ghost">
            Read the Rules
          </Link>
        </div>
      </div>
    </div>
  );
}
