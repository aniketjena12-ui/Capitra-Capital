"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

const PLANS: Record<string, { name: string; price: number; account: string; features: string[] }> = {
  starter: {
    name: "Starter",
    price: 999,
    account: "₹1,00,000 Account",
    features: ["8% Profit Target", "5% Max Drawdown", "80% Profit Split", "Weekly Payouts"],
  },
  professional: {
    name: "Professional",
    price: 2999,
    account: "₹5,00,000 Account",
    features: ["8% Profit Target", "5% Max Drawdown", "80% Profit Split", "Priority Support", "Bi-weekly Payouts"],
  },
  elite: {
    name: "Elite",
    price: 4999,
    account: "₹10,00,000 Account",
    features: ["8% Profit Target", "5% Max Drawdown", "80% Profit Split", "Dedicated Manager", "Daily Payouts"],
  },
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan: planKey = "professional" } = use(searchParams);
  const plan = PLANS[planKey] || PLANS.professional;
  const router = useRouter();
  const { toast } = useToast();
  const [paying, setPaying] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  async function handlePayment() {
    if (!scriptLoaded) { toast("Payment gateway loading… please wait.", "info"); return; }
    setPaying(true);

    try {
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: plan.price, planName: plan.name }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) { toast(order.error || "Failed to create order.", "error"); setPaying(false); return; }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: "INR",
        name: "Capitra Capital",
        description: `${plan.name} Challenge — ${plan.account}`,
        order_id: order.orderId,
        theme: { color: "#2563eb" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            router.push(`/order-confirmed?plan=${planKey}&paymentId=${response.razorpay_payment_id}`);
          } else {
            toast("Payment verification failed. Contact support.", "error");
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast("Something went wrong. Please try again.", "error");
      setPaying(false);
    }
  }

  return (
    <div className="page-wrapper" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
      <div className="checkout-layout">
        {/* Plan Summary */}
        <div className="checkout-plan-card card">
          <div className="section-eyebrow" style={{ marginBottom: "1.25rem" }}>Order Summary</div>
          <div className="plan-tier">{plan.name} Plan</div>
          <div className="plan-price">₹{plan.price.toLocaleString("en-IN")}</div>
          <div className="plan-account-size">{plan.account}</div>
          <div className="plan-divider" />
          <ul className="plan-features">
            {plan.features.map((f) => (
              <li key={f}><span className="feature-check">✓</span>{f}</li>
            ))}
          </ul>
          <div className="plan-divider" />

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--text-2)" }}>Challenge fee</span>
            <span>₹{plan.price.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
            <span style={{ color: "var(--text-2)" }}>GST (18%)</span>
            <span>₹{Math.round(plan.price * 0.18).toLocaleString("en-IN")}</span>
          </div>
          <div className="plan-divider" />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1rem" }}>
            <span>Total</span>
            <span>₹{Math.round(plan.price * 1.18).toLocaleString("en-IN")}</span>
          </div>

          <div style={{ marginTop: "1.25rem", padding: "0.875rem", background: "var(--bg-elevated)", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", color: "var(--text-3)" }}>
            🔒 Secured by Razorpay. All transactions are encrypted.
          </div>
        </div>

        {/* Payment Panel */}
        <div>
          <div className="card" style={{ marginBottom: "1.25rem" }}>
            <div className="section-eyebrow" style={{ marginBottom: "1.25rem" }}>Payment</div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-2)", marginBottom: "1.5rem" }}>
              Click below to open the secure Razorpay checkout. Supports UPI, cards, netbanking & wallets.
            </p>
            <button
              onClick={handlePayment}
              disabled={paying}
              className="btn btn-blue btn-full btn-lg"
            >
              {paying ? "Processing…" : `Pay ₹${Math.round(plan.price * 1.18).toLocaleString("en-IN")} →`}
            </button>
          </div>

          <div className="card">
            <div style={{ fontSize: "0.8125rem", fontWeight: 600, marginBottom: "1rem" }}>What happens next?</div>
            {[
              { icon: "✅", text: "Payment confirmed instantly" },
              { icon: "📧", text: "Account credentials sent to your email" },
              { icon: "📊", text: "Dashboard access within 5 minutes" },
              { icon: "🚀", text: "Start trading immediately" },
            ].map((s) => (
              <div key={s.text} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", fontSize: "0.8125rem", color: "var(--text-2)" }}>
                <span>{s.icon}</span>{s.text}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link href="/challenges" style={{ fontSize: "0.8125rem", color: "var(--text-3)", textDecoration: "none" }}>
              ← Change plan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
