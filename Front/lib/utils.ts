import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// ─── CLASS MERGE ─────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── CURRENCY FORMATTER ──────────────────────────────────────────
export function formatCurrency(
  amount: number,
  currency = "USD",
  locale = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── DATE FORMATTERS ─────────────────────────────────────────────
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", options).format(d);
}

export function formatRelativeDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// ─── DURATION FORMATTER ───────────────────────────────────────────
export function formatDuration(hours?: number, days?: number): string {
  if (days && days >= 1) {
    if (days === 1) return "Full day";
    return `${days} days`;
  }
  if (hours) {
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    if (hours === 1) return "1 hour";
    return hours % 1 === 0 ? `${hours} hours` : `${hours} hrs`;
  }
  return "";
}

// ─── SLUG FORMATTER ───────────────────────────────────────────────
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ─── BOOKING REFERENCE ────────────────────────────────────────────
export function formatBookingRef(id: number): string {
  return `RH-${new Date().getFullYear()}-${String(id).padStart(6, "0")}`;
}

// ─── TRUNCATE TEXT ─────────────────────────────────────────────────
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return `${str.slice(0, length)}…`;
}

// ─── PERCENTAGE ────────────────────────────────────────────────────
export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

// ─── PRODUCT TYPE LABELS ──────────────────────────────────────────
export function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    tour:       "Tour",
    transfer:   "Transfer",
    experience: "Experience",
    addon:      "Add-on",
  };
  return labels[type] ?? type;
}

// ─── BUILD QUERY STRING ───────────────────────────────────────────
export function buildQueryString(params: Record<string, unknown>): string {
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "" && v !== false
  );
  if (!filtered.length) return "";
  return "?" + new URLSearchParams(
    filtered.map(([k, v]) => [k, String(v)])
  ).toString();
}

// ─── DEBOUNCE ────────────────────────────────────────────────────
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ─── CLAMP ────────────────────────────────────────────────────────
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
