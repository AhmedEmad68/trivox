import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { Navbar }         from "@/components/layout/Navbar";
import { Footer }         from "@/components/layout/Footer";
import { Providers }      from "@/components/layout/Providers";
import { MockModeBanner } from "@/components/ui/MockModeBanner";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-sans",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://trivox.travel"),
  title: { default: "TriVox — Discover Egypt & Beyond", template: "%s | TriVox Travel" },
  description: "Discover authentic tours, seamless transfers, and immersive experiences across Egypt and the world.",
  openGraph: {
    type: "website", locale: "en_US", siteName: "TriVox Travel",
    title: "TriVox — Discover Egypt & Beyond",
    description: "Authentic tours, seamless transfers, and immersive experiences.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#C8913A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      {/* Use only safe structural Tailwind classes here — no colour aliases */}
      <body className="min-h-screen flex flex-col antialiased" style={{ background: "#FDFCFA", color: "#1A1208" }}>
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:rounded-xl focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
            style={{ background: "#C8913A", color: "#1A1208" }}
          >
            Skip to main content
          </a>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <main id="main-content" className="flex-1 page-enter">
            {children}
          </main>
          <Footer />
          <MockModeBanner />
        </Providers>
      </body>
    </html>
  );
}
