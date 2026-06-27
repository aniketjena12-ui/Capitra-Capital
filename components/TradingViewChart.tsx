"use client";

import { useEffect, useRef } from "react";

interface TradingViewChartProps {
  symbol: string;
}

export default function TradingViewChart({ symbol }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear out any previous widgets to avoid multi-mount overflows
    containerRef.current.innerHTML = "";

    // Generate a unique DOM container ID for the widget to prevent collisions
    const uniqueWidgetId = `tv_chart_${Math.random().toString(36).substring(2, 9)}`;
    const widgetDiv = document.createElement("div");
    widgetDiv.id = uniqueWidgetId;
    widgetDiv.style.width = "100%";
    widgetDiv.style.height = "100%";
    containerRef.current.appendChild(widgetDiv);

    const initWidget = () => {
      if (typeof (window as any).TradingView !== "undefined") {
        new (window as any).TradingView.widget({
          width: "100%",
          height: "100%",
          symbol: symbol,
          interval: "15",
          timezone: "Asia/Kolkata",
          theme: "dark",
          style: "1",
          locale: "en",
          enable_publishing: false,
          hide_sidebars: true,
          container_id: uniqueWidgetId,
          hide_legend: false,
          save_image: false,
          calendar: false,
        });
      }
    };

    const existingScript = document.getElementById("tradingview-sdk");

    if (existingScript) {
      if (typeof (window as any).TradingView !== "undefined") {
        initWidget();
      } else {
        // Fallback polling in case the script tag exists but has not completed load execution
        const interval = setInterval(() => {
          if (typeof (window as any).TradingView !== "undefined") {
            clearInterval(interval);
            initWidget();
          }
        }, 100);
        return () => clearInterval(interval);
      }
    } else {
      // Append standard script tag into document head
      const script = document.createElement("script");
      script.id = "tradingview-sdk";
      script.src = "https://s3.tradingview.com/tv.js";
      script.type = "text/javascript";
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div 
      style={{ 
        width: "100%", 
        height: "100%", 
        minHeight: "450px", 
        background: "#0c0f1a",
        border: "1px solid var(--border-soft)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden"
      }} 
      ref={containerRef} 
    />
  );
}
