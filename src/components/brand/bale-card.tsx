import Link from "next/link";
import { MapPin, Scale } from "lucide-react";

import { DipChip, type DipTone } from "@/components/brand/dip-chip";
import { PenampangBal } from "@/components/brand/penampang-bal";
import { formatBerat, formatRupiah } from "@/lib/format";
import type { Listing, ListingStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Status as depth of dip: the further along the trade, the deeper the colour. */
const STATUS_DIP: Record<ListingStatus, DipTone> = {
  "Menunggu Grading": "d0",
  Tersedia: "d6",
  "Dalam Negosiasi": "d1",
  Terjual: "d0",
};

/**
 * A listing, rendered as a bale of cloth in cross-section.
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
        "relative min-w-0 overflow-hidden rounded-sm border border-garis permukaan",
        href && "bal",
        // card-level focus ring, driven by the stretched link inside
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-nila-3",
      )}
    >
      <PenampangBal seed={listing.id} dasar={listing.swatch} berat={listing.berat} />

      {/* Horizontal padding runs one step looser than vertical — weft over warp. */}
      <div
        className={cn("min-w-0", compact ? "px-w3 py-w2" : "px-w4 py-w3")}
        style={{ marginLeft: 18 }}
      >
        <div className="flex items-start justify-between gap-w2">
          <div className="min-w-0">
            <div className="font-mono text-xs tracking-wide text-tinta-pudar">{listing.id}</div>
            <h3 className="judul-kecil mt-0.5 text-base leading-snug text-tinta">
              {href ? (
                <Link href={href} className="outline-none after:absolute after:inset-0" aria-label={label}>
                  {listing.material}
                </Link>
              ) : (
                listing.material
              )}
            </h3>
          </div>
          <div className="relative z-10 flex shrink-0 items-center gap-w2">
            {action}
            {listing.grade ? (
              <DipChip dip="d3">GRADE {listing.grade}</DipChip>
            ) : (
              <DipChip dip="d0">BELUM DINILAI</DipChip>
            )}
          </div>
        </div>

        <div className="mt-w2 flex flex-wrap items-center gap-x-w4 gap-y-w1 text-xs text-tinta-pudar">
          <span className="inline-flex items-center gap-1">
            <Scale size={12} aria-hidden="true" /> {formatBerat(listing.berat)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={12} aria-hidden="true" /> {listing.lokasi}
          </span>
        </div>

        <div className="mt-w3 flex items-center justify-between gap-w2">
          {listing.harga === null ? (
            <span className="text-xs text-tinta-pudar italic">Harga menunggu penilaian</span>
          ) : (
            <span className="font-mono text-sm font-semibold text-tinta">
              {formatRupiah(listing.harga)}
              <span className="text-xs font-normal text-tinta-pudar">/kg</span>
            </span>
          )}
          <DipChip dip={STATUS_DIP[listing.status]}>{listing.status}</DipChip>
        </div>
      </div>
    </article>
  );
}
