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
  tinggi: 260,
  atas: 14,
  kanan: 30,
  bawah: 42,
  kiri: 68,
};

const BULAN = 36;

const angkaJuta = (v: number) =>
  (v / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 0 });

/**
 * Kurva mulai dari −modal awal dan menanjak sepanjang laba bulanan. Titik
 * potongnya dengan nol itulah payback — jadi paybacknya terbaca sebagai
 * perpotongan, bukan sebagai angka yang harus dipercaya begitu saja.
 */
export function GrafikArusKas({
  proyeksi,
  paybackBulan,
}: {
  proyeksi: Proyeksi;
  paybackBulan: number | null;
}) {
  const titik: { bulan: number; kas: number }[] = [
    { bulan: 0, kas: -proyeksi.modalAwal },
  ];
  let kas = -proyeksi.modalAwal;
  for (let bulan = 1; bulan <= BULAN; bulan++) {
    kas += proyeksi.labaBersih[Math.floor((bulan - 1) / 12)] / 12;
    titik.push({ bulan, kas });
  }

  const nilai = titik.map((t) => t.kas);
  const [bawah, atas] = domainBagus(Math.min(...nilai, 0), Math.max(...nilai, 0));

  const x = skalaLinear([0, BULAN], [BINGKAI.kiri, BINGKAI.lebar - BINGKAI.kanan]);
  const y = skalaLinear([bawah, atas], [BINGKAI.tinggi - BINGKAI.bawah, BINGKAI.atas]);

  const jalur = titik.map((t) => `${x(t.bulan)},${y(t.kas)}`).join(" ");
  const area = `${x(0)},${y(0)} ${jalur} ${x(BULAN)},${y(0)}`;
  const akhir = titik[titik.length - 1];

  return (
    <Kanvas
      judul="Kas kumulatif dan titik balik modal"
      catatan="Sumbu dalam Rp juta. Kurva mulai dari minus modal awal; saat memotong nol, modal sudah kembali."
      bingkai={BINGKAI}
      ringkasan={
        paybackBulan === null
          ? `Modal awal ${formatJuta(
              proyeksi.modalAwal,
            )} belum kembali dalam 36 bulan. Kas kumulatif di bulan ke-36: ${formatJuta(akhir.kas)}.`
          : `Modal awal ${formatJuta(
              proyeksi.modalAwal,
            )} kembali pada bulan ke-${paybackBulan}. Kas kumulatif di bulan ke-36: ${formatJuta(akhir.kas)}.`
      }
    >
      <KisiY tick={tickBagus(bawah, atas, 5)} y={y} bingkai={BINGKAI} label={angkaJuta} />

      <polygon points={area} fill={WARNA.nila1} opacity={0.45} />
      <polyline
        points={jalur}
        fill="none"
        stroke={WARNA.nila6}
        strokeWidth={2.2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      {paybackBulan !== null && (
        <g>
          <line
            x1={x(paybackBulan)}
            y1={BINGKAI.atas}
            x2={x(paybackBulan)}
            y2={BINGKAI.tinggi - BINGKAI.bawah}
            stroke={WARNA.nila9}
            strokeWidth={1.2}
            strokeDasharray="4 3"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx={x(paybackBulan)} cy={y(0)} r={4} fill={WARNA.nila9} />
          <text
            x={x(paybackBulan) + 7}
            y={y(0) - 10}
            fontFamily={MONO}
            fontSize={11}
            fontWeight={600}
            fill={WARNA.nila9}
          >
            bulan ke-{paybackBulan}
          </text>
        </g>
      )}

      <LabelX
        bingkai={BINGKAI}
        posisi={[0, 12, 24, 36].map((b) => ({ x: x(b), teks: `bln ${b}` }))}
      />
    </Kanvas>
  );
}
