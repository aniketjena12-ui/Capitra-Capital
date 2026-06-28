import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Important Information & Disclaimer | Capitra Capital",
  description:
    "Important regulatory information and disclaimer for Capitra Capital — India's prop trading evaluation platform. Read before participating in any program.",
};

const sections = [
  {
    id: "simulated-environment",
    icon: "🖥️",
    title: "Simulated Trading Environment",
    content: [
      `All accounts provided by Capitra Capital are demo accounts operating exclusively in a simulated trading environment. Capitra Capital uses real-time or delayed market data feeds from Indian and global exchanges (including NSE, BSE, MCX, NCDEX, and international Forex markets) solely for the purpose of simulating trading conditions.`,
      `No actual trades are executed on any live exchange or financial market on behalf of participants. No real capital is deployed, managed, or placed at risk on behalf of any participant at any time. The services offered by Capitra Capital are designed for educational, skill-assessment, and evaluation purposes only.`,
    ],
  },
  {
    id: "not-sebi-registered",
    icon: "⚖️",
    title: "Not a SEBI-Registered Entity",
    content: [
      `Capitra Capital is NOT registered with the Securities and Exchange Board of India (SEBI) in any capacity, including but not limited to:`,
      `• Stockbroker or Sub-Broker under the Securities and Exchange Board of India (Brokers and Sub-Brokers) Regulations, 1992\n• Investment Adviser (IA) under the SEBI (Investment Advisers) Regulations, 2013\n• Research Analyst (RA) under the SEBI (Research Analysts) Regulations, 2014\n• Portfolio Manager under the SEBI (Portfolio Managers) Regulations, 2020\n• Depository Participant under the Depositories Act, 1996\n• Collective Investment Scheme (CIS) Manager\n• Any other SEBI-regulated intermediary`,
      `Participation in Capitra Capital's programs does not constitute opening a trading account, demat account, or any regulated securities account with any SEBI-registered entity. No securities transactions are executed on behalf of participants on any recognised stock exchange.`,
    ],
  },
  {
    id: "no-investment-advice",
    icon: "📋",
    title: "No Investment or Financial Advice",
    content: [
      `Nothing published on this website, within our platform, in our communications, or in any of our programs constitutes investment advice, financial advice, trading advice, tax advice, legal advice, or any recommendation to buy, sell, or hold any security, derivative, commodity, currency, or any other financial instrument.`,
      `Capitra Capital does not solicit or recommend the purchase or sale of any financial instruments. All content is provided for general informational and educational purposes only. Any trading strategies, analysis, or content shared on the platform reflect simulated conditions and should not be construed as advice applicable to real-world financial markets.`,
      `Past simulated performance is not necessarily indicative of future results in real or simulated markets.`,
    ],
  },
  {
    id: "program-fees",
    icon: "💳",
    title: "Nature of Program Fees",
    content: [
      `Fees paid to participate in Capitra Capital's evaluation programs are strictly service fees for access to our simulated evaluation platform, technology infrastructure, and related services.`,
      `Program fees are NOT:\n• Deposits under the Reserve Bank of India Act, 1934 or the Banking Regulation Act, 1949\n• Investments or securities under the Securities Contracts (Regulation) Act, 1956\n• Client funds under any SEBI regulation\n• Contributions to any collective investment scheme\n• Any form of capital that earns interest, dividends, returns, or profit sharing of any kind`,
      `Fees are non-refundable once paid, except where expressly required by applicable Indian law or stated otherwise in a specific promotion. Payment of program fees does not create any fiduciary duty, custodial relationship, investor-company relationship, or investment arrangement between participants and Capitra Capital.`,
      `All program fees are applied toward Capitra Capital's operational and administrative expenses, including but not limited to technology infrastructure, platform development, data licensing, and customer support.`,
    ],
  },
  {
    id: "not-nbfc",
    icon: "🏦",
    title: "Not a Banking Entity or NBFC",
    content: [
      `Capitra Capital does not accept public deposits and is NOT registered as a Non-Banking Financial Company (NBFC) with the Reserve Bank of India (RBI) under the Reserve Bank of India Act, 1934.`,
      `Capitra Capital does not provide banking services, lending services, payment services, forex dealing services, or investment management services. It does not hold a Payment Aggregator (PA) licence or Payment Gateway (PG) authorisation from the RBI. Payment processing for program fees is handled through a third-party SEBI/RBI-authorised payment gateway.`,
    ],
  },
  {
    id: "tax",
    icon: "🧾",
    title: "Tax Obligations & Payout Disclaimer",
    content: [
      `Any payouts received by participants from Capitra Capital may constitute taxable income under the Income Tax Act, 1961. The tax treatment of such payouts may vary depending on the nature of the income and the participant's individual tax situation.`,
      `Capitra Capital may deduct Tax Deducted at Source (TDS) on payouts where applicable under Indian law. Participants are solely responsible for complying with their individual tax obligations, including accurately reporting any income received from Capitra Capital to the Income Tax Department of India.`,
      `Participants are strongly advised to consult a qualified Chartered Accountant (CA) or tax professional regarding their specific tax obligations before participating in any payout program.`,
    ],
  },
  {
    id: "data-privacy",
    icon: "🔒",
    title: "Data Privacy",
    content: [
      `Capitra Capital collects and processes personal data including name, email address, PAN, Aadhaar number (for KYC verification), bank account details, and trading activity data. This data is collected for the purposes of identity verification, platform operation, payout processing, fraud prevention, and regulatory compliance.`,
      `In accordance with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India, participants have the right to access, correct, and request erasure of their personal data, subject to applicable legal obligations. Capitra Capital does not sell personal data to third parties.`,
      `For data-related requests or concerns, contact us at support@capitracapital.in. For full details, please review our Privacy Policy.`,
    ],
  },
  {
    id: "risk-warning",
    icon: "⚠️",
    title: "General Risk Warning",
    content: [
      `Trading in financial markets involves a substantial risk of loss. Even in a simulated environment, strategies tested under leveraged conditions may produce results that do not accurately reflect real-world execution, slippage, liquidity, or market impact.`,
      `Capitra Capital's evaluation programs are designed to assess trading skill and discipline under controlled, simulated conditions. Successfully passing an evaluation does not guarantee profitability in live markets. Participants should carefully consider their objectives, level of experience, and risk tolerance before participating in any evaluation program.`,
    ],
  },
  {
    id: "fema",
    icon: "🌐",
    title: "Foreign Exchange & Restrictions",
    content: [
      `Participants who are residents of India must ensure that their participation complies with the Foreign Exchange Management Act (FEMA), 1999 and all regulations issued thereunder by the Reserve Bank of India. Capitra Capital does not facilitate or encourage any transactions that may violate FEMA provisions.`,
      `Services are not offered to residents of jurisdictions subject to United Nations (UN) Security Council sanctions, Financial Action Task Force (FATF) blacklisted or grey-listed countries, or any jurisdiction where the provision of such services would be illegal or require licensing not held by Capitra Capital.`,
    ],
  },
  {
    id: "grievance",
    icon: "📬",
    title: "Grievance Redressal",
    content: [
      `Capitra Capital is committed to addressing participant grievances promptly and fairly. If you have a complaint or grievance related to our services, please contact us:`,
      `Grievance Officer: [Proprietor Name]\nDesignation: Proprietor, Capitra Capital\nEmail: support@capitracapital.in\nResponse time: We endeavour to acknowledge all grievances within 48 hours and resolve them within 15 business days.`,
      `If your grievance is not resolved to your satisfaction, you may seek recourse through appropriate consumer forums or courts of competent jurisdiction in India under the Consumer Protection Act, 2019.`,
    ],
  },
  {
    id: "corporate-info",
    icon: "🏢",
    title: "Corporate Information",
    content: [
      `Capitra Capital is a sole proprietorship business operating in India. It is not incorporated as a company under the Companies Act, 2013 and does not hold a Corporate Identification Number (CIN).`,
      `Registered Business Name: Capitra Capital\nEntity Type: Sole Proprietorship\nCountry of Operation: India\nContact: support@capitracapital.in`,
    ],
  },
  {
    id: "governing-law",
    icon: "📜",
    title: "Governing Law & Jurisdiction",
    content: [
      `These terms, disclaimers, and all matters relating to your use of Capitra Capital's platform and services are governed by and construed in accordance with the laws of the Republic of India, without regard to its conflict of law provisions.`,
      `Any disputes, claims, or controversies arising out of or in connection with your use of Capitra Capital's services shall be subject to the exclusive jurisdiction of the courts of competent jurisdiction in India.`,
    ],
  },
  {
    id: "modifications",
    icon: "🔄",
    title: "Modifications to This Disclaimer",
    content: [
      `Capitra Capital reserves the right to update, amend, or modify this disclaimer at any time without prior notice. The date of the most recent revision will be reflected at the top of this page. Continued use of the platform after any changes are made constitutes your acceptance of the revised disclaimer.`,
      `We encourage participants to review this page periodically to stay informed of any changes.`,
    ],
  },
];

