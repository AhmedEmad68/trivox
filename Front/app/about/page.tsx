import type { Metadata } from "next";
import Link  from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title:       "About TriVox — Our Story",
  description: "TriVox was founded to make authentic Egyptian travel accessible to curious travellers from anywhere in the world. Our story, mission, and team.",
};

const VALUES = [
  { icon: "🧭", title: "Authenticity first",    body: "Every operator is vetted in person. We only list experiences we'd book ourselves. No mass tourism, no shortcuts." },
  { icon: "🤝", title: "Fair to everyone",       body: "We pay guides and hosts fairly. We're transparent about pricing. No hidden commissions that compromise quality." },
  { icon: "🌍", title: "Locally rooted",         body: "Our team is Cairo-based. We know Egypt from the inside — the hidden restaurants, the best guides, the unlisted spots." },
  { icon: "♻️", title: "Thoughtful travel",      body: "We work with operators who minimise environmental impact and contribute positively to local communities." },
];

const TEAM = [
  { name: "Khaled Mansour", role: "Co-founder & CEO",     avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80", note: "Former Egyptologist, born in Cairo." },
  { name: "Nadia El-Sayed", role: "Head of Experiences",  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80", note: "Curates every experience personally." },
  { name: "Youssef Hamdi",  role: "Operations Director",   avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", note: "Logistics and driver network." },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#FDFCFA" }}>
      {/* Hero */}
      <div
        style={{
          background: "#1A1208",
          paddingTop: "calc(var(--navbar-height) + 4rem)",
          paddingBottom: "5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 55% 45% at 50% 80%, rgba(200,145,58,0.1), transparent)" }} />
        <div className="container-trivox relative z-10" style={{ maxWidth: "720px" }}>
          <p className="eyebrow" style={{ color: "rgba(200,145,58,0.75)", marginBottom: "12px" }}>Our story</p>
          <h1 style={{ fontFamily: "var(--font-display)", color: "#FDFCFA", fontSize: "clamp(2.25rem, 5vw, 3.5rem)", letterSpacing: "-0.035em", lineHeight: 1.1, marginBottom: "20px" }}>
            TriVox — every journey, amplified
          </h1>
          <p style={{ fontFamily: "var(--font-sans)", color: "rgba(253,252,250,0.7)", fontSize: "1.125rem", lineHeight: 1.75, maxWidth: "560px" }}>
            TriVox was born from a simple frustration: the best experiences in Egypt — the cooking class in Fatima&apos;s kitchen, the Egyptologist who changes how you see the pyramids — were impossible to find through generic booking platforms.
          </p>
        </div>
      </div>

      <div className="container-trivox section-padding" style={{ maxWidth: "800px" }}>

        {/* Mission */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "64px" }}>
          <div className="divider-gold" />
          <p className="eyebrow mt-4">What we believe</p>
          {[
            "Egypt is one of the most extraordinary places on earth. We believe everyone who visits deserves to experience it properly — not from the window of a coach, not rushed through the Pyramids in 40 minutes.",
            "The best guides are the ones who grew up in the shadow of these monuments and have studied them for decades. The best experiences happen in living rooms and on small boats, not in hotel lobbies.",
            "We built TriVox to be the platform that connects curious travellers with those people — and to make booking them as simple, trustworthy, and transparent as possible.",
          ].map((para, i) => (
            <p key={i} style={{ fontFamily: "var(--font-sans)", fontSize: "1.0625rem", color: "#1A1208", lineHeight: 1.8 }}>{para}</p>
          ))}
        </div>

        {/* Values */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#1A1208", letterSpacing: "-0.025em", marginBottom: "28px" }}>
            What we stand for
          </h2>
          <div style={{ display: "grid", gap: "16px" }} className="sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} style={{ padding: "22px", background: "#fff", borderRadius: "18px", border: "1px solid rgba(226,216,194,0.6)", boxShadow: "0 1px 8px rgba(26,18,8,0.04)" }}>
                <span style={{ fontSize: "1.75rem", display: "block", marginBottom: "12px" }}>{v.icon}</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.0625rem", color: "#1A1208", marginBottom: "8px" }}>{v.title}</h3>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60", lineHeight: 1.65 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "#1A1208", letterSpacing: "-0.025em", marginBottom: "28px" }}>
            The team
          </h2>
          <div style={{ display: "grid", gap: "16px" }} className="sm:grid-cols-3">
            {TEAM.map((person) => (
              <div key={person.name} style={{ padding: "22px", background: "#fff", borderRadius: "18px", border: "1px solid rgba(226,216,194,0.6)", textAlign: "center" }}>
                <div style={{ position: "relative", width: "64px", height: "64px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 14px", border: "2px solid rgba(200,145,58,0.3)" }}>
                  <Image src={person.avatar} alt={person.name} fill className="object-cover" />
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "#1A1208", letterSpacing: "-0.01em", marginBottom: "3px" }}>{person.name}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#C8913A", fontWeight: 500, marginBottom: "6px" }}>{person.role}</p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#7A6E60" }}>{person.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "36px", background: "#F5F0E8", borderRadius: "24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "#1A1208", letterSpacing: "-0.025em", marginBottom: "10px" }}>
            Ready to explore Egypt?
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", fontSize: "1rem", lineHeight: 1.65, marginBottom: "24px" }}>
            Browse 180+ handpicked tours, transfers, and experiences.
          </p>
          <Link href="/trips" style={{ display: "inline-flex", padding: "13px 32px", borderRadius: "14px", background: "#1A1208", color: "#FDFCFA", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "1rem", textDecoration: "none" }}>
            Explore all trips
          </Link>
        </div>
      </div>
    </div>
  );
}
