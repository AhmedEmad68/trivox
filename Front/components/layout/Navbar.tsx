"use client";

import Link  from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

/* ─── Logo ────────────────────────────────────────────────────────── */
function Logo({ light }: { light: boolean }) {
  const c = light ? "#FDFCFA" : "#1A1208";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{
        width: "34px", height: "34px", borderRadius: "10px",
        background: light ? "rgba(255,255,255,0.13)" : "rgba(200,145,58,0.08)",
        border: `1.5px solid ${light ? "rgba(255,255,255,0.22)" : "rgba(200,145,58,0.28)"}`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        boxShadow: light ? "0 2px 10px rgba(0,0,0,0.18)" : "0 2px 8px rgba(200,145,58,0.12)",
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke={light ? "rgba(253,252,250,0.35)" : "rgba(200,145,58,0.4)"} strokeWidth="1.2"/>
          <path d="M8 3.5L9.2 7.8 8 7 6.8 7.8Z" fill="#C8913A"/>
          <path d="M8 12.5L6.8 8.2 8 9 9.2 8.2Z" fill={light ? "rgba(253,252,250,0.3)" : "rgba(26,18,8,0.25)"}/>
          <circle cx="8" cy="8" r="1.2" fill={light ? "rgba(253,252,250,0.55)" : "rgba(200,145,58,0.5)"}/>
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5px" }}>
        <span style={{
          fontFamily: "var(--font-display)", fontSize: "1.25rem",
          letterSpacing: "-0.03em", color: c, lineHeight: 1.1, userSelect: "none",
        }}>
          TriVox
        </span>
        <span style={{
          fontFamily: "var(--font-sans)", fontSize: "0.5rem",
          letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600,
          color: light ? "rgba(224,160,64,0.9)" : "rgba(200,145,58,0.62)",
          lineHeight: 1, userSelect: "none",
        }}>
          Egypt & Beyond
        </span>
      </div>
    </div>
  );
}

/* ─── Nav links ───────────────────────────────────────────────────── */
const NAV_LINKS = [
  { href: "/",                        label: "Home",         exact: true  },
  { href: "/trips?type=tour",         label: "Tours",        exact: false },
  { href: "/trips?type=transfer",     label: "Transfers",    exact: false },
  { href: "/trips?type=experience",   label: "Experiences",  exact: false },
  { href: "/destinations",            label: "Destinations", exact: false },
];

/* ─── Active check ────────────────────────────────────────────────── */
function isLinkActive(href: string, exact: boolean, pathname: string, search: string): boolean {
  if (exact) return pathname === href;

  const [path, query] = href.split("?");

  // Pathname must match
  if (!pathname.startsWith(path)) return false;

  // If the link has a query param (e.g. type=tour), check the actual URL search too
  if (query) {
    const linkParams = new URLSearchParams(query);
    const pageParams = new URLSearchParams(search);
    for (const [key, val] of linkParams.entries()) {
      if (pageParams.get(key) !== val) return false;
    }
  }
  return true;
}

/* ─── Icons ───────────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <circle cx="7.5" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M11.5 11.5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const UserIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <circle cx="8.5" cy="5.5" r="2.8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2.5 15c0-3.04 2.69-5.5 6-5.5s6 2.46 6 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const MenuIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <path d="M3 5h13M3 9.5h13M3 14h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="19" height="19" viewBox="0 0 19 19" fill="none">
    <path d="M5 5l9 9M14 5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ─── Navbar ──────────────────────────────────────────────────────── */
