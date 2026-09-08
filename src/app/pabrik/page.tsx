"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Eyebrow } from "@/components/brand/eyebrow";
import { ListingGrid } from "@/components/pabrik/listing-grid";
import { StatRow } from "@/components/pabrik/stat-row";
import { useMyListings } from "@/lib/data/hooks";
import { PABRIK_AKTIF } from "@/lib/session";

export default function PabrikBerandaPage() {
  const { data, isPending } = useMyListings();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-w5 px-w4 py-w4 sm:px-w5">
      <div>
        <Eyebrow className="mb-w2">Ringkasan</Eyebrow>
        <h1 className="judul text-xl text-tinta">Selamat datang, {PABRIK_AKTIF}</h1>
      </div>

      <StatRow />

      <section>
        <div className="mb-w3 flex items-center justify-between gap-w3">
          <Eyebrow>Listing saya</Eyebrow>
          <Link
            href="/pabrik/upload"
            className="inline-flex items-center gap-1 rounded-sm bg-nila-6 px-w3 py-1.5 text-xs font-medium text-white hover:bg-nila-9"
          >
            <Plus size={13} aria-hidden="true" /> Upload Limbah
          </Link>
        </div>

        <ListingGrid listings={data} isPending={isPending} compact />
      </section>
    </div>
  );
}
