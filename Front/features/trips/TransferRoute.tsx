import type { Transfer } from "@/types";
import Image from "next/image";

const VEHICLE_LABELS: Record<string, string> = {
  economy_car:  "Economy Car",
  standard_car: "Standard Car",
  premium_car:  "Premium Car",
  minivan:      "Minivan",
  minibus:      "Minibus",
  coach:        "Coach",
  boat:         "Boat",
  speedboat:    "Speedboat",
};

export function TransferRoute({ transfer }: { transfer: Transfer }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Route card */}
      <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.6)", padding: "24px", boxShadow: "0 2px 12px rgba(26,18,8,0.06)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "#1A1208", marginBottom: "20px", letterSpacing: "-0.01em" }}>Route</h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {/* Pickup */}
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(200,145,58,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2C6 2 4 4.5 4 7c0 4 5 9 5 9s5-5 5-9c0-2.5-2-5-5-5z" stroke="#C8913A" strokeWidth="1.5"/>
                  <circle cx="9" cy="7" r="2" stroke="#C8913A" strokeWidth="1.4"/>
                </svg>
              </div>
              <div style={{ width: "2px", height: "32px", background: "linear-gradient(to bottom, #C8913A, #EDE5D5)", margin: "6px 0" }} />
            </div>
            <div style={{ paddingTop: "8px" }}>
              <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#C8913A", fontFamily: "var(--font-sans)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>Pickup</p>
              <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)", lineHeight: 1.3 }}>{transfer.pickup_location}</p>
              {transfer.pickup_address && (
                <p style={{ fontSize: "0.8125rem", color: "#948A7D", fontFamily: "var(--font-sans)", marginTop: "2px" }}>{transfer.pickup_address}</p>
              )}
            </div>
          </div>

          {/* Journey details */}
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ width: "40px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                {transfer.estimated_time && (
                  <span style={{ fontSize: "0.625rem", color: "#948A7D", fontFamily: "var(--font-sans)", whiteSpace: "nowrap" }}>{transfer.estimated_time}</span>
                )}
                {transfer.distance_km && (
                  <span style={{ fontSize: "0.625rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>{transfer.distance_km} km</span>
                )}
              </div>
            </div>
            <div style={{ flex: 1, height: "1px", background: "rgba(226,216,194,0.6)", margin: "0 8px" }} />
          </div>

          {/* Dropoff */}
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(26,18,8,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="8" width="12" height="8" rx="2" stroke="#1A1208" strokeWidth="1.5"/>
                  <path d="M1 8l2-4h12l2 4" stroke="#1A1208" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="6"  cy="14" r="2" stroke="#1A1208" strokeWidth="1.3"/>
                  <circle cx="12" cy="14" r="2" stroke="#1A1208" strokeWidth="1.3"/>
                </svg>
              </div>
            </div>
            <div style={{ paddingTop: "8px" }}>
              <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#1A1208", fontFamily: "var(--font-sans)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>Drop-off</p>
              <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)", lineHeight: 1.3 }}>{transfer.dropoff_location}</p>
              {transfer.dropoff_address && (
                <p style={{ fontSize: "0.8125rem", color: "#948A7D", fontFamily: "var(--font-sans)", marginTop: "2px" }}>{transfer.dropoff_address}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle card */}
      <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.6)", padding: "24px" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "#1A1208", marginBottom: "16px", letterSpacing: "-0.01em" }}>Your vehicle</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {transfer.vehicle_image ? (
            <div style={{ position: "relative", width: "80px", height: "56px", borderRadius: "10px", overflow: "hidden", flexShrink: 0 }}>
              <Image src={transfer.vehicle_image} alt={transfer.vehicle_model ?? "Vehicle"} fill className="object-cover" />
            </div>
          ) : (
            <div style={{ width: "80px", height: "56px", borderRadius: "10px", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="36" height="24" viewBox="0 0 36 24" fill="none">
                <rect x="1" y="8" width="34" height="14" rx="3" stroke="#948A7D" strokeWidth="1.5"/>
                <path d="M1 11l5-8h24l5 8" stroke="#948A7D" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="9"  cy="20" r="3" stroke="#948A7D" strokeWidth="1.5"/>
                <circle cx="27" cy="20" r="3" stroke="#948A7D" strokeWidth="1.5"/>
              </svg>
            </div>
          )}
          <div>
            <p style={{ fontSize: "1rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)" }}>
              {VEHICLE_LABELS[transfer.vehicle_type] ?? transfer.vehicle_type}
            </p>
            {transfer.vehicle_model && (
              <p style={{ fontSize: "0.8125rem", color: "#948A7D", fontFamily: "var(--font-sans)", marginTop: "2px" }}>{transfer.vehicle_model}</p>
            )}
            <div style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "#7A6E60", fontFamily: "var(--font-sans)" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="4.5" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.2"/><circle cx="8.5" cy="3.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 10c0-1.93 1.57-3.5 3.5-3.5S8 8.07 8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8.5 6.5c.9.3 1.5 1.2 1.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                Up to {transfer.max_passengers} passengers
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "#7A6E60", fontFamily: "var(--font-sans)" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="2" y="1" width="8" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4h4M4 7h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                {transfer.max_luggage} bags
              </span>
            </div>
          </div>
        </div>

        {/* Flight tracking badge */}
        {transfer.flight_tracking && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px", padding: "10px 12px", borderRadius: "10px", background: "rgba(74,124,63,0.08)", border: "1px solid rgba(74,124,63,0.2)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10l2-2 1.5.5L10 3l.5 1.5-2 4.5L10 10l-2.5-1L7 11l-1.5-1.5L4 11l-2-1z" stroke="#4A7C3F" strokeWidth="1.2" strokeLinejoin="round"/></svg>
            <span style={{ fontSize: "0.8125rem", color: "#3A6331", fontFamily: "var(--font-sans)", fontWeight: 500 }}>
              Flight tracking included — driver monitors your arrival in real-time
            </span>
          </div>
        )}
      </div>

      {/* Driver card */}
      {transfer.driver_name && (
        <div style={{ background: "#fff", borderRadius: "20px", border: "1px solid rgba(226,216,194,0.6)", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ position: "relative", width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#EDE5D5" }}>
            {transfer.driver_avatar && <Image src={transfer.driver_avatar} alt={transfer.driver_name} fill className="object-cover" />}
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", color: "#948A7D", fontFamily: "var(--font-sans)", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 500 }}>Your driver</p>
            <p style={{ fontSize: "1rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)" }}>{transfer.driver_name}</p>
          </div>
          {transfer.wait_time_minutes && (
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <p style={{ fontSize: "0.6875rem", color: "#948A7D", fontFamily: "var(--font-sans)" }}>Wait time</p>
              <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)" }}>{transfer.wait_time_minutes} min free</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
