"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarNav = [
  { href: "/dashboard",          icon: "📊", label: "Overview"   },
  { href: "/dashboard/journal",  icon: "📋", label: "Journal"    },
  { href: "/dashboard/payouts",  icon: "💸", label: "Payouts"    },
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
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const pathname = usePathname();

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

        <div className="sidebar-plan-badge">
          <div className="sidebar-plan-name">Professional Plan</div>
          <div className="sidebar-plan-detail">₹5,00,000 Account</div>
          <div className="sidebar-plan-status">
            <span className="status-dot" />
            Active
          </div>
        </div>
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
