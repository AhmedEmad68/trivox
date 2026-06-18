"use client";

import Image from "next/image";
import Link  from "next/link";
import type { TripBase } from "@/types";
import { Badge }      from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";

/* ─── Currency formatter ─────────────────────────────────────────── */
const fmt = (n: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currency || "USD", minimumFractionDigits: 0 }).format(n);

/* ─── Price block ────────────────────────────────────────────────── */
function Price({ price, currency, original }: { price: number; currency: string; original?: number }) {
  return (
    <div style={{ textAlign: "right" }}>
      {original && original > price && (
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#948A7D", textDecoration: "line-through", lineHeight: 1 }}>
          {fmt(original, currency)}
        </p>
      )}
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.5625rem", color: "#948A7D", textTransform: "uppercase", letterSpacing: "0.08em", lineHeight: 1.2 }}>From</p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1875rem", color: "#0F0A04", letterSpacing: "-0.025em", lineHeight: 1 }}>
        {fmt(price, currency)}
      </p>
    </div>
  );
}

/* ─── Inline meta (duration / pickup point) ──────────────────────── */
function TypeMeta({ trip }: { trip: TripBase }) {
  const style: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: "3px",
    fontSize: "0.6875rem", color: "#7A6E60", fontFamily: "var(--font-sans)",
  };
  switch (trip.type) {
    case "tour":
      return (
        <span style={style}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M5 2.8v2.2l1.4.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          {trip.duration_label}
        </span>
      );
    case "transfer":
      return (
        <span style={style}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 5h8M6 2.5L8.5 5 6 7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {(trip as { pickup_location?: string }).pickup_location ?? trip.location.name}
        </span>
      );
    case "experience":
      return (
        <span style={style}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M5 2.8v2.2l1.4.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          {trip.duration_label}
        </span>
      );
    default: return null;
  }
}

