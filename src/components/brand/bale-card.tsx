import Link from "next/link";
import { MapPin, Scale } from "lucide-react";

import { DipChip } from "@/components/brand/dip-chip";
import { MaterialSwatch } from "@/components/brand/material-swatch";
import { LISTING_DIP } from "@/components/brand/status-dip";
import { formatBerat, formatRupiah } from "@/lib/format";
import type { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * A listing: swatch, code, grade, name, weight and place, price per kilo, status.
 *
 * Pass `href` to make the whole card a link (buyer browsing). Omit it for the
 * factory's own listings, which are not navigable.
 */
export function BaleCard({
  listing,
  href,
  compact,
  action,
}: {
  listing: Listing;
  href?: string;
  compact?: boolean;
  /** Rendered top-right, above the stretched link — e.g. the favourite toggle. */
  action?: React.ReactNode;
}) {
  const label = [
    listing.material,
    listing.grade ? `grade ${listing.grade}` : "belum dinilai",
    formatBerat(listing.berat),
    listing.lokasi,
  ].join(", ");

  return (
    <article
      className={cn(
        "relative min-w-0 rounded-kartu permukaan",
        compact ? "p-w3" : "p-w4",
        href ? "bal" : "shadow-bal",
        // card-level focus ring, driven by the stretched link inside
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-nila-3",
      )}
    >
      <div className="flex items-start gap-w3">
        <MaterialSwatch
          material={listing.material}
          seed={listing.id}
          className={compact ? "size-14" : "size-16"}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-w2">
            <div className="flex min-w-0 flex-wrap items-center gap-x-w2 gap-y-w1">
              <span className="font-mono text-xs tracking-wide text-tinta-pudar">{listing.id}</span>
              {listing.grade ? (
                <DipChip dip="d3">GRADE {listing.grade}</DipChip>
              ) : (
                <DipChip dip="d0">BELUM DINILAI</DipChip>
              )}
            </div>
            <div className="relative z-10 -my-w2 -mr-w2 flex shrink-0 items-center">{action}</div>
          </div>

          <h3 className="judul-kecil mt-w1 text-lg leading-snug text-tinta">
            {href ? (
              <Link href={href} className="outline-none after:absolute after:inset-0" aria-label={label}>
                {listing.material}
              </Link>
            ) : (
              listing.material
            )}
          </h3>

          <div className="mt-w1 flex flex-wrap items-center gap-x-w3 gap-y-w1 text-sm text-tinta-pudar">
            <span className="inline-flex items-center gap-1">
              <Scale size={14} strokeWidth={1.8} aria-hidden="true" /> {formatBerat(listing.berat)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} strokeWidth={1.8} aria-hidden="true" /> {listing.lokasi}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-w4 flex items-end justify-between gap-w2">
        {listing.harga === null ? (
          <span className="text-sm text-tinta-pudar">Harga menunggu penilaian</span>
        ) : (
          <span className="judul text-3xl tabular-nums text-tinta">
            {formatRupiah(listing.harga)}
            <span className="ml-0.5 text-sm font-semibold tracking-normal text-tinta-pudar">/kg</span>
          </span>
        )}
        <DipChip dip={LISTING_DIP[listing.status]}>{listing.status}</DipChip>
      </div>
    </article>
  );
}
