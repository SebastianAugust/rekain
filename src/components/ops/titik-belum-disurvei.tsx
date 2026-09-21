import Link from "next/link";

import { Eyebrow } from "@/components/brand/eyebrow";
import { formatBerat } from "@/lib/format";
import type { TidakTerutekan } from "@/lib/types";

/**
 * Material the planner could not place, and why.
 *
 * Dropping these silently would make the savings figure look better and the plan
 * wrong — a truck would arrive at the hub short of stock nobody had accounted
 * for. The guard thread down the left edge is the same mark used on required
 * form fields: this is the thing that needs a person.
 */
export function TitikBelumDisurvei({ daftar }: { daftar: TidakTerutekan[] }) {
  const total = daftar.reduce((sum, d) => sum + d.muatan, 0);

  return (
    <section
      aria-label="Material yang belum bisa dirutekan"
      className="relative overflow-hidden rounded-sm border border-garis permukaan px-w4 py-w3"
    >
      <span className="absolute inset-y-0 left-0 bg-benang" style={{ width: 2 }} aria-hidden="true" />

      <Eyebrow className="mb-w2">Belum bisa dirutekan</Eyebrow>
      <p className="mb-w3 text-sm text-tinta">
        {/* Indonesian nouns do not inflect for number, so no singular/plural branch. */}
        {formatBerat(total)} dari {daftar.length} pabrik tidak masuk rencana.
      </p>

      <ul className="space-y-w2">
        {daftar.map((d) => (
          <li key={d.pabrik} className="flex flex-wrap items-baseline gap-x-w3 gap-y-w1 text-xs">
            <span className="font-medium text-tinta">{d.pabrik}</span>
            <span className="text-tinta-pudar">{d.alasan}</span>
            <span className="font-mono text-tinta-pudar">
              {formatBerat(d.muatan)} · {d.listingIds.join(" · ")}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href="/ops/pabrik"
        className="mt-w3 inline-block rounded-sm text-xs font-medium text-nila-tinta hover:underline"
      >
        Kelola titik jemput
      </Link>
    </section>
  );
}
