import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Capitra Capital — India's funded trader evaluation platform built for disciplined, data-driven traders.",
};

const teamValues = [
  {
    icon: "🎯",
    title: "Meritocracy First",
    desc: "We believe every skilled trader deserves access to capital, regardless of their starting portfolio size.",
  },
  {
    icon: "🔍",
    title: "Total Transparency",
    desc: "Clear rules, published metrics, and no hidden clauses. You always know exactly where you stand.",
  },
  {
    icon: "📈",
    title: "Trader-Centric",
    desc: "Every product decision is made to help traders succeed. Your wins are our wins — 80% of profits go to you.",
  },
  {
    icon: "🇮🇳",
    title: "Built for India",
    desc: "Designed for NSE, BSE & crypto traders with INR payouts, Indian bank support, and local market understanding.",
  },
];

const milestones = [
  { year: "2024", event: "Capitra Capital founded with a mission to democratize funded trading in India." },
  { year: "Q1 2025", event: "Launched Starter and Professional challenge tiers. First 100 traders registered." },
  { year: "Q3 2025", event: "Crossed ₹10 Lakh in total trader payouts. Launched Elite tier." },
  { year: "2026", event: "Platform v2 launched with real-time drawdown monitoring, leaderboard, and advanced analytics." },
];

const stats = [
  { value: "1,200+", label: "Active Traders" },
  { value: "₹50L+", label: "Total Payouts" },
  { value: "80%", label: "Profit Split" },
  { value: "3", label: "Challenge Tiers" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="inner-hero">
        <div className="section-eyebrow">Our Story</div>
        <h1 className="inner-hero-title">Built for the Next Generation of Indian Traders</h1>
        <p className="inner-hero-sub">
          Capitra Capital was founded with one belief: talented traders shouldn&apos;t be limited by capital.
          We provide the evaluation infrastructure, the funding, and the tools — you bring the edge.
        </p>
      </div>

      <div className="page-wrapper" style={{ paddingBottom: "5rem" }}>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "4rem",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="card"
              style={{ textAlign: "center", padding: "1.75rem 1rem" }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "var(--blue-400)",
                  marginBottom: "0.35rem",
                  letterSpacing: "-0.03em",
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--text-3)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "4rem", alignItems: "center" }} className="mobile-1col">
          <div>
            <div className="section-eyebrow">Mission</div>
            <h2 className="section-title" style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>
              Democratizing Access to Trading Capital
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "1rem" }}>
              Most retail traders have the skill to be profitable — they just lack the capital to make trading a sustainable livelihood.
              Capitra Capital bridges that gap with a fair, transparent evaluation system.
            </p>
            <p style={{ fontSize: "0.9375rem", color: "var(--text-2)", lineHeight: 1.7 }}>
              Prove your discipline over 5+ trading days, hit an 8% profit target, and we activate your funded account.
              It&apos;s that simple. No gimmicks, no moving goalposts.
            </p>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(37,99,235,0.04))",
              border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: "var(--radius-xl)",
              padding: "2.5rem",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💡</div>
            <blockquote
              style={{
                fontSize: "1.0625rem",
                color: "var(--text-1)",
                lineHeight: 1.7,
                fontStyle: "italic",
                borderLeft: "3px solid var(--blue-400)",
                paddingLeft: "1rem",
              }}
            >
              &ldquo;We don&apos;t care about your background. We care about your P&L. If you can trade, we&apos;ll fund you.&rdquo;
            </blockquote>
            <div style={{ marginTop: "1rem", fontSize: "0.8125rem", color: "var(--text-3)" }}>
              — Capitra Capital Founding Team
            </div>
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: "4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="section-eyebrow">What We Stand For</div>
            <h2 className="section-title" style={{ fontSize: "1.75rem" }}>Our Core Values</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem" }}>
            {teamValues.map((v) => (
              <div key={v.title} className="card" style={{ padding: "1.75rem" }}>
                <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{v.icon}</div>
                <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-1)", marginBottom: "0.5rem" }}>
                  {v.title}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-3)", lineHeight: 1.6 }}>{v.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: "4rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="section-eyebrow">History</div>
            <h2 className="section-title" style={{ fontSize: "1.75rem" }}>Our Journey</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0", position: "relative" }}>
            <div
              className="about-timeline-line"
              style={{
                position: "absolute",
                left: "7.5rem",
                top: 0,
                bottom: 0,
                width: "1px",
                background: "var(--border-soft)",
              }}
            />
            {milestones.map((m, i) => (
              <div
                key={i}
                className="about-timeline-item"
                style={{
                  display: "grid",
                  gridTemplateColumns: "7rem auto 1fr",
                  gap: "1.5rem",
                  alignItems: "flex-start",
                  paddingBottom: "2rem",
                }}
              >
                <div className="about-timeline-year" style={{ textAlign: "right", fontSize: "0.8125rem", fontWeight: 700, color: "var(--blue-400)", paddingTop: "0.15rem" }}>
                  {m.year}
                </div>
                <div
                  className="about-timeline-dot"
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "var(--blue-500)",
                    border: "3px solid var(--bg-base)",
                    boxShadow: "0 0 10px var(--blue-glow)",
                    marginTop: "0.1rem",
                    flexShrink: 0,
                    zIndex: 1,
                    position: "relative",
                  }}
                />
                <div style={{ fontSize: "0.875rem", color: "var(--text-2)", lineHeight: 1.6 }}>{m.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(37,99,235,0.04))",
            border: "1px solid rgba(59,130,246,0.2)",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🚀</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Ready to prove your edge?
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-2)", marginBottom: "1.5rem" }}>
            Join 1,200+ traders on Capitra Capital. Start your evaluation today.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-blue">
              Create Free Account
            </Link>
            <Link href="/challenges" className="btn btn-ghost">
              View Challenges →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
