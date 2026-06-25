import Link from "next/link";

const stats = [
  { value: "$5M+", label: "Simulated Capital" },
  { value: "80%", label: "Profit Split" },
  { value: "24/7", label: "Trader Support" },
];

const plans = [
  {
    tier: "Starter",
    price: "₹999",
    account: "₹1,00,000 Account",
    features: ["8% Profit Target", "5% Max Drawdown", "80% Profit Split", "Weekly Payouts"],
    featured: false,
  },
  {
    tier: "Professional",
    price: "₹2,999",
    account: "₹5,00,000 Account",
    features: ["8% Profit Target", "5% Max Drawdown", "80% Profit Split", "Priority Support", "Bi-weekly Payouts"],
    featured: true,
  },
  {
    tier: "Elite",
    price: "₹4,999",
    account: "₹10,00,000 Account",
    features: ["8% Profit Target", "5% Max Drawdown", "80% Profit Split", "Dedicated Manager", "Daily Payouts"],
    featured: false,
  },
];

const steps = [
  {
    num: "01",
    title: "Choose Your Challenge",
    desc: "Pick an account size that matches your trading experience. From ₹1L to ₹10L simulated capital.",
  },
  {
    num: "02",
    title: "Pass Evaluation",
    desc: "Hit the profit target while staying within drawdown limits. Trade any style — scalping, swing, or intraday.",
  },
  {
    num: "03",
    title: "Get Funded",
    desc: "Once verified, receive your funded account and start earning real profits with up to 80% split.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <div className="hero-glow" />
        <div className="hero-section anim-fade-up">
          <div className="badge badge-blue">Funded Trader Program</div>
          <h1 className="hero-title">
            Trade With Discipline.<br />
            Scale With Confidence.
          </h1>
          <p className="hero-subtitle">
            Capitra Capital empowers traders to prove their edge, pass evaluations,
            and unlock funded opportunities with real profit splits.
          </p>
          <div className="hero-cta-group">
            <Link href="/challenges" className="btn btn-blue btn-lg">
              Start Challenge
            </Link>
            <Link href="/faq" className="btn btn-ghost btn-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="page-wrapper">
        <div className="metric-grid anim-fade-up anim-delay-1">
          {stats.map((s) => (
            <div key={s.label} className="metric-card">
              <div className="metric-value">{s.value}</div>
              <div className="metric-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="page-wrapper" style={{ padding: "5rem 1.5rem 0" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="section-eyebrow">How It Works</div>
          <h2 className="section-title">Three steps to funded trading</h2>
          <p className="section-subtitle" style={{ margin: "0.75rem auto 0" }}>
            A straightforward, transparent path from evaluation to capital.
          </p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div key={s.num} className={`step-card anim-fade-up anim-delay-${i + 1}`}>
              <div className="step-number">{s.num}</div>
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CHALLENGE ACCOUNTS */}
      <section className="page-wrapper" style={{ padding: "5rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div className="section-eyebrow">Pricing</div>
          <h2 className="section-title">Challenge Accounts</h2>
          <p className="section-subtitle" style={{ margin: "0.75rem auto 0" }}>
            Choose your funding path. All plans include transparent rules and fast payouts.
          </p>
        </div>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`pricing-card${plan.featured ? " featured" : ""}`}
            >
              {plan.featured && <div className="popular-badge">Most Popular</div>}
              <div className="plan-tier">{plan.tier}</div>
              <div className="plan-price">{plan.price}</div>
              <div className="plan-account-size">{plan.account}</div>
              <div className="plan-divider" />
              <ul className="plan-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <span className="feature-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/challenges"
                className={`btn-plan ${plan.featured ? "btn-plan-featured" : "btn-plan-default"}`}
              >
                Buy Challenge
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}