/* ─── TripCard ───────────────────────────────────────────────────── */
export function TripCard({
  trip,
  variant   = "default",
  priority  = false,
  className = "",
}: {
  trip:      TripBase;
  variant?:  "default" | "horizontal" | "featured";
  priority?: boolean;
  className?: string;
}) {

  /* ── Horizontal list variant ───────────────────────────────────── */
  if (variant === "horizontal") {
    return (
      <Link
        href={`/trips/${trip.slug}`}
        className={className}
        style={{
          display: "flex", overflow: "hidden",
          background: "#fff", borderRadius: "14px",
          border: "1px solid rgba(214,204,184,0.6)",
          boxShadow: "0 1px 8px rgba(26,18,8,0.06)",
          textDecoration: "none", height: "168px",
          transition: "box-shadow 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 28px rgba(26,18,8,0.12)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 8px rgba(26,18,8,0.06)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
      >
        <div style={{ position: "relative", width: "180px", flexShrink: 0, overflow: "hidden", background: "#EDE5D5" }}>
          <Image
            src={trip.cover_image} alt={trip.title} fill sizes="180px"
            className="object-cover"
            style={{ transition: "transform 0.5s ease" }}
            priority={priority}
            onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
          />
          <div style={{ position: "absolute", top: "8px", left: "8px" }}>
            <Badge type={trip.type} size="sm" />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px", flex: 1, minWidth: 0 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#948A7D" }}>{trip.location.name}</span>
              <span style={{ color: "#DDD5C5" }}>·</span>
              <TypeMeta trip={trip} />
            </div>
            <h3 style={{
              fontFamily: "var(--font-display)", color: "#0F0A04", fontSize: "0.9375rem",
              lineHeight: 1.3, overflow: "hidden", display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>
              {trip.title}
            </h3>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <StarRating rating={trip.rating} reviewCount={trip.review_count} size="sm" />
            <Price price={trip.price} currency={trip.price_currency} original={trip.original_price} />
          </div>
        </div>
      </Link>
    );
  }

  /* ── Featured overlay variant ──────────────────────────────────── */
  if (variant === "featured") {
    return (
      <Link
        href={`/trips/${trip.slug}`}
        className={className}
        style={{
          position: "relative", overflow: "hidden", height: "360px",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          borderRadius: "16px", textDecoration: "none",
          boxShadow: "0 4px 20px rgba(26,18,8,0.15)",
        }}
        onMouseEnter={(e) => {
          const img = (e.currentTarget as HTMLElement).querySelector("img") as HTMLImageElement | null;
          if (img) img.style.transform = "scale(1.06)";
        }}
        onMouseLeave={(e) => {
          const img = (e.currentTarget as HTMLElement).querySelector("img") as HTMLImageElement | null;
          if (img) img.style.transform = "scale(1)";
        }}
      >
        <Image
          src={trip.cover_image} alt={trip.title} fill sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover"
          style={{ transition: "transform 0.7s ease" }}
          priority={priority}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,10,4,0.05) 0%, rgba(15,10,4,0.6) 55%, rgba(15,10,4,0.92) 100%)" }} />
        <div style={{ position: "absolute", top: "12px", left: "12px", display: "flex", gap: "6px" }}>
          <Badge type={trip.type} />
          {trip.is_featured && <Badge type="featured" />}
        </div>
        <div style={{ position: "relative", zIndex: 1, padding: "20px" }}>
          <TypeMeta trip={trip} />
          <h3 style={{
            fontFamily: "var(--font-display)", color: "#FDFCFA",
            fontSize: "1.25rem", lineHeight: 1.25, margin: "6px 0 12px",
            overflow: "hidden", display: "-webkit-box",
            WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>
            {trip.title}
          </h3>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "8px" }}>
            <StarRating rating={trip.rating} reviewCount={trip.review_count} size="sm" lightMode />
            <Price price={trip.price} currency={trip.price_currency} original={trip.original_price} />
          </div>
        </div>
      </Link>
    );
  }

  /* ── Default vertical card ─────────────────────────────────────── */
  return (
    <Link
      href={`/trips/${trip.slug}`}
      className={className}
      style={{
        display: "flex", flexDirection: "column", overflow: "hidden",
        background: "#fff", borderRadius: "16px",
        border: "1px solid rgba(214,204,184,0.55)",
        textDecoration: "none",
        boxShadow: "0 2px 12px rgba(26,18,8,0.06)",
        transition: "box-shadow 0.22s, transform 0.22s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 8px 36px rgba(26,18,8,0.13)";
        el.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 2px 12px rgba(26,18,8,0.06)";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#EDE5D5", flexShrink: 0 }}>
        <Image
          src={trip.cover_image} alt={trip.title} fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover"
          style={{ transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)" }}
          priority={priority}
          onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.07)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
        />
        {/* Badges */}
        <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "5px" }}>
          <Badge type={trip.type} />
          {trip.is_featured && <Badge type="featured" />}
        </div>
        {/* Free cancellation pill */}
        {trip.cancellation_policy === "free_cancellation" && (
          <div style={{
            position: "absolute", bottom: "10px", left: "10px",
            display: "flex", alignItems: "center", gap: "4px",
            background: "rgba(255,255,255,0.94)", backdropFilter: "blur(6px)",
            borderRadius: "8px", padding: "3px 8px",
            boxShadow: "0 1px 4px rgba(26,18,8,0.12)",
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5l2.5 2.5 5-5" stroke="#2D6E26" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#2D6E26", fontFamily: "var(--font-sans)" }}>
              Free cancellation
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "14px 16px 16px", gap: "6px" }}>
        {/* Location + duration row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", color: "#948A7D", fontWeight: 500, letterSpacing: "0.03em", textTransform: "uppercase" }}>
            {trip.location.name}
          </span>
          <TypeMeta trip={trip} />
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "var(--font-display)", color: "#0F0A04",
          fontSize: "1rem", lineHeight: 1.3, flex: 1,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          letterSpacing: "-0.01em",
        }}>
          {trip.title}
        </h3>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
          paddingTop: "10px", borderTop: "1px solid rgba(214,204,184,0.5)", gap: "8px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <StarRating rating={trip.rating} reviewCount={trip.review_count} size="sm" />
            {trip.max_group_size && (
              <span style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "0.6875rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="3.5" cy="3" r="1.6" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="3" r="1.2" stroke="currentColor" strokeWidth="1.2"/><path d="M0.5 8.5c0-1.66 1.34-3 3-3s3 1.34 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M7 5.5c.8.3 1.3 1.1 1.3 2.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                Up to {trip.max_group_size} people
              </span>
            )}
          </div>
          <Price price={trip.price} currency={trip.price_currency} original={trip.original_price} />
        </div>
      </div>
    </Link>
  );
}
