"use client";

import { useEffect, useState, useRef, Fragment } from "react";

interface OptionChainProps {
  symbolName: string; // e.g. "NIFTY 50" or "BANKNIFTY"
  indexPrice: number;  // e.g. 23420.50
  onSelectContract: (name: string, price: number, direction: "BUY" | "SELL") => void;
  onSelectIndex?: (name: string) => void;
}

interface StrikeRow {
  strike: number;
  callLtp: number;
  putLtp: number;
  callOi: string;
  putOi: string;
  callIv: boolean; // Is call In-the-Money?
  putIv: boolean;  // Is put In-the-Money?
}

export default function OptionChain({ 
  symbolName, 
  indexPrice, 
  onSelectContract,
  onSelectIndex 
}: OptionChainProps) {
  const [strikes, setStrikes] = useState<StrikeRow[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState("30 Jun 2026 M");
  const [columnView, setColumnView] = useState<"LTP_OI" | "LTP" | "OI">("LTP_OI");
  
  // Dropdown states
  const [indexOpen, setIndexOpen] = useState(false);
  const [expiryOpen, setExpiryOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIndexOpen(false);
        setExpiryOpen(false);
        setViewOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getStep = () => {
    if (symbolName.includes("NIFTY 50") || symbolName.includes("MIDCPNIFTY")) return 50;
    return 100; // BANKNIFTY, FINNIFTY, SENSEX use 100
  };
  
  const step = getStep();
  
  const getContractPrefix = () => {
    if (symbolName.includes("NIFTY 50")) return "NIFTY";
    return symbolName;
  };
  
  const prefix = getContractPrefix();
  
  // Base index price rounded to nearest strike
  const atmStrike = Math.round(indexPrice / step) * step;

  // Realistic OI generation
  function getSimulatedOi(strike: number, isCall: boolean): string {
    const seed = (strike * (isCall ? 3 : 7)) % 100;
    if (seed > 88) {
      return `${(1 + (seed - 88) * 0.05).toFixed(2)} Cr`;
    }
    return `${(5 + seed * 1.1).toFixed(2)} L`;
  }

  useEffect(() => {
    // Generate 9 strike rows around the ATM strike for a wider options board
    const list: StrikeRow[] = [];
    for (let i = -4; i <= 4; i++) {
      const strike = atmStrike + i * step;
      
      // Calculate Intrinsic Value
      const callIntrinsic = Math.max(0, indexPrice - strike);
      const putIntrinsic = Math.max(0, strike - indexPrice);
      
      // Extrinsic/Time Value buffers
      const callTimeValue = Math.max(10, 120 - Math.abs(indexPrice - strike) * 0.4);
      const putTimeValue = Math.max(10, 110 - Math.abs(indexPrice - strike) * 0.4);

      const callLtp = parseFloat((callIntrinsic + callTimeValue).toFixed(2));
      const putLtp = parseFloat((putIntrinsic + putTimeValue).toFixed(2));

      list.push({
        strike,
        callLtp,
        putLtp,
        callOi: getSimulatedOi(strike, true),
        putOi: getSimulatedOi(strike, false),
        callIv: strike < indexPrice,
        putIv: strike > indexPrice,
      });
    }
    setStrikes(list);
  }, [indexPrice, atmStrike, step]);

  const indexOptions = [
    { value: "NIFTY 50", price: "24,056.00", change: "+0.14%" },
    { value: "SENSEX", price: "77,100.47", change: "+0.14%" },
    { value: "BANKNIFTY", price: "58,177.05", change: "+0.05%" },
    { value: "FINNIFTY", price: "26,770.55", change: "+0.13%" },
    { value: "MIDCPNIFTY", price: "14,434.55", change: "+0.56%" },
  ];

  const expiryOptions = [
    { date: "30 Jun 2026", type: "M" },
    { date: "07 Jul 2026", type: "W" },
    { date: "14 Jul 2026", type: "W" },
    { date: "21 Jul 2026", type: "W" },
    { date: "28 Jul 2026", type: "M" },
  ];

  const viewOptions = [
    { label: "LTP & OI", value: "LTP_OI" },
    { label: "LTP only", value: "LTP" },
    { label: "OI only", value: "OI" },
  ];

  return (
    <div 
      ref={containerRef}
      style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "0.75rem", 
        background: "#0c0f1a", 
        padding: "1rem", 
        borderRadius: "var(--radius-md)", 
        border: "1px solid var(--border-soft)",
        height: "100%",
        overflowY: "auto",
        position: "relative"
      }}
    >
      {/* Dropdown Selectors Row */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", zIndex: 10, flexWrap: "wrap" }}>
        
        {/* Index Selector */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => { setIndexOpen(!indexOpen); setExpiryOpen(false); setViewOpen(false); }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border-soft)",
              color: "var(--text-1)",
              padding: "0.4rem 0.85rem",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            {symbolName} ▾
          </button>
          
          {indexOpen && (
            <div 
              style={{
                position: "absolute",
                top: "115%",
                left: 0,
                background: "#111526",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--radius-sm)",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
                width: "210px",
                zIndex: 100,
                padding: "0.35rem 0"
              }}
            >
              {indexOptions.map((item) => (
                <div
                  key={item.value}
                  onClick={() => {
                    if (onSelectIndex) onSelectIndex(item.value);
                    setIndexOpen(false);
                  }}
                  style={{
                    padding: "0.5rem 0.75rem",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.02)",
                    background: symbolName === item.value ? "rgba(255,255,255,0.03)" : "transparent"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={(e) => {
                    if (symbolName !== item.value) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ fontWeight: 700, color: "var(--text-1)" }}>{item.value}</span>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>
                    {item.price} <span style={{ color: "var(--green)" }}>{item.change}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expiry Selector */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => { setExpiryOpen(!expiryOpen); setIndexOpen(false); setViewOpen(false); }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border-soft)",
              color: "var(--text-1)",
              padding: "0.4rem 0.85rem",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            {selectedExpiry} ▾
          </button>

          {expiryOpen && (
            <div 
              style={{
                position: "absolute",
                top: "115%",
                left: 0,
                background: "#111526",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--radius-sm)",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
                width: "160px",
                zIndex: 100,
                padding: "0.35rem 0"
              }}
            >
              {expiryOptions.map((item) => {
                const label = `${item.date} ${item.type}`;
                return (
                  <div
                    key={label}
                    onClick={() => {
                      setSelectedExpiry(label);
                      setExpiryOpen(false);
                    }}
                    style={{
                      padding: "0.5rem 0.75rem",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: selectedExpiry === label ? "rgba(255,255,255,0.03)" : "transparent"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={(e) => {
                      if (selectedExpiry !== label) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span style={{ color: "var(--text-1)", fontWeight: 600 }}>{item.date}</span>
                    <span 
                      style={{ 
                        fontSize: "0.55rem", 
                        padding: "0.1rem 0.25rem", 
                        borderRadius: "2px",
                        background: item.type === "M" ? "rgba(59,130,246,0.15)" : "rgba(245,158,11,0.15)",
                        color: item.type === "M" ? "var(--blue-400)" : "var(--yellow)",
                        fontWeight: 700
                      }}
                    >
                      {item.type}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* View Columns Selector */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() => { setViewOpen(!viewOpen); setIndexOpen(false); setExpiryOpen(false); }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border-soft)",
              color: "var(--text-1)",
              padding: "0.4rem 0.85rem",
              borderRadius: "20px",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem"
            }}
          >
            {viewOptions.find(o => o.value === columnView)?.label} ▾
          </button>

          {viewOpen && (
            <div 
              style={{
                position: "absolute",
                top: "115%",
                left: 0,
                background: "#111526",
                border: "1px solid var(--border-soft)",
                borderRadius: "var(--radius-sm)",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.5)",
                width: "120px",
                zIndex: 100,
                padding: "0.35rem 0"
              }}
            >
              {viewOptions.map((item) => (
                <div
                  key={item.value}
                  onClick={() => {
                    setColumnView(item.value as any);
                    setViewOpen(false);
                  }}
                  style={{
                    padding: "0.5rem 0.75rem",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    background: columnView === item.value ? "rgba(255,255,255,0.03)" : "transparent"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={(e) => {
                    if (columnView !== item.value) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ color: "var(--text-1)", fontWeight: 600 }}>{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Grid Option Chain Table */}
      <div 
        style={{ 
          overflowX: "auto", 
          border: "1px solid var(--border-soft)", 
          borderRadius: "var(--radius-sm)", 
          background: "#0f1322",
          flexGrow: 1
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem", textAlign: "center" }}>
          <thead>
            {/* Top row - CALL and PUT header bounds */}
            <tr style={{ background: "#111526", borderBottom: "1px solid var(--border-soft)", textTransform: "uppercase" }}>
              <th 
                colSpan={columnView === "LTP_OI" ? 2 : 1} 
                style={{ padding: "0.5rem", color: "var(--green)", fontWeight: 800, letterSpacing: "0.05em" }}
              >
                CALL OPTIONS (CE)
              </th>
              <th style={{ padding: "0.5rem", fontWeight: 800, background: "#161c33", width: "95px" }}>STRIKE</th>
              <th 
                colSpan={columnView === "LTP_OI" ? 2 : 1} 
                style={{ padding: "0.5rem", color: "var(--red)", fontWeight: 800, letterSpacing: "0.05em" }}
              >
                PUT OPTIONS (PE)
              </th>
            </tr>
            {/* Column labels */}
            <tr style={{ borderBottom: "1px solid var(--border-soft)", color: "var(--text-3)", background: "rgba(255,255,255,0.01)" }}>
              {columnView === "LTP_OI" && (
                <>
                  <th style={{ padding: "0.375rem 0.5rem", textAlign: "center" }}>OI</th>
                  <th style={{ padding: "0.375rem 0.5rem", borderRight: "1px solid var(--border-soft)" }}>LTP</th>
                </>
              )}
              {columnView === "LTP" && (
                <th style={{ padding: "0.375rem 0.5rem", borderRight: "1px solid var(--border-soft)" }}>LTP</th>
              )}
              {columnView === "OI" && (
                <th style={{ padding: "0.375rem 0.5rem", borderRight: "1px solid var(--border-soft)" }}>OI</th>
              )}

              <th style={{ padding: "0.375rem 0.5rem", background: "#161c33" }}>Price</th>

              {columnView === "LTP_OI" && (
                <>
                  <th style={{ padding: "0.375rem 0.5rem", borderLeft: "1px solid var(--border-soft)" }}>LTP</th>
                  <th style={{ padding: "0.375rem 0.5rem", textAlign: "center" }}>OI</th>
                </>
              )}
              {columnView === "LTP" && (
                <th style={{ padding: "0.375rem 0.5rem", borderLeft: "1px solid var(--border-soft)" }}>LTP</th>
              )}
              {columnView === "OI" && (
                <th style={{ padding: "0.375rem 0.5rem", borderLeft: "1px solid var(--border-soft)" }}>OI</th>
              )}
            </tr>
          </thead>
          <tbody>
            {strikes.map((row, index) => {
              // Check if we should insert the spot price line before this row
              const prevRow = strikes[index - 1];
              const isSpotDividerHere = prevRow && prevRow.strike < indexPrice && row.strike > indexPrice;

              // Shading for In the Money (ITM) options (soft golden/bronze shade matching Angel One layout)
              const itmBackground = "rgba(217, 119, 6, 0.035)";

              return (
                <Fragment key={row.strike}>
                  {/* Spot divider indicator line */}
                  {isSpotDividerHere && (
                    <tr style={{ background: "rgba(34,197,94,0.06)", borderTop: "1px solid rgba(34,197,94,0.25)", borderBottom: "1px solid rgba(34,197,94,0.25)" }}>
                      <td colSpan={columnView === "LTP_OI" ? 2 : 1}></td>
                      <td style={{ padding: "0.25rem 0", background: "#182035", textAlign: "center" }}>
                        <span 
                          style={{ 
                            background: "rgba(34,197,94,0.12)", 
                            border: "1px solid rgba(34,197,94,0.5)", 
                            padding: "0.1rem 0.4rem", 
                            borderRadius: "3px", 
                            fontSize: "0.6875rem",
                            color: "#22c55e",
                            fontWeight: 800
                          }}
                        >
                          {indexPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td colSpan={columnView === "LTP_OI" ? 2 : 1}></td>
                    </tr>
                  )}

                  <tr 
                    key={row.strike} 
                    style={{ 
                      borderBottom: "1px solid var(--border-soft)",
                    }}
                  >
                    {/* Call Columns */}
                    {columnView === "LTP_OI" && (
                      <>
                        {/* Call OI */}
                        <td style={{ padding: "0.55rem 0.5rem", color: "var(--text-2)", background: row.callIv ? itmBackground : "transparent" }}>
                          {row.callOi}
                        </td>
                        {/* Call LTP */}
                        <td 
                          onClick={() => onSelectContract(`${prefix} ${row.strike} CE`, row.callLtp, "BUY")}
                          style={{ 
                            padding: "0.55rem 0.5rem", 
                            fontWeight: 700, 
                            color: "var(--green)", 
                            cursor: "pointer",
                            background: row.callIv ? itmBackground : "transparent",
                            borderRight: "1px solid var(--border-soft)",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(34,197,94,0.08)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = row.callIv ? itmBackground : "transparent"}
                        >
                          ₹{row.callLtp.toFixed(2)}
                        </td>
                      </>
                    )}
                    {columnView === "LTP" && (
                      <td 
                        onClick={() => onSelectContract(`${prefix} ${row.strike} CE`, row.callLtp, "BUY")}
                        style={{ 
                          padding: "0.55rem 0.5rem", 
                          fontWeight: 700, 
                          color: "var(--green)", 
                          cursor: "pointer",
                          background: row.callIv ? itmBackground : "transparent",
                          borderRight: "1px solid var(--border-soft)",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(34,197,94,0.08)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = row.callIv ? itmBackground : "transparent"}
                      >
                        ₹{row.callLtp.toFixed(2)}
                      </td>
                    )}
                    {columnView === "OI" && (
                      <td style={{ padding: "0.55rem 0.5rem", color: "var(--text-2)", background: row.callIv ? itmBackground : "transparent", borderRight: "1px solid var(--border-soft)" }}>
                        {row.callOi}
                      </td>
                    )}

                    {/* Strike Price Middle */}
                    <td 
                      style={{ 
                        padding: "0.55rem 0.5rem", 
                        fontWeight: 700, 
                        color: "var(--text-3)", 
                        background: "#161c33",
                        borderLeft: "1px solid var(--border-soft)",
                        borderRight: "1px solid var(--border-soft)"
                      }}
                    >
                      {row.strike}
                    </td>

                    {/* Put Columns */}
                    {columnView === "LTP_OI" && (
                      <>
                        {/* Put LTP */}
                        <td 
                          onClick={() => onSelectContract(`${prefix} ${row.strike} PE`, row.putLtp, "BUY")}
                          style={{ 
                            padding: "0.55rem 0.5rem", 
                            fontWeight: 700, 
                            color: "var(--red)", 
                            cursor: "pointer",
                            background: row.putIv ? itmBackground : "transparent",
                            borderLeft: "1px solid var(--border-soft)",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = row.putIv ? itmBackground : "transparent"}
                        >
                          ₹{row.putLtp.toFixed(2)}
                        </td>
                        {/* Put OI */}
                        <td style={{ padding: "0.55rem 0.5rem", color: "var(--text-2)", background: row.putIv ? itmBackground : "transparent" }}>
                          {row.putOi}
                        </td>
                      </>
                    )}
                    {columnView === "LTP" && (
                      <td 
                        onClick={() => onSelectContract(`${prefix} ${row.strike} PE`, row.putLtp, "BUY")}
                        style={{ 
                          padding: "0.55rem 0.5rem", 
                          fontWeight: 700, 
                          color: "var(--red)", 
                          cursor: "pointer",
                          background: row.putIv ? itmBackground : "transparent",
                          borderLeft: "1px solid var(--border-soft)",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = row.putIv ? itmBackground : "transparent"}
                      >
                        ₹{row.putLtp.toFixed(2)}
                      </td>
                    )}
                    {columnView === "OI" && (
                      <td style={{ padding: "0.55rem 0.5rem", color: "var(--text-2)", background: row.putIv ? itmBackground : "transparent", borderLeft: "1px solid var(--border-soft)" }}>
                        {row.putOi}
                      </td>
                    )}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
