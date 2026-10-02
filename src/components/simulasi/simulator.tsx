"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Halaman, PageHeader } from "@/components/brand/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GrafikKasKumulatif } from "@/components/simulasi/grafik/kas-kumulatif";
import { GrafikPertumbuhan } from "@/components/simulasi/grafik/pertumbuhan";
import { GrafikTornado } from "@/components/simulasi/grafik/tornado";
import { GrafikWaterfall } from "@/components/simulasi/grafik/waterfall";
import { BadgeDeviasi, KartuMetrik } from "@/components/simulasi/kartu-metrik";
import { PanelAsumsi, type UbahAsumsi } from "@/components/simulasi/panel-asumsi";
import { PilihSkenario } from "@/components/simulasi/pilih-skenario";
import { TabelProyeksi } from "@/components/simulasi/tabel-proyeksi";
import {
  type AsumsiSimulasi,
  BASELINE,
  salinAsumsi,
} from "@/lib/finance/asumsi";
import { hitungProyeksi } from "@/lib/finance/hitung";
import { hitungKelayakan } from "@/lib/finance/kelayakan";
import {
  analisisSensitivitas,
  DEVIASI_BAWAAN,
  LABEL_METRIK,
  type MetrikTarget,
} from "@/lib/finance/sensitivitas";
import { type NamaSkenario, SKENARIO, URUTAN_SKENARIO } from "@/lib/finance/skenario";
import {
  formatJuta,
  formatPersenPresisi,
  formatRupiah,
  formatTon,
} from "@/lib/format";
import { dariParam, keParam, PARAM_SKENARIO } from "@/lib/simulasi/url";
import { cn } from "@/lib/utils";

type Mode = "presentasi" | "kerja";

const JEDA_URL_MS = 350;

const tampil = (nilai: number | null, format: (n: number) => string) =>
  nilai === null ? "tidak terdefinisi" : format(nilai);

export function Simulator() {
  // `useSearchParams` menangguhkan saat render; tanpa batas ini seluruh halaman ikut.
  return (
    <Suspense fallback={<Memuat />}>
      <SimulatorDalam />
    </Suspense>
  );
}

function Memuat() {
  return (
    <Halaman className="max-w-7xl">
      <Skeleton className="h-8 w-72" />
      <div className="mt-w5 grid gap-w4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
    </Halaman>
  );
}

