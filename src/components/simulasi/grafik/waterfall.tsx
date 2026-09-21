"use client";

import { useState } from "react";

import type { Proyeksi } from "@/lib/finance/hitung";
import { formatJuta } from "@/lib/format";
import { domainBagus, skalaLinear, tickBagus } from "@/lib/grafik/skala";
import {
  type Bingkai,
  Kanvas,
  KisiY,
  LabelX,
  MONO,
  WARNA,
} from "@/components/simulasi/grafik/kerangka";
import { cn } from "@/lib/utils";

const BINGKAI: Bingkai = {
  lebar: 640,
  tinggi: 300,
  atas: 14,
  kanan: 14,
  bawah: 56,
  kiri: 68,
};

const LEBAR_BATANG = 0.58;

type Langkah = { label: string; delta: number; total?: boolean };

const angkaJuta = (v: number) =>
  (v / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 0 });

export function GrafikWaterfall({ proyeksi }: { proyeksi: Proyeksi }) {
  const [indeks, setIndeks] = useState(2);
  const t = proyeksi.tahun[indeks];

  const langkah: Langkah[] = [
    { label: "Pendapatan", delta: t.totalPendapatan },
    { label: "Biaya variabel", delta: -t.totalBiayaVariabel },
    { label: "Biaya tetap", delta: -t.totalBiayaTetap },
    { label: "PPh Badan", delta: -t.pajak },
    { label: "Laba bersih", delta: t.labaBersih, total: true },
  ];

  /* Tiap batang berdiri dari total berjalan sebelumnya; batang total dari nol. */
  let berjalan = 0;
  const segmen = langkah.map((l) => {
    const mulai = l.total ? 0 : berjalan;
    const selesai = l.total ? l.delta : berjalan + l.delta;
    if (!l.total) berjalan = selesai;
    return { ...l, mulai, selesai };
  });

  const nilai = segmen.flatMap((s) => [s.mulai, s.selesai]);
  const [bawah, atas] = domainBagus(Math.min(...nilai, 0), Math.max(...nilai, 0));
  const y = skalaLinear([bawah, atas], [BINGKAI.tinggi - BINGKAI.bawah, BINGKAI.atas]);

  const lebarPlot = BINGKAI.lebar - BINGKAI.kiri - BINGKAI.kanan;
  const lebarSlot = lebarPlot / segmen.length;
  const pusat = (i: number) => BINGKAI.kiri + lebarSlot * (i + 0.5);
  const lebarBatang = lebarSlot * LEBAR_BATANG;

  return (
    <Kanvas
      judul={`Dari pendapatan ke laba bersih — Tahun ${t.tahun}`}
      catatan="Sumbu dalam Rp juta. Tiap batang berdiri dari ujung batang sebelumnya."
      aksi={<PilihTahun indeks={indeks} pilih={setIndeks} />}
      bingkai={BINGKAI}
      ringkasan={`Tahun ${t.tahun}: pendapatan ${formatJuta(
        t.totalPendapatan,
      )}, dikurangi biaya variabel ${formatJuta(
        t.totalBiayaVariabel,
      )} dan biaya tetap ${formatJuta(t.totalBiayaTetap)}, dikurangi pajak ${formatJuta(
        t.pajak,
      )}, menyisakan laba bersih ${formatJuta(t.labaBersih)}.`}
    >
      <KisiY tick={tickBagus(bawah, atas, 5)} y={y} bingkai={BINGKAI} label={angkaJuta} />

      {segmen.map((s, i) => {
        const atasKotak = Math.min(y(s.mulai), y(s.selesai));
        const tinggi = Math.max(1, Math.abs(y(s.selesai) - y(s.mulai)));
        const naik = s.selesai >= s.mulai;
        const warna = s.total ? WARNA.nila9 : naik ? WARNA.nila3 : WARNA.garisKuat;

        return (
          <g key={s.label}>
            {/* Penghubung ke batang berikutnya, supaya alurnya terbaca sebagai satu rantai. */}
            {i < segmen.length - 1 && !segmen[i + 1].total && (
              <line
                x1={pusat(i) + lebarBatang / 2}
                y1={y(s.selesai)}
                x2={pusat(i + 1) - lebarBatang / 2}
                y2={y(s.selesai)}
                stroke={WARNA.garisKuat}
                strokeWidth={1}
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
              />
            )}

            <rect
              x={pusat(i) - lebarBatang / 2}
              y={atasKotak}
              width={lebarBatang}
              height={tinggi}
              fill={warna}
              rx={1}
            />

            <text
              x={pusat(i)}
              y={atasKotak - 6}
              textAnchor="middle"
              fontFamily={MONO}
              fontSize={11}
              fontWeight={s.total ? 600 : 400}
              fill={s.delta < 0 ? WARNA.benang : WARNA.tinta}
            >
              {s.delta < 0 ? "−" : ""}
              {angkaJuta(Math.abs(s.delta))}
            </text>
          </g>
        );
      })}

      <LabelX
        bingkai={BINGKAI}
        posisi={segmen.map((s, i) => ({ x: pusat(i), teks: s.label }))}
      />
    </Kanvas>
  );
}

function PilihTahun({
  indeks,
  pilih,
}: {
  indeks: number;
  pilih: (i: number) => void;
}) {
  return (
    <div role="group" aria-label="Tahun waterfall" className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => pilih(i)}
          aria-pressed={indeks === i}
          className={cn(
            "rounded-sm px-w2 py-1 font-mono text-xs transition-colors",
            indeks === i
              ? "bg-nila-6 text-white"
              : "border border-garis text-tinta-pudar hover:border-nila-3",
          )}
        >
          T{i + 1}
        </button>
      ))}
    </div>
  );
}
