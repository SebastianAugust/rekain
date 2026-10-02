"use client";

import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

/** Di bawah ini, perubahannya cuma derau pembulatan, bukan pergeseran skenario. */
const AMBANG = 0.0005;

/**
 * Seberapa jauh skenario saat ini menyimpang dari baseline proposal.
 *
 * `lebihKecilLebihBaik` untuk metrik seperti payback: bulan ke-15 itu kabar baik
 * meski angkanya turun, jadi warnanya tidak boleh ikut aturan naik=hijau.
 */
export function BadgeDeviasi({
  nilai,
  dasar,
  lebihKecilLebihBaik,
  className,
}: {
  nilai: number | null;
  dasar: number | null;
  lebihKecilLebihBaik?: boolean;
  className?: string;
}) {
  if (nilai === null || dasar === null || dasar === 0 || !Number.isFinite(dasar)) {
    return null;
  }

  const delta = (nilai - dasar) / Math.abs(dasar);

  if (Math.abs(delta) < AMBANG) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-input bg-kain px-1.5 py-0.5 font-mono text-xs text-tinta-pudar tabular-nums",
          className,
        )}
      >
        <Minus size={11} aria-hidden="true" />
        sama dengan baseline
      </span>
    );
  }

  const naik = delta > 0;
  const membaik = lebihKecilLebihBaik ? !naik : naik;
  const Ikon = naik ? TrendingUp : TrendingDown;
  const persen = Math.abs(delta * 100);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-input px-1.5 py-0.5 font-mono text-xs tabular-nums",
        membaik ? "bg-nila-1/45 text-nila-9" : "bg-kain text-benang",
        className,
      )}
    >
      <Ikon size={11} aria-hidden="true" />
      {naik ? "+" : "−"}
      {persen.toLocaleString("id-ID", {
        minimumFractionDigits: persen < 10 ? 1 : 0,
        maximumFractionDigits: persen < 10 ? 1 : 0,
      })}
      % dari baseline
    </span>
  );
}

export function KartuMetrik({
  label,
  nilai,
  catatan,
  badge,
  sorot,
  className,
}: {
  label: string;
  nilai: string;
  catatan?: string;
  badge?: React.ReactNode;
  /** Kartu utama di mode presentasi: ditinggikan dan dicelup. */
  sorot?: boolean;
  className?: string;
}) {
  if (sorot) {
    return (
      <div
        className={cn(
          "celup di-nila relative overflow-hidden rounded-kartu bg-nila-6 px-w4 py-w3 shadow-bal",
          className,
        )}
      >
        <div className="di-atas-celup">
          <div className="font-mono text-xs tracking-widest text-nila-1 uppercase">
            {label}
          </div>
          <div className="judul mt-w2 font-mono text-3xl leading-none text-white tabular-nums sm:text-4xl">
            {nilai}
          </div>
          {catatan && <p className="mt-w2 text-xs text-nila-1">{catatan}</p>}
          {badge && <div className="mt-w2">{badge}</div>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-kartu border border-garis permukaan px-w4 py-w3 shadow-panel",
        className,
      )}
    >
      <div className="font-mono text-xs tracking-widest text-nila-tinta uppercase">
        {label}
      </div>
      <div className="mt-w2 font-mono text-2xl leading-none font-semibold text-tinta tabular-nums">
        {nilai}
      </div>
      {catatan && <p className="mt-w2 text-xs text-tinta-pudar">{catatan}</p>}
      {badge && <div className="mt-w2">{badge}</div>}
    </div>
  );
}
