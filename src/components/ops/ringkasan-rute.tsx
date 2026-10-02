import { Eyebrow } from "@/components/brand/eyebrow";
import { DyeWash } from "@/components/brand/textile-filters";
import { formatBerat, formatKm } from "@/lib/format";
import type { RencanaRute } from "@/lib/types";
import { cn } from "@/lib/utils";

/*
  The number that justifies the engine existing: what consolidation saves against
  collecting each pickup on its own dedicated round trip. Both figures are shown,
  because a saving with no baseline beside it is a claim rather than a result.

  Two by two from the smallest screen up. Stacking four full-width tiles turned
  the first phone screen into nothing but this panel, and the top row is a
  comparison — the two distances belong side by side to be read as one.
*/
export function RingkasanRute({ rencana }: { rencana: RencanaRute }) {
  const r = rencana.ringkasan;

  const sel = [
    {
      label: "Jarak rencana",
      nilai: formatKm(r.totalJarak),
      catatan: `${r.jumlahRute} rute · ${r.jumlahPerhentian} perhentian`,
      sorot: false,
      redup: false,
    },
    {
      label: "Tanpa konsolidasi",
      nilai: formatKm(r.jarakTanpaKonsolidasi),
      catatan: "Satu pulang-pergi per pengambilan",
      sorot: false,
      redup: true,
    },
    {
      label: "Penghematan",
      nilai: formatKm(r.penghematanKm),
      catatan: `${r.penghematanPersen.toLocaleString("id-ID")}% lebih pendek`,
      sorot: true,
      redup: false,
    },
    {
      label: "Total muatan",
      nilai: formatBerat(r.totalMuatan),
      catatan: `Truk ${formatBerat(rencana.kapasitas)} per rute`,
      sorot: false,
      redup: false,
    },
  ];

  return (
    <section
      aria-label="Ringkasan rencana rute"
      className="overflow-hidden rounded-kartu border border-garis"
    >
      {/* A 1px gap over a garis ground draws the dividers at any column count. */}
      <dl className="grid grid-cols-2 gap-px bg-garis lg:grid-cols-4">
        {sel.map((s) => (
          <div
            key={s.label}
            className={cn("px-w4 py-w3", s.sorot ? "celup di-nila bg-nila-6" : "permukaan")}
          >
            {/* The one dyed tile follows the rule every navy surface does. */}
            {s.sorot && <DyeWash halus />}
            <dt className="di-atas-celup">
              <Eyebrow className={cn("mb-w2", s.sorot && "text-nila-1")}>{s.label}</Eyebrow>
            </dt>
            <dd
              className={cn(
                "di-atas-celup font-mono text-xl font-semibold sm:text-2xl",
                s.sorot ? "text-white" : s.redup ? "text-tinta-pudar" : "text-tinta",
              )}
            >
              {s.nilai}
            </dd>
            <dd
              className={cn(
                "di-atas-celup mt-w1 text-xs",
                s.sorot ? "text-nila-1" : "text-tinta-pudar",
              )}
            >
              {s.catatan}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
