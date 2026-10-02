"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { DataContoh } from "@/components/brand/data-contoh";
import { Halaman, PageHeader } from "@/components/brand/page-header";
import { tombol } from "@/components/brand/tombol";
import { DampakRingkas } from "@/components/pabrik/dampak-ringkas";
import { ListingGrid } from "@/components/pabrik/listing-grid";
import { StatRow } from "@/components/pabrik/stat-row";
import { useMyListings } from "@/lib/data/hooks";
import { PABRIK_AKTIF } from "@/lib/session";

export default function PabrikBerandaPage() {
  const { data, isPending, isError, refetch } = useMyListings();

  return (
    <Halaman>
      <PageHeader eyebrow="Ringkasan" title={`Selamat datang, ${PABRIK_AKTIF}`} action={<DataContoh />} />

      <StatRow />

      <div className="mt-w4">
        <DampakRingkas />
      </div>

      <section className="mt-w6" aria-labelledby="listing-saya">
        <div className="mb-w4 flex items-center justify-between gap-w3">
          <h2 id="listing-saya" className="judul text-2xl text-tinta">
            Listing saya
          </h2>
          <Link href="/pabrik/upload" className={tombol({ ukuran: "kecil" })}>
            <Plus size={18} strokeWidth={1.8} aria-hidden="true" /> Upload limbah
          </Link>
        </div>

        <ListingGrid
          listings={data}
          isPending={isPending}
          isError={isError}
          onRetry={() => refetch()}
          compact
        />

        <p className="mt-w5 text-center text-sm text-tinta-pudar">
          <Link href="/pabrik/listing" className="inline-flex min-h-11 items-center rounded-full px-w3 font-semibold text-nila-tinta hover:bg-awan">
            Lihat semua listing
          </Link>
        </p>
      </section>
    </Halaman>
  );
}
