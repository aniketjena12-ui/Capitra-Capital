"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  name: string;
  balance: number;
  date: string;
}

interface EquityChartProps {
  data: ChartDataPoint[];
  initialBalance: number;
}

export default function EquityChart({ data, initialBalance }: EquityChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        style={{ 
          height: 180, 
          width: "100%", 
          background: "var(--bg-elevated)", 
          borderRadius: "var(--radius-sm)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "var(--text-3)",
          fontSize: "0.8125rem"
        }}
      >
        Loading chart visualizer...
      </div>
    );
  }

  const processedData = data.map((d) => {
    const change = d.balance - initialBalance;
    const changePct = ((change / initialBalance) * 100).toFixed(2);
    return {
      ...d,
      displayBalance: `₹${d.balance.toLocaleString("en-IN")}`,
      changePct: `${parseFloat(changePct) >= 0 ? "+" : ""}${changePct}%`,
    };
  });

  return (
    <div style={{ width: "100%", height: 180, marginTop: "1rem" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={processedData}
          margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--blue-500)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--blue-500)" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="var(--text-3)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            dy={8}
          />
          <YAxis 
            stroke="var(--text-3)" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            domain={["auto", "auto"]} 
            dx={-8}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as ChartDataPoint & { displayBalance: string; changePct: string };
                const isPositive = item.balance >= initialBalance;
                return (
                  <div 
                    style={{
                      background: "rgba(17, 24, 39, 0.8)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid var(--border-soft)",
                      padding: "0.75rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.75rem",
                      lineHeight: 1.5,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    <div style={{ color: "var(--text-3)", marginBottom: "0.25rem" }}>{item.date}</div>
                    <div style={{ fontWeight: 600, color: "var(--text-1)" }}>
                      Balance: <span style={{ color: "var(--text-1)" }}>{item.displayBalance}</span>
                    </div>
                    <div style={{ color: isPositive ? "var(--green)" : "var(--red)", fontWeight: 500 }}>
                      Performance: {item.changePct}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="var(--blue-500)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBalance)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
