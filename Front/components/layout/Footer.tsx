"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/* ─── Types ──────────────────────────────────────────────────────── */
interface FooterLinkItem { href: string; label: string; }
interface TrustMarker    { icon: ReactNode; label: string; }
interface SocialLink     { href: string; label: string; icon: ReactNode; }

/* ─── Data ───────────────────────────────────────────────────────── */
const FOOTER_LINKS: Record<string, FooterLinkItem[]> = {
  Explore: [
    { href: "/trips?type=tour",       label: "Tours"          },
    { href: "/trips?type=transfer",   label: "Transfers"      },
    { href: "/trips?type=experience", label: "Experiences"    },
    { href: "/destinations",          label: "Destinations"   },
    { href: "/trips?featured=true",   label: "Featured Trips" },
  ],
  Destinations: [
    { href: "/destinations/cairo",      label: "Cairo"       },
    { href: "/destinations/luxor",      label: "Luxor"       },
    { href: "/destinations/aswan",      label: "Aswan"       },
    { href: "/destinations/alexandria", label: "Alexandria"  },
    { href: "/destinations/hurghada",   label: "Hurghada"    },
  ],
  Company: [
    { href: "/about",        label: "About TriVox"   },
    { href: "/how-it-works", label: "How It Works"  },
    { href: "/blog",         label: "Travel Journal"},
    { href: "/careers",      label: "Careers"       },
    { href: "/contact",      label: "Contact Us"    },
  ],
  Support: [
    { href: "/help",          label: "Help Centre"     },
    { href: "/terms",         label: "Terms of Service"},
    { href: "/privacy",       label: "Privacy Policy"  },
    { href: "/refund-policy", label: "Refund Policy"   },
  ],
};

const TRUST_MARKERS: TrustMarker[] = [
  {
    label: "Secure Payments",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M8.5 1.5L3 4v4c0 3.3 2.4 6.4 5.5 7.2C11.6 14.4 14 11.3 14 8V4L8.5 1.5z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round"/>
        <path d="M6 8.5l1.8 1.8 3.2-3.2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Verified Operators",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.35"/>
        <path d="M5.5 8.5l2.2 2.2 3.8-3.8" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Free Cancellation",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M14 8.5A5.5 5.5 0 1 1 8.5 3H11M11 3l2 2-2 2" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    label: "Instant Booking",
    icon: (
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
        <path d="M9.5 2L4 9.5h4.5L7 15l6.5-8H9L9.5 2z" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://instagram.com/trivoxtravel", label: "Instagram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="12" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8" cy="8" r="2.8" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="11.5" cy="4.5" r="0.75" fill="currentColor"/>
      </svg>
    ),
  },
  {
    href: "https://twitter.com/trivoxtravel", label: "Twitter / X",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2.5 2.5L7.5 8.5M7.5 8.5L2.5 14H5.5L8 11M7.5 8.5L13.5 2.5H10.5L8 6M7.5 8.5L8 11M8 11L13.5 14"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    href: "https://facebook.com/trivoxtravel", label: "Facebook",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M9.5 3H11V1H9.5C7.5 1 6 2.5 6 4.5V6H4.5V8H6V15H8V8H10L10.5 6H8V4.5C8 3.7 8.7 3 9.5 3Z" fill="currentColor"/>
      </svg>
    ),
  },
];

/* ─── Footer component ───────────────────────────────────────────── */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* Inject hover styles once — avoids all onMouseEnter/Leave handlers */}
      <style>{`
        .footer-social-btn { color: #948A7D; transition: color 0.15s, background 0.15s; }
        .footer-social-btn:hover { color: #FDFCFA; background: rgba(255,255,255,0.1) !important; }
        .footer-link { color: #948A7D; transition: color 0.15s; text-decoration: none; font-size: 0.875rem; font-family: var(--font-sans); }
        .footer-link:hover { color: #FDFCFA; }
        .footer-bottom-link { color: #948A7D; transition: color 0.15s; text-decoration: none; font-size: 0.75rem; font-family: var(--font-sans); }
        .footer-bottom-link:hover { color: #FDFCFA; }
      `}</style>

      <footer style={{ background: "#1A1208", color: "#CCC4BA" }} className="mt-auto">

        {/* Trust strip */}
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="container-trivox py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRUST_MARKERS.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span
                    className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
                    style={{ background: "rgba(200,145,58,0.14)", color: "#C8913A" }}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#AFA69A", fontFamily: "var(--font-sans)" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main body */}
        <div className="container-trivox py-14">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Brand column */}
            <div className="lg:col-span-1 flex flex-col gap-5">
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.875rem", color: "#FDFCFA", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  TriVox
                </p>
                <p style={{ fontSize: "0.6875rem", letterSpacing: "0.16em", color: "rgba(200,145,58,0.65)", textTransform: "uppercase", fontFamily: "var(--font-sans)", fontWeight: 500, marginTop: "4px" }}>
                  Egypt & Beyond
                </p>
              </div>
              <p style={{ fontSize: "0.875rem", color: "#948A7D", lineHeight: 1.7, maxWidth: "18rem", fontFamily: "var(--font-sans)" }}>
                Curated tours, transfers, and cultural experiences rooted in Egypt&apos;s soul — crafted for curious travellers worldwide.
              </p>

              {/* Social — CSS hover only */}
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    aria-label={s.label}
                    className="footer-social-btn w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "transparent" }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(FOOTER_LINKS).map(([section, links]) => (
                <div key={section}>
                  <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", color: "#FDFCFA", marginBottom: "1rem" }}>
                    {section}
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="footer-link">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="container-trivox py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p style={{ fontSize: "0.75rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>
              © {year} TriVox Travel. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/terms"   className="footer-bottom-link">Terms</Link>
              <Link href="/privacy" className="footer-bottom-link">Privacy</Link>
              <span style={{ fontSize: "0.75rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>
                <span style={{ color: "#C8913A" }}>♥</span> Made with care in Cairo
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
