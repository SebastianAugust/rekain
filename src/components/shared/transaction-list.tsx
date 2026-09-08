"use client";

import { Clock } from "lucide-react";

import { DipChip, type DipTone } from "@/components/brand/dip-chip";
import { EmptyState } from "@/components/brand/empty-state";
import { Eyebrow } from "@/components/brand/eyebrow";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBerat, formatRupiah } from "@/lib/format";
import type { Role, Transaction, TransactionStatus } from "@/lib/types";

/** Same dip logic as listings: the further along, the deeper the colour. */
const STATUS_DIP: Record<TransactionStatus, DipTone> = {
  "Menunggu Konfirmasi": "d0",
  Dikirim: "d1",
  Selesai: "d6",
};

export function TransactionList({
  items,
  isPending,
  role,
}: {
  items: Transaction[] | undefined;
  isPending: boolean;
  role: Role;
}) {
  return (
    <div className="mx-auto max-w-6xl px-w4 py-w4 sm:px-w5">
      <Eyebrow className="mb-w2">Transaksi</Eyebrow>
      <h1 className="judul mb-w4 text-xl text-tinta">Riwayat transaksi</h1>

      {isPending ? (
        <div className="space-y-w3" role="status" aria-label="Memuat transaksi">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} className="rounded-sm border border-garis permukaan px-w4 py-w3">
              <Skeleton className="h-4 w-48 bg-kain" />
              <Skeleton className="mt-w2 h-3 w-64 bg-kain" />
            </div>
          ))}
          <span className="sr-only">Memuat transaksi…</span>
        </div>
      ) : !items || items.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Belum ada transaksi"
          description="Transaksi yang sudah disepakati muncul di sini beserta status pengirimannya."
        />
      ) : (
        <ul className="space-y-w3">
          {items.map((t) => (
            <li
              key={t.id}
              className="flex flex-col gap-w2 rounded-sm border border-garis permukaan px-w4 py-w3 sm:flex-row sm:items-center sm:justify-between sm:gap-w4"
            >
              <div className="min-w-0">
                <div className="judul-kecil text-sm text-tinta">{t.material}</div>
                <div className="mt-0.5 text-xs text-tinta-pudar">
                  {role === "pabrik" ? `ke ${t.buyer}` : `dari ${t.pabrik}`} ·{" "}
                  {formatBerat(t.berat)} · {t.tanggal}
                </div>
              </div>
              <div className="flex items-center justify-between gap-w3 sm:block sm:shrink-0 sm:text-right">
                <div className="font-mono text-sm font-semibold text-tinta">
                  {formatRupiah(t.total)}
                </div>
                <DipChip dip={STATUS_DIP[t.status]} className="sm:mt-1">
                  {t.status}
                </DipChip>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
