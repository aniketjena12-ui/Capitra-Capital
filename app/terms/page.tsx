import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Capitra Capital Terms of Service — please read before using our platform.",
};

const sections = [
  {
    title: "1. Nature of the Service",
    content: `Capitra Capital ("Company", "we", "us") operates a proprietary trading evaluation platform. The challenge accounts provided are simulated trading environments using real market data. No real capital is deployed on behalf of traders during the evaluation phase. Challenge fees paid by traders are non-refundable unless stated otherwise in a specific promotion.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 18 years of age to register and participate. By creating an account, you confirm that you are legally permitted to engage in financial services in your jurisdiction. Capitra Capital reserves the right to request identity verification at any time.`,
  },
  {
    title: "3. Challenge Rules & Evaluation",
    content: `All challenge accounts are subject to the evaluation rules published on the Rules page, including:\n• Maximum Daily Loss limit of 4% of the initial account balance\n• Maximum Overall Loss limit of 8% of the initial account balance\n• Profit target of 8% of the initial account balance\n• Minimum 5 distinct trading days required to qualify for evaluation pass\n\nViolating any drawdown rule results in immediate challenge termination. These rules may be updated; users will be notified via the platform.`,
  },
  {
    title: "4. Payouts & Profit Split",
    content: `Upon passing the evaluation, traders are eligible for profit payouts of up to 80% of profits generated, subject to KYC verification completion. Payouts are processed via bank transfer (NEFT/IMPS) to the verified bank account on file. Processing times are 1–3 business days. Minimum payout amount is ₹1,000. Capitra Capital reserves the right to withhold payouts pending fraud review.`,
  },
  {
    title: "5. Prohibited Activities",
    content: `The following activities are strictly prohibited and will result in immediate account termination without refund:\n• Arbitrage strategies exploiting platform pricing inconsistencies\n• Copy trading from another participant's account on the same platform\n• High-frequency trading designed to exploit latency\n• Any form of market manipulation\n• Using automated bots or EAs not disclosed at registration`,
  },
  {
    title: "6. Account Termination",
    content: `Capitra Capital reserves the right to suspend or terminate any account at its sole discretion if we detect breach of these Terms, fraudulent activity, or conduct inconsistent with the spirit of fair evaluation. No refunds will be issued in such cases.`,
  },
  {
    title: "7. Disclaimer of Financial Advice",
    content: `Nothing on this platform constitutes financial, investment, or trading advice, or any recommendation to buy or sell any security, derivative, commodity, or currency.\n\nCapitra Capital is NOT registered with the Securities and Exchange Board of India (SEBI) as a broker, investment adviser, research analyst, or any other SEBI-regulated intermediary under the Securities and Exchange Board of India Act, 1992, the SEBI (Investment Advisers) Regulations 2013, or the SEBI (Research Analysts) Regulations 2014.\n\nPast performance in a simulated environment does not guarantee future results. Trading financial instruments involves significant risk of loss. Participants are advised to seek independent financial advice before making any investment decisions.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `To the maximum extent permitted by applicable law, Capitra Capital shall not be liable for any indirect, incidental, or consequential damages arising from use of the platform. Our total liability in any matter is limited to the fees paid by you in the 3 months preceding the claim.`,
  },
  {
    title: "9. Governing Law",
    content: `These Terms are governed by the laws of the Republic of India. Any disputes, claims, or controversies arising out of or relating to these Terms or your use of Capitra Capital's platform shall be subject to the exclusive jurisdiction of the courts of competent jurisdiction in India.`,
  },
  {
    title: "10. Modifications",
    content: `We reserve the right to update these Terms at any time. Continued use of the platform after changes constitutes acceptance. Material changes will be communicated via in-platform notification.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <div className="inner-hero">
        <div className="section-eyebrow">Legal</div>
        <h1 className="inner-hero-title">Terms of Service</h1>
        <p className="inner-hero-sub">
          Last updated: June 2026. Please read these terms carefully before using Capitra Capital.
        </p>
      </div>

      <div className="page-wrapper" style={{ paddingBottom: "5rem", maxWidth: 800 }}>
        <div
          className="card"
          style={{
            marginBottom: "1.5rem",
            padding: "1.25rem 1.5rem",
            background: "rgba(234,179,8,0.07)",
            border: "1px solid rgba(234,179,8,0.25)",
            fontSize: "0.8125rem",
            color: "var(--text-2)",
            lineHeight: 1.6,
          }}
        >
          ⚠️ <strong style={{ color: "var(--text-1)" }}>Important:</strong> Capitra Capital operates a{" "}
          <strong>simulated trading environment</strong>. Challenge fees are real service fees — not deposits or
          investments. This platform is not a brokerage and is not registered with SEBI, RBI, or any financial authority.
        </div>

        {/* Cross-link to full disclaimer */}
        <div
          className="card"
          style={{
            marginBottom: "1.5rem",
            padding: "1rem 1.5rem",
            background: "rgba(59,130,246,0.06)",
            border: "1px solid rgba(59,130,246,0.2)",
            fontSize: "0.8125rem",
            color: "var(--text-2)",
            lineHeight: 1.65,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <span>
            📋 <strong style={{ color: "var(--text-1)" }}>Regulatory Disclaimer:</strong> For full information on SEBI, RBI,
            Income Tax, DPDP Act, grievance redressal, and other Indian regulatory disclosures —
          </span>
          <Link
            href="/disclaimer"
            style={{
              color: "var(--blue-400)",
              textDecoration: "none",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Read Full Disclaimer →
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {sections.map((s) => (
            <div key={s.title}>
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--text-1)",
                  marginBottom: "0.75rem",
                }}
              >
                {s.title}
              </h2>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-2)",
                  lineHeight: 1.75,
                  whiteSpace: "pre-line",
                }}
              >
                {s.content}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border-soft)",
            display: "flex",
            gap: "1.5rem",
            fontSize: "0.8125rem",
            color: "var(--text-3)",
          }}
        >
          <Link href="/privacy" style={{ color: "var(--blue-400)", textDecoration: "none" }}>
            Privacy Policy →
          </Link>
          <Link href="/contact" style={{ color: "var(--blue-400)", textDecoration: "none" }}>
            Contact Support →
          </Link>
        </div>
      </div>
    </>
  );
}
