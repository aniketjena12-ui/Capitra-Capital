"use client";

import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/components/ToastProvider";
import TradingViewChart from "@/components/TradingViewChart";
import OptionChain from "@/components/OptionChain";

interface Asset {
  value: string;
  symbol: string;
  tvSymbol: string;
  basePrice: number;
  spread: number;
  multiplier: number;
  type: "INDEX" | "EQUITY" | "COMMODITY";
}

const assets: Asset[] = [
  { value: "NIFTY 50",      symbol: "NSE:NIFTY",       tvSymbol: "NSE:NIFTY",       basePrice: 23420, spread: 2.5,  multiplier: 75,   type: "INDEX" },
  { value: "BANKNIFTY",     symbol: "NSE:BANKNIFTY",   tvSymbol: "NSE:BANKNIFTY",   basePrice: 50250, spread: 5.0,  multiplier: 15,   type: "INDEX" },
  { value: "FINNIFTY",      symbol: "NSE:FINNIFTY",    tvSymbol: "NSE:CNXFINANCE",  basePrice: 22150, spread: 2.0,  multiplier: 40,   type: "INDEX" },
  { value: "MIDCPNIFTY",     symbol: "NSE:MIDCPNIFTY",   tvSymbol: "NSE:MIDCPNIFTY",   basePrice: 11820, spread: 1.5,  multiplier: 75,   type: "INDEX" },
  { value: "SENSEX",        symbol: "BSE:SENSEX",      tvSymbol: "BSE:SENSEX",      basePrice: 77200, spread: 15.0, multiplier: 10,   type: "INDEX" },
  { value: "GOLD",          symbol: "MCX:GOLD1!",      tvSymbol: "MCX:GOLD1!",      basePrice: 72500, spread: 10.0, multiplier: 100,  type: "COMMODITY" },
  { value: "SILVER",        symbol: "MCX:SILVER1!",    tvSymbol: "MCX:SILVER1!",    basePrice: 89200, spread: 25.0, multiplier: 30,   type: "COMMODITY" },
  { value: "CRUDE OIL",     symbol: "MCX:CRUDEOIL1!",  tvSymbol: "MCX:CRUDEOIL1!",  basePrice: 6720,  spread: 5.0,  multiplier: 100,  type: "COMMODITY" },
  { value: "NATURAL GAS",   symbol: "MCX:NATURALGAS1!",tvSymbol: "MCX:NATURALGAS1!",basePrice: 215,   spread: 0.5,  multiplier: 1250, type: "COMMODITY" },
  { value: "COPPER",        symbol: "MCX:COPPER1!",    tvSymbol: "MCX:COPPER1!",    basePrice: 860,   spread: 0.5,  multiplier: 2500, type: "COMMODITY" },
  { value: "ZINC",          symbol: "MCX:ZINC1!",      tvSymbol: "MCX:ZINC1!",      basePrice: 260,   spread: 0.2,  multiplier: 5000, type: "COMMODITY" },
  { value: "RELIANCE",      symbol: "NSE:RELIANCE",    tvSymbol: "NSE:RELIANCE",    basePrice: 2955,  spread: 0.5,  multiplier: 250,  type: "EQUITY" },
  { value: "HDFC BANK",     symbol: "NSE:HDFCBANK",    tvSymbol: "NSE:HDFCBANK",    basePrice: 1680,  spread: 0.3,  multiplier: 550,  type: "EQUITY" },
  { value: "TCS",           symbol: "NSE:TCS",         tvSymbol: "NSE:TCS",         basePrice: 3850,  spread: 0.8,  multiplier: 175,  type: "EQUITY" },
  { value: "INFOSYS",       symbol: "NSE:INFY",        tvSymbol: "NSE:INFY",        basePrice: 1530,  spread: 0.3,  multiplier: 400,  type: "EQUITY" },
  { value: "ICICI BANK",     symbol: "NSE:ICICIBANK",   tvSymbol: "NSE:ICICIBANK",   basePrice: 1110,  spread: 0.25, multiplier: 700,  type: "EQUITY" },
  { value: "STATE BANK",     symbol: "NSE:SBIN",        tvSymbol: "NSE:SBIN",        basePrice: 830,   spread: 0.2,  multiplier: 1500, type: "EQUITY" },
  { value: "TATA MOTORS",   symbol: "NSE:TATAMOTORS",  tvSymbol: "NSE:TATAMOTORS",  basePrice: 960,   spread: 0.25, multiplier: 1425, type: "EQUITY" },
  { value: "ITC",           symbol: "NSE:ITC",         tvSymbol: "NSE:ITC",         basePrice: 430,   spread: 0.15, multiplier: 1600, type: "EQUITY" },
  { value: "BHARTI AIRTEL",  symbol: "NSE:BHARTIAIRT",  tvSymbol: "NSE:BHARTIAIRT",  basePrice: 1420,  spread: 0.3,  multiplier: 950,  type: "EQUITY" },
  { value: "L&T",           symbol: "NSE:LT",          tvSymbol: "NSE:LT",          basePrice: 3520,  spread: 0.7,  multiplier: 300,  type: "EQUITY" },
  { value: "AXIS BANK",     symbol: "NSE:AXISBANK",    tvSymbol: "NSE:AXISBANK",    basePrice: 1120,  spread: 0.25, multiplier: 1200, type: "EQUITY" },
  { value: "SUN PHARMA",    symbol: "NSE:SUNPHARMA",   tvSymbol: "NSE:SUNPHARMA",   basePrice: 1510,  spread: 0.35, multiplier: 700,  type: "EQUITY" },
  { value: "TATA STEEL",    symbol: "NSE:TATASTEEL",   tvSymbol: "NSE:TATASTEEL",   basePrice: 165,   spread: 0.05, multiplier: 5500, type: "EQUITY" },
  { value: "WIPRO",         symbol: "NSE:WIPRO",       tvSymbol: "NSE:WIPRO",       basePrice: 480,   spread: 0.15, multiplier: 1500, type: "EQUITY" }
];

interface Position {
  id: string;
  symbol: string; // e.g. "RELIANCE" or "NIFTY 23400 CE"
  direction: "BUY" | "SELL";
  productType: "MIS" | "CNC";
  entryPrice: number;
  entryIndexSpot?: number; // Spot price of Nifty/BankNifty when option was bought
  quantity: number;
  multiplier: number;
  isOption: boolean;
  strikePrice?: number;
  optionType?: "CE" | "PE";
  createdAt: string;
}

interface Holding {
  id: string;
  symbol: string;
  qty: number;
  avgCost: number;
  createdAt: string;
}

interface TradeHistory {
  id: string;
  date: string;
  symbol: string;
  direction: string;
  entry: string;
  exit: string;
  pnl: string;
  isProfit: boolean;
  notes: string | null;
  createdAt: string;
}

interface ActiveAccount {
  id: string;
  planName: string;
  balance: number;
  initialBalance: number;
  status: string;
}

