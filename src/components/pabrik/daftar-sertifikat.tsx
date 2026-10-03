"use client";

import Link from "next/link";
import { BadgeCheck, ChevronRight } from "lucide-react";

import { DataContoh } from "@/components/brand/data-contoh";
import { EmptyState, ErrorState } from "@/components/brand/empty-state";
import { MaterialSwatch } from "@/components/brand/material-swatch";
import { Halaman, PageHeader } from "@/components/brand/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { useTransaksiSelesai } from "@/lib/data/hooks";
import { hitungDampak } from "@/lib/dampak";
import { formatBerat, formatCO2e } from "@/lib/format";

export function DaftarSertifikat() {
  const { data, isPending, isError, refetch } = useTransaksiSelesai();
  const selesai = data ?? [];

  return (
    <Halaman>
      <PageHeader
        eyebrow="Sertifikat"
        title="Sertifikat transaksi"
        description="Setiap transaksi yang selesai mendapat satu sertifikat berisi rincian material dan estimasi dampaknya."
        action={<DataContoh />}
      />

      {isPending ? (
        <div className="space-y-w3" role="status" aria-label="Memuat sertifikat">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-24 rounded-kartu" />
          ))}
          <span className="sr-only">Memuat sertifikat…</span>
        </div>
      ) : isError ? (
        <ErrorState title="Sertifikat gagal dimuat" onRetry={() => refetch()} />
      ) : selesai.length === 0 ? (
        <EmptyState
          icon={BadgeCheck}
          title="Belum ada sertifikat"
          description="Sertifikat terbit setelah transaksi selesai. Transaksi yang masih berjalan belum punya sertifikat."
        />
      ) : (
        <ul className="grid gap-w3 lg:grid-cols-2">
          {selesai.map((t) => (
            <li key={t.id}>
              <Link
                href={`/pabrik/sertifikat/${t.id}`}
                className="bal flex items-center gap-w3 rounded-kartu permukaan p-w4"
              >
                <MaterialSwatch material={t.material} className="size-14" />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-xs text-tinta-pudar">{t.id} · {t.tanggal}</span>
                  <span className="judul-kecil block text-lg text-tinta">{t.material}</span>
                  <span className="block text-sm text-tinta-pudar">
                    {formatBerat(t.berat)} · {formatCO2e(hitungDampak(t).co2eKg)}
                  </span>
                </span>
                <ChevronRight size={20} strokeWidth={1.8} className="shrink-0 text-tinta-pudar" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Halaman>
  );
}
