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

// Bottom nav shown on mobile — 5 key items
const mobileNav = [
  { href: "/dashboard",          icon: "📊", label: "Overview"  },
  { href: "/dashboard/journal",  icon: "📋", label: "Journal"   },
  { href: "/dashboard/payouts",  icon: "💸", label: "Payouts"   },
  { href: "/dashboard/kyc",      icon: "🪪", label: "KYC"       },
  { href: "/signout",            icon: "🚪", label: "Sign Out", danger: true },
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
  activePlan: activePlanProp,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [activePlan, setActivePlan] = useState<{
    planName: string;
    initialBalance: number;
    status: string;
  } | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const isAdmin = session?.user?.email === "admin@capitracapital.com";

  useEffect(() => {
    if (activePlanProp !== undefined) {
      setActivePlan(activePlanProp);
      setLoadingPlan(false);
    } else {
      fetch("/api/payouts")
        .then((res) => res.json())
        .then((data) => {
          if (data?.activeAccount) {
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
    <>
      <div className="dashboard-layout">
        {/* ── Desktop Sidebar ─────────────────────────────── */}
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
            <Link
              href="/signout"
              className="sidebar-nav-item"
              style={{ color: "#f87171" }}
            >
              <span className="sidebar-icon">🚪</span>
              Sign Out
            </Link>
          </div>

          {/* Plan Badge */}
          {!loadingPlan && (
            <div style={{ marginTop: "auto", padding: "1rem" }}>
              {activePlan ? (
                <div className="sidebar-plan-badge">
                  <div className="sidebar-plan-name">{activePlan.planName} Plan</div>
                  <div className="sidebar-plan-detail">
                    ₹{activePlan.initialBalance.toLocaleString("en-IN")} Account
                  </div>
                  <div className="sidebar-plan-status">
                    <span
                      className="status-dot"
                      style={{
                        background:
                          activePlan.status === "ACTIVE"
                            ? "var(--green)"
                            : "var(--red)",
                      }}
                    />
                    {activePlan.status === "ACTIVE" ? "Active" : activePlan.status}
                  </div>
                </div>
              ) : (
                <div
                  className="sidebar-plan-badge"
                  style={{
                    background: "rgba(239, 68, 68, 0.05)",
                    borderColor: "rgba(239, 68, 68, 0.15)",
                  }}
                >
                  <div
                    className="sidebar-plan-name"
                    style={{ color: "var(--red)", fontSize: "0.8125rem" }}
                  >
                    No Active Challenge
                  </div>
                  <div className="sidebar-plan-detail">Pass evaluation to start</div>
                  <div
                    className="sidebar-plan-status"
                    style={{ color: "var(--text-3)" }}
                  >
                    Inactive
                  </div>
                </div>
              )}
            </div>
          )}
        </aside>

        {/* ── Main Content ─────────────────────────────────── */}
        <main className="dashboard-main">
          {(title || subtitle) && (
            <div className="dash-page-header">
              {title && <h1 className="dash-page-title">{title}</h1>}
              {subtitle && <p className="dash-page-sub">{subtitle}</p>}
            </div>
          )}
          {children}
          {/* Bottom padding on mobile so content isn't hidden behind the nav bar */}
          <div className="mobile-nav-spacer" />
        </main>
      </div>

      {/* ── Mobile Bottom Navigation Bar ─────────────────── */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        {mobileNav.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item${isActive ? " active" : ""}${"danger" in item && item.danger ? " danger" : ""}`}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
