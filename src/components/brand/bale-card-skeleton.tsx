import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder that keeps the card silhouette, so lists do not jump. */
export function BaleCardSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div
      className={`relative min-w-0 rounded-kartu permukaan shadow-bal ${compact ? "p-w3" : "p-w4"}`}
      aria-hidden="true"
    >
      <div className="flex items-start gap-w3">
        <Skeleton className={`shrink-0 rounded-thumb bg-kain ${compact ? "size-14" : "size-16"}`} />
        <div className="min-w-0 flex-1 space-y-w2">
          <Skeleton className="h-3 w-24 bg-kain" />
          <Skeleton className="h-5 w-40 bg-kain" />
          <Skeleton className="h-3.5 w-32 bg-kain" />
        </div>
      </div>
      <div className="mt-w4 flex items-end justify-between">
        <Skeleton className="h-8 w-28 bg-kain" />
        <Skeleton className="h-6 w-20 rounded-full bg-kain" />
      </div>
    </div>
  );
}

/** A grid of skeletons matching the real listing grid. */
export function BaleCardSkeletonGrid({
  count = 4,
  compact,
  className = "grid gap-w4 sm:grid-cols-2 xl:grid-cols-3",
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
