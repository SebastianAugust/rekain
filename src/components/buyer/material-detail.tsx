"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Building2, ChevronLeft, Send } from "lucide-react";

import { DipChip } from "@/components/brand/dip-chip";
import { Eyebrow } from "@/components/brand/eyebrow";
import { Halaman } from "@/components/brand/page-header";
import { MaterialSwatch } from "@/components/brand/material-swatch";
import { LISTING_DIP } from "@/components/brand/status-dip";
import { FavoriteButton } from "@/components/buyer/favorite-button";
import { OfferForm } from "@/components/buyer/offer-form";
import { tombol } from "@/components/brand/tombol";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBerat, formatRupiah } from "@/lib/format";
import type { Listing } from "@/lib/types";

function BackLink() {
  return (
    <Link
      href="/buyer"
      className="group mb-w4 inline-flex min-h-11 items-center gap-1 rounded-full pr-w3 text-sm text-tinta-pudar hover:text-nila-tinta"
    >
      <ChevronLeft
        size={18}
        strokeWidth={1.8}
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
        <div className="rounded-kartu permukaan p-w5 shadow-bal">
          <Skeleton className="h-44 rounded-kartu" />
          <div className="space-y-w3 pt-w5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
        <div className="space-y-w3 rounded-kartu permukaan p-w5 shadow-bal">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <span className="sr-only">Memuat material…</span>
      </div>
    </Halaman>
  );
}

/**
 * Phones only: the offer form sits below the whole lot description, a long scroll
 * away, so the price and the one action stay pinned above the tab bar. It steps
 * aside once the form itself is on screen, so the action is never offered twice.
 */
function BarPenawaran({ listing }: { listing: Listing }) {
  const [formTerlihat, setFormTerlihat] = useState(false);

  useEffect(() => {
    const form = document.getElementById("penawaran");
    if (!form) return;
    // The bottom 40% of the screen does not count: a form peeking out from behind the
    // tab bar is not "on screen" yet, and the action should still be one tap away.
    const pengamat = new IntersectionObserver(([e]) => setFormTerlihat(e.isIntersecting), {
      rootMargin: "0px 0px -40% 0px",
    });
    pengamat.observe(form);
    return () => pengamat.disconnect();
  }, []);

  if (listing.harga === null || listing.status !== "Tersedia" || formTerlihat) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(3.5rem+var(--aman-bawah))] z-20 flex items-center justify-between gap-w3 border-t border-garis bg-white/90 px-w4 py-w2 backdrop-blur-xl md:hidden">
      <p className="judul min-w-0 text-2xl tabular-nums text-tinta">
        {formatRupiah(listing.harga)}
        <span className="ml-0.5 text-sm font-semibold tracking-normal text-tinta-pudar">/kg</span>
      </p>
      <a href="#penawaran" className={tombol()}>
        <Send size={18} strokeWidth={1.8} aria-hidden="true" /> Ajukan penawaran
      </a>
    </div>
  );
}

export function MaterialDetail({ listing }: { listing: Listing }) {
  return (
    <Halaman className="max-md:pb-w7">
      <BarPenawaran listing={listing} />
      <BackLink />

      <div className={KOLOM}>
        <article className="rounded-kartu permukaan p-w5 shadow-bal">
          {/* The swatch is the cloth itself, large: it does the job a product photo would. */}
          <MaterialSwatch
            material={listing.material}
            seed={listing.id}
            className="h-32 w-full rounded-kartu sm:h-52"
          />

          <div className="mt-w5 flex items-start justify-between gap-w2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-w2 gap-y-w1">
              <span className="font-mono text-xs tracking-wide text-tinta-pudar">{listing.id}</span>
              {listing.grade ? (
                <DipChip dip="d3">GRADE {listing.grade}</DipChip>
              ) : (
                <DipChip dip="d0">BELUM DINILAI</DipChip>
              )}
            </div>
            <div className="-my-w2 -mr-w2 shrink-0">
              <FavoriteButton listingId={listing.id} materialLabel={listing.material} />
            </div>
          </div>

          <h1 className="judul mt-w2 text-[1.75rem] leading-[1.15] text-tinta sm:text-4xl">{listing.material}</h1>

          <p className="judul mt-w2 text-4xl tabular-nums text-tinta sm:mt-w3 sm:text-5xl">
            {listing.harga === null ? (
              <span className="text-2xl text-tinta-pudar">Harga menunggu penilaian</span>
            ) : (
              <>
                {formatRupiah(listing.harga)}
                <span className="ml-1 text-lg font-semibold tracking-normal text-tinta-pudar">/kg</span>
              </>
            )}
          </p>

          <dl className="mt-w5 grid grid-cols-2 gap-x-w4 gap-y-w3 border-t border-garis pt-w4 sm:gap-x-w5 sm:gap-y-w4 sm:pt-w5">
            <div>
              <dt className="text-sm text-tinta-pudar">Berat tersedia</dt>
              <dd className="judul text-2xl tabular-nums text-tinta">{formatBerat(listing.berat)}</dd>
            </div>
            <div>
              <dt className="text-sm text-tinta-pudar">Lokasi</dt>
              <dd className="judul-kecil text-base text-tinta sm:text-lg">{listing.lokasi}</dd>
            </div>
            <div>
              <dt className="text-sm text-tinta-pudar">Diunggah</dt>
              <dd className="font-medium text-tinta">{listing.umur}</dd>
            </div>
            <div>
              <dt className="text-sm text-tinta-pudar">Status</dt>
              <dd className="mt-0.5">
                <DipChip dip={LISTING_DIP[listing.status]}>{listing.status}</DipChip>
              </dd>
            </div>
          </dl>

          <p className="mt-w5 inline-flex items-center gap-w2 text-tinta">
            <Building2 size={18} strokeWidth={1.8} className="text-nila-3" aria-hidden="true" />
            {listing.pabrik}
          </p>
        </article>

        <section
          id="penawaran"
          aria-label="Ajukan penawaran"
          className="scroll-mt-w4 rounded-kartu permukaan p-w5 shadow-bal lg:sticky lg:top-w5"
        >
          <Eyebrow className="mb-w4">Ajukan penawaran</Eyebrow>
          <OfferForm listing={listing} />
        </section>
      </div>
    </Halaman>
  );
}
