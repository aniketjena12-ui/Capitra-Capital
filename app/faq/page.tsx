"use client";

import { useState } from "react";

const faqs = [
  {
    category: "General",
    items: [
      {
        q: "What is Capitra Capital?",
        a: "Capitra Capital is a proprietary trading evaluation platform based in India. We provide traders with simulated capital to prove their edge. Once you pass our evaluation, you receive a funded account and keep up to 80% of your profits.",
      },
      {
        q: "Is this real money trading?",
        a: "No. The evaluation is conducted on a simulated trading environment with real market data. Your challenge fees are real, and your profits from the funded account are real — but the capital itself is simulated.",
      },
      {
        q: "Who can apply for a challenge?",
        a: "Any trader 18 years or older can apply. We welcome traders from all experience levels. There are no restrictions based on trading style — scalping, swing trading, and intraday are all allowed.",
      },
    ],
  },
  {
    category: "Challenge Rules",
    items: [
      {
        q: "What is the profit target?",
        a: "The profit target for all challenge accounts is 8%. For example, on a ₹5,00,000 account, you need to make ₹40,000 profit to pass.",
      },
      {
        q: "What are the drawdown limits?",
        a: "There are two drawdown rules: Max Daily Loss of 4% (resets every day) and Max Overall Loss of 8% from the initial balance. Breaching either limit ends your challenge.",
      },
      {
        q: "Is there a minimum number of trading days?",
        a: "Yes, you must trade on at least 5 different calendar days to qualify for evaluation. There is no time limit — your challenge period is unlimited.",
      },
      {
        q: "Can I trade over weekends or news events?",
        a: "You may hold positions over the weekend, but we strongly recommend caution during high-impact news events. Overnight gaps are your responsibility.",
      },
    ],
  },
  {
    category: "Payouts & Profits",
    items: [
      {
        q: "What is the profit split?",
        a: "Traders keep 80% of all profits generated in the funded account. Payouts are processed based on your selected plan — weekly for Starter, bi-weekly for Professional, and daily for Elite.",
      },
      {
        q: "How do I receive my payout?",
        a: "Payouts are made via bank transfer (NEFT/IMPS) directly to your registered bank account. Processing typically takes 1–3 business days.",
      },
      {
        q: "Can I scale up my funded account?",
        a: "Yes! Consistent profitable traders are eligible for account scaling. After three consecutive profitable months, you can apply to have your account size increased.",
      },
    ],
  },
  {
    category: "Technical",
    items: [
      {
        q: "What platforms do you support?",
        a: "We currently support trading via Zerodha Kite and Fyers. Additional platform integrations are planned for Q3 2026.",
      },
      {
        q: "What instruments can I trade?",
        a: "Depending on your plan, you can trade NSE equities, F&O (Futures & Options), and select cryptocurrency pairs. Check the Challenges page for per-plan instrument access.",
      },
    ],
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  function toggle(key: string) {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <>
      <div className="inner-hero">
        <div className="section-eyebrow">Support</div>
        <h1 className="inner-hero-title">Frequently Asked Questions</h1>
        <p className="inner-hero-sub">
          Everything you need to know about the Capitra Capital challenge and funded trading program.
        </p>
      </div>

      <div className="page-wrapper" style={{ paddingBottom: "5rem" }}>
        {faqs.map((section) => (
          <div key={section.category} style={{ marginBottom: "3rem" }}>
            <div
              style={{
                fontSize: "0.6875rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--blue-400)",
                marginBottom: "1rem",
                paddingLeft: "0.25rem",
              }}
            >
              {section.category}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {section.items.map((item, idx) => {
                const key = `${section.category}-${idx}`;
                const isOpen = !!openItems[key];
                return (
                  <div key={key} className={`faq-item${isOpen ? " open" : ""}`}>
                    <button className="faq-question" onClick={() => toggle(key)}>
                      <span>{item.q}</span>
                      <span className="faq-icon">+</span>
                    </button>
                    <div className="faq-answer">
                      <div className="faq-answer-inner">{item.a}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div
          style={{
            marginTop: "1rem",
            padding: "2.5rem",
            background: "var(--bg-card)",
            border: "1px solid var(--border-soft)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
            Still have questions?
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-2)", marginBottom: "1.25rem" }}>
            Our team is available 24/7 to help you get started.
          </p>
          <a href="/contact" className="btn btn-blue">
            Contact Support
          </a>
        </div>
      </div>
    </>
  );
}