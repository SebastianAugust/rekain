import Link from "next/link";
import { Check } from "lucide-react";

import { DipChip } from "@/components/brand/dip-chip";
import { StitchLine } from "@/components/brand/stitch-line";
import type { Listing } from "@/lib/types";

/**
 * In-page success state. A toast alone would vanish before the operator has read
 * the grading code, and the code is the one thing they need to write down.
 */
export function UploadSuccess({
  listing,
  onUploadLagi,
}: {
  listing: Listing;
  onUploadLagi: () => void;
}) {
  return (
    <div className="max-w-lg px-w4 py-w4 sm:px-w5">
      <div className="overflow-hidden rounded-sm border border-garis permukaan">
        <StitchLine seed={listing.id} className="mt-w3" />

        <div className="px-w4 pt-w3 pb-w5 text-center">
          <span
            className="inline-flex size-9 items-center justify-center rounded-sm bg-nila-6"
            aria-hidden="true"
          >
            <Check size={18} className="text-white" />
          </span>

          <h1 className="judul mt-w3 text-xl text-tinta">Limbah berhasil diunggah</h1>
          <p className="mx-auto mt-w2 max-w-xs text-sm text-tinta-pudar">
            Tim ReKain menggrading material ini dalam 1–2 hari kerja, lalu menampilkannya ke
            buyer.
          </p>

          <div className="mt-w4 inline-flex items-center gap-w3 rounded-sm border border-garis px-w3 py-w2">
            <span className="font-mono text-sm font-medium text-tinta">{listing.id}</span>
            <DipChip dip="d0">{listing.status}</DipChip>
          </div>

          <div className="mt-w5 flex flex-wrap items-center justify-center gap-w2">
            <Link
              href="/pabrik/listing"
              className="rounded-sm bg-nila-6 px-w4 py-w2 text-sm font-medium text-white hover:bg-nila-9"
            >
              Lihat listing saya
            </Link>
            <button
              type="button"
              onClick={onUploadLagi}
              className="rounded-sm border border-garis px-w4 py-w2 text-sm font-medium text-tinta hover:border-nila-3 hover:text-nila-tinta"
            >
              Upload lagi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
