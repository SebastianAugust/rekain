"use client";

import { KOMPONEN_TETAP, LABEL_TETAP } from "@/lib/finance/asumsi";
import type { BarisTahun, Proyeksi } from "@/lib/finance/hitung";
import { formatPersenPresisi, formatRupiah, formatTon } from "@/lib/format";
import { cn } from "@/lib/utils";

type Baris = {
  label: string;
  nilai: (b: BarisTahun) => number;
  format?: (n: number) => string;
  /** Baris jumlah — digarisbawahi dan ditebalkan. */
  jumlah?: boolean;
  /** Baris paling akhir dari sebuah blok — diberi garis atas. */
  awalBlok?: string;
};

const rupiah = (n: number) => formatRupiah(Math.round(n));

const BARIS: Baris[] = [
  {
    label: "Volume material",
    nilai: (b) => b.volumeKg / 1_000,
    format: (n) => formatTon(n, 0),
    awalBlok: "Transaksi",
  },
  { label: "GMV (nilai transaksi)", nilai: (b) => b.gmv, jumlah: true },

  { label: "Komisi transaksi", nilai: (b) => b.komisi, awalBlok: "Pendapatan" },
  { label: "Margin layanan logistik", nilai: (b) => b.marginLogistik },
  { label: "Grading & verifikasi premium", nilai: (b) => b.gradingPremium },
  { label: "Langganan SaaS traceability", nilai: (b) => b.saas },
  { label: "Total Pendapatan", nilai: (b) => b.totalPendapatan, jumlah: true },

  {
    label: "Biaya logistik & handling",
    nilai: (b) => b.biayaLogistik,
    awalBlok: "Biaya variabel",
  },
  { label: "Payment gateway & escrow", nilai: (b) => b.biayaPayment },
  { label: "Insentif mitra pengepul", nilai: (b) => b.insentifPengepul },
  { label: "Total Biaya Variabel", nilai: (b) => b.totalBiayaVariabel, jumlah: true },

  { label: "Laba Kotor", nilai: (b) => b.labaKotor, jumlah: true, awalBlok: "Laba" },
  {
    label: "Margin Kotor",
    nilai: (b) => b.marginKotor,
    format: (n) => formatPersenPresisi(n, 2),
  },

  ...KOMPONEN_TETAP.map(
    (k, i): Baris => ({
      label: LABEL_TETAP[k],
      nilai: (b) => b.biayaTetapRincian[k],
      awalBlok: i === 0 ? "Biaya tetap operasional" : undefined,
    }),
  ),
  { label: "Total Biaya Tetap", nilai: (b) => b.totalBiayaTetap, jumlah: true },

  {
    label: "Laba Sebelum Pajak",
    nilai: (b) => b.labaSebelumPajak,
    jumlah: true,
    awalBlok: "Hasil",
  },
  { label: "PPh Badan", nilai: (b) => -b.pajak },
  { label: "LABA BERSIH", nilai: (b) => b.labaBersih, jumlah: true },
];

export function TabelProyeksi({ proyeksi }: { proyeksi: Proyeksi }) {
  return (
    <div className="overflow-hidden rounded-kartu border border-garis permukaan">
      {/* Kolom angka harus tetap sejajar; di layar sempit tabel digeser, bukan ditumpuk. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-xl border-collapse text-sm">
          <caption className="sr-only">
            Proyeksi laba rugi tiga tahun berdasarkan asumsi saat ini
          </caption>
          <thead>
            <tr className="border-b border-garis">
              <th
                scope="col"
                className="px-w4 py-w2 text-left text-xs font-medium text-tinta-pudar"
              >
                Komponen
              </th>
              {proyeksi.tahun.map((t) => (
                <th
                  key={t.tahun}
                  scope="col"
                  className="px-w4 py-w2 text-right text-xs font-medium text-tinta-pudar"
                >
                  Tahun {t.tahun}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BARIS.map((baris) => (
              <Fragmen key={baris.label} baris={baris} proyeksi={proyeksi} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Fragmen({ baris, proyeksi }: { baris: Baris; proyeksi: Proyeksi }) {
  const format = baris.format ?? rupiah;

  return (
    <>
      {baris.awalBlok && (
        <tr>
          <th
            scope="colgroup"
            colSpan={4}
            className="border-t border-garis bg-kain px-w4 py-1.5 text-left font-mono text-xs tracking-widest text-nila-tinta uppercase"
          >
            {baris.awalBlok}
          </th>
        </tr>
      )}
      <tr className={cn(baris.jumlah && "border-t border-garis")}>
        <th
          scope="row"
          className={cn(
            "px-w4 py-1.5 text-left font-normal text-tinta-pudar",
            baris.jumlah && "font-medium text-tinta",
          )}
        >
          {baris.label}
        </th>
        {proyeksi.tahun.map((t) => {
          const nilai = baris.nilai(t);
          return (
            <td
              key={t.tahun}
              className={cn(
                "px-w4 py-1.5 text-right font-mono tabular-nums",
                baris.jumlah ? "font-semibold text-tinta" : "text-tinta-pudar",
                nilai < 0 && "text-benang",
              )}
            >
              {format(nilai)}
            </td>
          );
        })}
      </tr>
    </>
  );
}
