import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="footer-brand">Capitra Capital</div>
          <div className="footer-tagline">Built for disciplined traders.</div>
        </div>
        <div className="footer-links">
          <Link href="/challenges">Challenges</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/login">Login</Link>
        </div>
        <div className="footer-copy">
          © 2026 Capitra Capital. All rights reserved. Simulated trading environment — not real financial advice.
        </div>
      </div>
    </footer>
  );
}