export default function DisclaimerPage() {
  return (
    <>
      {/* Hero */}
      <div className="inner-hero">
        <div className="section-eyebrow">Legal</div>
        <h1 className="inner-hero-title">Important Information &amp; Disclaimer</h1>
        <p className="inner-hero-sub">
          Last updated: June 2026. Please read this disclaimer carefully before using Capitra Capital or
          participating in any of our programs.
        </p>
      </div>

      <div className="page-wrapper" style={{ paddingBottom: "5rem", maxWidth: 860 }}>

        {/* Top alert banner */}
        <div
          className="card"
          style={{
            marginBottom: "2rem",
            padding: "1.25rem 1.5rem",
            background: "rgba(234,179,8,0.07)",
            border: "1px solid rgba(234,179,8,0.3)",
            fontSize: "0.8125rem",
            color: "var(--text-2)",
            lineHeight: 1.65,
          }}
        >
          ⚠️{" "}
          <strong style={{ color: "var(--text-1)" }}>Important:</strong>{" "}
          Capitra Capital operates a{" "}
          <strong>simulated trading environment</strong>. No real trades are
          executed on any live exchange. Challenge fees are real service fees —
          not deposits or investments. This platform is{" "}
          <strong>not registered with SEBI, RBI, or any financial regulatory authority</strong>.
        </div>

        {/* Quick navigation */}
        <div
          className="card"
          style={{
            marginBottom: "2.5rem",
            padding: "1.25rem 1.5rem",
          }}
        >
          <div
            style={{
              fontSize: "0.6875rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-3)",
              marginBottom: "0.875rem",
            }}
          >
            Jump to Section
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  fontSize: "0.75rem",
                  padding: "0.3rem 0.7rem",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-soft)",
                  color: "var(--text-2)",
                  textDecoration: "none",
                  transition: "border-color 0.18s, color 0.18s",
                  whiteSpace: "nowrap",
                }}
              >
                {s.icon} {s.title.split(" ").slice(0, 3).join(" ")}
                {s.title.split(" ").length > 3 ? "…" : ""}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {sections.map((s) => (
            <div
              key={s.id}
              id={s.id}
              className="card"
              style={{ padding: "1.75rem" }}
            >
              {/* Section header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid var(--border-soft)",
                }}
              >
                <span
                  style={{
                    fontSize: "1.375rem",
                    lineHeight: 1,
                  }}
                >
                  {s.icon}
                </span>
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--text-1)",
                    margin: 0,
                  }}
                >
                  {s.title}
                </h2>
              </div>

              {/* Paragraphs */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                }}
              >
                {s.content.map((para, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-2)",
                      lineHeight: 1.8,
                      whiteSpace: "pre-line",
                      margin: 0,
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Professional advice note */}
        <div
          className="card"
          style={{
            marginTop: "2rem",
            padding: "1.25rem 1.5rem",
            background: "rgba(59,130,246,0.06)",
            border: "1px solid rgba(59,130,246,0.2)",
            fontSize: "0.8125rem",
            color: "var(--text-2)",
            lineHeight: 1.65,
          }}
        >
          💡{" "}
          <strong style={{ color: "var(--text-1)" }}>Professional Advice:</strong>{" "}
          This disclaimer is provided for general informational purposes and does not constitute legal
          advice. Participants are encouraged to seek independent legal, financial, and tax advice
          before participating in any of Capitra Capital&apos;s programs.
        </div>

        {/* Footer links */}
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border-soft)",
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            fontSize: "0.8125rem",
            color: "var(--text-3)",
          }}
        >
          <Link href="/terms" style={{ color: "var(--blue-400)", textDecoration: "none" }}>
            Terms of Service →
          </Link>
          <Link href="/privacy" style={{ color: "var(--blue-400)", textDecoration: "none" }}>
            Privacy Policy →
          </Link>
          <Link href="/contact" style={{ color: "var(--blue-400)", textDecoration: "none" }}>
            Contact / Grievance →
          </Link>
        </div>
      </div>
    </>
  );
}
