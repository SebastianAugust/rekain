"use client";

import Link from "next/link";
import { BadgeCheck, Clock, Lock, LockOpen } from "lucide-react";

import { DipChip } from "@/components/brand/dip-chip";
import { EmptyState, ErrorState } from "@/components/brand/empty-state";
import { DataContoh } from "@/components/brand/data-contoh";
import { Halaman, PageHeader } from "@/components/brand/page-header";
import { TRANSAKSI_DIP } from "@/components/brand/status-dip";
import { tombol } from "@/components/brand/tombol";
import { Skeleton } from "@/components/ui/skeleton";
import { labelEscrow } from "@/lib/data/alur";
import { formatBerat, formatRupiah } from "@/lib/format";
import type { Role, Transaction } from "@/lib/types";

const DESKRIPSI: Record<Role, string> = {
  pabrik: "Penjualan limbah dari pabrik Anda, dari penawaran masuk hingga dana diterima.",
  buyer: "Penawaran dan pembelian Anda, dari menunggu konfirmasi pabrik hingga barang tiba.",
  ops: "Seluruh transaksi di klaster.",
};

/** What the viewer should understand about where a trade stands, beyond the badge. */
function catatanStatus(role: Role, t: Transaction): string | null {
  const escrow = labelEscrow(t.status);
  if (escrow) return escrow;
  if (t.status === "Menunggu Konfirmasi") {
    return role === "pabrik" ? "Penawaran masuk, menunggu keputusan Anda." : "Menunggu konfirmasi pabrik.";
  }
  if (t.status === "Ditolak") return "Penawaran ditolak. Material kembali tersedia.";
  return null;
}

export function TransactionList({
  items,
  isPending,
  isError,
  onRetry,
  role,
  aksi,
}: {
  items: Transaction[] | undefined;
  isPending: boolean;
  isError?: boolean;
  onRetry?: () => void;
  role: Role;
  /** Per-row controls, e.g. accept/reject for the factory. Rendered in the row footer. */
  aksi?: (t: Transaction) => React.ReactNode;
}) {
  return (
    <Halaman>
      <PageHeader eyebrow="Transaksi" title="Riwayat transaksi" description={DESKRIPSI[role]} action={<DataContoh />} />

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
          {items.map((t) => {
            const catatan = catatanStatus(role, t);
            const kontrol = aksi?.(t);
            const sertifikat = role === "pabrik" && t.status === "Selesai";
            return (
              <li key={t.id} className="rounded-kartu border border-garis permukaan px-w4 py-w4 shadow-bal">
                <div className="flex flex-col gap-w2 sm:flex-row sm:items-center sm:justify-between sm:gap-w4">
                  <div className="min-w-0">
                    <div className="font-mono text-xs tracking-wide text-tinta-pudar">{t.id}</div>
                    <div className="judul-kecil mt-0.5 text-lg text-tinta">{t.material}</div>
                    <div className="mt-0.5 text-sm text-tinta-pudar">
                      {role === "pabrik" ? `ke ${t.buyer}` : `dari ${t.pabrik}`} · {formatBerat(t.berat)} ·{" "}
                      {t.tanggal}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-w3 sm:flex-col sm:items-end sm:gap-w1">
                    <div className="judul text-2xl tabular-nums text-tinta">{formatRupiah(t.total)}</div>
                    <DipChip dip={TRANSAKSI_DIP[t.status]}>{t.status}</DipChip>
                  </div>
                </div>

                {(catatan || kontrol || sertifikat) && (
                  <div className="mt-w3 flex flex-wrap items-center justify-between gap-x-w4 gap-y-w2 border-t border-garis pt-w3">
                    {catatan ? (
                      <p className="inline-flex items-center gap-w2 text-sm text-tinta-pudar">
                        {t.status === "Dikirim" && <Lock size={16} strokeWidth={1.8} aria-hidden="true" />}
                        {t.status === "Selesai" && <LockOpen size={16} strokeWidth={1.8} aria-hidden="true" />}
                        {catatan}
                      </p>
                    ) : (
                      <span />
                    )}
                    {kontrol}
                    {sertifikat && (
                      <Link
                        href={`/pabrik/sertifikat/${t.id}`}
                        className="inline-flex min-h-11 items-center gap-1 rounded-full px-w3 text-sm font-semibold text-nila-tinta hover:bg-awan"
                      >
                        <BadgeCheck size={16} strokeWidth={1.8} aria-hidden="true" /> Lihat sertifikat
                        <span className="sr-only"> {t.id}</span>
                      </Link>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Halaman>
  );
}
