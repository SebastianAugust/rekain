"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Eyebrow } from "@/components/brand/eyebrow";
import { Halaman, PageHeader } from "@/components/brand/page-header";
import { tombol } from "@/components/brand/tombol";
import { ListingGrid } from "@/components/pabrik/listing-grid";
import { StatRow } from "@/components/pabrik/stat-row";
import { useMyListings } from "@/lib/data/hooks";
import { PABRIK_AKTIF } from "@/lib/session";

export default function PabrikBerandaPage() {
  const { data, isPending, isError, refetch } = useMyListings();

  return (
    <Halaman>
      <PageHeader eyebrow="Ringkasan" title={`Selamat datang, ${PABRIK_AKTIF}`} />

      <StatRow />

      <section className="mt-w5">
        <div className="mb-w3 flex items-center justify-between gap-w3">
          <Eyebrow>Listing saya</Eyebrow>
          <Link href="/pabrik/upload" className={tombol({ ukuran: "kecil" })}>
            <Plus size={13} aria-hidden="true" /> Upload Limbah
          </Link>
        </div>

        <ListingGrid
          listings={data}
          isPending={isPending}
          isError={isError}
          onRetry={() => refetch()}
          compact
        />
      </section>
    </Halaman>
  );
}
