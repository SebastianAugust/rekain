import { Clock, MapPin, Package, Truck } from "lucide-react";

import { DipChip } from "@/components/brand/dip-chip";
import { PetaJahitan } from "@/components/ops/peta-jahitan";
import { formatBerat, formatDurasi, formatKm, formatPersen } from "@/lib/format";
import { DEPOT_NAMA } from "@/lib/session";
import type { Rute, Titik } from "@/lib/types";

/** Full trucks are the point of consolidating, so a slack load is worth flagging. */
function nadaUtilisasi(rasio: number) {
  if (rasio >= 0.85) return { dip: "d6" as const, label: "Padat" };
  if (rasio >= 0.6) return { dip: "d1" as const, label: "Wajar" };
  return { dip: "d0" as const, label: "Longgar" };
}

export function KartuRute({
  rute,
  depot,
  bingkai,
}: {
  rute: Rute;
  depot: Titik;
  /** Shared projection frame, so every route card is drawn at the same scale. */
  bingkai: Titik[];
}) {
  const utilisasi = nadaUtilisasi(rute.utilisasi);

  return (
    <article className="overflow-hidden rounded-sm border border-garis permukaan">
      <header className="flex flex-wrap items-center justify-between gap-w3 border-b border-garis px-w4 py-w3">
        <div className="min-w-0">
          <div className="font-mono text-xs text-tinta-pudar">{rute.id}</div>
          <h3 className="judul-kecil text-base text-tinta">{rute.kecamatan}</h3>
        </div>
        <div className="flex shrink-0 items-center gap-w2">
          <DipChip dip="d3">{rute.perhentian.length} PERHENTIAN</DipChip>
          <DipChip dip={utilisasi.dip}>{utilisasi.label}</DipChip>
        </div>
      </header>

      {/* Explicit height: the seam is orientation, not detail, so it does not need
          to grow with the card. Half a phone screen was too much to spend on it. */}
      <div className="h-44 bg-kain px-w4 py-w3 sm:h-40">
        <PetaJahitan
          depot={depot}
          perhentian={rute.perhentian}
          ruteId={rute.id}
          bingkai={bingkai}
        />
      </div>

      <ol className="divide-y divide-garis border-t border-garis">
        {rute.perhentian.map((p) => (
          <li key={`${p.pabrik}-${p.urutan}`} className="flex items-start gap-w3 px-w4 py-w3">
            <span
              className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-sm bg-nila-6 font-mono text-xs font-semibold text-white"
              aria-hidden="true"
            >
              {p.urutan}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-tinta">
                <span className="sr-only">Perhentian {p.urutan}: </span>
                {p.pabrik}
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-w4 gap-y-w1 text-xs text-tinta-pudar">
                <span className="inline-flex items-center gap-1">
                  <Package size={11} aria-hidden="true" /> {formatBerat(p.muatan)}
                </span>
                {/*
                  Only the first leg needs naming; after that the row is already
                  numbered, so the leg length alone is unambiguous. Spelling out
                  "dari perhentian sebelumnya" pushed most stops onto a third
                  line on a phone for no added meaning.
                */}
                <span className="inline-flex items-center gap-1">
                  <MapPin size={11} aria-hidden="true" />
                  {p.urutan === 1
                    ? `${formatKm(p.jarakDariSebelumnya)} dari hub`
                    : `lanjut ${formatKm(p.jarakDariSebelumnya)}`}
                </span>
                <span className="font-mono">{p.listingIds.join(" · ")}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <footer className="border-t border-garis px-w4 py-w3">
        <dl className="flex flex-wrap items-center gap-x-w5 gap-y-w2 text-sm">
          <div className="flex items-center gap-w2">
            <Truck size={14} className="text-nila-3" aria-hidden="true" />
            <dt className="text-xs text-tinta-pudar">Jarak</dt>
            <dd className="font-mono font-semibold text-tinta">{formatKm(rute.totalJarak)}</dd>
          </div>
          <div className="flex items-center gap-w2">
            <Clock size={14} className="text-nila-3" aria-hidden="true" />
            <dt className="text-xs text-tinta-pudar">Estimasi</dt>
            <dd className="font-mono font-semibold text-tinta">
              {formatDurasi(rute.estimasiMenit)}
            </dd>
          </div>
          <div className="flex items-center gap-w2">
            <dt className="text-xs text-tinta-pudar">Muatan</dt>
            <dd className="font-mono font-semibold text-tinta">
              {formatBerat(rute.totalMuatan)}
              <span className="font-normal text-tinta-pudar">
                {" "}
                / {formatBerat(rute.kapasitas)} · {formatPersen(rute.utilisasi)}
              </span>
            </dd>
          </div>
        </dl>

        {/* The bar repeats the figure above it, so it carries no information of its own. */}
        <div className="mt-w3 h-1.5 w-full overflow-hidden rounded-sm bg-kain" aria-hidden="true">
          <div
            className="h-full bg-nila-6"
            style={{ width: `${Math.min(100, rute.utilisasi * 100)}%` }}
          />
        </div>

        <p className="mt-w2 text-xs text-tinta-pudar">
          Berangkat dan kembali ke {DEPOT_NAMA}.
        </p>
      </footer>
    </article>
  );
}
