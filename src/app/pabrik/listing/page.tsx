"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Halaman, PageHeader } from "@/components/brand/page-header";
import { tombol } from "@/components/brand/tombol";
import { ListingGrid } from "@/components/pabrik/listing-grid";
import { useMyListings } from "@/lib/data/hooks";

export default function PabrikListingPage() {
  const { data, isPending, isError, refetch } = useMyListings();

  return (
    <Halaman>
      <PageHeader
        eyebrow="Listing Saya"
        title={
          isPending
            ? "Memuat material…"
            : isError
              ? "Material yang Anda unggah"
              : `${data?.length ?? 0} material diunggah`
        }
        action={
          <Link href="/pabrik/upload" className={tombol({ ukuran: "kecil" })}>
            <Plus size={18} strokeWidth={1.8} aria-hidden="true" /> Upload limbah
          </Link>
        }
      />

      <ListingGrid
        listings={data}
        isPending={isPending}
        isError={isError}
        onRetry={() => refetch()}
      />
    </Halaman>
  );
}
