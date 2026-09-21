"use client";

import { Package, Scale, TrendingUp } from "lucide-react";

import { StatCard } from "@/components/brand/stat-card";
import { useMyListings, useTransaksiPabrik } from "@/lib/data/hooks";
import { formatBerat, formatRupiahRingkas } from "@/lib/format";

/**
 * The mockup hardcoded "640 kg" and "Rp3,3 jt" — both are just sums over the
 * factory's completed transactions, so they're derived here and stay correct if
 * the seed data changes.
 */
export function StatRow() {
  const transaksi = useTransaksiPabrik();
  const listings = useMyListings();

  const selesai = (transaksi.data ?? []).filter((t) => t.status === "Selesai");
  const totalBerat = selesai.reduce((sum, t) => sum + t.berat, 0);
  const totalPendapatan = selesai.reduce((sum, t) => sum + t.total, 0);

  const memuat = transaksi.isPending;

  return (
    <div className="grid grid-cols-3 gap-x-w3 sm:gap-x-w4">
      <StatCard
        label="Terjual"
        value={memuat ? "—" : formatBerat(totalBerat)}
        icon={Scale}
      />
      <StatCard
        label="Omzet"
        value={memuat ? "—" : formatRupiahRingkas(totalPendapatan)}
        icon={TrendingUp}
      />
      <StatCard
        label="Listing"
        value={listings.isPending ? "—" : (listings.data?.length ?? 0)}
        icon={Package}
      />
    </div>
  );
}
