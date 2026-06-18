import type { BookingStatus } from "@/types";

const STATUS_CONFIG: Record<BookingStatus, { label: string; bg: string; color: string; dot: string }> = {
  pending:     { label: "Pending",     bg: "rgba(181,74,44,0.1)",  color: "#923A22", dot: "#B54A2C" },
  confirmed:   { label: "Confirmed",   bg: "rgba(74,124,63,0.1)",  color: "#2B4A24", dot: "#4A7C3F" },
  in_progress: { label: "In progress", bg: "rgba(200,145,58,0.12)", color: "#7D541A", dot: "#C8913A" },
  completed:   { label: "Completed",   bg: "rgba(26,18,8,0.07)",   color: "#3D2A12", dot: "#7A6E60" },
  cancelled:   { label: "Cancelled",   bg: "rgba(181,74,44,0.08)", color: "#923A22", dot: "#B54A2C" },
  refunded:    { label: "Refunded",    bg: "rgba(74,124,63,0.08)", color: "#2B4A24", dot: "#4A7C3F" },
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "9999px",
        background: cfg.bg,
        color: cfg.color,
        fontFamily: "var(--font-sans)",
        fontSize: "0.75rem",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}
