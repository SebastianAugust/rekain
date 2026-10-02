"use client";

import { useState } from "react";
import { SearchX } from "lucide-react";

import { BaleCard } from "@/components/brand/bale-card";
import { BaleCardSkeletonGrid } from "@/components/brand/bale-card-skeleton";
import { EmptyState, ErrorState } from "@/components/brand/empty-state";
import { DataContoh } from "@/components/brand/data-contoh";
import { Halaman, PageHeader } from "@/components/brand/page-header";
import { tombol } from "@/components/brand/tombol";
import { FavoriteButton } from "@/components/buyer/favorite-button";
import { SearchBar, saringListing } from "@/components/buyer/search-bar";
import { useListings } from "@/lib/data/hooks";
import { KLASTER_INLINE } from "@/lib/session";

export default function BuyerCariPage() {
  const [query, setQuery] = useState("");
  const [aktif, setAktif] = useState<string[]>([]);
  const { data, isPending, isError, refetch } = useListings();

  const semua = data ?? [];
  const hasil = saringListing(semua, query, aktif);
  const menyaring = query.trim() !== "" || aktif.length > 0;

  function reset() {
    setQuery("");
    setAktif([]);
  }

  const judul = isPending
    ? `Memuat material di ${KLASTER_INLINE}…`
    : isError
      ? `Katalog material ${KLASTER_INLINE}`
      : menyaring
        ? `${hasil.length} dari ${semua.length} material cocok`
        : `${semua.length} material tersedia di ${KLASTER_INLINE}`;

  return (
    <Halaman>
      <PageHeader eyebrow="Cari material" title={judul} action={<DataContoh />} />

      <SearchBar
        value={query}
        onValueChange={setQuery}
        aktif={aktif}
        onToggle={(id) =>
          setAktif((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))
        }
        onReset={menyaring ? reset : undefined}
      />

      {isPending ? (
        <BaleCardSkeletonGrid />
      ) : isError ? (
        <ErrorState
          title="Katalog gagal dimuat"
          description="Daftar material belum bisa diambil. Coba muat ulang sebentar lagi."
          onRetry={() => refetch()}
        />
      ) : hasil.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Tidak ada material yang cocok"
          description={
            menyaring
              ? "Coba kata kunci lain atau longgarkan filter — material baru masuk setiap hari."
              : "Belum ada material yang siap ditawarkan di klaster ini."
          }
          action={
            menyaring ? (
              <button type="button" onClick={reset} className={tombol({ nada: "garis" })}>
                Hapus pencarian dan filter
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-w4 sm:grid-cols-2 xl:grid-cols-3">
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
    </Halaman>
  );
}
