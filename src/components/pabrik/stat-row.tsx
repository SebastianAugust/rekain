"use client";

import { Package, Scale, TrendingUp } from "lucide-react";

import { StatCard } from "@/components/brand/stat-card";
import { useMyListings, useTransaksiSelesai } from "@/lib/data/hooks";
import { formatRupiahRingkas } from "@/lib/format";

/**
 * Totals are sums over the factory's completed transactions, derived here so they
 * stay correct if the seed data changes. Weight leads: it is the number the whole
 * product exists to move, so it gets the dyed tile and the other two stay quiet.
 */
export function StatRow() {
  const transaksi = useTransaksiSelesai();
  const listings = useMyListings();

  const selesai = transaksi.data ?? [];
  const totalBerat = selesai.reduce((sum, t) => sum + t.berat, 0);
  const totalPendapatan = selesai.reduce((sum, t) => sum + t.total, 0);

  const memuat = transaksi.isPending;

  return (
    <div className="grid gap-w4 lg:grid-cols-5">
      <StatCard
        utama
        className="flex flex-col justify-end py-w6 lg:col-span-3"
        label="Limbah terjual"
        value={memuat ? "—" : totalBerat.toLocaleString("id-ID")}
        satuan="kg"
        catatan={memuat ? undefined : `Dari ${selesai.length} transaksi yang sudah selesai.`}
        icon={Scale}
      />
      <div className="grid gap-w4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
        <StatCard label="Omzet" value={memuat ? "—" : formatRupiahRingkas(totalPendapatan)} icon={TrendingUp} />
        <StatCard
          label="Listing aktif"
          value={listings.isPending ? "—" : (listings.data?.length ?? 0)}
          icon={Package}
        />
      </div>
    </div>
  );
}
