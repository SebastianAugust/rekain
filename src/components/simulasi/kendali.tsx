"use client";

import { useId } from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export type Batas = { min: number; max: number; step: number };

/**
 * Slider dengan pembacaan angka di sebelah labelnya.
 *
 * Nilainya dibaca sebagai angka tunggal, bukan rentang — Base UI mengembalikan
 * `number` ketika `value`-nya `number`.
 */
export function KendaliSlider({
  label,
  nilai,
  ubah,
  batas,
  tampilkan,
  catatan,
  dasar,
}: {
  label: string;
  nilai: number;
  ubah: (nilai: number) => void;
  batas: Batas;
  tampilkan: (nilai: number) => string;
  catatan?: string;
  /** Nilai baseline, ditandai sebagai garis kecil di bawah trek. */
  dasar?: number;
}) {
  const id = useId();
  const posisiDasar =
    dasar === undefined || batas.max === batas.min
      ? null
      : ((dasar - batas.min) / (batas.max - batas.min)) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-w2">
        <Label htmlFor={id} className="text-xs font-medium text-tinta-pudar">
          {label}
        </Label>
        <span className="font-mono text-sm font-semibold text-tinta tabular-nums">
          {tampilkan(nilai)}
        </span>
      </div>

      <div className="relative">
        <Slider
          id={id}
          value={nilai}
          onValueChange={(v) => ubah(typeof v === "number" ? v : v[0])}
          min={batas.min}
          max={batas.max}
          step={batas.step}
        />
        {posisiDasar !== null && posisiDasar >= 0 && posisiDasar <= 100 && (
          /* Penanda baseline proposal — supaya jelas seberapa jauh slider digeser. */
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 h-1.5 w-px bg-nila-9/45"
            style={{ left: `${posisiDasar}%` }}
          />
        )}
      </div>

      {catatan && <p className="text-xs text-tinta-pudar">{catatan}</p>}
    </div>
  );
}
