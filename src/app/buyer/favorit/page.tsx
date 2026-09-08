"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { EmptyState } from "@/components/brand/empty-state";
import { Eyebrow } from "@/components/brand/eyebrow";
import { BaleCard } from "@/components/brand/bale-card";
import { BaleCardSkeletonGrid } from "@/components/brand/bale-card-skeleton";
import { FavoriteButton } from "@/components/buyer/favorite-button";
import { useFavorit, useListings } from "@/lib/data/hooks";

export default function BuyerFavoritPage() {
  const listings = useListings();
  const favorit = useFavorit();

  const isPending = listings.isPending || favorit.isPending;
  const tersimpan = (listings.data ?? []).filter((l) => favorit.data?.includes(l.id));

  return (
    <div className="mx-auto max-w-6xl px-w4 py-w4 sm:px-w5">
      <Eyebrow className="mb-w2">Favorit</Eyebrow>
      <h1 className="judul mb-w4 text-xl text-tinta">Material yang Anda simpan</h1>

      {isPending ? (
        <BaleCardSkeletonGrid count={2} />
      ) : tersimpan.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Belum ada material yang disimpan"
          description="Tekan ikon hati pada material untuk menyimpannya di sini."
          action={
            <Link
              href="/buyer"
              className="rounded-sm bg-nila-6 px-w4 py-w2 text-sm font-medium text-white hover:bg-nila-9"
            >
              Cari material
            </Link>
          }
        />
      ) : (
        <div className="grid gap-x-w4 gap-y-w3 sm:grid-cols-2">
          {tersimpan.map((l) => (
            <BaleCard
              key={l.id}
              listing={l}
              href={`/buyer/material/${l.id}`}
              action={<FavoriteButton listingId={l.id} materialLabel={l.material} />}
            />
          ))}
        </div>
      )}
    </div>
  );
}
