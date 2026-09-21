"use client";

import type { Proyeksi } from "@/lib/finance/hitung";
import { formatJuta } from "@/lib/format";
import { domainBagus, skalaLinear, tickBagus } from "@/lib/grafik/skala";
import {
  type Bingkai,
  Kanvas,
  KisiY,
  LabelX,
  WARNA,
} from "@/components/simulasi/grafik/kerangka";

const BINGKAI: Bingkai = {
  lebar: 640,
  tinggi: 280,
  atas: 14,
  kanan: 14,
  bawah: 42,
  kiri: 68,
};

/*
  Batang bersarang, bukan berkelompok. GMV berorde miliar sementara laba bersih
  berorde puluhan juta — disandingkan berdampingan, batang laba tinggal sisa
  piksel. Disarangkan, perbandingan itu justru jadi isi ceritanya: dari seluruh
  nilai transaksi, sekian yang jadi pendapatan platform, dan sekian yang tersisa
  sebagai laba.
*/
const LEBAR_BATANG = 0.56;
const RASIO_PENDAPATAN = 0.6;
const RASIO_LABA = 0.3;

const angkaJuta = (v: number) =>
  (v / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 0 });

export function GrafikPertumbuhan({ proyeksi }: { proyeksi: Proyeksi }) {
  const puncak = Math.max(...proyeksi.tahun.map((t) => t.gmv), 0);
  const dasar = Math.min(...proyeksi.tahun.map((t) => t.labaBersih), 0);

  const [bawah, atas] = domainBagus(dasar, puncak);
  const y = skalaLinear([bawah, atas], [
    BINGKAI.tinggi - BINGKAI.bawah,
    BINGKAI.atas,
  ]);
  const tick = tickBagus(bawah, atas, 5);

  const lebarPlot = BINGKAI.lebar - BINGKAI.kiri - BINGKAI.kanan;
  const lebarSlot = lebarPlot / proyeksi.tahun.length;
  const pusat = (i: number) => BINGKAI.kiri + lebarSlot * (i + 0.5);

  const batang = (i: number, rasio: number, nilai: number, warna: string) => {
    const lebar = lebarSlot * LEBAR_BATANG * rasio;
    const y0 = y(0);
    const y1 = y(nilai);
    return (
      <rect
        x={pusat(i) - lebar / 2}
        y={Math.min(y0, y1)}
        width={lebar}
        height={Math.abs(y1 - y0)}
        fill={warna}
        rx={1}
      />
    );
  };

  return (
    <Kanvas
      judul="Pertumbuhan tiga tahun"
      catatan="Sumbu dalam Rp juta. Batang luar adalah GMV; yang bersarang di dalamnya porsi yang menjadi pendapatan ReKain, lalu yang tersisa sebagai laba bersih."
      legenda={[
        { warna: WARNA.nila1, teks: "GMV" },
        { warna: WARNA.nila3, teks: "Pendapatan" },
        { warna: WARNA.nila6, teks: "Laba bersih" },
      ]}
      bingkai={BINGKAI}
      ringkasan={proyeksi.tahun
        .map(
          (t) =>
            `Tahun ${t.tahun}: GMV ${formatJuta(t.gmv)}, pendapatan ${formatJuta(
              t.totalPendapatan,
            )}, laba bersih ${formatJuta(t.labaBersih)}.`,
        )
        .join(" ")}
    >
      <KisiY tick={tick} y={y} bingkai={BINGKAI} label={angkaJuta} />

      {proyeksi.tahun.map((t, i) => (
        <g key={t.tahun}>
          {batang(i, 1, t.gmv, WARNA.nila1)}
          {batang(i, RASIO_PENDAPATAN, t.totalPendapatan, WARNA.nila3)}
          {batang(i, RASIO_LABA, t.labaBersih, WARNA.nila6)}
        </g>
      ))}

      <LabelX
        tebal
        bingkai={BINGKAI}
        posisi={proyeksi.tahun.map((t, i) => ({
          x: pusat(i),
          teks: `Tahun ${t.tahun}`,
        }))}
      />
    </Kanvas>
  );
}
