import type { TripBase } from "@/types";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", ar: "Arabic", fr: "French", de: "German",
  es: "Spanish", it: "Italian", ru: "Russian", zh: "Chinese",
  ja: "Japanese",
};

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "#fff", borderRadius: "14px", border: "1px solid rgba(226,216,194,0.6)" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(200,145,58,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: "0.6875rem", color: "#948A7D", fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{label}</p>
        <p style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#1A1208", fontFamily: "var(--font-sans)", marginTop: "1px" }}>{value}</p>
      </div>
    </div>
  );
}

export function TripMeta({ trip }: { trip: TripBase }) {
  const langs = trip.languages.map((l) => LANGUAGE_NAMES[l] ?? l).join(", ");

  const cancellationText =
    trip.cancellation_policy === "free_cancellation"
      ? `Free cancel${trip.cancellation_hours ? ` up to ${trip.cancellation_hours}h before` : ""}`
      : trip.cancellation_policy === "partial_refund"
        ? "Partial refund on cancellation"
        : "Non-refundable";

  const items = [
    {
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#C8913A" strokeWidth="1.4"/><path d="M8 5v3l2 1.5" stroke="#C8913A" strokeWidth="1.3" strokeLinecap="round"/></svg>,
      label: "Duration", value: trip.duration_label,
    },
    ...(trip.max_group_size ? [{
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="4.5" r="2.5" stroke="#C8913A" strokeWidth="1.4"/><circle cx="11" cy="4.5" r="2" stroke="#C8913A" strokeWidth="1.3"/><path d="M1 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#C8913A" strokeWidth="1.4" strokeLinecap="round"/><path d="M11 9c1.1.4 2 1.7 2 3.5" stroke="#C8913A" strokeWidth="1.3" strokeLinecap="round"/></svg>,
      label: "Group size", value: `Up to ${trip.max_group_size} people`,
    }] : []),
    {
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2C5 2 3 4.5 3 7c0 4 5 7 5 7s5-3 5-7c0-2.5-2-5-5-5z" stroke="#C8913A" strokeWidth="1.4"/><circle cx="8" cy="7" r="2" stroke="#C8913A" strokeWidth="1.3"/></svg>,
      label: "Languages", value: langs,
    },
    {
      icon: trip.cancellation_policy === "free_cancellation"
        ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5 6.5-7" stroke="#4A7C3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#948A7D" strokeWidth="1.4"/><path d="M8 5v3M8 10.5v.5" stroke="#948A7D" strokeWidth="1.4" strokeLinecap="round"/></svg>,
      label: "Cancellation", value: cancellationText,
    },
    ...(trip.instant_confirmation ? [{
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2l1.5 4H14l-3.5 2.5 1.5 4-3.5-2.5L5 12.5l1.5-4L3 6h4.5z" stroke="#C8913A" strokeWidth="1.4" strokeLinejoin="round"/></svg>,
      label: "Confirmation", value: "Instant",
    }] : []),
    ...(trip.pickup_included ? [{
      icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="7" width="14" height="7" rx="1.5" stroke="#C8913A" strokeWidth="1.4"/><path d="M1 8.5l3-4h8l3 4" stroke="#C8913A" strokeWidth="1.3" strokeLinecap="round"/><circle cx="5"  cy="14" r="1.5" stroke="#C8913A" strokeWidth="1.3"/><circle cx="11" cy="14" r="1.5" stroke="#C8913A" strokeWidth="1.3"/></svg>,
      label: "Pickup", value: "Included",
    }] : []),
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
      {items.map((item) => (
        <MetaItem key={item.label} {...item} />
      ))}
    </div>
  );
}
