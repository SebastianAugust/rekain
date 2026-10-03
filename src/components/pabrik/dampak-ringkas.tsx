"use client";

import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";

import { DataContoh } from "@/components/brand/data-contoh";
import { useTransaksiSelesai } from "@/lib/data/hooks";
import { jumlahkanDampak, kgKeTon } from "@/lib/dampak";
import { formatCO2e, formatDesimal } from "@/lib/format";

/** The Beranda doorway into the full Dampak page. */
export function DampakRingkas() {
  const { data, isPending } = useTransaksiSelesai();
  const total = jumlahkanDampak(data ?? []);

  return (
    <Link
      href="/pabrik/dampak"
      className="bal group flex flex-col gap-w3 rounded-kartu permukaan p-w4 sm:flex-row sm:items-center sm:gap-w5 sm:p-w5"
    >
      {/*
        On a phone the icon and text share a row and the link drops below, so the
        copy keeps nearly the full card width. Letting the three flow and wrap
        squeezed the text into a column a few words wide.
      */}
      <span className="flex min-w-0 flex-1 items-start gap-w3 sm:gap-w4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-nila-1/45 text-nila-9 sm:size-12">
          <Leaf size={22} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-w2 gap-y-w1">
            <span className="judul-kecil text-lg text-tinta">Estimasi dampak lingkungan</span>
            <DataContoh className="whitespace-nowrap" />
          </span>
          <span className="mt-w1 block text-sm text-tinta-pudar sm:text-base">
            {isPending
              ? "Menghitung…"
              : `${formatDesimal(kgKeTon(total.limbahKg), 2)} ton dialihkan dari TPA, perkiraan ${formatCO2e(total.co2eKg)} dihindari.`}
          </span>
        </span>
      </span>
      <span className="inline-flex min-h-11 items-center gap-1 self-start font-semibold text-nila-tinta sm:self-auto">
        Lihat dampak
        <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
