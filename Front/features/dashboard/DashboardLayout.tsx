"use client";

import Link       from "next/link";
import Image      from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MOCK_USER } from "@/lib/mockUserData"; // fallback for dev

const NAV_ITEMS = [
  {
    href: "/dashboard", exact: true, label: "Overview",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <rect x="1.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="9.5" y="1.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="1.5" y="9.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="9.5" y="9.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/bookings", exact: false, label: "My Bookings",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <rect x="2" y="1.5" width="13" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M5.5 6h6M5.5 9h6M5.5 12h3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: "/dashboard/profile", exact: false, label: "Profile",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <circle cx="8.5" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M2 15c0-3.314 2.91-6 6.5-6s6.5 2.686 6.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user: authUser, isAuthenticated, loading, logout } = useAuth();

  /* Redirect unauthenticated users — allow through if API not wired yet (dev) */
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, isAuthenticated, pathname, router]);

  /* Use real user when authenticated, fall back to mock for dev */
  const user = authUser ?? MOCK_USER;

  /* Show loading shimmer while auth resolves */
  if (loading) {
    return (
      <div style={{ paddingTop: "var(--navbar-height)", minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ animation: "spin 1s linear infinite" }}>
            <circle cx="20" cy="20" r="17" stroke="#EDE5D5" strokeWidth="3"/>
            <path d="M20 3 A17 17 0 0 1 37 20" stroke="#C8913A" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "var(--navbar-height)", minHeight: "100vh", background: "#F5F0E8" }}>
      <div className="container-trivox" style={{ paddingBlock: "32px 64px" }}>
        <div style={{ display: "grid", gap: "24px", alignItems: "start" }} className="lg:grid-cols-[260px_1fr]">

          {/* ── Sidebar ──────────────────────────────────────── */}
          <aside>
            {/* User card */}
            <div style={{ background: "#1A1208", borderRadius: "20px", padding: "24px", marginBottom: "12px", textAlign: "center" }}>
              <div style={{ position: "relative", width: "72px", height: "72px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 14px", border: "3px solid rgba(200,145,58,0.5)", background: "#2A1C0A" }}>
                {user.avatar ? (
                  <Image src={user.avatar} alt={user.first_name} fill className="object-cover" />
                ) : (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#C8913A" }}>
                    {user.first_name?.[0]?.toUpperCase() ?? "?"}
                  </span>
                )}
              </div>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "#FDFCFA", letterSpacing: "-0.02em", marginBottom: "4px" }}>
                {user.first_name} {user.last_name}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#625849" }}>
                {user.email}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#C8913A", letterSpacing: "-0.02em" }}>
                    {user.bookings_count}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#625849" }}>Trips</p>
                </div>
                <div style={{ width: "1px", background: "rgba(255,255,255,0.08)" }} />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#C8913A", letterSpacing: "-0.02em" }}>4.9★</p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#625849" }}>Avg rating</p>
                </div>
              </div>
            </div>

            {/* Nav links */}
            <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid rgba(226,216,194,0.6)", overflow: "hidden", boxShadow: "0 2px 12px rgba(26,18,8,0.05)", marginBottom: "12px" }}>
              {NAV_ITEMS.map((item, i) => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 16px", textDecoration: "none", fontFamily: "var(--font-sans)", fontSize: "0.9375rem", fontWeight: active ? 600 : 400, color: active ? "#C8913A" : "#1A1208", background: active ? "rgba(200,145,58,0.07)" : "transparent", borderBottom: i < NAV_ITEMS.length - 1 ? "1px solid rgba(226,216,194,0.4)" : "none", transition: "background 0.15s" }}>
                    <span style={{ color: active ? "#C8913A" : "#948A7D" }}>{item.icon}</span>
                    {item.label}
                    {active && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: "auto" }}>
                        <path d="M5 3l4 4-4 4" stroke="#C8913A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Logout button */}
            {isAuthenticated && (
              <button onClick={logout}
                style={{ width: "100%", padding: "11px 16px", borderRadius: "12px", border: "1px solid rgba(226,216,194,0.6)", background: "#fff", color: "#7A6E60", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", transition: "background 0.15s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F5F0E8"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M6 2H3a1 1 0 00-1 1v9a1 1 0 001 1h3M10 10l3-2.5L10 5M13 7.5H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign out
              </button>
            )}

            {/* Help card */}
            <div style={{ padding: "16px", background: "rgba(200,145,58,0.08)", borderRadius: "14px", border: "1px solid rgba(200,145,58,0.18)" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#1A1208", marginBottom: "4px" }}>Need help?</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#7A6E60", lineHeight: 1.5, marginBottom: "10px" }}>Our team is available 24/7.</p>
              <a href="mailto:hello@trivox.travel" style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#C8913A", textDecoration: "none", fontFamily: "var(--font-sans)" }}>
                Contact support →
              </a>
            </div>
          </aside>

          {/* ── Main content ──────────────────────────────────── */}
          <main style={{ minWidth: 0 }}>{children}</main>
        </div>
      </div>
    </div>
  );
}
