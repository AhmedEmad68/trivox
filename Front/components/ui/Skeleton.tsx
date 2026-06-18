function Shimmer({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton${className ? " " + className : ""}`} style={style} />;
}

export function TripCardSkeleton({ variant = "default" }: { variant?: "default" | "horizontal" }) {
  if (variant === "horizontal") {
    return (
      <div className="card-base flex overflow-hidden" style={{ height: "176px" }}>
        <Shimmer className="w-48 flex-shrink-0 rounded-none" />
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <Shimmer className="h-3 w-20" />
            <Shimmer className="h-5 w-full" />
            <Shimmer className="h-5 w-3/4" />
          </div>
          <div className="flex justify-between items-center">
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-6 w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-base overflow-hidden">
      <Shimmer className="w-full rounded-none" style={{ aspectRatio: "4/3" }} />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-3 w-16" />
        </div>
        <Shimmer className="h-6 w-full" />
        <Shimmer className="h-5 w-4/5" />
        <div className="flex justify-between pt-2" style={{ borderTop: "1px solid rgba(226,216,194,0.4)" }}>
          <Shimmer className="h-4 w-20" />
          <Shimmer className="h-6 w-14" />
        </div>
      </div>
    </div>
  );
}

export function SectionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => <TripCardSkeleton key={i} />)}
    </div>
  );
}

export function TextSkeleton({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={`flex flex-col gap-2${className ? " " + className : ""}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer key={i} className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}
