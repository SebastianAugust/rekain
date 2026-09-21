"use client";

import Link from "next/link";
import { Building2, ChevronLeft } from "lucide-react";

import { DipChip, type DipTone } from "@/components/brand/dip-chip";
import { Eyebrow } from "@/components/brand/eyebrow";
import { Halaman } from "@/components/brand/page-header";
import { PitaPenampang } from "@/components/brand/penampang-bal";
import { FavoriteButton } from "@/components/buyer/favorite-button";
import { OfferForm } from "@/components/buyer/offer-form";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBerat, formatRupiah } from "@/lib/format";
import type { Listing, ListingStatus } from "@/lib/types";

const STATUS_DIP: Record<ListingStatus, DipTone> = {
  "Menunggu Grading": "d0",
  Tersedia: "d6",
  "Dalam Negosiasi": "d1",
  Terjual: "d0",
};

function BackLink() {
  return (
    <Link
      href="/buyer"
      className="group mb-w4 inline-flex items-center gap-1 rounded-sm text-xs text-tinta-pudar hover:text-nila-tinta"
    >
      <ChevronLeft
        size={14}
        aria-hidden="true"
        className="transition-transform group-hover:-translate-x-0.5"
      />
      Kembali ke pencarian
    </Link>
  );
}

/** Two columns from `lg`: the lot on the left, the offer beside it, not below it. */
const KOLOM = "grid max-w-5xl gap-x-w5 gap-y-w4 lg:grid-cols-2 lg:items-start";

export function MaterialDetailSkeleton() {
  return (
    <Halaman>
      <BackLink />
      <div className={KOLOM} role="status" aria-label="Memuat material">
        <div className="overflow-hidden rounded-sm border border-garis permukaan">
          <Skeleton className="h-32 rounded-none" />
          <div className="space-y-w3 px-w4 py-w4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
        <div className="space-y-w3 rounded-sm border border-garis permukaan px-w4 py-w4">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <span className="sr-only">Memuat material…</span>
      </div>
    </Halaman>
  );
}

export function MaterialDetail({ listing }: { listing: Listing }) {
  return (
    <Halaman>
      <BackLink />

      <div className={KOLOM}>
        <article className="overflow-hidden rounded-sm border border-garis permukaan shadow-bal">
          {/*
            The full cut face of this one bale, not submerged: a buyer inspecting
            a lot needs to see the cloth itself. This is the only place natural
            fibre colour occupies real estate, and it is doing the job a product
            photo would do — everything framing it stays on the dip ladder.
          */}
          <PitaPenampang
            bal={[{ id: listing.id, berat: listing.berat, swatch: listing.swatch }]}
            terendam={false}
            tinggi={132}
          />

          <div className="px-w4 py-w4">
            <div className="flex items-start justify-between gap-w2">
              <div className="min-w-0">
                <div className="font-mono text-xs tracking-wide text-tinta-pudar">{listing.id}</div>
                <h1 className="judul text-xl text-tinta sm:text-2xl">{listing.material}</h1>
              </div>
              <div className="flex shrink-0 items-center gap-w1">
                <FavoriteButton listingId={listing.id} materialLabel={listing.material} />
                {listing.grade ? (
                  <DipChip dip="d3">GRADE {listing.grade}</DipChip>
                ) : (
                  <DipChip dip="d0">BELUM DINILAI</DipChip>
                )}
              </div>
            </div>

            <dl className="mt-w4 grid grid-cols-2 gap-x-w5 gap-y-w3 text-sm">
              <div>
                <dt className="text-xs text-tinta-pudar">Berat tersedia</dt>
                <dd className="font-mono font-medium text-tinta">{formatBerat(listing.berat)}</dd>
              </div>
              <div>
                <dt className="text-xs text-tinta-pudar">Harga</dt>
                <dd className="font-mono font-medium text-tinta">
                  {listing.harga === null
                    ? "Menunggu penilaian"
                    : `${formatRupiah(listing.harga)}/kg`}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-tinta-pudar">Lokasi</dt>
                <dd className="font-medium text-tinta">{listing.lokasi}</dd>
              </div>
              <div>
                <dt className="text-xs text-tinta-pudar">Diunggah</dt>
                <dd className="font-medium text-tinta">{listing.umur}</dd>
              </div>
            </dl>

            <div className="mt-w4 flex flex-wrap items-center justify-between gap-w2 border-t border-garis pt-w4">
              <span className="inline-flex items-center gap-w2 text-sm text-tinta">
                <Building2 size={15} className="text-nila-3" aria-hidden="true" />
                {listing.pabrik}
              </span>
              <DipChip dip={STATUS_DIP[listing.status]}>{listing.status}</DipChip>
            </div>
          </div>
        </article>

        <section
          aria-label="Ajukan penawaran"
          className="rounded-sm border border-garis permukaan px-w4 py-w4 shadow-panel"
        >
          <Eyebrow className="mb-w4">Ajukan penawaran</Eyebrow>
          <OfferForm listing={listing} />
        </section>
      </div>
    </Halaman>
  );
}
