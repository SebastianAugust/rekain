"use client";

import Link from "next/link";
import { Package, Plus } from "lucide-react";

import { BaleCard } from "@/components/brand/bale-card";
import { BaleCardSkeletonGrid } from "@/components/brand/bale-card-skeleton";
import { EmptyState, ErrorState } from "@/components/brand/empty-state";
import { tombol } from "@/components/brand/tombol";
import type { Listing } from "@/lib/types";

/** All four states of a factory's listing grid: loading, failed, empty, populated. */
export function ListingGrid({
  listings,
  isPending,
  isError,
  onRetry,
  compact,
}: {
  listings: Listing[] | undefined;
  isPending: boolean;
  isError?: boolean;
  onRetry?: () => void;
  compact?: boolean;
}) {
  if (isPending) return <BaleCardSkeletonGrid count={compact ? 2 : 4} compact={compact} />;

  if (isError) {
    return <ErrorState title="Listing gagal dimuat" onRetry={onRetry} />;
  }

  if (!listings || listings.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Belum ada material diunggah"
        description="Unggah limbah pertama Anda. Tim kami menilai mutunya, lalu menawarkannya ke buyer yang cocok."
        action={
          <Link href="/pabrik/upload" className={tombol()}>
            <Plus size={14} aria-hidden="true" /> Upload Limbah
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-x-w4 gap-y-w3 sm:grid-cols-2">
      {listings.map((l) => (
        <BaleCard key={l.id} listing={l} compact={compact} />
      ))}
    </div>
  );
}
