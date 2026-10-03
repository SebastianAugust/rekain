"use client";

import Link from "next/link";
import { BadgeCheck, Droplets, Leaf, Receipt } from "lucide-react";

import { DataContoh } from "@/components/brand/data-contoh";
import { ErrorState } from "@/components/brand/empty-state";
import { Eyebrow } from "@/components/brand/eyebrow";
import { MaterialSwatch } from "@/components/brand/material-swatch";
import { Halaman, PageHeader } from "@/components/brand/page-header";
import { StatCard } from "@/components/brand/stat-card";
import { CaraMenghitung } from "@/components/pabrik/cara-menghitung";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransaksiSelesai } from "@/lib/data/hooks";
import {
  dampakPerBulan,
  dampakPerMaterial,
  hitungDampak,
  jumlahkanDampak,
  kgKeTon,
} from "@/lib/dampak";
import { formatBerat, formatCO2e, formatDesimal, formatLiter } from "@/lib/format";
import type { Transaction } from "@/lib/types";

/** Six bars, one per month. Zero months keep a stub so the gap reads as "none", not "missing". */
function TrenEnamBulan({ transaksi }: { transaksi: Transaction[] }) {
  const bulan = dampakPerBulan(transaksi, 6);
  const puncak = Math.max(...bulan.map((b) => b.limbahKg), 1);

  return (
    <figure className="relative rounded-kartu permukaan p-w5 shadow-bal">
      <figcaption className="flex flex-wrap items-center justify-between gap-w2">
        <Eyebrow>Limbah dialihkan, 6 bulan terakhir</Eyebrow>
        <DataContoh />
      </figcaption>
      <div className="mt-w5 flex h-44 items-end gap-w2 sm:gap-w4" aria-hidden="true">
        {bulan.map((b) => (
          <div key={b.kunci} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-w1">
            <span className="text-xs font-medium tabular-nums text-tinta-pudar">
              {b.limbahKg > 0 ? formatDesimal(kgKeTon(b.limbahKg), 2) : ""}
            </span>
            <div
              className={b.limbahKg > 0 ? "w-full rounded-t-input bg-nila-6" : "w-full rounded-full bg-garis"}
              style={{ height: b.limbahKg > 0 ? `${Math.max(6, (b.limbahKg / puncak) * 100)}%` : 4 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-w2 flex gap-w2 sm:gap-w4" aria-hidden="true">
        {bulan.map((b) => (
          <span key={b.kunci} className="min-w-0 flex-1 text-center text-xs text-tinta-pudar">
            {b.label}
          </span>
        ))}
      </div>
      {/* The bars are decorative to a screen reader; the same numbers are here as text. */}
      <div className="sr-only">
        <table>
        <caption>Limbah dialihkan dari TPA per bulan, dalam ton (estimasi, data contoh)</caption>
        <thead>
          <tr>
            <th scope="col">Bulan</th>
            <th scope="col">Ton</th>
          </tr>
        </thead>
        <tbody>
          {bulan.map((b) => (
            <tr key={b.kunci}>
              <th scope="row">{b.label}</th>
              <td>{formatDesimal(kgKeTon(b.limbahKg), 2)}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </figure>
  );
}

function RincianMaterial({ transaksi }: { transaksi: Transaction[] }) {
  const baris = dampakPerMaterial(transaksi);
  const total = baris.reduce((s, b) => s + b.limbahKg, 0) || 1;

  return (
    <section aria-labelledby="rincian-material" className="rounded-kartu permukaan p-w5 shadow-bal">
      <h2 id="rincian-material" className="judul-kecil text-xl text-tinta">
        Rincian per material
      </h2>
      <ul className="mt-w4 space-y-w4">
        {baris.map((b) => (
          <li key={b.material} className="flex items-center gap-w3">
            <MaterialSwatch material={b.material} className="size-12" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-w3">
                <span className="font-semibold text-tinta">{b.material}</span>
                <span className="text-sm tabular-nums text-tinta-pudar">{formatBerat(b.limbahKg)}</span>
              </div>
              <div className="mt-w1 h-1.5 overflow-hidden rounded-full bg-awan" aria-hidden="true">
                <div className="h-full rounded-full bg-nila-6" style={{ width: `${(b.limbahKg / total) * 100}%` }} />
              </div>
              <p className="mt-w1 text-xs text-tinta-pudar">
                {formatCO2e(b.co2eKg)} · {formatLiter(b.airLiter)} air · {b.serat}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TabelTransaksi({ transaksi }: { transaksi: Transaction[] }) {
  return (
    <section aria-labelledby="tabel-dampak" className="rounded-kartu permukaan shadow-bal">
      <div className="flex flex-wrap items-center justify-between gap-w2 px-w5 pt-w5">
        <h2 id="tabel-dampak" className="judul-kecil text-xl text-tinta">
          Estimasi per transaksi
        </h2>
        <DataContoh />
      </div>
      <table className="mt-w3 w-full border-collapse text-sm">
        <caption className="sr-only">Estimasi dampak untuk setiap transaksi yang selesai</caption>
        <thead className="hidden sm:table-header-group">
          <tr className="border-b border-garis text-left text-xs text-tinta-pudar">
            <th scope="col" className="px-w5 py-w2 font-medium">Transaksi</th>
            <th scope="col" className="px-w3 py-w2 font-medium">Berat</th>
            <th scope="col" className="px-w3 py-w2 font-medium">CO2e dihindari</th>
            <th scope="col" className="px-w3 py-w2 font-medium">Air dihemat</th>
            <th scope="col" className="px-w5 py-w2 text-right font-medium">Sertifikat</th>
          </tr>
        </thead>
        <tbody>
          {transaksi.map((t) => {
            const d = hitungDampak(t);
            return (
              <tr
                key={t.id}
                className="grid grid-cols-3 gap-x-w3 gap-y-w2 border-b border-garis px-w5 py-w3 last:border-b-0 sm:table-row sm:px-0 sm:py-0"
              >
                <td className="col-span-3 flex items-center gap-w3 sm:table-cell sm:px-w5 sm:py-w3">
                  <span className="flex items-center gap-w3">
                    <MaterialSwatch material={t.material} className="size-10 rounded-input" />
                    <span>
                      <span className="block font-medium text-tinta">{t.material}</span>
                      <span className="block font-mono text-xs text-tinta-pudar">
                        {t.id} · {t.tanggal}
                      </span>
                    </span>
                  </span>
                </td>
                <td className="tabular-nums sm:px-w3 sm:py-w3">
                  <span className="block text-xs text-tinta-pudar sm:hidden">Berat</span>
                  {formatBerat(t.berat)}
                </td>
                <td className="tabular-nums sm:px-w3 sm:py-w3">
                  <span className="block text-xs text-tinta-pudar sm:hidden">CO2e</span>
                  {formatCO2e(d.co2eKg)}
                </td>
                <td className="tabular-nums sm:px-w3 sm:py-w3">
                  <span className="block text-xs text-tinta-pudar sm:hidden">Air</span>
                  {formatLiter(d.airLiter)}
                </td>
                <td className="col-span-3 sm:table-cell sm:px-w5 sm:py-w3 sm:text-right">
                  <Link
                    href={`/pabrik/sertifikat/${t.id}`}
                    className="inline-flex min-h-11 items-center gap-1 rounded-full px-w3 font-semibold text-nila-tinta hover:bg-awan"
                  >
                    <BadgeCheck size={16} strokeWidth={1.8} aria-hidden="true" /> Lihat
                    <span className="sr-only"> sertifikat {t.id}</span>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export function DampakPanel() {
  const { data, isPending, isError, refetch } = useTransaksiSelesai();

  return (
    <Halaman>
      <PageHeader
        eyebrow="Dampak lingkungan"
        title="Estimasi dampak limbah Anda"
        description="Berapa banyak limbah yang tidak berakhir di TPA karena dijual lewat ReKain, dan perkiraan dampaknya."
        action={<DataContoh />}
      />

      {isPending ? (
        <div className="space-y-w4" role="status" aria-label="Memuat dampak">
          <Skeleton className="h-56 rounded-kartu" />
          <div className="grid gap-w4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-32 rounded-kartu" />
            ))}
          </div>
          <span className="sr-only">Memuat dampak…</span>
        </div>
      ) : isError ? (
        <ErrorState title="Dampak gagal dimuat" onRetry={() => refetch()} />
      ) : (
        <Isi transaksi={data ?? []} />
      )}
    </Halaman>
  );
}

function Isi({ transaksi }: { transaksi: Transaction[] }) {
  const total = jumlahkanDampak(transaksi);

  return (
    <div className="space-y-w5">
      <div className="grid gap-w4 lg:grid-cols-5">
        <StatCard
          utama
          className="flex flex-col justify-end py-w6 lg:col-span-2"
          label="Dialihkan dari TPA"
          value={formatDesimal(kgKeTon(total.limbahKg), 2)}
          satuan="ton"
          catatan={`Dari ${total.jumlahTransaksi} transaksi yang sudah selesai. Estimasi dampak.`}
          icon={Leaf}
        />
        <div className="grid gap-w4 sm:grid-cols-3 lg:col-span-3">
          <StatCard label="CO2e dihindari" value={Math.round(total.co2eKg).toLocaleString("id-ID")} satuan="kg" icon={Leaf} />
          <StatCard label="Air dihemat" value={Math.round(total.airLiter).toLocaleString("id-ID")} satuan="L" icon={Droplets} />
          <StatCard label="Transaksi" value={total.jumlahTransaksi} icon={Receipt} />
        </div>
      </div>

      <div className="grid gap-w5 lg:grid-cols-2">
        <TrenEnamBulan transaksi={transaksi} />
        {transaksi.length > 0 ? (
          <RincianMaterial transaksi={transaksi} />
        ) : (
          <section className="rounded-kartu permukaan p-w5 shadow-bal">
            <h2 className="judul-kecil text-xl text-tinta">Belum ada dampak tercatat</h2>
            <p className="mt-w2 text-tinta-pudar">
              Dampak dihitung dari transaksi yang sudah selesai. Begitu penjualan pertama Anda selesai,
              rincian per material muncul di sini.
            </p>
            <Link href="/pabrik/upload" className="mt-w4 inline-flex min-h-11 items-center rounded-full bg-nila-6 px-w4 font-semibold text-white hover:bg-nila-9">
              Unggah limbah
            </Link>
          </section>
        )}
      </div>

      {transaksi.length > 0 && <TabelTransaksi transaksi={transaksi} />}

      <CaraMenghitung />
    </div>
  );
}
