"use client";

import { useEffect, useState } from "react";

interface Trader {
  rank: number;
  name: string;
  plan: string;
  balance: string;
  profit: string;
  pct: string;
  winRate: string;
  days: number;
  badge: string;
}

const planColors: Record<string, string> = {
  Elite:        "#93c5fd",
  Professional: "#86efac",
  Starter:      "#fde047",
};

export default function LeaderboardPage() {
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Leaderboard - Capitra Capital";
    async function loadLeaderboard() {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = await res.json();
          setTraders(data.traders || []);
        }
      } catch (e) {
        console.error("Failed to load leaderboard:", e);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

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
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-3)" }}>
            <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "1rem" }}>🔄</span>
            Loading rankings...
          </div>
        ) : traders.length >= 3 ? (
          <>
            {/* Top 3 podium */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr 1fr", gap: "1rem", marginBottom: "2.5rem", alignItems: "end" }}>
              {[traders[1], traders[0], traders[2]].map((t, i) => {
                if (!t) return null;
                return (
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
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: planColors[t.plan] || "var(--text-2)", marginBottom: "0.25rem" }}>{t.plan}</div>
                    <div style={{ fontSize: "0.9375rem", fontWeight: 600, marginBottom: "0.25rem" }}>{t.name}</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#86efac", marginBottom: "0.125rem" }}>{t.pct}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>Return</div>
                  </div>
                );
              })}
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
                          <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: planColors[t.plan] || "var(--text-2)" }}>{t.plan}</span>
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
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-3)" }}>
            No rankings available.
          </div>
        )}

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
