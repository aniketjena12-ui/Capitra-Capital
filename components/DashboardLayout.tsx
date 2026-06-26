"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const sidebarNav = [
  { href: "/dashboard",          icon: "📊", label: "Overview"   },
  { href: "/dashboard/journal",  icon: "📋", label: "Journal"    },
  { href: "/dashboard/payouts",  icon: "💸", label: "Payouts"    },
  { href: "/dashboard/kyc",      icon: "🪪", label: "KYC"        },
  { href: "/dashboard/settings", icon: "⚙️", label: "Settings"   },
];

const quickLinks = [
  { href: "/challenges", icon: "🏆", label: "Challenges" },
  { href: "/rules",      icon: "📖", label: "Rules"      },
  { href: "/faq",        icon: "❓", label: "FAQ"        },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  activePlan?: {
    planName: string;
    initialBalance: number;
    status: string;
  } | null;
}

export default function DashboardLayout({ 
  children, 
  title, 
  subtitle,
  activePlan: activePlanProp
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [activePlan, setActivePlan] = useState<{ planName: string; initialBalance: number; status: string } | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const isAdmin = session?.user?.email === "admin@capitracapital.com";

  useEffect(() => {
    if (activePlanProp !== undefined) {
      setActivePlan(activePlanProp);
      setLoadingPlan(false);
    } else {
      // Fallback: Fetch from payouts API (which returns activeAccount)
      fetch("/api/payouts")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.activeAccount) {
            setActivePlan({
              planName: data.activeAccount.planName,
              initialBalance: data.activeAccount.initialBalance,
              status: data.activeAccount.status,
            });
          }
        })
        .catch(() => {})
        .finally(() => setLoadingPlan(false));
    }
  }, [activePlanProp]);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-section">
          <div className="sidebar-label">Trader</div>
          {sidebarNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item${pathname === item.href ? " active" : ""}`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin/payouts"
              className={`sidebar-nav-item${pathname === "/admin/payouts" ? " active" : ""}`}
              style={{ borderLeft: "2px solid var(--yellow)" }}
            >
              <span className="sidebar-icon">👑</span>
              Admin Console
            </Link>
          )}
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Platform</div>
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href} className="sidebar-nav-item">
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <Link href="/api/auth/signout" className="sidebar-nav-item" style={{ color: "#f87171" }}>
            <span className="sidebar-icon">🚪</span>
            Logout
          </Link>
        </div>

        {/* Dynamic Plan Badge */}
        {!loadingPlan && (
          <div style={{ marginTop: "auto", padding: "1rem" }}>
            {activePlan ? (
              <div className="sidebar-plan-badge">
                <div className="sidebar-plan-name">{activePlan.planName} Plan</div>
                <div className="sidebar-plan-detail">₹{activePlan.initialBalance.toLocaleString("en-IN")} Account</div>
                <div className="sidebar-plan-status">
                  <span className="status-dot" style={{ background: activePlan.status === "ACTIVE" ? "var(--green)" : "var(--red)" }} />
                  {activePlan.status === "ACTIVE" ? "Active" : activePlan.status}
                </div>
              </div>
            ) : (
              <div className="sidebar-plan-badge" style={{ background: "rgba(239, 68, 68, 0.05)", borderColor: "rgba(239, 68, 68, 0.15)" }}>
                <div className="sidebar-plan-name" style={{ color: "var(--red)", fontSize: "0.8125rem" }}>No Active Challenge</div>
                <div className="sidebar-plan-detail">Pass evaluation to start</div>
                <div className="sidebar-plan-status" style={{ color: "var(--text-3)" }}>
                  Inactive
                </div>
              </div>
            )}
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="dashboard-main">
        {(title || subtitle) && (
          <div className="dash-page-header">
            {title && <h1 className="dash-page-title">{title}</h1>}
            {subtitle && <p className="dash-page-sub">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
