"use client";

import type {
  BarisSensitivitas,
  MetrikTarget,
  Penggerak,
} from "@/lib/finance/sensitivitas";
import { LABEL_METRIK } from "@/lib/finance/sensitivitas";
import { formatJuta, formatPersenPresisi } from "@/lib/format";
import { domainBagus, skalaLinear, tickBagus } from "@/lib/grafik/skala";
import {
  type Bingkai,
  Kanvas,
  MONO,
  WARNA,
} from "@/components/simulasi/grafik/kerangka";

const TINGGI_BARIS = 22;
const TINGGI_BATANG = 13;

/** Dua penggerak yang disebut Bab 5.4 sebagai penentu kelayakan. */
const DISEBUT_PROPOSAL: Penggerak[] = ["hargaPerKg", "biayaLogistik"];

export function GrafikTornado({
  baris,
  metrik,
  deviasi,
  aksi,
}: {
  baris: BarisSensitivitas[];
  metrik: MetrikTarget;
  deviasi: number;
  aksi?: React.ReactNode;
}) {
  const bingkai: Bingkai = {
    lebar: 640,
    tinggi: baris.length * TINGGI_BARIS + 46,
    atas: 10,
    kanan: 16,
    bawah: 26,
    kiri: 212,
  };

  const terpakai = baris.filter((b) => b.turun !== null && b.naik !== null);
  const semua = terpakai.flatMap((b) => [b.turun!, b.naik!]);
  const dasar = baris[0]?.dasar ?? 0;

  const [bawah, atas] = domainBagus(
    Math.min(...semua, dasar),
    Math.max(...semua, dasar),
  );
  const x = skalaLinear([bawah, atas], [bingkai.kiri, bingkai.lebar - bingkai.kanan]);

  const format = (v: number) =>
    metrik === "roi"
      ? formatPersenPresisi(v, 0)
      : (v / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 0 });

  const teratas = baris[0];

  return (
    <Kanvas
      judul="Variabel paling menentukan"
      catatan={`Tiap penggerak digeser ±${Math.round(deviasi * 100)}% sementara yang lain ditahan. ${
        metrik === "roi" ? "Sumbu dalam persen ROI." : "Sumbu dalam Rp juta."
      }`}
      aksi={aksi}
      legenda={[
        { warna: WARNA.nila6, teks: "Disebut Bab 5.4 sebagai penentu" },
        { warna: WARNA.nila3, teks: "Penggerak lain" },
      ]}
      bingkai={bingkai}
      ringkasan={
        teratas
          ? `Terhadap ${LABEL_METRIK[metrik]}, penggerak paling menentukan adalah ${
              teratas.label
            } dengan rentang ${
              metrik === "roi"
                ? formatPersenPresisi(teratas.rentang, 0)
                : formatJuta(teratas.rentang)
            }. Urutan berikutnya: ${baris
              .slice(1, 5)
              .map((b) => b.label)
              .join(", ")}.`
          : "Tidak ada penggerak yang bisa diukur pada asumsi ini."
      }
    >
      {/* Garis nilai dasar — batang yang memotongnya berarti bisa jatuh di bawah baseline. */}
      <line
        x1={x(dasar)}
        y1={bingkai.atas}
        x2={x(dasar)}
        y2={bingkai.tinggi - bingkai.bawah}
        stroke={WARNA.garisKuat}
        strokeWidth={1.2}
        vectorEffect="non-scaling-stroke"
      />

      {baris.map((b, i) => {
        const y = bingkai.atas + i * TINGGI_BARIS + TINGGI_BARIS / 2;
        const disebut = DISEBUT_PROPOSAL.includes(b.penggerak);
        const adaData = b.turun !== null && b.naik !== null;
        const kiri = adaData ? Math.min(b.turun!, b.naik!) : dasar;
        const kanan = adaData ? Math.max(b.turun!, b.naik!) : dasar;

        return (
          <g key={b.penggerak}>
            <text
              x={bingkai.kiri - 10}
              y={y}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily={MONO}
              fontSize={11}
              fontWeight={disebut ? 600 : 400}
              fill={disebut ? WARNA.nila9 : WARNA.tintaPudar}
            >
              {b.label}
            </text>

            {adaData ? (
              <rect
                x={x(kiri)}
                y={y - TINGGI_BATANG / 2}
                width={Math.max(1, x(kanan) - x(kiri))}
                height={TINGGI_BATANG}
                fill={disebut ? WARNA.nila6 : WARNA.nila3}
                rx={1}
              />
            ) : (
              <text
                x={x(dasar) + 8}
                y={y}
                dominantBaseline="central"
                fontFamily={MONO}
                fontSize={11}
                fill={WARNA.tintaPudar}
              >
                tidak terdefinisi
              </text>
            )}
          </g>
        );
      })}

      <g aria-hidden="true">
        {tickBagus(bawah, atas, 5).map((t) => (
          <text
            key={t}
            x={x(t)}
            y={bingkai.tinggi - bingkai.bawah + 15}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily={MONO}
            fontSize={11}
            fill={WARNA.tintaPudar}
          >
            {format(t)}
          </text>
        ))}
      </g>
    </Kanvas>
  );
}
