interface TraderCertificateProps {
  traderName: string;
  planName: string;
  initialBalance: number;
  passedAt?: string; // ISO date string
}

export default function TraderCertificate({
  traderName,
  planName,
  initialBalance,
  passedAt,
}: TraderCertificateProps) {
  const dateStr = passedAt
    ? new Date(passedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div
      style={{
        position: "relative",
        background: "linear-gradient(135deg, #0c0f1a 0%, #131829 50%, #0c0f1a 100%)",
        border: "1px solid rgba(59,130,246,0.35)",
        borderRadius: "var(--radius-xl)",
        padding: "2.5rem",
        overflow: "hidden",
        maxWidth: 600,
      }}
    >
      {/* Corner decorations */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 60, height: 60, borderTop: "2px solid rgba(59,130,246,0.5)", borderLeft: "2px solid rgba(59,130,246,0.5)", borderRadius: "var(--radius-xl) 0 0 0" }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, borderTop: "2px solid rgba(59,130,246,0.5)", borderRight: "2px solid rgba(59,130,246,0.5)", borderRadius: "0 var(--radius-xl) 0 0" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 60, height: 60, borderBottom: "2px solid rgba(59,130,246,0.5)", borderLeft: "2px solid rgba(59,130,246,0.5)", borderRadius: "0 0 0 var(--radius-xl)" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 60, height: 60, borderBottom: "2px solid rgba(59,130,246,0.5)", borderRight: "2px solid rgba(59,130,246,0.5)", borderRadius: "0 0 var(--radius-xl) 0" }} />

      {/* Glow orb */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Content */}
      <div style={{ position: "relative", textAlign: "center" }}>
        {/* Brand */}
        <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.3em", color: "var(--blue-400)", textTransform: "uppercase", marginBottom: "0.35rem" }}>
          Capitra Capital
        </div>
        <div style={{ fontSize: "0.625rem", color: "var(--text-3)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1.75rem" }}>
          Funded Trader Program
        </div>

        {/* Trophy */}
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>

        {/* Certificate title */}
        <div style={{ fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: "0.5rem" }}>
          Certificate of Achievement
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.4))" }} />
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--blue-400)" }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(59,130,246,0.4), transparent)" }} />
        </div>

        {/* This certifies */}
        <p style={{ fontSize: "0.75rem", color: "var(--text-3)", marginBottom: "0.5rem" }}>
          This certifies that
        </p>

        {/* Trader name */}
        <div
          style={{
            fontSize: "1.75rem",
            fontWeight: 800,
            color: "var(--text-1)",
            letterSpacing: "-0.02em",
            marginBottom: "0.5rem",
            fontFamily: "Georgia, serif",
          }}
        >
          {traderName}
        </div>

        <p style={{ fontSize: "0.8125rem", color: "var(--text-2)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
          has successfully completed the evaluation challenge and demonstrated
          consistent trading discipline on a{" "}
          <strong style={{ color: "var(--text-1)" }}>
            {planName} — ₹{initialBalance.toLocaleString("en-IN")}
          </strong>{" "}
          account, meeting all required profit targets and risk management criteria.
        </p>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.4))" }} />
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--blue-400)" }} />
          <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(59,130,246,0.4), transparent)" }} />
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Profit Target", value: "8% ✓" },
            { label: "Min Trading Days", value: "5 Days ✓" },
            { label: "Profit Split", value: "80%" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--green)" }}>{s.value}</div>
              <div style={{ fontSize: "0.6rem", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Date & Seal */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: "0.625rem", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Date Issued</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-2)" }}>{dateStr}</div>
          </div>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "rgba(37,99,235,0.15)",
              border: "2px solid rgba(59,130,246,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
            }}
          >
            ✦
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.625rem", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Verified by</div>
            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-2)" }}>Capitra Capital</div>
          </div>
        </div>
      </div>
    </div>
  );
}
