"use client";

import Link from "next/link";
import { ArrowRight, Leaf } from "lucide-react";

import { DataContoh } from "@/components/brand/data-contoh";
import { useTransaksiPabrik } from "@/lib/data/hooks";
import { jumlahkanDampak, kgKeTon, transaksiSelesai } from "@/lib/dampak";
import { formatCO2e, formatDesimal } from "@/lib/format";

/** The Beranda doorway into the full Dampak page. */
export function DampakRingkas() {
  const { data, isPending } = useTransaksiPabrik();
  const total = jumlahkanDampak(transaksiSelesai(data ?? []));

  return (
    <Link
      href="/pabrik/dampak"
      className="bal group flex flex-wrap items-center gap-x-w5 gap-y-w3 rounded-kartu permukaan p-w5"
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-nila-1/45 text-nila-9">
        <Leaf size={22} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-w2">
          <span className="judul-kecil text-lg text-tinta">Estimasi dampak lingkungan</span>
          <DataContoh />
        </span>
        <span className="mt-w1 block text-tinta-pudar">
          {isPending
            ? "Menghitung…"
            : `${formatDesimal(kgKeTon(total.limbahKg), 2)} ton dialihkan dari TPA, perkiraan ${formatCO2e(total.co2eKg)} dihindari.`}
        </span>
      </span>
      <span className="inline-flex min-h-11 items-center gap-1 font-semibold text-nila-tinta">
        Lihat dampak
        <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