export default function CapitradePage() {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [activeAccount, setActiveAccount] = useState<ActiveAccount | null>(null);
  const [history, setHistory] = useState<TradeHistory[]>([]);

  // Groww Broker View Tabs & Search
  const [activeTab, setActiveTab] = useState<"STOCKS" | "F&O">("STOCKS");
  const [chartMode, setChartMode] = useState<"CHART" | "OPTION_CHAIN" | "WATCHLIST">("OPTION_CHAIN");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selected Asset & Option Contract States
  const [selectedAsset, setSelectedAsset] = useState<Asset>(assets[0]); // Default Nifty 50
  const [selectedOption, setSelectedOption] = useState<{ name: string; price: number; type: "CE" | "PE" } | null>(null);
  
  // Order Sheet Panel Form States
  const [direction, setDirection] = useState<"BUY" | "SELL">("BUY");
  const [productType, setProductType] = useState<"MIS" | "CNC">("MIS"); // MIS (Intraday) vs CNC (Delivery)
  const [priceType, setPriceType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [quantity, setQuantity] = useState("75"); // Matches NIFTY contract lot size by default
  const [limitPrice, setLimitPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Live price tick tickers
  const [livePrices, setLivePrices] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    assets.forEach((a) => {
      initial[a.symbol] = a.basePrice;
    });
    return initial;
  });
  const [priceTrends, setPriceTrends] = useState<Record<string, "up" | "down">>({});

  // Open Positions & holdings
  const [positions, setPositions] = useState<Position[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [bottomTab, setBottomTab] = useState<"POSITIONS" | "HOLDINGS">("POSITIONS");

  // Filter watchlist based on search and selected category tab
  const filteredAssets = assets.filter((a) => {
    const matchesSearch = a.value.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "STOCKS") {
      return matchesSearch && (a.type === "EQUITY" || a.type === "COMMODITY" || a.type === "INDEX");
    } else {
      // F&O is only available on indices
      return matchesSearch && a.type === "INDEX";
    }
  });

  useEffect(() => {
    fetchAccountData();
  }, []);

  // Update default order quantities based on selected instrument type
  useEffect(() => {
    if (selectedOption) {
      // Option contracts lot sizes
      setQuantity(selectedAsset.value.includes("NIFTY 50") ? "75" : "15");
    } else {
      if (selectedAsset.type === "INDEX") {
        setQuantity(selectedAsset.value.includes("NIFTY 50") ? "75" : "15");
      } else if (selectedAsset.type === "COMMODITY") {
        setQuantity("1");
      } else {
        setQuantity("10"); // Default Stock Qty
      }
    }
  }, [selectedAsset, selectedOption]);

  async function fetchAccountData() {
    try {
      const res = await fetch("/api/trades");
      const data = await res.json();
      if (res.ok) {
        setActiveAccount(data.activeAccount || null);
        setHistory(data.trades || []);

        if (data.activeAccount) {
          // Load from localStorage specific to this account
          const storedPos = localStorage.getItem(`capitra_positions_${data.activeAccount.id}`);
          if (storedPos) setPositions(JSON.parse(storedPos));

          const storedHold = localStorage.getItem(`capitra_holdings_${data.activeAccount.id}`);
          if (storedHold) setHoldings(JSON.parse(storedHold));
        }
      }
    } catch {
      toast("Failed to sync broker database details.", "error");
    } finally {
      setLoading(false);
    }
  }

  // Simulated live prices ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrices((prev) => {
        const next = { ...prev };
        const trends: Record<string, "up" | "down"> = {};
        assets.forEach((a) => {
          const current = prev[a.symbol];
          const factor = 0.0003; // Indian spot fluctuation scale
          const pctChange = (Math.random() - 0.5) * factor;
          const delta = current * pctChange;
          next[a.symbol] = parseFloat((current + delta).toFixed(2));
          trends[a.symbol] = delta >= 0 ? "up" : "down";
        });
        setPriceTrends(trends);
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Sync positions & holdings state to localStorage
  useEffect(() => {
    if (activeAccount) {
      localStorage.setItem(`capitra_positions_${activeAccount.id}`, JSON.stringify(positions));
    }
  }, [positions, activeAccount]);

  useEffect(() => {
    if (activeAccount) {
      localStorage.setItem(`capitra_holdings_${activeAccount.id}`, JSON.stringify(holdings));
    }
  }, [holdings, activeAccount]);

  const activeSpotPrice = livePrices[selectedAsset.symbol];
  const prefix = selectedAsset.value.includes("NIFTY 50") ? "NIFTY" : selectedAsset.value;
  const isNiftyIndex = selectedAsset.value.includes("NIFTY 50") || selectedAsset.value.includes("MIDCPNIFTY");
  const strikeStep = isNiftyIndex ? 50 : 100;
  const atmStrike = Math.round(activeSpotPrice / strikeStep) * strikeStep;
  const executionPrice = selectedOption 
    ? selectedOption.price 
    : priceType === "LIMIT" && limitPrice 
      ? parseFloat(limitPrice) 
      : activeSpotPrice;

  // Calculates live option premium based on spot index changes
  function getLiveOptionPremium(pos: Position): number {
    if (!pos.entryIndexSpot) return pos.entryPrice;
    
    // Spot difference mapping
    let spotSymbol = "NSE:NIFTY";
    if (pos.symbol.includes("BANKNIFTY")) spotSymbol = "NSE:BANKNIFTY";
    else if (pos.symbol.includes("FINNIFTY")) spotSymbol = "NSE:FINNIFTY";
    else if (pos.symbol.includes("MIDCPNIFTY")) spotSymbol = "NSE:MIDCPNIFTY";
    else if (pos.symbol.includes("SENSEX")) spotSymbol = "BSE:SENSEX";

    const currentSpot = livePrices[spotSymbol] || pos.entryIndexSpot;
    const spotDiff = currentSpot - pos.entryIndexSpot;

    // Delta is roughly 0.5 for ATM options, meaning option price moves by ~50% of the index spot price movement
    const delta = 0.5; 
    let premiumChange = spotDiff * delta;
    
    if (pos.optionType === "PE") {
      premiumChange = -premiumChange; // Puts go up when spot index goes down
    }

    const nextPremium = pos.entryPrice + premiumChange;
    return parseFloat(Math.max(1, nextPremium).toFixed(2));
  }

  // Get active live price for any position item
  function getLivePositionPrice(pos: Position): number {
    if (pos.isOption) {
      return getLiveOptionPremium(pos);
    }
    // Spot stock/commodity price
    const asset = assets.find((a) => a.value === pos.symbol || a.symbol === pos.symbol);
    return asset ? livePrices[asset.symbol] : pos.entryPrice;
  }

  // Calculate live unrealized P&L of all open positions
  const openPositionsPnl = positions.reduce((sum, pos) => {
    const livePrice = getLivePositionPrice(pos);
    const priceDiff = pos.direction === "BUY" ? livePrice - pos.entryPrice : pos.entryPrice - livePrice;
    return sum + priceDiff * pos.quantity * pos.multiplier;
  }, 0);

  // Calculate live returns of Holdings
  const holdingsValue = holdings.reduce((sum, h) => {
    const asset = assets.find((a) => a.value === h.symbol || a.symbol === h.symbol);
    const livePrice = asset ? livePrices[asset.symbol] : h.avgCost;
    return sum + livePrice * h.qty;
  }, 0);
  const holdingsCost = holdings.reduce((sum, h) => sum + h.avgCost * h.qty, 0);
  const holdingsPnl = holdingsValue - holdingsCost;

  // Global capital metrics
  const balance = activeAccount?.balance || 500000;
  const equity = balance + openPositionsPnl;
  const isFailed = activeAccount?.status === "FAILED";
  const isPassed = activeAccount?.status === "PASSED";

  // Triggered when CE/PE contract is clicked inside Option Chain
  function handleSelectOptionContract(contractName: string, price: number, type: "BUY" | "SELL") {
    setSelectedOption({
      name: contractName,
      price: price,
      type: contractName.endsWith("CE") ? "CE" : "PE"
    });
    setDirection("BUY"); // Default F&O buy
  }

  // Order Placement logic (Support MIS Intraday vs CNC Delivery)
  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!activeAccount || activeAccount.status !== "ACTIVE") {
      toast("Active evaluation challenge is required to execute orders.", "error");
      return;
    }

    const qty = parseFloat(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast("Please enter a valid order quantity.", "error");
      return;
    }

    const orderSymbol = selectedOption ? selectedOption.name : selectedAsset.value;
    const isOption = !!selectedOption;
    const multiplier = selectedOption ? 1 : selectedAsset.multiplier;

    // Margin Checks (Intraday MIS provides 5x leverage on cash stocks, F&O Options require 100% premium)
    const totalCost = executionPrice * qty * multiplier;
    const marginRequired = productType === "MIS" && !isOption ? totalCost * 0.2 : totalCost;

    if (marginRequired > balance) {
      toast(`Insufficient margin balance. Available: ₹${Math.round(balance).toLocaleString("en-IN")}, Required: ₹${Math.round(marginRequired).toLocaleString("en-IN")}`, "error");
      return;
    }

    // Handled differently: Stocks bought under Delivery (CNC) go directly to "Holdings"
    if (productType === "CNC" && !isOption) {
      // Find if holding already exists to average out cost
      const existingIdx = holdings.findIndex((h) => h.symbol === orderSymbol);
      if (existingIdx !== -1) {
        const h = holdings[existingIdx];
        const newQty = h.qty + qty;
        const newAvg = (h.avgCost * h.qty + executionPrice * qty) / newQty;
        const nextHold = [...holdings];
        nextHold[existingIdx] = { ...h, qty: newQty, avgCost: parseFloat(newAvg.toFixed(2)) };
        setHoldings(nextHold);
      } else {
        const newHolding: Holding = {
          id: Math.random().toString(36).substring(2, 9),
          symbol: orderSymbol,
          qty,
          avgCost: executionPrice,
          createdAt: new Date().toISOString()
        };
        setHoldings((prev) => [newHolding, ...prev]);
      }

      // Deduct cash balance directly from database
      updateDatabaseBalance(-totalCost, `Bought ${qty} shares of ${orderSymbol} via CNC.`);
      setBottomTab("HOLDINGS");
      return;
    }

    // MIS Intraday or Options go to active "Positions"
    const newPosition: Position = {
      id: Math.random().toString(36).substring(2, 9),
      symbol: orderSymbol,
      direction,
      productType,
      entryPrice: parseFloat(executionPrice.toFixed(2)),
      entryIndexSpot: isOption ? (selectedAsset.value.includes("NIFTY 50") ? livePrices["NSE:NIFTY"] : livePrices["NSE:BANKNIFTY"]) : undefined,
      quantity: qty,
      multiplier,
      isOption,
      optionType: isOption ? selectedOption?.type : undefined,
      createdAt: new Date().toISOString()
    };

    setPositions((prev) => [newPosition, ...prev]);
    toast(`Executed Market ${direction} order of ${qty} units of ${orderSymbol}.`, "success");
    setBottomTab("POSITIONS");
  }

  // Function to deduct/increment balance in database
  async function updateDatabaseBalance(amount: number, detailsMsg: string) {
    try {
      const dateStr = new Date().toISOString().split("T")[0];
      const pnlFormatted = `${amount >= 0 ? "+" : "–"}₹${Math.abs(Math.round(amount)).toLocaleString("en-IN")}`;
      
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          symbol: "Account Adjustment",
          direction: "BUY",
          entry: "0",
          exit: "0",
          pnl: pnlFormatted,
          notes: detailsMsg,
        }),
      });

      if (res.ok) {
        fetchAccountData();
      }
    } catch {
      console.error("Failed to sync balance change to database.");
    }
  }

  // Close active Position (posts details to server database)
  async function handleClosePosition(pos: Position) {
    if (!activeAccount) return;
    setSubmitting(true);

    const livePrice = getLivePositionPrice(pos);
    const priceDiff = pos.direction === "BUY" ? livePrice - pos.entryPrice : pos.entryPrice - livePrice;
    const rawPnl = priceDiff * pos.quantity * pos.multiplier;

    const dateStr = new Date().toISOString().split("T")[0];
    const pnlFormatted = `${rawPnl >= 0 ? "+" : "–"}₹${Math.abs(Math.round(rawPnl)).toLocaleString("en-IN")}`;

    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          symbol: pos.symbol,
          direction: pos.direction,
          entry: pos.entryPrice.toString(),
          exit: livePrice.toFixed(2),
          pnl: pnlFormatted,
          notes: `Closed ${pos.productType} position.`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast(`Closed position! P&L: ${pnlFormatted}`, "success");
        setPositions((prev) => prev.filter((p) => p.id !== pos.id));
        fetchAccountData();
      } else {
        toast(data.error || "Failed to close position.", "error");
      }
    } catch {
      toast("Server error closing position.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  // Sell holding (CNC delivery exit)
  async function handleSellHolding(hold: Holding) {
    if (!activeAccount) return;
    setSubmitting(true);

    const asset = assets.find((a) => a.value === hold.symbol || a.symbol === hold.symbol);
    const livePrice = asset ? livePrices[asset.symbol] : hold.avgCost;
    const rawReturn = (livePrice - hold.avgCost) * hold.qty;
    const payoutAmount = livePrice * hold.qty;

    const dateStr = new Date().toISOString().split("T")[0];
    const pnlFormatted = `${rawReturn >= 0 ? "+" : "–"}₹${Math.abs(Math.round(rawReturn)).toLocaleString("en-IN")}`;

    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          symbol: hold.symbol,
          direction: "SELL",
          entry: hold.avgCost.toString(),
          exit: livePrice.toFixed(2),
          pnl: pnlFormatted,
          notes: `Sold holdings of ${hold.symbol} CNC. Received credit of ₹${Math.round(payoutAmount).toLocaleString("en-IN")}.`,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast(`Sold holdings! P&L: ${pnlFormatted}`, "success");
        setHoldings((prev) => prev.filter((h) => h.id !== hold.id));
        fetchAccountData();
      } else {
        toast(data.error || "Failed to exit holding.", "error");
      }
    } catch {
      toast("Server error selling holdings.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  const getStrikeListForDashboard = () => {
    const isNifty = selectedAsset.value.includes("NIFTY 50") || selectedAsset.value.includes("MIDCPNIFTY");
    const step = isNifty ? 50 : 100;
    const atm = Math.round(activeSpotPrice / step) * step;
    
    const list = [];
    for (let i = -2; i <= 2; i++) {
      const strike = atm + i * step;
      const callIntrinsic = Math.max(0, activeSpotPrice - strike);
      const putIntrinsic = Math.max(0, strike - activeSpotPrice);
      const callTimeValue = Math.max(10, 120 - Math.abs(activeSpotPrice - strike) * 0.4);
      const putTimeValue = Math.max(10, 110 - Math.abs(activeSpotPrice - strike) * 0.4);

      list.push({
        strike,
        callLtp: parseFloat((callIntrinsic + callTimeValue).toFixed(2)),
        putLtp: parseFloat((putIntrinsic + putTimeValue).toFixed(2)),
      });
    }
    return list;
  };

  if (loading) {
    return (
      <DashboardLayout title="Capitra Terminal" subtitle="Brokerage trading terminal loaded">
        <div style={{ color: "var(--text-3)", padding: "3rem", textAlign: "center" }}>Setting up trading desk...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Capitrade" subtitle="The smart, simple trading workspace">
      
      {/* Account Info bar */}
      <div 
        className="card" 
        style={{ 
          marginBottom: "1.25rem", 
          padding: "1rem 1.5rem", 
          background: isFailed ? "rgba(239,68,68,0.06)" : isPassed ? "rgba(34,197,94,0.06)" : "var(--bg-elevated)",
          border: `1px solid ${isFailed ? "rgba(239,68,68,0.25)" : isPassed ? "rgba(34,197,94,0.25)" : "var(--border-soft)"}`,
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center" 
        }}
      >
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", textTransform: "uppercase", fontWeight: 600 }}>Challenge Status</div>
            <div style={{ fontWeight: 700, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.15rem" }}>
              {activeAccount ? (
                <>
                  <span>{activeAccount.planName} Tier</span>
                  <span className={`badge ${isPassed ? "badge-green" : isFailed ? "badge-red" : "badge-blue"}`} style={{ fontSize: "0.55rem" }}>
                    {activeAccount.status}
                  </span>
                </>
              ) : (
                <span style={{ color: "var(--yellow)" }}>No Active Challenge</span>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", textTransform: "uppercase", fontWeight: 600 }}>Account Balance</div>
            <div style={{ fontWeight: 700, fontSize: "0.9375rem", marginTop: "0.15rem" }}>
              ₹{balance.toLocaleString("en-IN")}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", textTransform: "uppercase", fontWeight: 600 }}>Running Equity</div>
            <div 
              style={{ 
                fontWeight: 700, 
                fontSize: "0.9375rem", 
                marginTop: "0.15rem",
                color: equity >= balance ? "var(--green)" : "var(--red)" 
              }}
            >
              ₹{equity.toLocaleString("en-IN")}
            </div>
          </div>

          <div>
            <div style={{ fontSize: "0.6875rem", color: "var(--text-3)", textTransform: "uppercase", fontWeight: 600 }}>Open P&amp;L</div>
            <div 
              style={{ 
                fontWeight: 700, 
                fontSize: "0.9375rem", 
                marginTop: "0.15rem",
                color: openPositionsPnl >= 0 ? "var(--green)" : "var(--red)" 
              }}
            >
              {openPositionsPnl >= 0 ? "+" : ""}₹{Math.round(openPositionsPnl).toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {isFailed && (
          <div style={{ color: "var(--red)", fontSize: "0.75rem", fontWeight: 600 }}>
            ⚠️ DRAWDOWN LIMIT BREACHED — ACCOUNT TRADING LOCKED
          </div>
        )}
        {isPassed && (
          <div style={{ color: "var(--green)", fontSize: "0.75rem", fontWeight: 600 }}>
            🎉 CHALLENGE COMPLETED — CERTIFICATE AVAILABLE IN HOME
          </div>
        )}
      </div>

      {!activeAccount && (
        <div 
          className="card" 
          style={{ 
            padding: "3rem 2rem", 
            textAlign: "center", 
            border: "1px dashed var(--border-soft)", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center",
            gap: "1rem"
          }}
        >
          <span style={{ fontSize: "3rem" }}>🔒</span>
          <h3 style={{ fontWeight: 600, color: "var(--text-1)" }}>Desk Locked</h3>
          <p style={{ color: "var(--text-3)", fontSize: "0.8125rem", maxWidth: "450px", lineHeight: 1.5 }}>
            To place simulated trades and complete the evaluation challenge, you must first purchase a challenge account.
          </p>
          <a href="/challenges" className="btn btn-blue btn-sm" style={{ textDecoration: "none" }}>Browse Challenges</a>
        </div>
      )}

      {activeAccount && (
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: activeTab === "F&O" ? "1fr 310px" : "270px 1fr 310px", 
            gap: "1.25rem",
            opacity: (isFailed || isPassed) ? 0.65 : 1
          }} 
          className="mobile-1col"
        >
          {activeTab === "STOCKS" ? (
            <>
              {/* Column 1: Watchlist & Search */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="card" style={{ padding: "1rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  
                  {/* Stocks vs F&O Tab Toggle */}
                  <div style={{ display: "flex", borderBottom: "1px solid var(--border-soft)", marginBottom: "0.75rem" }}>
                    <button
                      onClick={() => { setActiveTab("STOCKS"); setChartMode("CHART"); setSelectedOption(null); }}
                      style={{
                        flex: 1, padding: "0.5rem", border: "none", background: "transparent",
                        color: activeTab === "STOCKS" ? "var(--green)" : "var(--text-3)",
                        borderBottom: activeTab === "STOCKS" ? "2px solid var(--green)" : "none",
                        fontWeight: 700, cursor: "pointer", fontSize: "0.75rem"
                      }}
                    >
                      STOCKS
                    </button>
                    <button
                      onClick={() => { setActiveTab("F&O"); setChartMode("OPTION_CHAIN"); }}
                      style={{
                        flex: 1, padding: "0.5rem", border: "none", background: "transparent",
                        color: (activeTab as string) === "F&O" ? "var(--green)" : "var(--text-3)",
                        borderBottom: (activeTab as string) === "F&O" ? "2px solid var(--green)" : "none",
                        fontWeight: 700, cursor: "pointer", fontSize: "0.75rem"
                      }}
                    >
                      F&amp;O (Options)
                    </button>
                  </div>

                  {/* Groww-style search bar */}
                  <input
                    type="text"
                    placeholder="🔍 Search stocks, indices..."
                    className="form-input"
                    style={{ fontSize: "0.75rem", padding: "0.5rem 0.75rem", marginBottom: "0.75rem", borderRadius: "var(--radius-sm)" }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", overflowY: "auto", maxHeight: "400px" }}>
                    {filteredAssets.map((asset) => {
                      const price = livePrices[asset.symbol];
                      const isSelected = selectedAsset.symbol === asset.symbol;
                      const trend = priceTrends[asset.symbol];
                      
                      return (
                        <div 
                          key={asset.symbol}
                          onClick={() => {
                            setSelectedAsset(asset);
                            setSelectedOption(null);
                            if ((activeTab as string) === "F&O") {
                              setChartMode("OPTION_CHAIN");
                            } else {
                              setChartMode("CHART");
                            }
                          }}
                          style={{
                            padding: "0.625rem 0.75rem",
                            borderRadius: "var(--radius-sm)",
                            background: isSelected ? "rgba(34,197,94,0.06)" : "transparent",
                            border: `1px solid ${isSelected ? "rgba(34,197,94,0.3)" : "var(--border-soft)"}`,
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.015)";
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-1)" }}>{asset.value}</div>
                            <div style={{ fontSize: "0.625rem", color: "var(--text-3)", marginTop: "0.1rem" }}>{asset.type}</div>
                          </div>

                          <div style={{ textAlign: "right" }}>
                            <div 
                              style={{ 
                                fontSize: "0.75rem", 
                                fontWeight: 700, 
                                color: trend === "up" ? "var(--green)" : trend === "down" ? "var(--red)" : "var(--text-1)",
                                transition: "color 0.2s"
                              }}
                            >
                              ₹{price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {filteredAssets.length === 0 && (
                      <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", textAlign: "center", padding: "1rem" }}>
                        No matching instruments found.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Column 2: Chart or Option Chain / Tabular desk */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", minWidth: 0 }}>
                
                {/* Chart / Option Chain switcher */}
                <div className="card" style={{ padding: "0.5rem", display: "flex", gap: "0.5rem", borderRadius: "var(--radius-sm)" }}>
                  <button
                    onClick={() => setChartMode("CHART")}
                    className={`btn btn-sm ${chartMode === "CHART" ? "btn-blue" : "btn-ghost"}`}
                    style={{ flex: 1, fontSize: "0.75rem" }}
                  >
                    📊 Technical Chart
                  </button>
                  
                  {(activeTab as string) === "F&O" && (
                    <button
                      onClick={() => setChartMode("OPTION_CHAIN")}
                      className={`btn btn-sm ${chartMode === "OPTION_CHAIN" ? "btn-blue" : "btn-ghost"}`}
                      style={{ flex: 1, fontSize: "0.75rem" }}
                    >
                      🔗 Option Chain (CE / PE)
                    </button>
                  )}
                </div>

                <div style={{ height: "450px" }}>
                  {chartMode === "CHART" ? (
                    <TradingViewChart symbol={selectedAsset.tvSymbol} />
                  ) : (
                    <OptionChain 
                      symbolName={selectedAsset.value} 
                      indexPrice={activeSpotPrice} 
                      onSelectContract={handleSelectOptionContract}
                      onSelectIndex={(name) => {
                        const found = assets.find(a => a.value === name);
                        if (found) {
                          setSelectedAsset(found);
                          setSelectedOption(null);
                        }
                      }}
                    />
                  )}
                </div>

                {/* Holdings & Positions Manager */}
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  
                  {/* Positions / Holdings toggle tabs */}
                  <div style={{ borderBottom: "1px solid var(--border-soft)", background: "rgba(255,255,255,0.015)", display: "flex", padding: "0 1rem" }}>
                    <button
                      onClick={() => setBottomTab("POSITIONS")}
                      style={{
                        border: "none", background: "transparent", padding: "1rem 0.75rem",
                        color: bottomTab === "POSITIONS" ? "var(--green)" : "var(--text-3)",
                        borderBottom: bottomTab === "POSITIONS" ? "2px solid var(--green)" : "none",
                        fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer"
                      }}
                    >
                      Positions ({positions.length})
                    </button>
                    <button
                      onClick={() => setBottomTab("HOLDINGS")}
                      style={{
                        border: "none", background: "transparent", padding: "1rem 0.75rem",
                        color: bottomTab === "HOLDINGS" ? "var(--green)" : "var(--text-3)",
                        borderBottom: bottomTab === "HOLDINGS" ? "2px solid var(--green)" : "none",
                        fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer"
                      }}
                    >
                      Holdings (CNC Stocks)
                    </button>
                  </div>

                  {bottomTab === "POSITIONS" ? (
                    <div style={{ overflowX: "auto" }}>
                      <table className="trades-table">
                        <thead>
                          <tr>
                            <th>Instrument</th>
                            <th>Type</th>
                            <th>Qty</th>
                            <th>Avg Cost</th>
                            <th>LTP</th>
                            <th>Returns P&amp;L</th>
                            <th style={{ textAlign: "center" }}>Square Off</th>
                          </tr>
                        </thead>
                        <tbody>
                          {positions.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-3)", fontSize: "0.75rem" }}>
                                No open trading positions. Place orders to execute trades.
                              </td>
                            </tr>
                          ) : (
                            positions.map((pos) => {
                              const ltp = getLivePositionPrice(pos);
                              const diff = pos.direction === "BUY" ? ltp - pos.entryPrice : pos.entryPrice - ltp;
                              const pnlVal = diff * pos.quantity * pos.multiplier;

                              return (
                                <tr key={pos.id}>
                                  <td style={{ fontWeight: 600 }}>{pos.symbol}</td>
                                  <td>
                                    <span className={`badge ${pos.direction === "BUY" ? "badge-green" : "badge-red"}`} style={{ fontSize: "0.55rem" }}>
                                      {pos.direction} ({pos.productType})
                                    </span>
                                  </td>
                                  <td>{pos.quantity}</td>
                                  <td style={{ fontSize: "0.75rem" }}>₹{pos.entryPrice.toFixed(2)}</td>
                                  <td style={{ fontSize: "0.75rem" }}>₹{ltp.toFixed(2)}</td>
                                  <td style={{ fontWeight: 700, color: pnlVal >= 0 ? "var(--green)" : "var(--red)", fontSize: "0.75rem" }}>
                                    {pnlVal >= 0 ? "+" : ""}₹{Math.round(pnlVal).toLocaleString("en-IN")}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <button
                                      disabled={submitting}
                                      onClick={() => handleClosePosition(pos)}
                                      className="btn btn-ghost btn-sm"
                                      style={{ padding: "0.2rem 0.5rem", fontSize: "0.6875rem", color: "var(--red)", borderColor: "rgba(239,68,68,0.2)" }}
                                    >
                                      Exit
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table className="trades-table">
                        <thead>
                          <tr>
                            <th>Stock</th>
                            <th>Qty</th>
                            <th>Avg Cost</th>
                            <th>Total Cost</th>
                            <th>Current Price</th>
                            <th>Total Returns</th>
                            <th style={{ textAlign: "center" }}>Exit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {holdings.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-3)", fontSize: "0.75rem" }}>
                                No stock holdings yet. Buy equity shares using CNC (Delivery) to build holdings.
                              </td>
                            </tr>
                          ) : (
                            holdings.map((hold) => {
                              const asset = assets.find((a) => a.value === hold.symbol || a.symbol === hold.symbol);
                              const livePrice = asset ? livePrices[asset.symbol] : hold.avgCost;
                              const totalCostAmt = hold.avgCost * hold.qty;
                              const currentValueAmt = livePrice * hold.qty;
                              const returnsAmt = currentValueAmt - totalCostAmt;

                              return (
                                <tr key={hold.id}>
                                  <td style={{ fontWeight: 600 }}>{hold.symbol}</td>
                                  <td>{hold.qty}</td>
                                  <td style={{ fontSize: "0.75rem" }}>₹{hold.avgCost.toFixed(2)}</td>
                                  <td style={{ fontSize: "0.75rem" }}>₹{totalCostAmt.toLocaleString("en-IN")}</td>
                                  <td style={{ fontSize: "0.75rem" }}>₹{livePrice.toFixed(2)}</td>
                                  <td style={{ fontWeight: 700, color: returnsAmt >= 0 ? "var(--green)" : "var(--red)", fontSize: "0.75rem" }}>
                                    {returnsAmt >= 0 ? "+" : ""}₹{Math.round(returnsAmt).toLocaleString("en-IN")}
                                  </td>
                                  <td style={{ textAlign: "center" }}>
                                    <button
                                      disabled={submitting}
                                      onClick={() => handleSellHolding(hold)}
                                      className="btn btn-ghost btn-sm"
                                      style={{ padding: "0.2rem 0.5rem", fontSize: "0.6875rem", color: "var(--red)", borderColor: "rgba(239,68,68,0.2)" }}
                                    >
                                      Sell
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            /* Column 1+2 Merged F&O Desk: Angel One Dashboard Layout */
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", minWidth: 0 }}>
              
              {/* Watchlist Quick selector pills & Spot card */}
              <div className="card" style={{ padding: "1.25rem" }}>
                
                {/* Watchlist index switch tabs */}
                <div style={{ display: "flex", borderBottom: "1px solid var(--border-soft)", marginBottom: "0.75rem" }}>
                  <button
                    onClick={() => { setActiveTab("STOCKS"); setChartMode("CHART"); setSelectedOption(null); }}
                    style={{
                      padding: "0.5rem 1rem", border: "none", background: "transparent",
                      color: (activeTab as string) === "STOCKS" ? "var(--green)" : "var(--text-3)",
                      borderBottom: (activeTab as string) === "STOCKS" ? "2px solid var(--green)" : "none",
                      fontWeight: 700, cursor: "pointer", fontSize: "0.75rem"
                    }}
                  >
                    STOCKS
                  </button>
                  <button
                    onClick={() => { setActiveTab("F&O"); setChartMode("OPTION_CHAIN"); }}
                    style={{
                      padding: "0.5rem 1rem", border: "none", background: "transparent",
                      color: activeTab === "F&O" ? "var(--green)" : "var(--text-3)",
                      borderBottom: activeTab === "F&O" ? "2px solid var(--green)" : "none",
                      fontWeight: 700, cursor: "pointer", fontSize: "0.75rem"
                    }}
                  >
                    F&amp;O (Options)
                  </button>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-1)" }}>
                    F&amp;O watchlists
                  </span>
                  <span style={{ fontSize: "0.6875rem", color: "var(--text-3)" }}>
                    Expiry: <span style={{ color: "var(--yellow)", fontWeight: 600 }}>30 Jun 2026 (Weekly)</span>
                  </span>
                </div>

                {/* Index Pills */}
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  {assets.filter(a => a.type === "INDEX").map((indexAsset) => {
                    const isSelected = selectedAsset.symbol === indexAsset.symbol;
                    return (
                      <button
                        key={indexAsset.symbol}
                        type="button"
                        onClick={() => { setSelectedAsset(indexAsset); setSelectedOption(null); }}
                        style={{
                          padding: "0.5rem 1rem",
                          borderRadius: "var(--radius-md)",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          background: isSelected ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.02)",
                          color: isSelected ? "var(--blue-400)" : "var(--text-3)",
                          border: `1px solid ${isSelected ? "var(--blue-400)" : "var(--border-soft)"}`,
                          transition: "all 0.2s"
                        }}
                      >
                        {indexAsset.value}
                      </button>
                    );
                  })}
                </div>

                {/* Spot Card details */}
                <div 
                  style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    padding: "0.85rem 1.25rem", 
                    background: "rgba(0,0,0,0.2)", 
                    borderRadius: "var(--radius-sm)", 
                    border: "1px solid var(--border-soft)" 
                  }}
                  className="mobile-1col"
                >
                  <div>
                    <span style={{ fontSize: "0.6875rem", color: "var(--text-3)", display: "block", textTransform: "uppercase", fontWeight: 600 }}>Spot Market Price</span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-1)", marginTop: "0.15rem", display: "inline-block" }}>
                      {selectedAsset.value} Spot
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="mobile-1col">
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-1)" }}>
                        ₹{activeSpotPrice.toLocaleString("en-IN")}
                      </span>
                      <span style={{ fontSize: "0.6875rem", color: "var(--green)", display: "block", marginTop: "0.1rem", fontWeight: 600 }}>
                        +₹50.50 (+0.21%)
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => setChartMode("CHART")}
                        className={`btn btn-sm ${chartMode === "CHART" ? "btn-blue" : "btn-ghost"}`}
                        style={{ fontSize: "0.6875rem", padding: "0.35rem 0.75rem" }}
                      >
                        📊 CHARTS
                      </button>
                      <button
                        onClick={() => setChartMode("OPTION_CHAIN")}
                        className={`btn btn-sm ${chartMode === "OPTION_CHAIN" ? "btn-blue" : "btn-ghost"}`}
                        style={{ fontSize: "0.6875rem", padding: "0.35rem 0.75rem" }}
                      >
                        🔗 OPTION CHAIN
                      </button>
                      <button
                        onClick={() => setChartMode("WATCHLIST")}
                        className={`btn btn-sm ${chartMode === "WATCHLIST" ? "btn-blue" : "btn-ghost"}`}
                        style={{ fontSize: "0.6875rem", padding: "0.35rem 0.75rem" }}
                      >
                        📋 WATCHLIST
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Technical Chart OR Dynamic Option Chain OR Side-by-side Watchlist */}
              {chartMode === "CHART" && (
                <div style={{ height: "450px" }}>
                  <TradingViewChart symbol={selectedAsset.tvSymbol} />
                </div>
              )}

              {chartMode === "OPTION_CHAIN" && (
                <OptionChain 
                  symbolName={selectedAsset.value} 
                  indexPrice={activeSpotPrice} 
                  onSelectContract={handleSelectOptionContract}
                  onSelectIndex={(name) => {
                    const found = assets.find(a => a.value === name);
                    if (found) {
                      setSelectedAsset(found);
                      setSelectedOption(null);
                    }
                  }}
                />
              )}

              {chartMode === "WATCHLIST" && (
                /* Calls vs Puts side-by-side Watchlist grid */
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }} className="mobile-1col">
                  
                  {/* Call options left card */}
                  <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "0.85rem 1.25rem", background: "rgba(34,197,94,0.03)", borderBottom: "1px solid var(--border-soft)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ background: "rgba(34,197,94,0.15)", color: "var(--green)", padding: "0.15rem 0.35rem", borderRadius: "var(--radius-xs)", fontSize: "0.625rem", fontWeight: 700 }}>CE</span>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--green)" }}>Call Options Watchlist</span>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                        <thead>
                          <tr style={{ background: "rgba(255,255,255,0.01)", borderBottom: "1px solid var(--border-soft)", color: "var(--text-3)", textAlign: "left" }}>
                            <th style={{ padding: "0.625rem 1rem" }}>Options</th>
                            <th style={{ padding: "0.625rem 1rem" }}>LTP</th>
                            <th style={{ padding: "0.625rem 1rem", textAlign: "right" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getStrikeListForDashboard().map((row) => {
                            const isAtm = row.strike === atmStrike;
                            const isItm = row.strike < activeSpotPrice;
                            const badgeColor = isAtm ? "rgba(168,85,247,0.15)" : isItm ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)";
                            const badgeTextColor = isAtm ? "var(--purple-400)" : isItm ? "var(--green)" : "var(--text-3)";
                            const badgeText = isAtm ? "ATM" : isItm ? "ITM" : "OTM";
                            
                            return (
                              <tr key={row.strike} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                                <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span>{prefix} {row.strike} CE</span>
                                    <span style={{ background: badgeColor, color: badgeTextColor, padding: "0.1rem 0.3rem", borderRadius: "var(--radius-xs)", fontSize: "0.55rem", fontWeight: 700 }}>
                                      {badgeText}
                                    </span>
                                  </div>
                                </td>
                                <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>
                                  ₹{row.callLtp.toFixed(2)}
                                </td>
                                <td style={{ padding: "0.5rem 1rem", textAlign: "right" }}>
                                  <button
                                    type="button"
                                    onClick={() => handleSelectOptionContract(`${prefix} ${row.strike} CE`, row.callLtp, "BUY")}
                                    className="btn btn-ghost btn-sm"
                                    style={{ padding: "0.2rem 0.5rem", fontSize: "0.6875rem", color: "var(--green)", borderColor: "rgba(34,197,94,0.3)" }}
                                  >
                                    Trade
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Put options right card */}
                  <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "0.85rem 1.25rem", background: "rgba(239,68,68,0.03)", borderBottom: "1px solid var(--border-soft)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ background: "rgba(239,68,68,0.15)", color: "var(--red)", padding: "0.15rem 0.35rem", borderRadius: "var(--radius-xs)", fontSize: "0.625rem", fontWeight: 700 }}>PE</span>
                      <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--red)" }}>Put Options Watchlist</span>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                        <thead>
                          <tr style={{ background: "rgba(255,255,255,0.01)", borderBottom: "1px solid var(--border-soft)", color: "var(--text-3)", textAlign: "left" }}>
                            <th style={{ padding: "0.625rem 1rem" }}>Options</th>
                            <th style={{ padding: "0.625rem 1rem" }}>LTP</th>
                            <th style={{ padding: "0.625rem 1rem", textAlign: "right" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getStrikeListForDashboard().map((row) => {
                            const isAtm = row.strike === atmStrike;
                            const isItm = row.strike > activeSpotPrice;
                            const badgeColor = isAtm ? "rgba(168,85,247,0.15)" : isItm ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)";
                            const badgeTextColor = isAtm ? "var(--purple-400)" : isItm ? "var(--green)" : "var(--text-3)";
                            const badgeText = isAtm ? "ATM" : isItm ? "ITM" : "OTM";

                            return (
                              <tr key={row.strike} style={{ borderBottom: "1px solid var(--border-soft)" }}>
                                <td style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span>{prefix} {row.strike} PE</span>
                                    <span style={{ background: badgeColor, color: badgeTextColor, padding: "0.1rem 0.3rem", borderRadius: "var(--radius-xs)", fontSize: "0.55rem", fontWeight: 700 }}>
                                      {badgeText}
                                    </span>
                                  </div>
                                </td>
                                <td style={{ padding: "0.75rem 1rem", fontWeight: 700 }}>
                                  ₹{row.putLtp.toFixed(2)}
                                </td>
                                <td style={{ padding: "0.5rem 1rem", textAlign: "right" }}>
                                  <button
                                    type="button"
                                    onClick={() => handleSelectOptionContract(`${prefix} ${row.strike} PE`, row.putLtp, "BUY")}
                                    className="btn btn-ghost btn-sm"
                                    style={{ padding: "0.2rem 0.5rem", fontSize: "0.6875rem", color: "var(--red)", borderColor: "rgba(239,68,68,0.3)" }}
                                  >
                                    Trade
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* Bottom positions log */}
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                
                {/* Positions / Holdings toggle tabs */}
                <div style={{ borderBottom: "1px solid var(--border-soft)", background: "rgba(255,255,255,0.015)", display: "flex", padding: "0 1rem" }}>
                  <button
                    onClick={() => setBottomTab("POSITIONS")}
                    style={{
                      border: "none", background: "transparent", padding: "1rem 0.75rem",
                      color: bottomTab === "POSITIONS" ? "var(--green)" : "var(--text-3)",
                      borderBottom: bottomTab === "POSITIONS" ? "2px solid var(--green)" : "none",
                      fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer"
                    }}
                  >
                    Positions ({positions.length})
                  </button>
                  <button
                    onClick={() => setBottomTab("HOLDINGS")}
                    style={{
                      border: "none", background: "transparent", padding: "1rem 0.75rem",
                      color: bottomTab === "HOLDINGS" ? "var(--green)" : "var(--text-3)",
                      borderBottom: bottomTab === "HOLDINGS" ? "2px solid var(--green)" : "none",
                      fontWeight: 600, fontSize: "0.8125rem", cursor: "pointer"
                    }}
                  >
                    Holdings (CNC Stocks)
                  </button>
                </div>

                {bottomTab === "POSITIONS" ? (
                  <div style={{ overflowX: "auto" }}>
                    <table className="trades-table">
                      <thead>
                        <tr>
                          <th>Instrument</th>
                          <th>Type</th>
                          <th>Qty</th>
                          <th>Avg Cost</th>
                          <th>LTP</th>
                          <th>Returns P&amp;L</th>
                          <th style={{ textAlign: "center" }}>Square Off</th>
                        </tr>
                      </thead>
                      <tbody>
                        {positions.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-3)", fontSize: "0.75rem" }}>
                              No open trading positions. Place orders to execute trades.
                            </td>
                          </tr>
                        ) : (
                          positions.map((pos) => {
                            const ltp = getLivePositionPrice(pos);
                            const diff = pos.direction === "BUY" ? ltp - pos.entryPrice : pos.entryPrice - ltp;
                            const pnlVal = diff * pos.quantity * pos.multiplier;

                            return (
                              <tr key={pos.id}>
                                <td style={{ fontWeight: 600 }}>{pos.symbol}</td>
                                <td>
                                  <span className={`badge ${pos.direction === "BUY" ? "badge-green" : "badge-red"}`} style={{ fontSize: "0.55rem" }}>
                                    {pos.direction} ({pos.productType})
                                  </span>
                                </td>
                                <td>{pos.quantity}</td>
                                <td style={{ fontSize: "0.75rem" }}>₹{pos.entryPrice.toFixed(2)}</td>
                                <td style={{ fontSize: "0.75rem" }}>₹{ltp.toFixed(2)}</td>
                                <td style={{ fontWeight: 700, color: pnlVal >= 0 ? "var(--green)" : "var(--red)", fontSize: "0.75rem" }}>
                                  {pnlVal >= 0 ? "+" : ""}₹{Math.round(pnlVal).toLocaleString("en-IN")}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <button
                                    disabled={submitting}
                                    onClick={() => handleClosePosition(pos)}
                                    className="btn btn-ghost btn-sm"
                                    style={{ padding: "0.2rem 0.5rem", fontSize: "0.6875rem", color: "var(--red)", borderColor: "rgba(239,68,68,0.2)" }}
                                  >
                                    Exit
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table className="trades-table">
                      <thead>
                        <tr>
                          <th>Stock</th>
                          <th>Qty</th>
                          <th>Avg Cost</th>
                          <th>Total Cost</th>
                          <th>Current Price</th>
                          <th>Total Returns</th>
                          <th style={{ textAlign: "center" }}>Exit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {holdings.length === 0 ? (
                          <tr>
                            <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-3)", fontSize: "0.75rem" }}>
                              No stock holdings yet. Buy equity shares using CNC (Delivery) to build holdings.
                            </td>
                          </tr>
                        ) : (
                          holdings.map((hold) => {
                            const asset = assets.find((a) => a.value === hold.symbol || a.symbol === hold.symbol);
                            const livePrice = asset ? livePrices[asset.symbol] : hold.avgCost;
                            const totalCostAmt = hold.avgCost * hold.qty;
                            const currentValueAmt = livePrice * hold.qty;
                            const returnsAmt = currentValueAmt - totalCostAmt;

                            return (
                              <tr key={hold.id}>
                                <td style={{ fontWeight: 600 }}>{hold.symbol}</td>
                                <td>{hold.qty}</td>
                                <td style={{ fontSize: "0.75rem" }}>₹{hold.avgCost.toFixed(2)}</td>
                                <td style={{ fontSize: "0.75rem" }}>₹{totalCostAmt.toLocaleString("en-IN")}</td>
                                <td style={{ fontSize: "0.75rem" }}>₹{livePrice.toFixed(2)}</td>
                                <td style={{ fontWeight: 700, color: returnsAmt >= 0 ? "var(--green)" : "var(--red)", fontSize: "0.75rem" }}>
                                  {returnsAmt >= 0 ? "+" : ""}₹{Math.round(returnsAmt).toLocaleString("en-IN")}
                                </td>
                                <td style={{ textAlign: "center" }}>
                                  <button
                                    disabled={submitting}
                                    onClick={() => handleSellHolding(hold)}
                                    className="btn btn-ghost btn-sm"
                                    style={{ padding: "0.2rem 0.5rem", fontSize: "0.6875rem", color: "var(--red)", borderColor: "rgba(239,68,68,0.2)" }}
                                  >
                                    Sell
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Column 3: Groww-style order executing panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div 
              className="card" 
              style={{ 
                padding: 0, 
                overflow: "hidden",
                border: `1px solid ${direction === "BUY" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`
              }}
            >
              
              {/* Color coded action header */}
              <div 
                style={{ 
                  background: direction === "BUY" ? "var(--green)" : "var(--red)", 
                  padding: "0.85rem 1.25rem", 
                  color: "white", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center" 
                }}
              >
                <div>
                  <span style={{ fontSize: "0.625rem", opacity: 0.8, textTransform: "uppercase", fontWeight: 700, display: "block" }}>Order Sheet</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                    {selectedOption ? selectedOption.name : selectedAsset.value}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                  <button 
                    onClick={() => setDirection("BUY")}
                    style={{
                      background: direction === "BUY" ? "white" : "transparent",
                      color: direction === "BUY" ? "var(--green)" : "white",
                      border: "1px solid white", padding: "0.15rem 0.5rem", fontSize: "0.625rem", borderRadius: "var(--radius-xs)", fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    BUY
                  </button>
                  <button 
                    onClick={() => setDirection("SELL")}
                    style={{
                      background: direction === "SELL" ? "white" : "transparent",
                      color: direction === "SELL" ? "var(--red)" : "white",
                      border: "1px solid white", padding: "0.15rem 0.5rem", fontSize: "0.625rem", borderRadius: "var(--radius-xs)", fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    SELL
                  </button>
                </div>
              </div>

              <form onSubmit={handlePlaceOrder} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                
                {/* Delivery (CNC) vs Intraday (MIS) selector */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Product Type</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      disabled={!!selectedOption} // Options can only be MIS/Intraday for compliance
                      onClick={() => setProductType("CNC")}
                      style={{
                        flex: 1, padding: "0.5rem", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", cursor: "pointer",
                        background: productType === "CNC" ? "rgba(34,197,94,0.08)" : "transparent",
                        color: productType === "CNC" ? "var(--green)" : "var(--text-3)",
                        border: `1px solid ${productType === "CNC" ? "var(--green)" : "var(--border-soft)"}`,
                        fontWeight: 700
                      }}
                    >
                      Delivery (CNC)
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductType("MIS")}
                      style={{
                        flex: 1, padding: "0.5rem", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", cursor: "pointer",
                        background: productType === "MIS" ? "rgba(34,197,94,0.08)" : "transparent",
                        color: productType === "MIS" ? "var(--green)" : "var(--text-3)",
                        border: `1px solid ${productType === "MIS" ? "var(--green)" : "var(--border-soft)"}`,
                        fontWeight: 700
                      }}
                    >
                      Intraday (MIS)
                    </button>
                  </div>
                </div>

                {/* Market vs Limit price switcher */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: "0.75rem" }}>Price Type</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => setPriceType("MARKET")}
                      style={{
                        flex: 1, padding: "0.5rem", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", cursor: "pointer",
                        background: priceType === "MARKET" ? "rgba(255,255,255,0.02)" : "transparent",
                        color: priceType === "MARKET" ? "var(--text-1)" : "var(--text-3)",
                        border: `1px solid ${priceType === "MARKET" ? "var(--text-1)" : "var(--border-soft)"}`,
                        fontWeight: 600
                      }}
                    >
                      Market
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPriceType("LIMIT"); setLimitPrice(executionPrice.toFixed(2)); }}
                      style={{
                        flex: 1, padding: "0.5rem", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", cursor: "pointer",
                        background: priceType === "LIMIT" ? "rgba(255,255,255,0.02)" : "transparent",
                        color: priceType === "LIMIT" ? "var(--text-1)" : "var(--text-3)",
                        border: `1px solid ${priceType === "LIMIT" ? "var(--text-1)" : "var(--border-soft)"}`,
                        fontWeight: 600
                      }}
                    >
                      Limit
                    </button>
                  </div>
                </div>

                {/* Order size and price inputs */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Quantity</label>
                    <input
                      type="number"
                      className="form-input"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Price (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={priceType === "MARKET" ? executionPrice.toFixed(2) : limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      disabled={priceType === "MARKET"}
                      step="0.05"
                      required
                    />
                  </div>
                </div>

                {/* Details Footer */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", padding: "0.625rem 0.75rem", background: "rgba(255,255,255,0.015)", border: "1px solid var(--border-soft)", borderRadius: "var(--radius-sm)", fontSize: "0.6875rem", color: "var(--text-3)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Available Balance:</span>
                    <span style={{ fontWeight: 600, color: "var(--text-1)" }}>₹{Math.round(balance).toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Required Margin:</span>
                    <span style={{ fontWeight: 600, color: "var(--green)" }}>
                      ₹{Math.round(
                        executionPrice * parseFloat(quantity || "0") * (selectedOption ? 1 : selectedAsset.multiplier) * (productType === "MIS" && !selectedOption ? 0.2 : 1)
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isFailed || isPassed}
                  style={{
                    background: direction === "BUY" ? "var(--green)" : "var(--red)",
                    color: "white", border: "none", padding: "0.75rem", fontSize: "0.8125rem", fontWeight: 700, borderRadius: "var(--radius-sm)", cursor: "pointer",
                    transition: "opacity 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                >
                  {isFailed || isPassed ? "Desk Locked" : `${direction === "BUY" ? "BUY" : "SELL"} ${selectedOption ? selectedOption.name : selectedAsset.value}`}
                </button>

              </form>
            </div>
          </div>
        </div>
      )}

      {/* Closed positions history logs */}
      {activeAccount && (
        <div className="card" style={{ padding: 0, overflow: "hidden", marginTop: "1.25rem" }}>
          <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-soft)", fontSize: "0.875rem", fontWeight: 600 }}>
            Closed Positions Log
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="trades-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Symbol</th>
                  <th>Direction</th>
                  <th>Entry Price</th>
                  <th>Exit Price</th>
                  <th>Fulfill P&amp;L</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-3)", fontSize: "0.75rem" }}>
                      No closed orders found in the history log.
                    </td>
                  </tr>
                ) : (
                  history.map((h) => {
                    const isProfit = h.pnl.startsWith("+");
                    const dateStr = new Date(h.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                    });
                    return (
                      <tr key={h.id}>
                        <td style={{ fontSize: "0.75rem", color: "var(--text-2)" }}>{dateStr}</td>
                        <td style={{ fontWeight: 600 }}>{h.symbol}</td>
                        <td>
                          <span className={`badge ${h.direction === "BUY" ? "badge-green" : "badge-red"}`} style={{ fontSize: "0.55rem" }}>
                            {h.direction}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.75rem" }}>₹{parseFloat(h.entry).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td style={{ fontSize: "0.75rem" }}>₹{parseFloat(h.exit).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                        <td style={{ fontWeight: 700, color: isProfit ? "var(--green)" : "var(--red)", fontSize: "0.75rem" }}>
                          {h.pnl}
                        </td>
                        <td style={{ fontSize: "0.6875rem", color: "var(--text-3)", maxWidth: "220px", whiteSpace: "normal" }}>
                          {h.notes}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
