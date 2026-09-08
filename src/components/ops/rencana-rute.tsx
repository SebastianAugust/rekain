"use client";

import { useState } from "react";
import { Route } from "lucide-react";

import { EmptyState } from "@/components/brand/empty-state";
import { Eyebrow } from "@/components/brand/eyebrow";
import { KartuRute } from "@/components/ops/kartu-rute";
import { KontrolKapasitas } from "@/components/ops/kontrol-kapasitas";
import { RingkasanRute } from "@/components/ops/ringkasan-rute";
import { TitikBelumDisurvei } from "@/components/ops/titik-belum-disurvei";
import { Skeleton } from "@/components/ui/skeleton";
import { useRencanaRute } from "@/lib/data/hooks";
import { KAPASITAS_DEFAULT } from "@/lib/logistik/rute";
import { DEPOT_NAMA, KLASTER } from "@/lib/session";

function RencanaSkeleton() {
  return (
    <div className="space-y-w5" role="status" aria-label="Menyusun rencana rute">
      <div className="grid grid-cols-1 gap-px rounded-sm border border-garis bg-garis sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="space-y-w2 permukaan px-w4 py-w3">
            <Skeleton className="h-3 w-24 bg-kain" />
            <Skeleton className="h-7 w-28 bg-kain" />
            <Skeleton className="h-3 w-32 bg-kain" />
          </div>
        ))}
      </div>
      <div className="grid gap-x-w5 gap-y-w4 xl:grid-cols-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="space-y-w3 rounded-sm border border-garis permukaan px-w4 py-w4">
            <Skeleton className="h-4 w-32 bg-kain" />
            <Skeleton className="h-40 w-full bg-kain" />
            <Skeleton className="h-3 w-full bg-kain" />
            <Skeleton className="h-3 w-2/3 bg-kain" />
          </div>
        ))}
      </div>
      <span className="sr-only">Menyusun rencana rute…</span>
    </div>
  );
}

export function RencanaRutePanel() {
  const [kapasitas, setKapasitas] = useState<number>(KAPASITAS_DEFAULT);
  const { data, isPending, isFetching } = useRencanaRute(kapasitas);

  return (
    <div className="mx-auto max-w-6xl px-w4 py-w4 sm:px-w5">
      <Eyebrow className="mb-w2">Logistik · {KLASTER}</Eyebrow>
      <h1 className="judul mb-w2 text-xl text-tinta">Rencana pengambilan hari ini</h1>
      <p className="mb-w5 max-w-2xl text-sm text-tinta-pudar">
        Material yang sudah digrading dikelompokkan per kecamatan, dipadatkan ke muatan truk,
        lalu diurutkan jadi rute terpendek dari {DEPOT_NAMA}. Ubah kapasitas truk untuk menyusun
        ulang.
      </p>

      <div className="mb-w5">
        <KontrolKapasitas
          kapasitas={kapasitas}
          onKapasitasChange={setKapasitas}
          sedangHitung={isFetching}
        />
      </div>

      {isPending || !data ? (
        <RencanaSkeleton />
      ) : data.rute.length === 0 ? (
        <EmptyState
          icon={Route}
          title="Belum ada yang perlu dijemput"
          description="Rute muncul di sini begitu ada material yang selesai digrading dan masih berada di pabrik."
        />
      ) : (
        <div className="space-y-w5">
          <RingkasanRute rencana={data} />

          {data.tidakTerutekan.length > 0 && (
            <TitikBelumDisurvei daftar={data.tidakTerutekan} />
          )}

          <section aria-label="Daftar rute">
            <h2 className="judul-kecil mb-w3 text-base text-tinta">
              {data.rute.length} rute untuk armada hari ini
            </h2>
            <div className="grid gap-x-w5 gap-y-w4 xl:grid-cols-2">
              {data.rute.map((r) => (
                <KartuRute
                  key={r.id}
                  rute={r}
                  depot={data.depot}
                  bingkai={[
                    data.depot,
                    ...data.rute.flatMap((x) => x.perhentian.map((p) => p.titik)),
                  ]}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
