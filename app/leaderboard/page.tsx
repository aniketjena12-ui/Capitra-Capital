import type { Metadata } from "next";

export const metadata: Metadata = { title: "Leaderboard" };

const traders = [
  { rank: 1,  name: "Trader_Apex92",   plan: "Elite",        balance: "₹11,82,400", profit: "+₹1,82,400", pct: "+18.2%", winRate: "74%", days: 28, badge: "🥇" },
  { rank: 2,  name: "QuantEdge_47",    plan: "Elite",        balance: "₹11,54,200", profit: "+₹1,54,200", pct: "+15.4%", winRate: "71%", days: 32, badge: "🥈" },
  { rank: 3,  name: "NiftyStar_IN",    plan: "Professional", balance: "₹5,72,100",  profit: "+₹72,100",  pct: "+14.4%", winRate: "68%", days: 21, badge: "🥉" },
  { rank: 4,  name: "SwingKing_2026",  plan: "Elite",        balance: "₹11,38,900", profit: "+₹1,38,900", pct: "+13.9%", winRate: "65%", days: 45, badge: "" },
  { rank: 5,  name: "Scalper_Pro_X",   plan: "Professional", balance: "₹5,67,400",  profit: "+₹67,400",  pct: "+13.5%", winRate: "78%", days: 15, badge: "" },
  { rank: 6,  name: "BankNiftyBull",   plan: "Professional", balance: "₹5,62,000",  profit: "+₹62,000",  pct: "+12.4%", winRate: "62%", days: 38, badge: "" },
  { rank: 7,  name: "CryptoRider_v2",  plan: "Elite",        balance: "₹11,20,500", profit: "+₹1,20,500", pct: "+12.1%", winRate: "60%", days: 52, badge: "" },
  { rank: 8,  name: "IndexTrader99",   plan: "Starter",      balance: "₹1,11,800",  profit: "+₹11,800",  pct: "+11.8%", winRate: "57%", days: 19, badge: "" },
  { rank: 9,  name: "PatienceIs_Key",  plan: "Professional", balance: "₹5,57,200",  profit: "+₹57,200",  pct: "+11.4%", winRate: "69%", days: 60, badge: "" },
  { rank: 10, name: "RiskMgr_Elite",   plan: "Elite",        balance: "₹11,10,000", profit: "+₹1,10,000", pct: "+11.0%", winRate: "55%", days: 41, badge: "" },
];

const planColors: Record<string, string> = {
  Elite:        "#93c5fd",
  Professional: "#86efac",
  Starter:      "#fde047",
};

export default function LeaderboardPage() {
  return (
    <>
      <div className="inner-hero">
        <div className="section-eyebrow">Rankings</div>
        <h1 className="inner-hero-title">Leaderboard</h1>
        <p className="inner-hero-sub">
          Top performing funded traders this month. Names are anonymized to protect trader identity.
        </p>
      </div>

      <div className="page-wrapper" style={{ paddingBottom: "5rem" }}>
        {/* Top 3 podium */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr 1fr", gap: "1rem", marginBottom: "2.5rem", alignItems: "end" }}>
          {[traders[1], traders[0], traders[2]].map((t, i) => (
            <div
              key={t.rank}
              className={`card${i === 1 ? " card-glow" : ""}`}
              style={{
                textAlign: "center",
                paddingTop: i === 1 ? "2.5rem" : "1.75rem",
                background: i === 1 ? "linear-gradient(160deg, #1e3a8a, #1d4ed8)" : undefined,
                border: i === 1 ? "1px solid rgba(59,130,246,0.4)" : undefined,
              }}
            >
              <div style={{ fontSize: i === 1 ? "2.5rem" : "2rem", marginBottom: "0.5rem" }}>{t.badge}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: planColors[t.plan], marginBottom: "0.25rem" }}>{t.plan}</div>
              <div style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "0.25rem" }}>{t.name}</div>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#86efac", marginBottom: "0.125rem" }}>{t.pct}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Return</div>
            </div>
          ))}
        </div>

        {/* Full table */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-soft)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>All Rankings — June 2026</span>
            <span className="badge badge-green">Updated live</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Trader</th>
                  <th>Plan</th>
                  <th>Balance</th>
                  <th>Profit</th>
                  <th>Return</th>
                  <th>Win Rate</th>
                  <th>Days</th>
                </tr>
              </thead>
              <tbody>
                {traders.map((t) => (
                  <tr key={t.rank}>
                    <td>
                      <span style={{ fontSize: "1rem" }}>{t.badge || `#${t.rank}`}</span>
                    </td>
                    <td style={{ fontWeight: 500, color: "var(--text-1)" }}>{t.name}</td>
                    <td>
                      <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: planColors[t.plan] }}>{t.plan}</span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{t.balance}</td>
                    <td style={{ color: "#86efac", fontWeight: 600 }}>{t.profit}</td>
                    <td style={{ color: "#86efac", fontWeight: 700 }}>{t.pct}</td>
                    <td>{t.winRate}</td>
                    <td style={{ color: "var(--text-3)" }}>{t.days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card" style={{ marginTop: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", color: "var(--text-2)", marginBottom: "1rem" }}>
            Want to see your name on the leaderboard?
          </p>
          <a href="/challenges" className="btn btn-blue">Start a Challenge →</a>
        </div>
      </div>
    </>
  );
}
