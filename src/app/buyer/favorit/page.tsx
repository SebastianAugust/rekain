"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { BaleCard } from "@/components/brand/bale-card";
import { BaleCardSkeletonGrid } from "@/components/brand/bale-card-skeleton";
import { EmptyState, ErrorState } from "@/components/brand/empty-state";
import { Halaman, PageHeader } from "@/components/brand/page-header";
import { tombol } from "@/components/brand/tombol";
import { FavoriteButton } from "@/components/buyer/favorite-button";
import { useFavorit, useListings } from "@/lib/data/hooks";

export default function BuyerFavoritPage() {
  const listings = useListings();
  const favorit = useFavorit();

  const isPending = listings.isPending || favorit.isPending;
  const isError = listings.isError || favorit.isError;
  const tersimpan = (listings.data ?? []).filter((l) => favorit.data?.includes(l.id));

  return (
    <Halaman>
      <PageHeader
        eyebrow="Favorit"
        title="Material yang Anda simpan"
        description="Pantau harga dan status bal yang sedang Anda pertimbangkan."
      />

      {isPending ? (
        <BaleCardSkeletonGrid count={2} />
      ) : isError ? (
        <ErrorState
          onRetry={() => {
            listings.refetch();
            favorit.refetch();
          }}
        />
      ) : tersimpan.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Belum ada material yang disimpan"
          description="Tekan ikon hati pada material untuk menyimpannya di sini."
          action={
            <Link href="/buyer" className={tombol()}>
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
    </Halaman>
  );
}
