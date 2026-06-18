"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── EMPTY STATE ──────────────────────────────────────────────────
interface EmptyStateProps {
  icon?:        React.ReactNode;
  title:        string;
  description?: string;
  action?:      { label: string; href?: string; onClick?: () => void };
  className?:   string;
  compact?:     boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center",
      compact ? "py-10 px-6" : "py-20 px-8",
      className
    )}>
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-sand-200 flex items-center justify-center mb-5 text-dusk-500">
          {icon}
        </div>
      )}
      <h3 className={cn(
        "font-display text-deep-800 mb-2",
        compact ? "text-xl" : "text-2xl"
      )}>
        {title}
      </h3>
      {description && (
        <p className="text-sm text-dusk-500 max-w-xs leading-relaxed mb-6">{description}</p>
      )}
      {action && (
        action.href ? (
          <Link href={action.href} className="btn-primary btn btn-md">
            {action.label}
          </Link>
        ) : (
          <button onClick={action.onClick} className="btn-primary btn btn-md">
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

// ─── ERROR STATE ──────────────────────────────────────────────────
interface ErrorStateProps {
  title?:       string;
  description?: string;
  onRetry?:     () => void;
  className?:   string;
}

export function ErrorState({
  title       = "Something went wrong",
  description = "We couldn't load this content. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-16 px-8",
      className
    )}>
      <div className="w-14 h-14 rounded-2xl bg-rust-500/10 flex items-center justify-center mb-5">
        <AlertIcon />
      </div>
      <h3 className="font-display text-deep-800 text-2xl mb-2">{title}</h3>
      <p className="text-sm text-dusk-500 max-w-xs leading-relaxed mb-6">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary btn btn-md">
          Try Again
        </button>
      )}
    </div>
  );
}

// ─── NO RESULTS STATE ─────────────────────────────────────────────
interface NoResultsProps {
  query?:       string;
  onClear?:     () => void;
  className?:   string;
}

export function NoResults({ query, onClear, className }: NoResultsProps) {
  return (
    <EmptyState
      icon={<SearchIcon />}
      title={query ? `No results for "${query}"` : "No trips found"}
      description="Try adjusting your filters or search for something different."
      action={onClear ? { label: "Clear filters", onClick: onClear } : undefined}
      className={className}
    />
  );
}

// ─── LOADING SPINNER ──────────────────────────────────────────────
export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };
  const strokes = { sm: "1.5", md: "1.5", lg: "1.8" };
  return (
    <svg
      className={cn("animate-spin text-gold-500", sizes[size])}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Loading…"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor"
        strokeWidth={strokes[size]} strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"
        strokeWidth={strokes[size]} strokeLinecap="round" />
    </svg>
  );
}

// ─── PAGE LOADING ─────────────────────────────────────────────────
export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <LoadingSpinner size="lg" />
    </div>
  );
}

// ─── ICONS ────────────────────────────────────────────────────────
function AlertIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-rust-500">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-dusk-500">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
