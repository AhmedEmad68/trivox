"use client";

import Image from "next/image";
import type { Addon } from "@/types";
import { formatCurrency } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, string> = {
  transport: "🚐", food: "🍽️", equipment: "🎒",
  guide: "🧭", insurance: "🛡️", photo: "📷", other: "✨",
};

/* ─── Single addon card ──────────────────────────────────────────── */
export function AddonCard({ addon, selected, quantity, onToggle, onQuantity, compact = false }:
  { addon: Addon; selected: boolean; quantity: number; onToggle: (id: number) => void; onQuantity: (id: number, q: number) => void; compact?: boolean }) {

  const icon       = CATEGORY_ICONS[addon.category ?? "other"];
  const priceLabel = addon.price_unit === "per_person" ? "/ person" : addon.price_unit === "per_group" ? "/ group" : "";
  const subtotal   = addon.price * (addon.price_unit === "per_person" ? quantity : 1);

  return (
    <div style={{
      position: "relative",
      borderRadius: "16px",
      border: `2px solid ${selected ? "#C8913A" : "rgba(226,216,194,0.8)"}`,
      background: selected ? "rgba(200,145,58,0.04)" : "#fff",
      padding: compact ? "16px" : "20px",
      transition: "border-color 0.2s, background 0.2s",
    }}>
      {addon.is_required && (
        <div style={{ position: "absolute", top: "12px", right: "12px" }}>
          <span style={{ fontSize: "0.5625rem", fontFamily: "var(--font-sans)", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: "rgba(200,145,58,0.12)", color: "#7D541A", border: "1px solid rgba(200,145,58,0.25)", borderRadius: "9999px", padding: "2px 8px" }}>
            Required
          </span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        {/* Icon */}
        <div style={{ flexShrink: 0, width: compact ? "40px" : "48px", height: compact ? "40px" : "48px", borderRadius: "12px", background: selected ? "rgba(200,145,58,0.12)" : "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {addon.image ? (
            <Image src={addon.image} alt={addon.name} width={compact ? 40 : 48} height={compact ? 40 : 48} className="object-cover rounded-xl" />
          ) : (
            <span style={{ fontSize: compact ? "1rem" : "1.25rem" }}>{icon}</span>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
            <div style={{ minWidth: 0 }}>
              <h4 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "#1A1208", fontSize: compact ? "0.875rem" : "1rem", lineHeight: 1.35 }}>{addon.name}</h4>
              {!compact && <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#7A6E60", marginTop: "2px", lineHeight: 1.5 }}>{addon.description}</p>}
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "#1A1208", letterSpacing: "-0.02em" }}>{formatCurrency(addon.price, "USD")}</span>
              {priceLabel && <span style={{ display: "block", fontSize: "0.6875rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>{priceLabel}</span>}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
            {/* Quantity stepper */}
            {selected && addon.price_unit === "per_person" && (addon.max_quantity ?? 1) > 1 ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {[{ label: "−", action: () => onQuantity(addon.id, Math.max(1, quantity - 1)) }, { label: "+", action: () => onQuantity(addon.id, Math.min(addon.max_quantity ?? 10, quantity + 1)) }].map((btn, i) => (
                  i === 0 ? (
                    <button key="minus" onClick={btn.action}
                      style={{ width: "28px", height: "28px", borderRadius: "8px", border: "1px solid #E2D8C2", background: "#fff", color: "#7A6E60", fontSize: "1.125rem", lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>−</button>
                  ) : (
                    <button key="plus" onClick={btn.action}
                      style={{ width: "28px", height: "28px", borderRadius: "8px", border: "1px solid #E2D8C2", background: "#fff", color: "#7A6E60", fontSize: "1.125rem", lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>+</button>
                  )
                ))}
                <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)", minWidth: "20px", textAlign: "center" }}>{quantity}</span>
                {quantity > 1 && <span style={{ fontSize: "0.75rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>= {formatCurrency(subtotal, "USD")}</span>}
              </div>
            ) : <div />}

            {/* Toggle */}
            {!addon.is_required ? (
              <button onClick={() => onToggle(addon.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "6px 14px", borderRadius: "10px", fontSize: "0.875rem",
                  fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "var(--font-sans)",
                  background: selected ? "#C8913A" : "#fff",
                  color: selected ? "#1A1208" : "#7A6E60",
                  border: `1px solid ${selected ? "#C8913A" : "#E2D8C2"}`,
                }}>
                {selected && <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                {selected ? "Added" : "Add"}
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "#4A7C3F", fontWeight: 500, fontFamily: "var(--font-sans)" }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Included
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Selection panel ────────────────────────────────────────────── */
export function AddonSelectionPanel({ addons, selectedAddons, onToggle, onQuantity, participantCount = 1 }:
  { addons: Addon[]; selectedAddons: Record<number, number>; onToggle: (id: number) => void; onQuantity: (id: number, q: number) => void; participantCount?: number }) {
  if (!addons.length) return null;

  const required = addons.filter((a) => a.is_required);
  const optional = addons.filter((a) => !a.is_required);
  const selectedTotal = Object.entries(selectedAddons).reduce((sum, [id, qty]) => {
    const addon = addons.find((a) => a.id === Number(id));
    return addon ? sum + addon.price * (addon.price_unit === "per_person" ? qty : 1) : sum;
  }, 0);

  const sectionLabel: React.CSSProperties = { fontSize: "0.6875rem", fontWeight: 500, color: "#948A7D", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "var(--font-sans)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {required.length > 0 && (
        <div>
          <p style={sectionLabel}>Included</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {required.map((a) => <AddonCard key={a.id} addon={a} selected quantity={participantCount} onToggle={onToggle} onQuantity={onQuantity} compact />)}
          </div>
        </div>
      )}
      {optional.length > 0 && (
        <div>
          <p style={sectionLabel}>Optional Add-ons</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {optional.map((a) => <AddonCard key={a.id} addon={a} selected={a.id in selectedAddons} quantity={selectedAddons[a.id] ?? participantCount} onToggle={onToggle} onQuantity={onQuantity} />)}
          </div>
        </div>
      )}
      {selectedTotal > 0 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: "12px", background: "rgba(200,145,58,0.07)", border: "1px solid rgba(200,145,58,0.18)" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)" }}>Add-ons total</span>
          <span style={{ fontFamily: "var(--font-display)", color: "#C8913A", fontSize: "1.125rem", letterSpacing: "-0.02em" }}>{formatCurrency(selectedTotal, "USD")}</span>
        </div>
      )}
    </div>
  );
}
