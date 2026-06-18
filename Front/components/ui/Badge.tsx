import type { ProductType } from "@/types";

interface BadgeProps {
  type:       ProductType | "featured" | "bestseller" | "new";
  label?:     string;
  size?:      "sm" | "md";
  className?: string;
}

const CONFIG: Record<string, { label: string; bg: string; color: string; border: string }> = {
  tour:       { label: "Tour",        bg: "rgba(200,145,58,0.12)", color: "#7D541A", border: "rgba(200,145,58,0.25)" },
  transfer:   { label: "Transfer",    bg: "rgba(181,74,44,0.10)",  color: "#923A22", border: "rgba(181,74,44,0.22)"  },
  experience: { label: "Experience",  bg: "rgba(74,124,63,0.10)",  color: "#2B4A24", border: "rgba(74,124,63,0.22)"  },
  addon:      { label: "Add-on",      bg: "rgba(26,18,8,0.08)",    color: "#3D2A12", border: "rgba(26,18,8,0.15)"    },
  featured:   { label: "Featured",    bg: "rgba(200,145,58,0.14)", color: "#7D541A", border: "rgba(200,145,58,0.28)" },
  bestseller: { label: "Bestseller",  bg: "rgba(181,74,44,0.10)",  color: "#923A22", border: "rgba(181,74,44,0.22)"  },
  new:        { label: "New",         bg: "rgba(74,124,63,0.10)",  color: "#2B4A24", border: "rgba(74,124,63,0.22)"  },
};

export function Badge({ type, label, size = "md", className }: BadgeProps) {
  const cfg          = CONFIG[type] ?? CONFIG.tour;
  const displayLabel = label ?? cfg.label;
  const fontSize     = size === "sm" ? "0.5625rem" : "0.6875rem";
  const padding      = size === "sm" ? "2px 8px" : "2px 10px";

  return (
    <span
      className={className}
      style={{
        display:        "inline-flex",
        alignItems:     "center",
        borderRadius:   "9999px",
        fontFamily:     "var(--font-sans)",
        fontWeight:     500,
        fontSize,
        padding,
        letterSpacing:  "0.06em",
        textTransform:  "uppercase",
        background:     cfg.bg,
        color:          cfg.color,
        border:         `1px solid ${cfg.border}`,
        whiteSpace:     "nowrap",
      }}
    >
      {displayLabel}
    </span>
  );
}
