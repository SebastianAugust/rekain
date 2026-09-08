"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";

import { EmptyState } from "@/components/brand/empty-state";
import { Eyebrow } from "@/components/brand/eyebrow";
import { BaleCard } from "@/components/brand/bale-card";
import { BaleCardSkeletonGrid } from "@/components/brand/bale-card-skeleton";
import { FavoriteButton } from "@/components/buyer/favorite-button";
import { SearchBar } from "@/components/buyer/search-bar";
import { useListings } from "@/lib/data/hooks";
import { KLASTER_INLINE } from "@/lib/session";

export default function BuyerCariPage() {
  const [query, setQuery] = useState("");
  const { data, isPending } = useListings();

  const hasil = (data ?? []).filter((l) =>
    l.material.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl px-w4 py-w4 sm:px-w5">
      <Eyebrow className="mb-w2">Cari Material</Eyebrow>
      <h1 className="judul mb-w4 text-xl text-tinta">
        {isPending
          ? `Memuat material di ${KLASTER_INLINE}…`
          : `${hasil.length} material tersedia di ${KLASTER_INLINE}`}
      </h1>

      <SearchBar value={query} onValueChange={setQuery} />

      {isPending ? (
        <BaleCardSkeletonGrid />
      ) : hasil.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Tidak ada material yang cocok"
          description={
            query
              ? `Tidak ada material yang cocok dengan "${query}". Coba kata kunci lain.`
              : "Belum ada material yang siap ditawarkan di klaster ini."
          }
        />
      ) : (
        <div className="grid gap-x-w4 gap-y-w3 sm:grid-cols-2">
          {hasil.map((l) => (
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
