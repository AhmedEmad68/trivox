"use client";

import { useState } from "react";
import type { FilterState } from "@/hooks/useFilterState";

interface FilterSidebarProps {
  filters:     FilterState;
  onChange:    (updates: Partial<FilterState>) => void;
  onClear:     () => void;
  activeCount: number;
  hideHeader?: boolean; // when true, skip the dark header (used inside mobile drawer)
}

/* ─── Collapsible section ─────────────────────────────────────────── */
function FilterSection({
  title, children, defaultOpen = true,
}: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: "1px solid rgba(226,216,194,0.4)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "none", border: "none", cursor: "pointer",
          padding: "14px 0", fontFamily: "var(--font-sans)", fontWeight: 500,
          fontSize: "0.875rem", color: "#1A1208", letterSpacing: "0.01em",
        }}
      >
        {title}
        <svg
          width="15" height="15" viewBox="0 0 15 15" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: "#948A7D", flexShrink: 0 }}
        >
          <path d="M3.5 5.5l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && <div style={{ paddingBottom: "16px" }}>{children}</div>}
    </div>
  );
}

/* ─── Dual range slider ───────────────────────────────────────────── */
function RangeSlider({
  min, max, valueMin, valueMax, step = 1, format, onChangeMin, onChangeMax,
}: {
  min: number; max: number; valueMin: number; valueMax: number;
  step?: number; format: (n: number) => string;
  onChangeMin: (v: number) => void; onChangeMax: (v: number) => void;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", fontWeight: 600, color: "#1A1208", background: "#F2EDE5", padding: "3px 8px", borderRadius: "7px" }}>
          {format(valueMin)}
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", fontWeight: 600, color: "#1A1208", background: "#F2EDE5", padding: "3px 8px", borderRadius: "7px" }}>
          {format(valueMax)}
        </span>
      </div>
      <div style={{ position: "relative", height: "22px" }}>
        {/* Track */}
        <div style={{ position: "absolute", top: "9px", left: 0, right: 0, height: "4px", borderRadius: "9999px", background: "#E2D8C2" }} />
        {/* Active */}
        <div style={{ position: "absolute", top: "9px", height: "4px", borderRadius: "9999px", background: "linear-gradient(90deg, #B8831A, #C8913A)", left: `${pct(valueMin)}%`, right: `${100 - pct(valueMax)}%` }} />
        {/* Min input */}
        <input type="range" min={min} max={max} step={step} value={valueMin}
          onChange={(e) => { const v = Number(e.target.value); if (v <= valueMax - step) onChangeMin(v); }}
          style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: "22px", zIndex: valueMin > max - 20 ? 2 : 1 }}
        />
        {/* Max input */}
        <input type="range" min={min} max={max} step={step} value={valueMax}
          onChange={(e) => { const v = Number(e.target.value); if (v >= valueMin + step) onChangeMax(v); }}
          style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer", height: "22px", zIndex: 2 }}
        />
        {/* Thumb min */}
        <div style={{ position: "absolute", top: "3px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", border: "2.5px solid #C8913A", boxShadow: "0 1px 5px rgba(26,18,8,0.2)", transform: "translateX(-50%)", left: `${pct(valueMin)}%`, pointerEvents: "none" }} />
        {/* Thumb max */}
        <div style={{ position: "absolute", top: "3px", width: "16px", height: "16px", borderRadius: "50%", background: "#fff", border: "2.5px solid #C8913A", boxShadow: "0 1px 5px rgba(26,18,8,0.2)", transform: "translateX(-50%)", left: `${pct(valueMax)}%`, pointerEvents: "none" }} />
      </div>
    </div>
  );
}

