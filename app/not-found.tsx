import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "calc(100vh - 58px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      position: "relative",
      zIndex: 1,
    }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{
          fontSize: "6rem",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.05em",
          background: "linear-gradient(135deg, #1d4ed8, #60a5fa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "1rem",
        }}>
          404
        </div>

        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
          Page not found
        </h1>

        <p style={{ fontSize: "0.9375rem", color: "var(--text-2)", marginBottom: "2.5rem", lineHeight: 1.65 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn btn-blue btn-lg">
            Go Home
          </Link>
          <Link href="/challenges" className="btn btn-ghost btn-lg">
            View Challenges
          </Link>
        </div>

        <div style={{ marginTop: "3rem", padding: "1.25rem", background: "var(--bg-card)", border: "1px solid var(--border-soft)", borderRadius: "var(--radius-md)" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--text-3)", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Quick links
          </div>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { href: "/challenges", label: "Challenges" },
              { href: "/rules",      label: "Rules"      },
              { href: "/blog",       label: "Blog"       },
              { href: "/faq",        label: "FAQ"        },
              { href: "/contact",    label: "Contact"    },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: "0.8125rem", color: "var(--blue-400)", textDecoration: "none" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
