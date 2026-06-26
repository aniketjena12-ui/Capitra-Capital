import Link from "next/link";

const footerLinks = {
  Platform: [
    { href: "/challenges", label: "Challenges" },
    { href: "/rules", label: "Trading Rules" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/affiliate", label: "Affiliate Program" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  Legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/rules", label: "Risk Disclaimer" },
  ],
};

const socials = [
  { href: "https://twitter.com", label: "𝕏", title: "Twitter / X" },
  { href: "https://instagram.com", label: "📸", title: "Instagram" },
  { href: "https://t.me", label: "✈️", title: "Telegram" },
];

export default function Footer() {
  return (
    <footer className="footer" style={{ marginTop: 0 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        {/* Top row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr repeat(3, 1fr)",
            gap: "2.5rem",
            paddingBottom: "2.5rem",
          }}
        >
          {/* Brand */}
          <div>
            <div className="footer-brand" style={{ marginBottom: "0.75rem" }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--blue-400)",
                  display: "inline-block",
                  marginRight: "0.4rem",
                  boxShadow: "0 0 8px var(--blue-glow)",
                }}
              />
              Capitra Capital
            </div>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--text-3)",
                lineHeight: 1.65,
                maxWidth: 260,
                marginBottom: "1.25rem",
              }}
            >
              India&apos;s premier funded trader evaluation platform. Prove your
              edge, earn your funding.
            </p>
            {/* Socials */}
            <div style={{ display: "flex", gap: "0.625rem" }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.title}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-soft)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <div
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--text-2)",
                  marginBottom: "1rem",
                }}
              >
                {section}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--text-3)",
                      textDecoration: "none",
                      transition: "color 0.18s",
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border-soft)", paddingTop: "1.5rem", paddingBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <p style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>
              © {new Date().getFullYear()} Capitra Capital. All rights reserved.
            </p>
            <p style={{ fontSize: "0.6875rem", color: "var(--text-3)", maxWidth: 520, textAlign: "right" }}>
              ⚠️ Simulated trading environment. Challenge fees are real. Capital is virtual. Not investment advice. Trading involves risk.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}