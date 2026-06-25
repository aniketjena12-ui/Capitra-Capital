import Link from "next/link";

const plans = [
  {
    tier: "Starter",
    price: "₹999",
    account: "₹1,00,000",
    highlight: "Perfect for beginners",
    color: "",
    features: [
      { label: "Account Size", val: "₹1,00,000" },
      { label: "Profit Target", val: "8%" },
      { label: "Max Daily Loss", val: "4%" },
      { label: "Max Overall Loss", val: "8%" },
      { label: "Profit Split", val: "80%" },
      { label: "Minimum Trading Days", val: "5 days" },
      { label: "Trading Period", val: "Unlimited" },
      { label: "Instruments", val: "Equities, Futures" },
    ],
    featured: false,
  },
  {
    tier: "Professional",
    price: "₹2,999",
    account: "₹5,00,000",
    highlight: "Best value for serious traders",
    color: "featured",
    features: [
      { label: "Account Size", val: "₹5,00,000" },
      { label: "Profit Target", val: "8%" },
      { label: "Max Daily Loss", val: "4%" },
      { label: "Max Overall Loss", val: "8%" },
      { label: "Profit Split", val: "80%" },
      { label: "Minimum Trading Days", val: "5 days" },
      { label: "Trading Period", val: "Unlimited" },
      { label: "Instruments", val: "Equities, Futures, Options" },
    ],
    featured: true,
  },
  {
    tier: "Elite",
    price: "₹4,999",
    account: "₹10,00,000",
    highlight: "Maximum capital & priority support",
    color: "",
    features: [
      { label: "Account Size", val: "₹10,00,000" },
      { label: "Profit Target", val: "8%" },
      { label: "Max Daily Loss", val: "4%" },
      { label: "Max Overall Loss", val: "8%" },
      { label: "Profit Split", val: "80%" },
      { label: "Minimum Trading Days", val: "5 days" },
      { label: "Trading Period", val: "Unlimited" },
      { label: "Instruments", val: "All — Equities, F&O, Crypto" },
    ],
    featured: false,
  },
];

export default function ChallengesPage() {
  return (
    <>
      <div className="inner-hero">
        <div className="section-eyebrow">Funding Challenges</div>
        <h1 className="inner-hero-title">Choose Your Account</h1>
        <p className="inner-hero-sub">
          Select a challenge size, pass the evaluation, and unlock real funded capital.
        </p>
      </div>

      <div className="page-wrapper" style={{ paddingBottom: "5rem" }}>
        {/* Trust Banner */}
        <div className="trust-banner">
          <div className="trust-item">
            <span className="trust-icon">⚡</span>
            <span className="trust-text"><strong>Instant</strong> account setup</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">📈</span>
            <span className="trust-text"><strong>Unlimited</strong> trading period</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">💸</span>
            <span className="trust-text"><strong>80%</strong> profit split</span>
          </div>
          <div className="trust-item">
            <span className="trust-icon">🛡️</span>
            <span className="trust-text"><strong>Transparent</strong> risk rules</span>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`pricing-card${plan.featured ? " featured" : ""}`}
            >
              {plan.featured && <div className="popular-badge">Most Popular</div>}
              <div className="plan-tier">{plan.tier}</div>
              <div className="plan-price">{plan.price}</div>
              <div className="plan-account-size">{plan.account} simulated account</div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: plan.featured ? "rgba(255,255,255,0.55)" : "var(--text-3)",
                  fontStyle: "italic",
                  marginBottom: "1.25rem",
                }}
              >
                {plan.highlight}
              </div>
              <div className="plan-divider" />

              {/* Feature table */}
              <div style={{ marginBottom: "1.5rem" }}>
                {plan.features.map((f) => (
                  <div
                    key={f.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem 0",
                      borderBottom: `1px solid ${plan.featured ? "rgba(255,255,255,0.08)" : "var(--border-soft)"}`,
                      fontSize: "0.8125rem",
                    }}
                  >
                    <span style={{ color: plan.featured ? "rgba(255,255,255,0.6)" : "var(--text-3)" }}>
                      {f.label}
                    </span>
                    <span style={{ color: plan.featured ? "white" : "var(--text-1)", fontWeight: 500 }}>
                      {f.val}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href={`/checkout?plan=${plan.tier.toLowerCase()}`}
                className={`btn-plan ${plan.featured ? "btn-plan-featured" : "btn-plan-default"}`}
              >
                Start Challenge →
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ teaser */}
        <div
          style={{
            marginTop: "3rem",
            textAlign: "center",
            padding: "2rem",
            background: "var(--bg-card)",
            border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <p style={{ fontSize: "0.9375rem", color: "var(--text-2)", marginBottom: "1rem" }}>
            Have questions about the challenge rules?
          </p>
          <Link href="/faq" className="btn btn-ghost">
            Read the FAQ
          </Link>
        </div>
      </div>
    </>
  );
}