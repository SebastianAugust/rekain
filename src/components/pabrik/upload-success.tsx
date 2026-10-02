import Link from "next/link";

import { DipChip } from "@/components/brand/dip-chip";
import { Halaman } from "@/components/brand/page-header";
import { BingkaiJahit, StitchLine } from "@/components/brand/stitch-line";
import { tombol } from "@/components/brand/tombol";
import type { Listing } from "@/lib/types";

/**
 * In-page success state. A toast alone would vanish before the operator has read
 * the grading code, and the code is the one thing they need to write down — so
 * it is set large, on its own tag, and the check mark sews itself shut.
 */
export function UploadSuccess({
  listing,
  onUploadLagi,
}: {
  listing: Listing;
  onUploadLagi: () => void;
}) {
  return (
    <Halaman className="max-w-xl">
      <div
        role="status"
        className="overflow-hidden rounded-kartu border border-garis permukaan shadow-bal"
      >
        <StitchLine seed={listing.id} className="mt-w3" />

        <div className="px-w4 pt-w4 pb-w5 text-center">
          <span
            className="inline-flex size-11 items-center justify-center rounded-input bg-nila-6 shadow-tombol"
            aria-hidden="true"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" focusable="false">
              <path
                className="jahit-tutup"
                d="M5 12.5 10 17 19 7"
                fill="none"
                stroke="#ffffff"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <h1 className="judul mt-w3 text-xl text-tinta sm:text-2xl">Limbah berhasil diunggah</h1>
          <p className="mx-auto mt-w2 max-w-sm text-sm text-pretty text-tinta-pudar">
            Tim ReKain menilai mutu material ini dalam 1–2 hari kerja, lalu menampilkannya ke
            buyer. Catat kode di bawah untuk pelacakan.
          </p>

          <div className="relative mx-auto mt-w4 inline-flex -rotate-1 items-center gap-w3 rounded-kartu bg-white px-w4 py-w3 shadow-bal">
            <BingkaiJahit rapat />
            <span className="relative font-mono text-lg font-semibold tracking-wide text-tinta">
              {listing.id}
            </span>
            <DipChip dip="d0" className="relative">
              {listing.status}
            </DipChip>
          </div>

          <div className="mt-w5 flex flex-wrap items-center justify-center gap-w2">
            <Link href="/pabrik/listing" className={tombol()}>
              Lihat listing saya
            </Link>
            <button type="button" onClick={onUploadLagi} className={tombol({ nada: "garis" })}>
              Upload lagi
            </button>
          </div>
        </div>
      </div>
    </Halaman>
  );
}
