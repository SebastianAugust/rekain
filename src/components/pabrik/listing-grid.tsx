"use client";

import Link from "next/link";
import { Package, Plus } from "lucide-react";

import { EmptyState } from "@/components/brand/empty-state";
import { BaleCard } from "@/components/brand/bale-card";
import { BaleCardSkeletonGrid } from "@/components/brand/bale-card-skeleton";
import type { Listing } from "@/lib/types";

/** Handles all three states of a factory's listing grid: loading, empty, populated. */
export function ListingGrid({
  listings,
  isPending,
  compact,
}: {
  listings: Listing[] | undefined;
  isPending: boolean;
  compact?: boolean;
}) {
  if (isPending) return <BaleCardSkeletonGrid count={compact ? 2 : 4} compact={compact} />;

  if (!listings || listings.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="Belum ada material diunggah"
        description="Unggah limbah pertama Anda untuk mulai digrading dan ditawarkan ke buyer."
        action={
          <Link
            href="/pabrik/upload"
            className="inline-flex items-center gap-1.5 rounded-sm bg-nila-6 px-w3 py-w2 text-xs font-medium text-white hover:bg-nila-9"
          >
            <Plus size={13} aria-hidden="true" /> Upload Limbah
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