export function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query,      setQuery]      = useState("");
  const searchParams = useSearchParams();
  const search       = searchParams.toString();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setSearchOpen(false); }, [pathname]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [searchOpen]);

  const glass = !scrolled && !mobileOpen && pathname === "/";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/trips?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  };

  const linkColor    = glass ? "rgba(253,252,250,0.88)" : "#3D2E20";
  const iconColor    = glass ? "rgba(253,252,250,0.8)"  : "#625849";
  const hoverBg      = glass ? "rgba(255,255,255,0.1)"  : "#EDE8DF";

  return (
    <>
      <style>{`
        .rn-link {
          font-family: var(--font-sans); font-size: 0.8125rem; font-weight: 500;
          text-decoration: none; padding: 6px 13px; border-radius: 8px;
          transition: background 0.15s, color 0.15s; white-space: nowrap;
          display: inline-flex; align-items: center; gap: 5px; letter-spacing: 0.005em;
        }
        .rn-link-active-solid {
          background: #1A1208 !important;
          color: #FDFCFA !important;
          font-weight: 600 !important;
          box-shadow: 0 1px 8px rgba(26,18,8,0.16);
        }
        .rn-link-active-glass {
          background: rgba(255,255,255,0.18) !important;
          color: #FDFCFA !important;
          font-weight: 600 !important;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.22);
        }
        .rn-icon {
          background: transparent; border: none; cursor: pointer;
          border-radius: 8px; padding: 7px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .rn-icon:hover { background: ${glass ? "rgba(255,255,255,0.11)" : "rgba(26,18,8,0.06)"}; }
        .rn-signin-btn {
          font-family: var(--font-sans); font-size: 0.8125rem; font-weight: 500;
          text-decoration: none; padding: 6px 14px; border-radius: 8px;
          display: inline-flex; align-items: center; gap: 6px;
          letter-spacing: 0.005em; transition: background 0.15s, color 0.15s;
          border: 1px solid transparent;
        }
        .rn-drawer-link {
          display: flex; align-items: center; gap: 9px;
          padding: 11px 14px; border-radius: 10px;
          font-size: 0.9375rem; font-family: var(--font-sans); font-weight: 500;
          color: #1A1208; text-decoration: none; transition: background 0.13s;
        }
        .rn-drawer-link:hover  { background: #F5F0E8; }
        .rn-drawer-link-active { background: #1A1208 !important; color: #FDFCFA !important; }
        .rn-drawer-util {
          display: flex; align-items: center; gap: 8px; padding: 10px 14px;
          border-radius: 10px; font-size: 0.875rem; font-family: var(--font-sans);
          color: #7A6E60; text-decoration: none; transition: background 0.13s, color 0.13s;
        }
        .rn-drawer-util:hover { background: #F5F0E8; color: #1A1208; }
        @media (min-width: 768px) { #mobile-menu-btn { display: none !important; } }
        @media (max-width: 767px) { .rn-desktop-nav { display: none !important; } .rn-desktop-actions { display: none !important; } }
        .rn-header-inner { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; height: 100%; }
        @media (max-width: 767px) { .rn-header-inner { display: flex; justify-content: space-between; align-items: center; } }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
          height: "var(--navbar-height)",
          background: glass ? "transparent" : "rgba(253,252,250,0.96)",
          backdropFilter: glass ? "none" : "blur(24px) saturate(1.8)",
          WebkitBackdropFilter: glass ? "none" : "blur(24px) saturate(1.8)",
          borderBottom: glass ? "none" : "1px solid rgba(220,210,192,0.45)",
          boxShadow: scrolled && !glass ? "0 1px 24px rgba(26,18,8,0.07)" : "none",
          transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
        }}
      >
        <div className="container-trivox rn-header-inner">
          {/* ── Left: Logo ─────────────────────────────────────── */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              <Logo light={glass} />
            </Link>
          </div>

          {/* ── Center: Desktop nav ─────────────────────────────── */}
          <nav
            className="rn-desktop-nav"
            style={{
              display: "flex", alignItems: "center", gap: "2px",
              background: glass ? "rgba(255,255,255,0.07)" : "rgba(26,18,8,0.04)",
              borderRadius: "11px",
              padding: "3px",
              border: glass ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(26,18,8,0.07)",
            }}
          >
            {NAV_LINKS.map((l) => {
              const active = isLinkActive(l.href, l.exact, pathname, search);
              const activeClass = glass ? "rn-link-active-glass" : "rn-link-active-solid";
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rn-link${active ? ` ${activeClass}` : ""}`}
                  style={{ color: active ? undefined : linkColor }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* ── Right: Actions + Mobile hamburger ───────────────── */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>

            {/* Desktop-only actions */}
            <div className="rn-desktop-actions" style={{ display: "flex", alignItems: "center", gap: "4px" }}>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
                className="rn-icon"
                style={{ color: iconColor }}
              >
                <SearchIcon />
              </button>

              {/* Divider */}
              <div style={{
                width: "1px", height: "18px", margin: "0 4px",
                background: glass ? "rgba(255,255,255,0.18)" : "rgba(26,18,8,0.12)",
                flexShrink: 0,
              }} />

              {/* Account / Sign in */}
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="rn-signin-btn"
                  style={{
                    background: isLinkActive("/dashboard", false, pathname, search)
                      ? (glass ? "rgba(255,255,255,0.16)" : "#1A1208")
                      : "transparent",
                    color: isLinkActive("/dashboard", false, pathname, search)
                      ? "#FDFCFA"
                      : iconColor,
                    borderColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLinkActive("/dashboard", false, pathname, search))
                      (e.currentTarget as HTMLElement).style.background = hoverBg;
                  }}
                  onMouseLeave={(e) => {
                    if (!isLinkActive("/dashboard", false, pathname, search))
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {user?.avatar ? (
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", overflow: "hidden", border: "1.5px solid rgba(200,145,58,0.5)", flexShrink: 0, position: "relative" }}>
                      <Image src={user.avatar} alt={user.first_name} fill className="object-cover" sizes="22px" />
                    </div>
                  ) : (
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: glass ? "rgba(200,145,58,0.85)" : "#C8913A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.625rem", fontWeight: 700, color: "#1A1208" }}>
                        {user?.first_name?.[0]?.toUpperCase() ?? "?"}
                      </span>
                    </div>
                  )}
                  <span>{user?.first_name ?? "Account"}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="rn-signin-btn"
                  style={{
                    color: iconColor,
                    borderColor: glass ? "rgba(255,255,255,0.18)" : "rgba(26,18,8,0.14)",
                    background: glass ? "rgba(255,255,255,0.07)" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = hoverBg;
                    (e.currentTarget as HTMLElement).style.borderColor = glass ? "rgba(255,255,255,0.28)" : "rgba(26,18,8,0.22)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = glass ? "rgba(255,255,255,0.07)" : "transparent";
                    (e.currentTarget as HTMLElement).style.borderColor = glass ? "rgba(255,255,255,0.18)" : "rgba(26,18,8,0.14)";
                  }}
                >
                  <UserIcon />
                  <span>Sign in</span>
                </Link>
              )}

              {/* Explore CTA */}
              <Link
                href="/trips"
                style={{
                  fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.8125rem",
                  padding: "7px 16px", borderRadius: "8px", textDecoration: "none",
                  background: glass
                    ? "linear-gradient(135deg, #D49B3A 0%, #C8913A 100%)"
                    : "linear-gradient(135deg, #2A1C0A 0%, #1A1208 100%)",
                  color: glass ? "#1A1208" : "#FDFCFA",
                  boxShadow: glass
                    ? "0 2px 14px rgba(200,145,58,0.45), inset 0 1px 0 rgba(255,255,255,0.2)"
                    : "0 1px 8px rgba(26,18,8,0.22), inset 0 1px 0 rgba(255,255,255,0.06)",
                  transition: "opacity 0.18s, transform 0.18s, box-shadow 0.18s",
                  marginLeft: "6px", display: "inline-flex", alignItems: "center",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.88";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = glass
                    ? "0 4px 20px rgba(200,145,58,0.55), inset 0 1px 0 rgba(255,255,255,0.2)"
                    : "0 4px 16px rgba(26,18,8,0.28), inset 0 1px 0 rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = glass
                    ? "0 2px 14px rgba(200,145,58,0.45), inset 0 1px 0 rgba(255,255,255,0.2)"
                    : "0 1px 8px rgba(26,18,8,0.22), inset 0 1px 0 rgba(255,255,255,0.06)";
                }}
              >
                Explore Trips
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
              className="rn-icon"
              style={{ color: iconColor, display: "flex" }}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Search drop-down */}
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, overflow: "hidden",
          maxHeight: searchOpen ? "80px" : "0", opacity: searchOpen ? 1 : 0,
          transition: "max-height 0.28s ease, opacity 0.22s ease",
          background: "rgba(253,252,250,0.97)", backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(220,210,192,0.45)",
        }}>
          <div className="container-trivox" style={{ paddingBlock: "12px" }}>
            <form onSubmit={submit} style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#948A7D", pointerEvents: "none" }}>
                  <SearchIcon />
                </span>
                <input
                  ref={inputRef} type="text" value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tours, transfers, experiences…"
                  className="input-base" style={{ paddingLeft: "40px" }}
                />
              </div>
              <button type="submit" className="btn-primary btn btn-md" style={{ flexShrink: 0 }}>
                Search
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        style={{
          position: "fixed", inset: 0, zIndex: 190,
          background: "rgba(26,18,8,0.5)", backdropFilter: "blur(3px)",
          opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity 0.25s",
        }}
      />

      {/* Mobile slide-in drawer */}
      <nav style={{
        position: "fixed", top: "var(--navbar-height)", right: 0, bottom: 0,
        zIndex: 195, width: "280px",
        background: "#FDFCFA",
        borderLeft: "1px solid rgba(220,210,192,0.5)",
        boxShadow: "-12px 0 40px rgba(26,18,8,0.14)",
        display: "flex", flexDirection: "column",
        transform: mobileOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflowY: "auto",
      }}>
        <div style={{ flex: 1, padding: "20px 16px" }}>
          <p style={{ fontSize: "0.625rem", fontWeight: 700, color: "#948A7D", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.12em", padding: "6px 14px 8px", marginBottom: "2px" }}>
            Navigation
          </p>
          {NAV_LINKS.map((l) => {
            const active = isLinkActive(l.href, l.exact, pathname, search);
            const HomeIcon = () => (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M1.5 7.5L7.5 2l6 5.5V13a1 1 0 01-1 1h-3v-3.5h-4V14h-3a1 1 0 01-1-1V7.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
            );
            const icons: Record<string, React.ReactNode> = {
              "/":                       <HomeIcon />,
              "/trips?type=tour":        <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5L2 11h11L7.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>,
              "/trips?type=transfer":    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="6" width="13" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M1 8l3-4h7l3 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
              "/trips?type=experience":  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5C5 1.5 3 4 3 6c0 3.5 4.5 7.5 4.5 7.5S12 9.5 12 6c0-2-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.3"/></svg>,
              "/destinations":           <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1C5 1 2.5 3.5 2.5 6c0 4 5 8 5 8s5-4 5-8c0-2.5-2.5-5-5-5z" stroke="currentColor" strokeWidth="1.3"/><circle cx="7.5" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.2"/></svg>,
            };
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rn-drawer-link${active ? " rn-drawer-link-active" : ""}`}
              >
                <span style={{ opacity: active ? 1 : 0.55, flexShrink: 0 }}>{icons[l.href]}</span>
                {l.label}
                {active && (
                  <svg style={{ marginLeft: "auto" }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3l4 4-4 4" stroke="#C8913A" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </Link>
            );
          })}

          <div style={{ height: "1px", background: "rgba(220,210,192,0.55)", margin: "14px 4px" }} />

          <Link href="/dashboard"          className="rn-drawer-util"><UserIcon /><span>My Account</span></Link>
          <Link href="/dashboard/bookings" className="rn-drawer-util">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M5 6h6M5 9h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            <span>My Bookings</span>
          </Link>
        </div>

        <div style={{ padding: "16px", borderTop: "1px solid rgba(220,210,192,0.5)" }}>
          <Link href="/trips" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "13px", borderRadius: "12px",
            background: "#1A1208", color: "#FDFCFA",
            fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.9375rem", textDecoration: "none",
          }}>
            Explore All Trips
          </Link>
        </div>
      </nav>
    </>
  );
}
