"use client";

import { Factory } from "lucide-react";

import { DipChip } from "@/components/brand/dip-chip";
import { EmptyState, ErrorState } from "@/components/brand/empty-state";
import { Halaman, PageHeader } from "@/components/brand/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { usePabrik } from "@/lib/data/hooks";
import { formatKm } from "@/lib/format";
import { jarakJalan } from "@/lib/logistik/jarak";
import { DEPOT, DEPOT_NAMA, KLASTER } from "@/lib/session";
import type { Pabrik } from "@/lib/types";

/** Sort surveyed factories by cluster then distance; unsurveyed ones last. */
function urutkan(pabrik: Pabrik[]): Pabrik[] {
  return [...pabrik].sort((a, b) => {
    if (!a.titik && b.titik) return 1;
    if (a.titik && !b.titik) return -1;
    if (a.kecamatan !== b.kecamatan) return a.kecamatan.localeCompare(b.kecamatan);
    if (a.titik && b.titik) return jarakJalan(DEPOT, a.titik) - jarakJalan(DEPOT, b.titik);
    return a.nama.localeCompare(b.nama);
  });
}

export function DaftarPabrik() {
  const { data, isPending, isError, refetch } = usePabrik();

  return (
    <Halaman>
      <PageHeader
        eyebrow={`Registri · ${KLASTER}`}
        title="Titik jemput pabrik"
        description={`Koordinat yang dipakai perencana rute. Jarak dihitung dari ${DEPOT_NAMA}; pabrik tanpa koordinat tidak bisa masuk rute sampai titiknya disurvei.`}
      />

      {isPending ? (
        <div className="space-y-w2" role="status" aria-label="Memuat titik jemput">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-sm border border-garis permukaan px-w4 py-w3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="mt-w2 h-3 w-64" />
            </div>
          ))}
          <span className="sr-only">Memuat titik jemput…</span>
        </div>
      ) : isError || !data ? (
        <ErrorState title="Registri pabrik gagal dimuat" onRetry={() => refetch()} />
      ) : data.length === 0 ? (
        <EmptyState
          icon={Factory}
          title="Registri masih kosong"
          description="Pabrik yang sudah terdaftar beserta titik jemputnya akan muncul di sini."
        />
      ) : (
        <div className="overflow-hidden rounded-sm border border-garis permukaan">
          {/* A table on desktop; the same rows stack on a phone without a horizontal scroll. */}
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">
              Daftar pabrik, kecamatan, koordinat, dan jarak dari hub
            </caption>
            <thead className="hidden sm:table-header-group">
              <tr className="border-b border-garis text-left">
                <th scope="col" className="px-w4 py-w2 text-xs font-medium text-tinta-pudar">
                  Pabrik
                </th>
                <th scope="col" className="px-w4 py-w2 text-xs font-medium text-tinta-pudar">
                  Kecamatan
                </th>
                <th scope="col" className="px-w4 py-w2 text-xs font-medium text-tinta-pudar">
                  Koordinat
                </th>
                <th scope="col" className="px-w4 py-w2 text-xs font-medium text-tinta-pudar">
                  Jarak dari hub
                </th>
              </tr>
            </thead>
            <tbody>
              {urutkan(data).map((p) => (
                /*
                  Below `sm` the header row is gone, so a plain stack would leave
                  "21,1 km" sitting under a name with nothing saying what it is.
                  Two columns instead: name against its distance on the first
                  line, sub-district against its coordinates on the second, so
                  every value stays beside something that explains it.
                */
                <tr
                  key={p.nama}
                  className="grid grid-cols-2 items-baseline gap-x-w3 gap-y-w1 border-b border-garis px-w4 py-w3 last:border-b-0 sm:table-row sm:px-0 sm:py-0"
                >
                  <td className="col-start-1 row-start-1 font-medium text-tinta sm:px-w4 sm:py-w3">
                    {p.nama}
                  </td>
                  <td className="col-start-1 row-start-2 text-xs text-tinta-pudar sm:px-w4 sm:py-w3 sm:text-sm">
                    {p.kecamatan}
                  </td>
                  <td className="col-start-2 row-start-2 text-right font-mono text-xs text-tinta-pudar sm:px-w4 sm:py-w3 sm:text-left">
                    {p.titik
                      ? `${p.titik.lat.toFixed(4)}, ${p.titik.lng.toFixed(4)}`
                      : "—"}
                  </td>
                  <td className="col-start-2 row-start-1 text-right sm:px-w4 sm:py-w3 sm:text-left">
                    {p.titik ? (
                      <span className="font-mono text-tinta">
                        {formatKm(jarakJalan(DEPOT, p.titik))}
                      </span>
                    ) : (
                      <DipChip dip="d0">BELUM DISURVEI</DipChip>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Halaman>
  );
}
