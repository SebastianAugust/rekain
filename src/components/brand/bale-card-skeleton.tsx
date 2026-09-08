import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder that keeps the bale silhouette, so lists do not jump. */
export function BaleCardSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div
      className="relative min-w-0 overflow-hidden rounded-sm border border-garis permukaan"
      aria-hidden="true"
    >
      {/* The binding edge stays, undyed — the cross-section is not known yet. */}
      <div className="absolute inset-y-0 left-0 bg-garis" style={{ width: 18 }} />
      <div
        className={compact ? "space-y-w2 px-w3 py-w2" : "space-y-w2 px-w4 py-w3"}
        style={{ marginLeft: 18 }}
      >
        <Skeleton className="h-2.5 w-20 bg-kain" />
        <Skeleton className="h-4 w-40 bg-kain" />
        <Skeleton className="h-3 w-32 bg-kain" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-4 w-24 bg-kain" />
          <Skeleton className="h-4 w-16 bg-kain" />
        </div>
      </div>
    </div>
  );
}

/** A grid of skeletons matching the real listing grid, including its grain. */
export function BaleCardSkeletonGrid({
  count = 4,
  compact,
  className = "grid gap-x-w4 gap-y-w3 sm:grid-cols-2",
}: {
  count?: number;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={className} role="status" aria-label="Memuat material">
      {Array.from({ length: count }, (_, i) => (
        <BaleCardSkeleton key={i} compact={compact} />
      ))}
      <span className="sr-only">Memuat material…</span>
    </div>
  );
}
