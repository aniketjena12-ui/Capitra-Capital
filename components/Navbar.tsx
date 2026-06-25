"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/challenges", label: "Challenges" },
  { href: "/rules", label: "Rules" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <span className="navbar-brand-dot" />
            Capitra Capital
          </Link>

          {/* Desktop links */}
          <div className="navbar-links navbar-desktop">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={pathname === l.href ? "active" : ""}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/login" className="navbar-login-btn">
              Login
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`nav-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`nav-drawer${menuOpen ? " open" : ""}`}>
        <div className="nav-drawer-inner">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-drawer-link${pathname === l.href ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="btn btn-blue btn-full"
            style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
            onClick={() => setMenuOpen(false)}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="btn btn-ghost btn-full"
            style={{ marginTop: "0.5rem", display: "flex", justifyContent: "center" }}
            onClick={() => setMenuOpen(false)}
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div className="nav-backdrop" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}