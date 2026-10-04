"use client";

import { bangunAsumsi, BATAS_MASUKAN, MASUKAN_BAWAAN, type Masukan } from "@/lib/finance/skenario";
import { hitungProyeksi } from "@/lib/finance/hitung";
import { formatJuta, formatRupiah } from "@/lib/format";
import { domainBagus, skalaLinear, tickBagus } from "@/lib/grafik/skala";
import {
  type Bingkai,
  Kanvas,
  KisiY,
  LabelX,
  MONO,
  WARNA,
} from "@/components/simulasi/grafik/kerangka";

const BINGKAI: Bingkai = { lebar: 640, tinggi: 260, atas: 14, kanan: 30, bawah: 42, kiri: 68 };

const { min: HARGA_MIN, max: HARGA_MAX } = BATAS_MASUKAN.harga;
const LANGKAH = 250;
const HARGA = Array.from(
  { length: (HARGA_MAX - HARGA_MIN) / LANGKAH + 1 },
  (_, i) => HARGA_MIN + i * LANGKAH,
);

const angkaJuta = (v: number) =>
  (v / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 0 });

/** Laba sebelum pajak Tahun 1 pada harga tertentu; masukan lain ditahan. */
const laba = (m: Masukan, harga: number) =>
  hitungProyeksi(bangunAsumsi({ ...m, harga })).tahun[0].labaSebelumPajak;

/**
 * Kurva Tabel 4.6 versi utuh: bukan tiga titik harga, tapi seluruh rentang. Titik
 * potongnya dengan nol adalah harga impas Tahun 1.
 */
export function GrafikLabaHarga({ masukan }: { masukan: Masukan }) {
  const kini = HARGA.map((h) => laba(masukan, h));
  const acuan = HARGA.map((h) => laba(MASUKAN_BAWAAN, h));
  const sekarang = laba(masukan, masukan.harga);

  const [bawah, atas] = domainBagus(
    Math.min(...kini, ...acuan, sekarang),
    Math.max(...kini, ...acuan, sekarang),
  );
  const x = skalaLinear([HARGA_MIN, HARGA_MAX], [BINGKAI.kiri, BINGKAI.lebar - BINGKAI.kanan]);
  const y = skalaLinear([bawah, atas], [BINGKAI.tinggi - BINGKAI.bawah, BINGKAI.atas]);

  const garis = (nilai: number[]) => HARGA.map((h, i) => `${x(h)},${y(nilai[i])}`).join(" ");

  return (
    <Kanvas
      judul="Laba sebelum pajak Tahun 1 menurut harga"
      catatan="Sumbu dalam Rp juta. Kurva memotong nol di harga impas; titik menandai harga yang sedang dipilih."
      legenda={[
        { warna: WARNA.nila6, teks: "Asumsi saat ini" },
        { warna: WARNA.garisKuat, teks: "Moderat (proposal)" },
      ]}
      bingkai={BINGKAI}
      ringkasan={`Pada harga ${formatRupiah(masukan.harga)}/kg, laba sebelum pajak Tahun 1 adalah ${formatJuta(sekarang)}. Pada harga Moderat Rp6.000/kg labanya ${formatJuta(laba(MASUKAN_BAWAAN, 6_000))}.`}
    >
      <KisiY tick={tickBagus(bawah, atas, 5)} y={y} bingkai={BINGKAI} label={angkaJuta} />

      <polyline
        points={garis(acuan)}
        fill="none"
        stroke={WARNA.garisKuat}
        strokeWidth={1.6}
        strokeDasharray="5 4"
        vectorEffect="non-scaling-stroke"
      />
      <polyline
        points={garis(kini)}
        fill="none"
        stroke={WARNA.nila6}
        strokeWidth={2.2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />

      <line
        x1={x(masukan.harga)}
        y1={BINGKAI.atas}
        x2={x(masukan.harga)}
        y2={BINGKAI.tinggi - BINGKAI.bawah}
        stroke={WARNA.nila9}
        strokeWidth={1.2}
        strokeDasharray="4 3"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={x(masukan.harga)} cy={y(sekarang)} r={4.5} fill={WARNA.nila9} stroke={WARNA.putih} strokeWidth={1.5} />
      <text
        x={x(masukan.harga) + (masukan.harga > (HARGA_MIN + HARGA_MAX) / 2 ? -8 : 8)}
        y={y(sekarang) - 12}
        textAnchor={masukan.harga > (HARGA_MIN + HARGA_MAX) / 2 ? "end" : "start"}
        fontFamily={MONO}
        fontSize={11}
        fontWeight={600}
        fill={WARNA.nila9}
        stroke={WARNA.putih}
        strokeWidth={3}
        paintOrder="stroke"
      >
        {formatJuta(sekarang)}
      </text>

      <LabelX
        bingkai={BINGKAI}
        posisi={[2_000, 4_000, 6_000, 8_000].map((h) => ({ x: x(h), teks: formatRupiah(h) }))}
      />
    </Kanvas>
  );
}
