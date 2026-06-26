"use client";

import { useEffect, useRef } from "react";

interface TradingViewWidgetProps {
  compact?: boolean;
}

export default function TradingViewWidget({ compact = false }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // Clean previous content
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "NSE:NIFTY", title: "NIFTY 50" },
        { proName: "NSE:BANKNIFTY", title: "BANK NIFTY" },
        { proName: "NSE:SENSEX", title: "SENSEX" },
        { proName: "CRYPTOCAP:BTC", title: "Bitcoin" },
        { proName: "CRYPTOCAP:ETH", title: "Ethereum" },
        { proName: "FX_IDC:USDINR", title: "USD/INR" },
        { proName: "NSE:RELIANCE", title: "Reliance" },
        { proName: "NSE:TCS", title: "TCS" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: compact ? "compact" : "adaptive",
      colorTheme: "dark",
      locale: "en",
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [compact]);

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        minHeight: compact ? 46 : 54,
      }}
    >
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget" />
      </div>
    </div>
  );
}
