"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { Eyebrow } from "@/components/brand/eyebrow";
import { PitaPenampang, type BalPita } from "@/components/brand/penampang-bal";
import { DyeWash } from "@/components/brand/textile-filters";
import { useListings } from "@/lib/data/hooks";
import { formatBerat } from "@/lib/format";

/** Undyed stand-in while the pipeline loads — cloth that has not reached the vat. */
const PLACEHOLDER: BalPita[] = Array.from({ length: 6 }, (_, i) => ({
  id: `menunggu-${i}`,
  berat: 500,
  swatch: "#dfe5ec",
}));

/**
 * The hero is not a headline over a gradient. It is the pipeline itself: the
 * bales currently listed, in cross-section, sized by their real weight, with the
 * lower half still submerged in the indigo vat.
 *
 * That waterline is a jittered path run through a displacement filter, not a
 * linear-gradient. A soft blue-to-blue fade is the most templated move available
 * on a navy hero and it would flatten everything the texture work is for.
 */
export function Hero() {
  const { data, isPending } = useListings();

  const bal: BalPita[] = isPending
    ? PLACEHOLDER
    : (data ?? []).slice(0, 6).map((l) => ({ id: l.id, berat: l.berat, swatch: l.swatch }));

  const totalBerat = bal.reduce((sum, b) => sum + b.berat, 0) || 1;

  return (
    <section className="celup di-nila relative overflow-hidden bg-nila-6">
      <DyeWash />

      <div className="di-atas-celup mx-auto max-w-6xl px-w4 pt-w6 pb-w5 sm:px-w5 sm:pt-w7">
        <Eyebrow className="text-nila-1">Infrastruktur limbah tekstil B2B</Eyebrow>

        <h1 className="judul mt-w3 max-w-3xl text-4xl leading-none text-white sm:text-6xl">
          Lihat isi balnya sebelum Anda beli.
        </h1>

        <p className="mt-w4 max-w-xl text-base text-nila-1">
          ReKain menghubungkan pabrik garmen dengan recycler, upcycler, dan brand berkelanjutan.
          Setiap bal digrading dan dihargai terbuka sebelum sampai ke daftar Anda.
        </p>

        <div className="mt-w5 flex flex-col gap-w3 sm:flex-row sm:flex-wrap">
          <Link
            id="untuk-pabrik"
            href="/pabrik"
            className="inline-flex scroll-mt-24 items-center justify-center gap-w2 rounded-sm bg-nila-1 px-w4 py-w3 text-sm font-semibold text-nila-9 hover:bg-white"
          >
            Jual limbah pabrik saya <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            id="untuk-buyer"
            href="/buyer"
            className="inline-flex scroll-mt-24 items-center justify-center gap-w2 rounded-sm border border-nila-3 px-w4 py-w3 text-sm font-medium text-white hover:bg-nila-9"
          >
            Cari material daur ulang <Search size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="di-atas-celup mt-w5">
        <PitaPenampang bal={bal} />

        {/*
          The manifest reads like a packing list, and it is aligned to the band
          above it: each column is exactly as wide as that bale is heavy. It sits
          on its own solid ground rather than on the textured band, so small mono
          type never has to fight a turbulent backdrop.
        */}
        <div className="hidden bg-nila-9 sm:flex" aria-hidden={isPending}>
          {bal.map((b) => (
            <div
              key={b.id}
              className="min-w-0 border-r border-nila-6 px-w2 py-w2 last:border-r-0"
              style={{ width: `${(b.berat / totalBerat) * 100}%` }}
            >
              <div className="truncate font-mono text-xs text-nila-1">
                {isPending ? "—" : b.id}
              </div>
              <div className="truncate font-mono text-xs text-white">
                {isPending ? "" : formatBerat(b.berat)}
              </div>
            </div>
          ))}
        </div>

        <p className="sr-only">
          {isPending
            ? "Memuat material yang tersedia."
            : `${bal.length} bal material tersedia, total ${formatBerat(totalBerat)}.`}
        </p>
      </div>
    </section>
  );
}