function SimulatorDalam() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [asumsi, setAsumsi] = useState<AsumsiSimulasi>(() =>
    dariParam(searchParams.get(PARAM_SKENARIO)),
  );
  const [mode, setMode] = useState<Mode>("presentasi");
  const [metrik, setMetrik] = useState<MetrikTarget>("npv");
  const [tautanTersalin, setTautanTersalin] = useState(false);

  const ubah = useCallback<UbahAsumsi>((pembaru) => {
    setAsumsi((lama) => {
      const draf = salinAsumsi(lama);
      pembaru(draf);
      return draf;
    });
  }, []);

  const proyeksi = useMemo(() => hitungProyeksi(asumsi), [asumsi]);
  const kelayakan = useMemo(
    () => hitungKelayakan(asumsi, proyeksi),
    [asumsi, proyeksi],
  );
  const sensitivitas = useMemo(
    () => analisisSensitivitas(asumsi, { metrik, deviasi: DEVIASI_BAWAAN }),
    [asumsi, metrik],
  );

  const dasar = useMemo(() => {
    const p = hitungProyeksi(BASELINE);
    return { proyeksi: p, kelayakan: hitungKelayakan(BASELINE, p) };
  }, []);

  const preset = useMemo(() => cocokkanPreset(asumsi), [asumsi]);

  /* Menulis skenario ke URL supaya satu tautan bisa dibagikan apa adanya. */
  useEffect(() => {
    const tunda = setTimeout(() => {
      const param = keParam(asumsi);
      const url = param ? `?${PARAM_SKENARIO}=${param}` : window.location.pathname;
      router.replace(url, { scroll: false });
    }, JEDA_URL_MS);
    return () => clearTimeout(tunda);
  }, [asumsi, router]);

  useEffect(() => {
    if (!tautanTersalin) return;
    const tunda = setTimeout(() => setTautanTersalin(false), 2_000);
    return () => clearTimeout(tunda);
  }, [tautanTersalin]);

  const salinTautan = useCallback(() => {
    const param = keParam(asumsi);
    const url = `${window.location.origin}${window.location.pathname}${
      param ? `?${PARAM_SKENARIO}=${param}` : ""
    }`;
    void navigator.clipboard?.writeText(url).then(() => setTautanTersalin(true));
  }, [asumsi]);

  const lengkap = mode === "kerja";
  const y1 = proyeksi.tahun[0];
  const y3 = proyeksi.tahun[2];

  return (
    <Halaman className="max-w-7xl">
      <PageHeader
        eyebrow="Internal · tidak tertaut & tidak diindeks"
        title="Kalkulator skenario proyeksi ReKain"
        description="Seluruh nilai bawaan diambil dari Tabel 5.1–5.4 proposal. Geser asumsinya, dan proyeksi tiga tahun beserta indikator kelayakannya dihitung ulang seketika."
        action={
          <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
            <TabsList>
              <TabsTrigger value="presentasi">Presentasi</TabsTrigger>
              <TabsTrigger value="kerja">Kerja</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <PilihSkenario
        aktif={preset}
        pilih={(nama) => setAsumsi(salinAsumsi(SKENARIO[nama].asumsi))}
        reset={() => setAsumsi(salinAsumsi(BASELINE))}
        salinTautan={salinTautan}
        tautanTersalin={tautanTersalin}
      />

      <div className="mt-w5 grid gap-w5 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
        <aside className="cetak-mengalir rounded-kartu permukaan px-w4 py-w4 shadow-bal lg:sticky lg:top-w4 lg:max-h-[calc(100dvh-2rem)] lg:overflow-y-auto">
          <h2 className="judul-kecil mb-w3 text-sm text-tinta">Asumsi</h2>
          <PanelAsumsi asumsi={asumsi} ubah={ubah} lengkap={lengkap} />
        </aside>

        <div className="min-w-0 space-y-w5">
          <section aria-label="Indikator kelayakan">
            <div className="grid gap-w3 sm:grid-cols-2 xl:grid-cols-4">
              <KartuMetrik
                sorot
                label="ROI kumulatif 3 tahun"
                nilai={tampil(kelayakan.roi, (v) => formatPersenPresisi(v, 2))}
                badge={
                  <BadgeDeviasi nilai={kelayakan.roi} dasar={dasar.kelayakan.roi} />
                }
              />
              <KartuMetrik
                sorot
                label="IRR"
                nilai={tampil(kelayakan.irr, (v) => formatPersenPresisi(v, 2))}
                catatan={`Ambang kelayakan: WACC ${formatPersenPresisi(asumsi.wacc, 2)}`}
                badge={
                  <BadgeDeviasi nilai={kelayakan.irr} dasar={dasar.kelayakan.irr} />
                }
              />
              <KartuMetrik
                sorot
                label="Payback period"
                nilai={tampil(
                  kelayakan.paybackBulan,
                  (v) => `bulan ke-${v.toLocaleString("id-ID")}`,
                )}
                catatan={
                  kelayakan.paybackBulan === null
                    ? "Modal belum kembali dalam 36 bulan"
                    : `Setara ${lamaPayback(kelayakan.paybackBulan)}`
                }
                badge={
                  <BadgeDeviasi
                    lebihKecilLebihBaik
                    nilai={kelayakan.paybackBulan}
                    dasar={dasar.kelayakan.paybackBulan}
                  />
                }
              />
              <KartuMetrik
                sorot
                label={`NPV @ ${formatPersenPresisi(asumsi.wacc, 1)}`}
                nilai={tampil(kelayakan.npv, (v) => formatJuta(v))}
                badge={
                  <BadgeDeviasi nilai={kelayakan.npv} dasar={dasar.kelayakan.npv} />
                }
              />
            </div>

            <div className="mt-w3 grid gap-w3 sm:grid-cols-2 xl:grid-cols-4">
              <KartuMetrik
                label="Pendapatan Tahun 3"
                nilai={formatJuta(y3.totalPendapatan)}
                catatan={`GMV ${formatJuta(y3.gmv)} · ${formatTon(y3.volumeKg / 1_000, 0)}`}
                badge={
                  <BadgeDeviasi
                    nilai={y3.totalPendapatan}
                    dasar={dasar.proyeksi.tahun[2].totalPendapatan}
                  />
                }
              />
              <KartuMetrik
                label="Laba bersih 3 tahun"
                nilai={formatJuta(proyeksi.totalLabaBersih)}
                catatan={`Modal awal ${formatJuta(proyeksi.modalAwal)}`}
                badge={
                  <BadgeDeviasi
                    nilai={proyeksi.totalLabaBersih}
                    dasar={dasar.proyeksi.totalLabaBersih}
                  />
                }
              />
              <KartuMetrik
                label="Margin kotor Tahun 1"
                nilai={formatPersenPresisi(y1.marginKotor, 2)}
                catatan={`Kontribusi ${formatPersenPresisi(proyeksi.marginKontribusiGmv, 2)} per rupiah GMV`}
                badge={
                  <BadgeDeviasi
                    nilai={y1.marginKotor}
                    dasar={dasar.proyeksi.tahun[0].marginKotor}
                  />
                }
              />
              <KartuMetrik
                label="BEP pendapatan Tahun 1"
                nilai={tampil(kelayakan.bepPendapatan[0], (v) => formatJuta(v))}
                catatan={tampil(
                  kelayakan.bepVolumeTon[0],
                  (v) => `Setara ${formatTon(v)} material`,
                )}
                badge={
                  <BadgeDeviasi
                    lebihKecilLebihBaik
                    nilai={kelayakan.bepPendapatan[0]}
                    dasar={dasar.kelayakan.bepPendapatan[0]}
                  />
                }
              />
            </div>
          </section>

          <section aria-label="Grafik proyeksi" className="space-y-w4">
            <GrafikPertumbuhan proyeksi={proyeksi} />

            <div className="grid gap-w4 2xl:grid-cols-2">
              <GrafikWaterfall proyeksi={proyeksi} />
              <GrafikKasKumulatif
                proyeksi={proyeksi}
                paybackBulan={kelayakan.paybackBulan}
              />
            </div>

            <GrafikTornado
              baris={sensitivitas}
              metrik={metrik}
              deviasi={DEVIASI_BAWAAN}
              aksi={
                <div role="group" aria-label="Metrik sensitivitas" className="flex gap-1">
                  {(["npv", "roi", "labaBersih"] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMetrik(m)}
                      aria-pressed={metrik === m}
                      className={cn(
                        "rounded-full px-w3 py-1.5 font-mono text-xs transition-colors",
                        metrik === m
                          ? "bg-nila-6 text-white"
                          : "border border-garis text-tinta-pudar hover:border-nila-3",
                      )}
                    >
                      {LABEL_METRIK[m]}
                    </button>
                  ))}
                </div>
              }
            />

            <p className="rounded-kartu border border-garis bg-kain px-w4 py-w3 text-xs text-tinta-pudar">
              <span className="font-medium text-tinta">Catatan atas klaim Bab 5.4.</span>{" "}
              Proposal menyebut model ini paling sensitif terhadap harga per kg dan biaya
              logistik. Pada uji seragam ±{Math.round(DEVIASI_BAWAAN * 100)}% di atas, harga
              memang termasuk penggerak terkuat, tetapi biaya logistik berada di bawah biaya
              tetap dan take rate komisi. Keduanya tetap ditandai karena itulah dua variabel
              yang ketidakpastiannya datang dari pasar — biaya tetap sebagian besar keputusan
              manajemen, dan take rate ditentukan sendiri oleh platform.
            </p>
          </section>

          {lengkap && (
            <section aria-label="Tabel proyeksi" className="space-y-w3">
              <h2 className="judul-kecil text-sm text-tinta">Proyeksi laba rugi</h2>
              <TabelProyeksi proyeksi={proyeksi} />

              <div className="grid gap-w3 sm:grid-cols-3">
                {proyeksi.tahun.map((t, i) => (
                  <div
                    key={t.tahun}
                    className="rounded-kartu permukaan px-w4 py-w4 shadow-bal"
                  >
                    <div className="font-mono text-xs tracking-widest text-nila-tinta uppercase">
                      BEP Tahun {t.tahun}
                    </div>
                    <dl className="mt-w2 space-y-1 text-xs">
                      <div className="flex justify-between gap-w2">
                        <dt className="text-tinta-pudar">Pendapatan</dt>
                        <dd className="font-mono text-tinta tabular-nums">
                          {tampil(kelayakan.bepPendapatan[i], (v) => formatRupiah(Math.round(v)))}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-w2">
                        <dt className="text-tinta-pudar">Volume</dt>
                        <dd className="font-mono text-tinta tabular-nums">
                          {tampil(kelayakan.bepVolumeTon[i], (v) => formatTon(v))}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>

              <p className="text-xs text-tinta-pudar">
                BEP pendapatan memakai rumus proposal — biaya tetap dibagi rasio margin
                kotor. BEP volume adalah turunan yang tidak tercantum di proposal: ia
                memperlakukan grading premium dan SaaS sebagaimana adanya, yaitu pendapatan
                bernominal tetap yang tidak ikut naik bersama GMV.
              </p>
            </section>
          )}
        </div>
      </div>
    </Halaman>
  );
}

function lamaPayback(bulan: number): string {
  const tahun = Math.floor(bulan / 12);
  const sisa = bulan % 12;
  if (tahun === 0) return `${sisa} bulan`;
  return sisa === 0 ? `${tahun} tahun` : `${tahun} tahun ${sisa} bulan`;
}

/** Preset mana yang sedang aktif, atau `null` kalau user sudah menggeser sendiri. */
function cocokkanPreset(asumsi: AsumsiSimulasi): NamaSkenario | null {
  const kini = JSON.stringify(asumsi);
  return (
    URUTAN_SKENARIO.find((nama) => JSON.stringify(SKENARIO[nama].asumsi) === kini) ??
    null
  );
}
