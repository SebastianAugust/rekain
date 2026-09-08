"use client";

import { Eyebrow } from "@/components/brand/eyebrow";
import { ListingGrid } from "@/components/pabrik/listing-grid";
import { useMyListings } from "@/lib/data/hooks";

export default function PabrikListingPage() {
  const { data, isPending } = useMyListings();

  return (
    <div className="mx-auto max-w-6xl px-w4 py-w4 sm:px-w5">
      <Eyebrow className="mb-w2">Listing Saya</Eyebrow>
      <h1 className="judul mb-w4 text-xl text-tinta">
        {isPending ? "Memuat material…" : `${data?.length ?? 0} material diunggah`}
      </h1>

      <ListingGrid listings={data} isPending={isPending} />
    </div>
  );
}
