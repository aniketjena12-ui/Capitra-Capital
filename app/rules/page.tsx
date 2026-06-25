import type { Metadata } from "next";

export const metadata: Metadata = { title: "Challenge Rules" };

const ruleSections = [
  {
    icon: "🎯",
    title: "Profit Target",
    color: "green",
    rules: [
      { label: "Required Profit", val: "8% of starting balance" },
      { label: "Example (₹5L account)", val: "Earn ₹40,000 to pass" },
      { label: "Counting method", val: "Closed P&L only" },
      { label: "Time limit", val: "No time limit — trade at your pace" },
    ],
    note: "Profits are calculated on closed positions only. Open floating profits do not count toward the target.",
  },
  {
    icon: "🛡️",
    title: "Maximum Daily Loss",
    color: "yellow",
    rules: [
      { label: "Limit", val: "4% of starting balance" },
      { label: "Resets", val: "Every calendar day at midnight IST" },
      { label: "Includes", val: "Closed losses + open floating loss" },
      { label: "Breach consequence", val: "Challenge ends immediately" },
    ],
    note: "Your daily loss limit is always measured against the starting balance, not the current balance. This prevents compounding risk.",
  },
  {
    icon: "📉",
    title: "Maximum Overall Loss",
    color: "red",
    rules: [
      { label: "Limit", val: "8% of starting balance" },
      { label: "Measured from", val: "Initial starting balance" },
      { label: "Includes", val: "All realized and unrealized losses" },
      { label: "Breach consequence", val: "Challenge ends immediately" },
    ],
    note: "This is a static trailing limit from your initial account balance. It does not scale with profits.",
  },
  {
    icon: "📅",
    title: "Minimum Trading Days",
    color: "blue",
    rules: [
      { label: "Required days", val: "5 different calendar days" },
      { label: "Counts as a day", val: "At least 1 closed trade in that session" },
      { label: "Time limit", val: "No restriction — take as long as you need" },
      { label: "Carry over", val: "Days accumulate until requirement is met" },
    ],
    note: "You must demonstrate consistency by trading on at least 5 different days before being eligible for evaluation.",
  },
  {
    icon: "📋",
    title: "Allowed Instruments",
    color: "blue",
    rules: [
      { label: "Starter Plan", val: "NSE Equities, Index Futures" },
      { label: "Professional Plan", val: "Equities, Futures, Index Options" },
      { label: "Elite Plan", val: "All — Equities, F&O, Crypto pairs" },
      { label: "Leverage", val: "Up to 5x (SEBI compliant)" },
    ],
    note: "All instruments are traded on the simulated environment mirroring live NSE/BSE/crypto prices.",
  },
  {
    icon: "🚫",
    title: "Prohibited Strategies",
    color: "red",
    rules: [
      { label: "Martingale systems", val: "Not allowed" },
      { label: "Copy trading / signal bots", val: "Not allowed" },
      { label: "Tick scalping under 30s", val: "Not allowed" },
      { label: "Account sharing", val: "Immediate disqualification" },
    ],
    note: "We look for consistent, disciplined traders. Any form of manipulation or strategy gaming will result in permanent ban.",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  green:  { bg: "rgba(34,197,94,0.07)",  border: "rgba(34,197,94,0.2)",  text: "#86efac" },
  yellow: { bg: "rgba(234,179,8,0.07)",  border: "rgba(234,179,8,0.2)",  text: "#fde047" },
  red:    { bg: "rgba(239,68,68,0.07)",  border: "rgba(239,68,68,0.2)",  text: "#fca5a5" },
  blue:   { bg: "rgba(59,130,246,0.07)", border: "rgba(59,130,246,0.2)", text: "#93c5fd" },
};

export default function RulesPage() {
  return (
    <>
      <div className="inner-hero">
        <div className="section-eyebrow">Rulebook</div>
        <h1 className="inner-hero-title">Challenge Rules</h1>
        <p className="inner-hero-sub">
          All the rules you need to know before starting your funded trader evaluation. Read carefully — discipline starts here.
        </p>
      </div>

      <div className="page-wrapper" style={{ paddingBottom: "5rem" }}>
        {/* Quick reference bar */}
        <div className="trust-banner" style={{ marginBottom: "3rem" }}>
          {[
            { label: "Profit Target", val: "8%" },
            { label: "Max Daily Loss", val: "4%" },
            { label: "Max Overall Loss", val: "8%" },
            { label: "Min Trading Days", val: "5" },
            { label: "Profit Split", val: "80%" },
            { label: "Time Limit", val: "None ∞" },
          ].map((r) => (
            <div key={r.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-1)", marginBottom: "0.2rem" }}>{r.val}</div>
              <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{r.label}</div>
            </div>
          ))}
        </div>

        {/* Rule sections */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: "1.5rem" }}>
          {ruleSections.map((section) => {
            const c = colorMap[section.color];
            return (
              <div key={section.title} className="card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, fontSize: "1.25rem",
                    background: c.bg, border: `1px solid ${c.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>{section.icon}</div>
                  <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-1)" }}>{section.title}</h2>
                </div>

                <div>
                  {section.rules.map((r) => (
                    <div key={r.label} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "0.5rem 0", borderBottom: "1px solid var(--border-soft)", fontSize: "0.8125rem",
                    }}>
                      <span style={{ color: "var(--text-3)" }}>{r.label}</span>
                      <span style={{ color: c.text, fontWeight: 600 }}>{r.val}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  padding: "0.75rem", background: c.bg, borderRadius: "var(--radius-sm)",
                  border: `1px solid ${c.border}`, fontSize: "0.75rem", color: "var(--text-2)", lineHeight: 1.6,
                }}>
                  💡 {section.note}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="card" style={{ marginTop: "3rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>Ready to take the challenge?</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-2)", marginBottom: "1.5rem" }}>
            You&apos;ve read the rules. Now prove you can follow them.
          </p>
          <a href="/challenges" className="btn btn-blue btn-lg">Choose Your Plan →</a>
        </div>
      </div>
    </>
  );
}
