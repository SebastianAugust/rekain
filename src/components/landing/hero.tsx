"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { Eyebrow } from "@/components/brand/eyebrow";
import { PitaPenampang, type BalPita } from "@/components/brand/penampang-bal";
import { BingkaiJahit } from "@/components/brand/stitch-line";
import { DyeWash } from "@/components/brand/textile-filters";
import { tombol } from "@/components/brand/tombol";
import { useListings } from "@/lib/data/hooks";
import { formatBerat, formatRupiah } from "@/lib/format";
import { KLASTER } from "@/lib/session";
import type { Listing } from "@/lib/types";

/** Undyed stand-in while the pipeline loads — cloth that has not reached the vat. */
const PLACEHOLDER: BalPita[] = Array.from({ length: 6 }, (_, i) => ({
  id: `menunggu-${i}`,
  berat: 500,
  swatch: "#dfe5ec",
}));

/**
 * The packing slip pinned beside the headline. It turns the headline's promise
 * into a reading: this many graded bales, this much weight, prices from here.
 * Pinned a degree off square because paper tacked to a crate never sits true;
 * it straightens when you reach for it.
 */
function SuratMuat({ listings }: { listings: Listing[] | undefined }) {
  const harga = (listings ?? []).map((l) => l.harga).filter((h): h is number => h !== null);
  const baris = [
    { label: "Bal di katalog", nilai: listings ? String(listings.length) : "—" },
    {
      label: "Total berat",
      nilai: listings ? formatBerat(listings.reduce((s, l) => s + l.berat, 0)) : "—",
    },
    { label: "Harga mulai", nilai: harga.length ? `${formatRupiah(Math.min(...harga))}/kg` : "—" },
  ];

  return (
    <aside
      aria-label="Ringkasan katalog hari ini"
      className="di-kain relative hidden rotate-1 rounded-kartu permukaan px-w4 py-w4 text-tinta shadow-bal-angkat transition-transform duration-300 hover:rotate-0 lg:col-span-4 lg:block"
    >
      <BingkaiJahit />
      <div className="relative">
        <div className="flex items-baseline justify-between gap-w2">
          <Eyebrow>Surat muat · hari ini</Eyebrow>
          <span className="font-mono text-xs text-tinta-pudar">{KLASTER}</span>
        </div>
        <dl className="mt-w3 divide-y divide-garis">
          {baris.map((b) => (
            <div key={b.label} className="flex items-baseline justify-between gap-w3 py-w2">
              <dt className="text-xs text-tinta-pudar">{b.label}</dt>
              <dd className="font-mono text-base font-semibold text-tinta">{b.nilai}</dd>
            </div>
          ))}
        </dl>
        <Link
          href="/buyer"
          className="mt-w2 inline-flex items-center gap-1 rounded-input text-xs font-medium text-nila-tinta hover:underline"
        >
          Buka katalog lengkap <ArrowRight size={12} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}

/**
 * The hero is not a headline over a gradient. It is the pipeline itself: the
 * bales currently listed, in cross-section, sized by their real weight, with the
 * lower half still in the indigo vat and dye wicking up the threads.
 */
export function Hero() {
  const { data, isPending, isError } = useListings();
  const siap = !isPending && !isError;

  const bal: BalPita[] = siap
    ? (data ?? []).slice(0, 6).map((l) => ({ id: l.id, berat: l.berat, swatch: l.swatch }))
    : PLACEHOLDER;

  const totalBerat = bal.reduce((sum, b) => sum + b.berat, 0) || 1;

  return (
    <section className="celup di-nila relative overflow-hidden bg-nila-6">
      <DyeWash />

      <div className="di-atas-celup mx-auto grid max-w-6xl gap-w5 px-w4 pt-w6 pb-w5 sm:px-w5 sm:pt-w7 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <Eyebrow className="text-nila-1">Infrastruktur limbah tekstil B2B</Eyebrow>

          <h1 className="judul mt-w3 max-w-3xl text-4xl leading-none text-white sm:text-6xl">
            Lihat isi setiap bal sebelum Anda membeli.
          </h1>

          <p className="mt-w4 max-w-xl text-base text-pretty text-nila-1 sm:text-lg">
            ReKain menghubungkan pabrik garmen dengan recycler, upcycler, dan brand
            berkelanjutan. Setiap bal dinilai mutunya dan diberi harga secara transparan
            sebelum tampil di katalog Anda.
          </p>

          <div className="mt-w5 flex flex-col gap-w3 sm:flex-row sm:flex-wrap">
            <Link
              id="untuk-pabrik"
              href="/pabrik"
              className={`${tombol({ nada: "terang", ukuran: "besar" })} group scroll-mt-24`}
            >
              Jual limbah pabrik saya
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              id="untuk-buyer"
              href="/buyer"
              className={`${tombol({ nada: "garis-terang", ukuran: "besar" })} scroll-mt-24`}
            >
              Cari material daur ulang <Search size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <SuratMuat listings={siap ? data : undefined} />
      </div>

      <div className="di-atas-celup mt-w5">
        <PitaPenampang bal={bal} />

        {/*
          The manifest reads like a packing list, and it is aligned to the band
          above it: each column is exactly as wide as that bale is heavy. It sits
          on its own solid ground rather than on the textured band, so small mono
          type never has to fight a turbulent backdrop.
        */}
        <div className="hidden bg-nila-9 sm:flex" aria-hidden={!siap}>
          {bal.map((b) => (
            <div
              key={b.id}
              className="min-w-0 border-r border-nila-6 px-w2 py-w2 last:border-r-0"
              style={{ width: `${(b.berat / totalBerat) * 100}%` }}
            >
              <div className="truncate font-mono text-xs text-nila-1">{siap ? b.id : "—"}</div>
              <div className="truncate font-mono text-xs text-white">
                {siap ? formatBerat(b.berat) : ""}
              </div>
            </div>
          ))}
        </div>

        <p className="sr-only">
          {isPending
            ? "Memuat material yang tersedia."
            : isError
              ? "Daftar material belum bisa dimuat."
              : `${bal.length} bal material ditampilkan, total ${formatBerat(totalBerat)}.`}
        </p>
      </div>
    </section>
  );
}
