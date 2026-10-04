"use client";

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

const BINGKAI: Bingkai = {
  lebar: 640,
  tinggi: 280,
  atas: 14,
  kanan: 30,
  bawah: 42,
  kiri: 68,
};

/* Dua batang berdampingan per tahun; GMV ada di tabel, di sini cukup pendapatan dan laba. */
const LEBAR_BATANG = 0.34;

const angkaJuta = (v: number) =>
  (v / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 0 });

export function GrafikPertumbuhan({ proyeksi }: { proyeksi: Proyeksi }) {
  const puncak = Math.max(...proyeksi.tahun.map((t) => t.totalPendapatan), 0);
  const dasar = Math.min(...proyeksi.tahun.map((t) => t.labaBersih), 0);

  const [bawah, atas] = domainBagus(dasar, puncak);
  const y = skalaLinear([bawah, atas], [BINGKAI.tinggi - BINGKAI.bawah, BINGKAI.atas]);

  const lebarPlot = BINGKAI.lebar - BINGKAI.kiri - BINGKAI.kanan;
  const lebarSlot = lebarPlot / proyeksi.tahun.length;
  const pusat = (i: number) => BINGKAI.kiri + lebarSlot * (i + 0.5);
  const lebar = lebarSlot * LEBAR_BATANG;

  const batang = (i: number, sisi: -1 | 1, nilai: number, warna: string) => {
    const x = sisi < 0 ? pusat(i) - lebar - 1.5 : pusat(i) + 1.5;
    const y0 = y(0);
    const y1 = y(nilai);
    return (
      <g>
        <rect x={x} y={Math.min(y0, y1)} width={lebar} height={Math.abs(y1 - y0)} fill={warna} rx={1} />
        <text
          x={x + lebar / 2}
          y={nilai >= 0 ? y1 - 6 : y1 + 12}
          textAnchor="middle"
          fontFamily={MONO}
          fontSize={11}
          fill={WARNA.tinta}
        >
          {angkaJuta(nilai)}
        </text>
      </g>
    );
  };

  return (
    <Kanvas
      judul="Pendapatan dan laba bersih tiga tahun"
      catatan="Sumbu dan label dalam Rp juta."
      legenda={[
        { warna: WARNA.nila3, teks: "Pendapatan" },
        { warna: WARNA.nila6, teks: "Laba bersih" },
      ]}
      bingkai={BINGKAI}
      ringkasan={proyeksi.tahun
        .map(
          (t) =>
            `Tahun ${t.tahun}: pendapatan ${formatJuta(t.totalPendapatan)}, laba bersih ${formatJuta(t.labaBersih)}.`,
        )
        .join(" ")}
    >
      <KisiY tick={tickBagus(bawah, atas, 5)} y={y} bingkai={BINGKAI} label={angkaJuta} />

      {proyeksi.tahun.map((t, i) => (
        <g key={t.tahun}>
          {batang(i, -1, t.totalPendapatan, WARNA.nila3)}
          {batang(i, 1, t.labaBersih, WARNA.nila6)}
        </g>
      ))}

      <LabelX
        tebal
        bingkai={BINGKAI}
        posisi={proyeksi.tahun.map((t, i) => ({ x: pusat(i), teks: `Tahun ${t.tahun}` }))}
      />
    </Kanvas>
  );
}
