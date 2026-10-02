"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ChevronLeft, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

import { DataContoh } from "@/components/brand/data-contoh";
import { ErrorState } from "@/components/brand/empty-state";
import { Eyebrow } from "@/components/brand/eyebrow";
import { Logo } from "@/components/brand/logo";
import { MaterialSwatch } from "@/components/brand/material-swatch";
import { Halaman } from "@/components/brand/page-header";
import { tombol } from "@/components/brand/tombol";
import { CaraMenghitung } from "@/components/pabrik/cara-menghitung";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyListings, useTransaksiPabrik } from "@/lib/data/hooks";
import { hitungDampak, kgKeTon } from "@/lib/dampak";
import { formatBerat, formatCO2e, formatDesimal, formatLiter, formatRupiah } from "@/lib/format";
import type { Transaction } from "@/lib/types";

function Baris({ label, nilai }: { label: string; nilai: React.ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-w4 gap-y-w1 py-w3 text-sm">
      <dt className="text-tinta-pudar">{label}</dt>
      <dd className="font-medium text-tinta">{nilai}</dd>
    </div>
  );
}

async function bagikan(t: Transaction) {
  const url = window.location.href;
  const teks = `Sertifikat transaksi ${t.id} di ReKain (estimasi dampak, data contoh).`;
  try {
    if (navigator.share) {
      await navigator.share({ title: `Sertifikat ${t.id}`, text: teks, url });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success("Tautan disalin", { description: "Tempelkan di pesan atau email." });
  } catch (e) {
    // The user dismissing the share sheet is not an error worth a toast.
    if (e instanceof DOMException && e.name === "AbortError") return;
    toast.error("Tautan belum bisa dibagikan", { description: "Salin alamat dari bilah browser." });
  }
}

export function SertifikatTransaksi({ id }: { id: string }) {
  const transaksi = useTransaksiPabrik();
  const listings = useMyListings();

  if (transaksi.isPending) {
    return (
      <Halaman className="max-w-3xl">
        <Skeleton className="h-[32rem] rounded-kartu" />
      </Halaman>
    );
  }
  if (transaksi.isError) {
    return (
      <Halaman className="max-w-3xl">
        <ErrorState title="Sertifikat gagal dimuat" onRetry={() => transaksi.refetch()} />
      </Halaman>
    );
  }

  const t = transaksi.data?.find((x) => x.id === id && x.status === "Selesai");
  if (!t) notFound();

  const d = hitungDampak(t);
  const grade = listings.data?.find((l) => l.id === t.listingId)?.grade;

  return (
    <Halaman className="max-w-3xl">
      <Link
        href="/pabrik/sertifikat"
        className="mb-w4 inline-flex min-h-11 items-center gap-1 rounded-full pr-w3 text-sm text-tinta-pudar hover:text-nila-tinta print:hidden"
      >
        <ChevronLeft size={18} strokeWidth={1.8} aria-hidden="true" /> Semua sertifikat
      </Link>

      <article className="rounded-kartu permukaan p-w5 shadow-bal-angkat sm:p-w6" aria-labelledby="judul-sertifikat">
        <header className="flex flex-wrap items-start justify-between gap-w3">
          <Logo />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-nila-1/45 px-w3 py-1.5 text-sm font-semibold text-nila-9">
            <BadgeCheck size={16} strokeWidth={1.8} aria-hidden="true" /> Terverifikasi
          </span>
        </header>

        <Eyebrow className="mt-w6">Sertifikat transaksi</Eyebrow>
        <h1 id="judul-sertifikat" className="judul mt-w2 text-3xl text-tinta sm:text-[2.5rem] sm:leading-[1.1]">
          {t.material}
        </h1>
        <p className="mt-w2 font-mono text-sm text-tinta-pudar">
          {t.id} · {t.tanggal}
        </p>
        <p className="mt-w1 text-sm text-tinta-pudar">Transaksi selesai dan tercatat di ledger ReKain.</p>

        <div className="mt-w5 flex items-center gap-w4">
          <MaterialSwatch material={t.material} seed={t.listingId} className="size-20 rounded-kartu" />
          <dl className="grid flex-1 grid-cols-2 gap-w3">
            <div>
              <dt className="text-xs text-tinta-pudar">Berat</dt>
              <dd className="judul text-2xl tabular-nums text-tinta">{formatBerat(t.berat)}</dd>
            </div>
            <div>
              <dt className="text-xs text-tinta-pudar">Nilai</dt>
              <dd className="judul text-2xl tabular-nums text-tinta">{formatRupiah(t.total)}</dd>
            </div>
          </dl>
        </div>

        <dl className="mt-w4 divide-y divide-garis border-t border-garis">
          <Baris label="Pabrik" nilai={t.pabrik} />
          <Baris label="Buyer" nilai={t.buyer} />
          {grade && <Baris label="Grade" nilai={`Grade ${grade}`} />}
          {t.listingId && <Baris label="Kode material" nilai={<span className="font-mono">{t.listingId}</span>} />}
        </dl>

        <section aria-labelledby="dampak-sertifikat" className="mt-w5 rounded-kartu bg-awan p-w5">
          <div className="flex flex-wrap items-center justify-between gap-w2">
            <h2 id="dampak-sertifikat" className="judul-kecil text-lg text-tinta">
              Estimasi dampak
            </h2>
            <DataContoh />
          </div>
          <dl className="mt-w3 grid gap-w4 sm:grid-cols-3">
            <div>
              <dt className="text-xs text-tinta-pudar">Dialihkan dari TPA</dt>
              <dd className="judul text-2xl tabular-nums text-tinta">{formatDesimal(kgKeTon(d.limbahKg), 2)} ton</dd>
            </div>
            <div>
              <dt className="text-xs text-tinta-pudar">CO2e dihindari</dt>
              <dd className="judul text-2xl tabular-nums text-tinta">{formatCO2e(d.co2eKg)}</dd>
            </div>
            <div>
              <dt className="text-xs text-tinta-pudar">Air dihemat</dt>
              <dd className="judul text-2xl tabular-nums text-tinta">{formatLiter(d.airLiter)}</dd>
            </div>
          </dl>
          <p className="mt-w3 text-xs text-tinta-pudar">
            Estimasi dampak berdasarkan berat x faktor serat. Bukan kredit karbon.
          </p>
        </section>

        <div className="mt-w5 flex flex-wrap gap-w2 print:hidden">
          <button type="button" onClick={() => bagikan(t)} className={tombol()}>
            <Share2 size={18} strokeWidth={1.8} aria-hidden="true" /> Bagikan
          </button>
          <button type="button" onClick={() => window.print()} className={tombol({ nada: "garis" })}>
            <Download size={18} strokeWidth={1.8} aria-hidden="true" /> Unduh PDF
          </button>
        </div>
      </article>

      <div className="mt-w5 print:hidden">
        <CaraMenghitung />
      </div>
    </Halaman>
  );
}