/* ─── Rating selector ────────────────────────────────────────────── */
function RatingSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {([0, 3, 3.5, 4, 4.5] as number[]).map((r) => {
        const active = value === r;
        return (
          <button key={r} onClick={() => onChange(r === value ? 0 : r)}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "7px 10px", borderRadius: "9px", border: "none", cursor: "pointer",
              background: active ? "#1A1208" : "transparent",
              transition: "background 0.12s",
            }}
          >
            <div style={{ display: "flex", gap: "2px" }}>
              {[1,2,3,4,5].map((s) => (
                <svg key={s} width="11" height="11" viewBox="0 0 12 12"
                  fill={s <= Math.floor(r) ? (active ? "#C8913A" : "#C8913A") : s - 0.5 <= r ? "url(#half-r)" : (active ? "rgba(255,255,255,0.15)" : "#DDD5C5")}>
                  <defs>
                    <linearGradient id="half-r">
                      <stop offset="50%" stopColor="#C8913A"/>
                      <stop offset="50%" stopColor="#DDD5C5"/>
                    </linearGradient>
                  </defs>
                  <path d="M6 1l1.236 2.504L10 3.82 8 5.77l.472 2.73L6 7.12 3.528 8.5 4 5.77 2 3.82l2.764-.316z"/>
                </svg>
              ))}
            </div>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: "0.8125rem",
              color: active ? "#FDFCFA" : "#625849", fontWeight: active ? 500 : 400,
            }}>
              {r === 0 ? "Any rating" : `${r}+ stars`}
            </span>
            {active && r > 0 && (
              <svg style={{ marginLeft: "auto" }} width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l2.5 2.5 5.5-5" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── Toggle switch ──────────────────────────────────────────────── */
function Toggle({
  label, sublabel, checked, onChange,
}: { label: string; sublabel?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", cursor: "pointer" }}
      onClick={() => onChange(!checked)}>
      <div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "#1A1208", fontWeight: checked ? 500 : 400 }}>{label}</p>
        {sublabel && <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", color: "#948A7D", marginTop: "1px" }}>{sublabel}</p>}
      </div>
      {/* Toggle pill */}
      <div style={{ width: "38px", height: "20px", borderRadius: "10px", background: checked ? "#1A1208" : "#DDD5C5", position: "relative", flexShrink: 0, transition: "background 0.18s", border: `1.5px solid ${checked ? "#1A1208" : "#C8B99A"}` }}>
        <div style={{ position: "absolute", top: "2px", left: checked ? "19px" : "2px", width: "14px", height: "14px", borderRadius: "50%", background: checked ? "#C8913A" : "#fff", boxShadow: "0 1px 3px rgba(26,18,8,0.25)", transition: "left 0.18s" }} />
      </div>
    </div>
  );
}

/* ─── Duration chips ─────────────────────────────────────────────── */
const DURATIONS = [
  { label: "Any",      value: 0  },
  { label: "< 2 hrs",  value: 2  },
  { label: "< 4 hrs",  value: 4  },
  { label: "< 8 hrs",  value: 8  },
  { label: "Full day", value: 24 },
];

/* ─── Main sidebar ───────────────────────────────────────────────── */
export function FilterSidebar({ filters, onChange, onClear, activeCount, hideHeader = false }: FilterSidebarProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: hideHeader ? "0" : "18px",
        border: hideHeader ? "none" : "1px solid rgba(214,204,184,0.7)",
        overflow: "hidden",
        boxShadow: hideHeader ? "none" : "0 2px 20px rgba(26,18,8,0.07)",
      }}
    >
      {/* Header — hidden when inside mobile drawer (drawer has its own header) */}
      {!hideHeader && (
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px",
          background: "#1A1208",
          borderBottom: "1px solid rgba(200,145,58,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M1.5 3.5h12M4 7.5h7M6.5 11.5h2" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "0.875rem", color: "#FDFCFA", letterSpacing: "0.02em" }}>
            Filters
          </span>
          {activeCount > 0 && (
            <span style={{
              background: "#C8913A", color: "#1A1208", fontSize: "0.5625rem",
              fontWeight: 700, fontFamily: "var(--font-sans)",
              borderRadius: "9999px", padding: "2px 6px",
            }}>
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={onClear}
            style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#C8913A", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
            Clear all
          </button>
        )}
      </div>
      )}

      {/* Filter sections */}
      <div style={{ padding: "4px 20px 8px" }}>

        {/* When inside drawer (no header), show inline clear row */}
        {hideHeader && activeCount > 0 && (
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 0 6px" }}>
            <button onClick={onClear}
              style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", color: "#C8913A", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>
              Clear all filters
            </button>
          </div>
        )}

        <FilterSection title="Price range">
          <RangeSlider
            min={0} max={500} step={5}
            valueMin={filters.price_min || 0}
            valueMax={filters.price_max || 500}
            format={(n) => `$${n}${n === 500 ? "+" : ""}`}
            onChangeMin={(v) => onChange({ price_min: v })}
            onChangeMax={(v) => onChange({ price_max: v })}
          />
        </FilterSection>

        <FilterSection title="Minimum rating">
          <RatingSelector value={filters.rating_min} onChange={(v) => onChange({ rating_min: v })} />
        </FilterSection>

        <FilterSection title="Duration">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {DURATIONS.map((opt) => {
              const active = filters.duration_max === opt.value;
              return (
                <button key={opt.value} onClick={() => onChange({ duration_max: active ? 0 : opt.value })}
                  style={{
                    padding: "5px 12px", borderRadius: "8px", fontSize: "0.8125rem",
                    fontFamily: "var(--font-sans)", cursor: "pointer", transition: "all 0.12s",
                    background: active ? "#1A1208" : "#F2EDE5",
                    color:      active ? "#FDFCFA" : "#625849",
                    border:     `1px solid ${active ? "#1A1208" : "rgba(214,204,184,0.7)"}`,
                    fontWeight: active ? 500 : 400,
                  }}>
                  {opt.label}
                </button>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection title="Preferences">
          <div>
            <Toggle
              label="Free cancellation" sublabel="Cancel for free up to 24h before"
              checked={filters.free_cancel} onChange={(v) => onChange({ free_cancel: v })} />
            <Toggle
              label="Instant confirmation" sublabel="No waiting for approval"
              checked={filters.instant} onChange={(v) => onChange({ instant: v })} />
          </div>
        </FilterSection>

        <FilterSection title="Destination" defaultOpen={false}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {[
              { value: "",           label: "All Egypt"  },
              { value: "cairo",      label: "Cairo"      },
              { value: "luxor",      label: "Luxor"      },
              { value: "aswan",      label: "Aswan"      },
              { value: "alexandria", label: "Alexandria" },
              { value: "hurghada",   label: "Hurghada"   },
              { value: "sinai",      label: "Sinai"      },
            ].map((d) => {
              const active = filters.location === d.value;
              return (
                <button key={d.value} onClick={() => onChange({ location: d.value })}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 10px", borderRadius: "9px", border: "none", cursor: "pointer",
                    background: active ? "#1A1208" : "transparent",
                    fontFamily: "var(--font-sans)", fontSize: "0.875rem",
                    color: active ? "#FDFCFA" : "#625849",
                    fontWeight: active ? 500 : 400,
                    transition: "background 0.12s",
                  }}>
                  <span>{d.label}</span>
                  {active && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l2.5 2.5 5.5-5" stroke="#C8913A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </FilterSection>

      </div>
    </div>
  );
}
