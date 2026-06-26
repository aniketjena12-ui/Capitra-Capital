import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Capitra Capital Privacy Policy — how we collect, use, and protect your personal data.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect the following categories of personal information when you use Capitra Capital:\n\n• Account Information: Name, email address, phone number, and password (stored as a hashed value).\n• Bank Details: Account holder name, account number, IFSC code, and bank name — collected solely for the purpose of processing profit payouts.\n• Trade Data: Trade logs, P&L records, and performance metrics you submit through the platform.\n• Payment Data: Razorpay order IDs and payment IDs. We do not store full card numbers or UPI credentials — these are handled by Razorpay.\n• Usage Data: IP address, browser type, and session data collected automatically.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use your information for the following purposes:\n\n• To operate and maintain your account and challenge evaluation\n• To process payouts to your registered bank account\n• To send in-platform and email notifications related to your account activity\n• To detect and prevent fraud or platform abuse\n• To improve our services and user experience\n• To comply with legal obligations`,
  },
  {
    title: "3. Data Sharing & Third Parties",
    content: `We do not sell your personal data. We share data only in the following circumstances:\n\n• Payment Processing: Razorpay receives necessary transaction data to process payments. Their privacy policy applies to that data.\n• Legal Compliance: We may disclose information if required by Indian law, court order, or government request.\n• Service Providers: We may share data with trusted infrastructure providers (e.g., hosting, analytics) who are contractually bound to protect your data.`,
  },
  {
    title: "4. Data Security",
    content: `We implement industry-standard security measures including:\n\n• HTTPS encryption for all data in transit\n• Bcrypt hashing for all passwords (never stored in plaintext)\n• Role-based access controls for admin functions\n\nHowever, no system is 100% secure. We encourage you to use a strong, unique password and to contact us immediately if you suspect unauthorized access.`,
  },
  {
    title: "5. Data Retention",
    content: `We retain your personal data for as long as your account is active. If you request account deletion, we will remove your personal data within 30 days, except where we are required to retain it for legal or regulatory compliance (e.g., transaction records may be kept for up to 7 years per Indian tax law).`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to:\n\n• Access: Request a copy of the personal data we hold about you\n• Correction: Update inaccurate information via the Settings page\n• Deletion: Request deletion of your account and associated data\n• Portability: Request your trade data in a machine-readable format\n\nTo exercise these rights, contact us at privacy@capitracapital.com.`,
  },
  {
    title: "7. Cookies",
    content: `We use session cookies for authentication (managed by NextAuth.js). We do not use third-party advertising cookies. You may disable cookies in your browser settings, though this may affect platform functionality.`,
  },
  {
    title: "8. Children's Privacy",
    content: `Our platform is not intended for users under 18. We do not knowingly collect data from minors. If we discover a minor has registered, we will promptly delete their account.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy periodically. We will notify you of material changes via in-platform notification. The effective date at the top of this page will be updated accordingly.`,
  },
  {
    title: "10. Contact",
    content: `For privacy-related queries, contact our Data Protection team at:\nprivacy@capitracapital.com\n\nFor general support: support@capitracapital.com`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <div className="inner-hero">
        <div className="section-eyebrow">Legal</div>
        <h1 className="inner-hero-title">Privacy Policy</h1>
        <p className="inner-hero-sub">
          Last updated: June 2026. We are committed to protecting your personal data and being transparent about how we use it.
        </p>
      </div>

      <div className="page-wrapper" style={{ paddingBottom: "5rem", maxWidth: 800 }}>
        <div
          className="card"
          style={{
            marginBottom: "1.5rem",
            padding: "1.25rem 1.5rem",
            background: "rgba(37,99,235,0.07)",
            border: "1px solid rgba(59,130,246,0.2)",
            fontSize: "0.8125rem",
            color: "var(--text-2)",
            lineHeight: 1.6,
          }}
        >
          🔒 <strong style={{ color: "var(--text-1)" }}>Your data is yours.</strong> We only collect what is
          necessary to operate the platform and process your payouts. We never sell your information.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {sections.map((s) => (
            <div key={s.title}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-1)", marginBottom: "0.75rem" }}>
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
          <Link href="/terms" style={{ color: "var(--blue-400)", textDecoration: "none" }}>
            Terms of Service →
          </Link>
          <Link href="/contact" style={{ color: "var(--blue-400)", textDecoration: "none" }}>
            Contact Support →
          </Link>
        </div>
      </div>
    </>
  );
}
