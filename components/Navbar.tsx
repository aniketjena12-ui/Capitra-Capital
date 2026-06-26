"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

const navLinks = [
  { href: "/challenges", label: "Challenges" },
  { href: "/rules", label: "Rules" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/affiliate", label: "Affiliate" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Notification states
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session) {
      fetchNotifications();
      // Poll notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  // Close notifications dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      console.warn("Failed to fetch notifications:", e);
    }
  }

  async function handleMarkRead(id?: string) {
    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (e) {
      console.warn("Failed to update notification status:", e);
    }
  }

  const typeColors: Record<string, string> = {
    SUCCESS: "var(--green)",
    ERROR: "var(--red)",
    WARNING: "var(--yellow)",
    INFO: "var(--blue-500)",
  };

  return (
    <>
      <nav className="navbar" style={{ zIndex: 100 }}>
        <div className="navbar-inner">
          <Link href="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <span className="navbar-brand-dot" />
            Capitra Capital
          </Link>

          <div className="navbar-links navbar-desktop">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={pathname === l.href ? "active" : ""}
              >
                {l.label}
              </Link>
            ))}

            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={pathname?.startsWith("/dashboard") ? "active" : ""}
                  style={{ fontWeight: 600, color: "var(--blue-400)" }}
                >
                  Dashboard
                </Link>

                {/* Notifications Bell Dropdown */}
                <div ref={notifRef} style={{ position: "relative", marginLeft: "0.5rem" }}>
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--text-2)",
                      fontSize: "1.25rem",
                      cursor: "pointer",
                      padding: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative"
                    }}
                    aria-label="Notifications"
                  >
                    🔔
                    {unreadCount > 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: 4,
                          right: 2,
                          background: "var(--red)",
                          color: "white",
                          borderRadius: "50%",
                          fontSize: "0.625rem",
                          fontWeight: 700,
                          minWidth: "14px",
                          height: "14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 2px"
                        }}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        width: "320px",
                        background: "rgba(17, 24, 39, 0.95)",
                        backdropFilter: "blur(16px)",
                        border: "1px solid var(--border-soft)",
                        borderRadius: "var(--radius-md)",
                        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.5)",
                        marginTop: "0.5rem",
                        zIndex: 110,
                        maxHeight: "400px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden"
                      }}
                    >
                      <div
                        style={{
                          padding: "0.75rem 1rem",
                          borderBottom: "1px solid var(--border-soft)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: "0.8125rem", color: "var(--text-1)" }}>Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => handleMarkRead()}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "var(--blue-400)",
                              fontSize: "0.6875rem",
                              cursor: "pointer",
                              padding: 0
                            }}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div style={{ overflowY: "auto", flex: 1 }}>
                        {notifications.length === 0 ? (
                          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-3)", fontSize: "0.75rem" }}>
                            No notifications yet.
                          </div>
                        ) : (
                          notifications.map((n) => {
                            const dateStr = new Date(n.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                            });
                            return (
                              <div
                                key={n.id}
                                onClick={() => !n.read && handleMarkRead(n.id)}
                                style={{
                                  padding: "0.75rem 1rem",
                                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                                  background: n.read ? "transparent" : "rgba(37, 99, 235, 0.05)",
                                  cursor: n.read ? "default" : "pointer",
                                  display: "flex",
                                  gap: "0.5rem",
                                  alignItems: "flex-start",
                                  transition: "background 0.2s"
                                }}
                              >
                                <span 
                                  style={{ 
                                    width: 6, height: 6, borderRadius: "50%", 
                                    background: typeColors[n.type] || "var(--text-3)", 
                                    marginTop: 6, flexShrink: 0 
                                  }} 
                                />
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-1)", marginBottom: "0.15rem" }}>
                                    {n.title}
                                  </div>
                                  <div style={{ fontSize: "0.6875rem", color: "var(--text-2)", lineHeight: 1.4, marginBottom: "0.25rem" }}>
                                    {n.message}
                                  </div>
                                  <div style={{ fontSize: "0.5625rem", color: "var(--text-3)" }}>
                                    {dateStr}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Link href="/login" className="navbar-login-btn">
                  Login
                </Link>
                <Link href="/register" className="btn btn-blue btn-sm" style={{ fontSize: "0.8125rem", padding: "0.4rem 1rem" }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`nav-hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`nav-drawer${menuOpen ? " open" : ""}`} style={{ zIndex: 90 }}>
        <div className="nav-drawer-inner" style={{ paddingTop: "5rem" }}>
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-drawer-link${pathname === l.href ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}

          {session ? (
            <Link
              href="/dashboard"
              className="btn btn-blue btn-full"
              style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
              onClick={() => setMenuOpen(false)}
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="btn btn-blue btn-full"
                style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="btn btn-ghost btn-full"
                style={{ marginTop: "0.5rem", display: "flex", justifyContent: "center" }}
                onClick={() => setMenuOpen(false)}
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div className="nav-backdrop" style={{ zIndex: 80 }} onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
}