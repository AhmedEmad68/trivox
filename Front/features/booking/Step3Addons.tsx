"use client";

import type { Addon } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface Step3Props {
  addons:          Addon[];
  selectedAddons:  Record<number, number>;
  totalPeople:     number;
  currency:        string;
  onToggle:        (id: number, totalPeople: number) => void;
  onQty:           (id: number, qty: number) => void;
  onNext:          () => void;
  onBack:          () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  transport: "🚐", food: "🍽️", equipment: "🎒",
  guide: "🧭", insurance: "🛡️", photo: "📷", other: "✨",
};

export function Step3Addons({ addons, selectedAddons, totalPeople, currency, onToggle, onQty, onNext, onBack }: Step3Props) {
  const optional = addons.filter((a) => !a.is_required);
  const required = addons.filter((a) =>  a.is_required);

  const addonsTotal = Object.entries(selectedAddons).reduce((sum, [id, qty]) => {
    const addon = addons.find((a) => a.id === Number(id));
    return addon ? sum + addon.price * (addon.price_unit === "per_person" ? qty : 1) : sum;
  }, 0);

  if (!optional.length && !required.length) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div style={{ textAlign: "center", padding: "48px 24px", background: "#F5F0E8", borderRadius: "20px" }}>
          <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", fontSize: "0.9375rem" }}>
            No add-ons available for this trip.
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onBack} style={backBtnStyle}>← Back</button>
          <button onClick={onNext} style={nextBtnStyle("#C8913A")}>Continue to payment →</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* Required addons */}
      {required.length > 0 && (
        <div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", fontWeight: 600, color: "#948A7D", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Included</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {required.map((addon) => (
              <AddonRow key={addon.id} addon={addon} selected quantity={totalPeople} currency={currency}
                onToggle={() => {}} onQty={() => {}} totalPeople={totalPeople} />
            ))}
          </div>
        </div>
      )}

      {/* Optional addons */}
      {optional.length > 0 && (
        <div>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", fontWeight: 600, color: "#948A7D", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>Optional extras</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {optional.map((addon) => (
              <AddonRow
                key={addon.id} addon={addon}
                selected={addon.id in selectedAddons}
                quantity={selectedAddons[addon.id] ?? totalPeople}
                currency={currency} totalPeople={totalPeople}
                onToggle={() => onToggle(addon.id, totalPeople)}
                onQty={(qty) => onQty(addon.id, qty)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Running total */}
      {addonsTotal > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "rgba(200,145,58,0.08)", borderRadius: "14px", border: "1px solid rgba(200,145,58,0.2)" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "#1A1208", fontSize: "0.9375rem" }}>Add-ons total</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "#C8913A", letterSpacing: "-0.025em" }}>
            +{formatCurrency(addonsTotal, currency)}
          </span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={onBack} style={backBtnStyle}>← Back</button>
        <button onClick={onNext} style={nextBtnStyle("#C8913A")}>Continue to payment →</button>
      </div>
    </div>
  );
}

/* ─── Single addon row ───────────────────────────────────────────── */
function AddonRow({ addon, selected, quantity, currency, totalPeople, onToggle, onQty }: {
  addon: Addon; selected: boolean; quantity: number; currency: string;
  totalPeople: number; onToggle: () => void; onQty: (q: number) => void;
}) {
  const subtotal = addon.price * (addon.price_unit === "per_person" ? quantity : 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "16px", borderRadius: "16px", border: `2px solid ${selected ? "#C8913A" : "rgba(226,216,194,0.7)"}`, background: selected ? "rgba(200,145,58,0.04)" : "#fff", transition: "all 0.2s" }}>
      <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: selected ? "rgba(200,145,58,0.12)" : "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.25rem" }}>
        {CATEGORY_ICONS[addon.category ?? "other"]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "#1A1208", fontSize: "0.9375rem" }}>{addon.name}</p>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-display)", color: "#1A1208", fontSize: "1.0625rem", letterSpacing: "-0.02em" }}>
              {formatCurrency(addon.price, currency)}
            </p>
            {addon.price_unit === "per_person" && <p style={{ fontFamily: "var(--font-sans)", color: "#948A7D", fontSize: "0.6875rem" }}>/person</p>}
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-sans)", color: "#7A6E60", fontSize: "0.8125rem", lineHeight: 1.5, marginTop: "3px" }}>{addon.description}</p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px" }}>
          {/* Quantity stepper */}
          {selected && addon.price_unit === "per_person" && (addon.max_quantity ?? 1) > 1 ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button onClick={() => onQty(Math.max(1, quantity - 1))}
                style={{ width: "28px", height: "28px", borderRadius: "8px", border: "1px solid #E2D8C2", background: "#fff", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>−</button>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, color: "#1A1208", minWidth: "20px", textAlign: "center" }}>{quantity}</span>
              <button onClick={() => onQty(Math.min(addon.max_quantity ?? 10, quantity + 1))}
                style={{ width: "28px", height: "28px", borderRadius: "8px", border: "1px solid #E2D8C2", background: "#fff", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>+</button>
              {quantity > 1 && <span style={{ fontSize: "0.75rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>= {formatCurrency(subtotal, currency)}</span>}
            </div>
          ) : <div />}

          {/* Toggle */}
          {!addon.is_required ? (
            <button onClick={onToggle}
              style={{ padding: "6px 16px", borderRadius: "10px", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "0.875rem", transition: "all 0.18s", background: selected ? "#C8913A" : "#F5F0E8", color: selected ? "#1A1208" : "#7A6E60" }}>
              {selected ? "✓ Added" : "Add"}
            </button>
          ) : (
            <span style={{ fontSize: "0.8125rem", color: "#4A7C3F", fontFamily: "var(--font-sans)", fontWeight: 500 }}>✓ Included</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Button styles ──────────────────────────────────────────────── */
const backBtnStyle: React.CSSProperties = {
  flex: "none", padding: "14px 20px", borderRadius: "14px",
  border: "1.5px solid rgba(226,216,194,0.8)", background: "#fff",
  color: "#7A6E60", fontFamily: "var(--font-sans)", fontWeight: 500,
  fontSize: "0.9375rem", cursor: "pointer",
};
const nextBtnStyle = (bg: string): React.CSSProperties => ({
  flex: 1, padding: "14px", borderRadius: "14px", border: "none", cursor: "pointer",
  background: bg, color: "#1A1208", fontFamily: "var(--font-sans)",
  fontWeight: 600, fontSize: "1rem", boxShadow: `0 4px 20px rgba(200,145,58,0.35)`,
});
