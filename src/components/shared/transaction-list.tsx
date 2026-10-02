"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

import { DipChip, type DipTone } from "@/components/brand/dip-chip";
import { EmptyState, ErrorState } from "@/components/brand/empty-state";
import { Halaman, PageHeader } from "@/components/brand/page-header";
import { tombol } from "@/components/brand/tombol";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBerat, formatRupiah } from "@/lib/format";
import type { Role, Transaction, TransactionStatus } from "@/lib/types";

/** Same dip logic as listings: the further along, the deeper the colour. */
const STATUS_DIP: Record<TransactionStatus, DipTone> = {
  "Menunggu Konfirmasi": "d0",
  Dikirim: "d1",
  Selesai: "d6",
};

const DESKRIPSI: Record<Role, string> = {
  pabrik: "Penjualan limbah dari pabrik Anda, dari penawaran masuk hingga dana diterima.",
  buyer: "Penawaran dan pembelian Anda, dari menunggu konfirmasi pabrik hingga barang tiba.",
  ops: "Seluruh transaksi di klaster.",
};

export function TransactionList({
  items,
  isPending,
  isError,
  onRetry,
  role,
}: {
  items: Transaction[] | undefined;
  isPending: boolean;
  isError?: boolean;
  onRetry?: () => void;
  role: Role;
}) {
  return (
    <Halaman>
      <PageHeader eyebrow="Transaksi" title="Riwayat transaksi" description={DESKRIPSI[role]} />

      {isPending ? (
        <div className="space-y-w3" role="status" aria-label="Memuat transaksi">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="rounded-kartu border border-garis permukaan px-w4 py-w3">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="mt-w2 h-4 w-48" />
              <Skeleton className="mt-w2 h-3 w-64" />
            </div>
          ))}
          <span className="sr-only">Memuat transaksi…</span>
        </div>
      ) : isError ? (
        <ErrorState title="Riwayat transaksi gagal dimuat" onRetry={onRetry} />
      ) : !items || items.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Belum ada transaksi"
          description="Transaksi yang sudah disepakati muncul di sini beserta status pengirimannya."
          action={
            role === "buyer" ? (
              <Link href="/buyer" className={tombol()}>
                Cari material
              </Link>
            ) : undefined
          }
        />
      ) : (
        <ul className="space-y-w3">
          {items.map((t) => (
            <li
              key={t.id}
              className="flex flex-col gap-w2 rounded-kartu border border-garis permukaan px-w4 py-w4 shadow-bal sm:flex-row sm:items-center sm:justify-between sm:gap-w4"
            >
              <div className="min-w-0">
                <div className="font-mono text-xs tracking-wide text-tinta-pudar">{t.id}</div>
                <div className="judul-kecil mt-0.5 text-lg text-tinta">{t.material}</div>
                <div className="mt-0.5 text-sm text-tinta-pudar">
                  {role === "pabrik" ? `ke ${t.buyer}` : `dari ${t.pabrik}`} ·{" "}
                  {formatBerat(t.berat)} · {t.tanggal}
                </div>
              </div>
              <div className="flex items-center justify-between gap-w3 sm:flex-col sm:items-end sm:gap-w1">
                <div className="judul text-2xl tabular-nums text-tinta">
                  {formatRupiah(t.total)}
                </div>
                <DipChip dip={STATUS_DIP[t.status]}>{t.status}</DipChip>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Halaman>
  );
}
