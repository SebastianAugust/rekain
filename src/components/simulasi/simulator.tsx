"use client";

import { useMemo, useState } from "react";
import { BadgeCheck } from "lucide-react";

import { Halaman, PageHeader } from "@/components/brand/page-header";
import { AcuanProposal } from "@/components/simulasi/acuan-proposal";
import { BadgeDeviasi, KartuMetrik } from "@/components/simulasi/kartu-metrik";
import { PanelAsumsi } from "@/components/simulasi/panel-asumsi";
import { PilihSkenario } from "@/components/simulasi/pilih-skenario";
import { TabelProyeksi } from "@/components/simulasi/tabel-proyeksi";
import { hitungProyeksi } from "@/lib/finance/hitung";
import { hitungKelayakan } from "@/lib/finance/kelayakan";
import {
  bangunAsumsi,
  cocokkanPreset,
  MASUKAN_BAWAAN,
  type Masukan,
  SKENARIO,
} from "@/lib/finance/skenario";
import { formatJuta, formatPersenPresisi, formatRupiah, formatTon } from "@/lib/format";

const tampil = (nilai: number | null, format: (n: number) => string, kosong = "tidak terdefinisi") =>
  nilai === null ? kosong : format(nilai);

const hitung = (m: Masukan) => {
  const asumsi = bangunAsumsi(m);
  const proyeksi = hitungProyeksi(asumsi);
  return { proyeksi, kelayakan: hitungKelayakan(asumsi, proyeksi) };
};

/* Pembanding badge deviasi: Moderat pada diskonto yang sedang dipilih. */
const MODERAT_PER_DISKONTO = new Map<number, ReturnType<typeof hitung>>();
function moderat(diskonto: number) {
  let h = MODERAT_PER_DISKONTO.get(diskonto);
  if (!h) {
    h = hitung({ ...MASUKAN_BAWAAN, diskonto });
    MODERAT_PER_DISKONTO.set(diskonto, h);
  }
  return h;
}

export function Simulator() {
  const [masukan, setMasukan] = useState<Masukan>(MASUKAN_BAWAAN);

  const { proyeksi, kelayakan } = useMemo(() => hitung(masukan), [masukan]);
  const dasar = moderat(masukan.diskonto);

  const preset = cocokkanPreset(masukan);
  const sesuaiProposal =
    preset === "moderat" && masukan.diskonto === MASUKAN_BAWAAN.diskonto;
  const y1 = proyeksi.tahun[0];

  return (
    <Halaman className="max-w-7xl">
      <PageHeader
        eyebrow="Prototipe · data asumsi"
        title="Kalkulator skenario proyeksi ReKain"
        description="Nilai bawaan (Moderat) sesuai proyeksi proposal. Geser harga material, volume, take rate komisi, dan biaya logistik untuk melihat dampaknya pada ROI, IRR, dan payback."
        action={
          sesuaiProposal && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-nila-1/45 px-w3 py-1 font-mono text-xs text-nila-9">
              <BadgeCheck size={13} aria-hidden="true" />
              Sesuai proyeksi proposal
            </span>
          )
        }
      />

      <PilihSkenario
        aktif={preset}
        pilih={(nama) => setMasukan(SKENARIO[nama].masukan)}
        reset={() => setMasukan(MASUKAN_BAWAAN)}
      />

      <div className="mt-w5 grid gap-w5 lg:grid-cols-[19rem_minmax(0,1fr)] lg:items-start">
        <aside className="cetak-mengalir rounded-kartu permukaan px-w4 py-w4 shadow-bal lg:sticky lg:top-w4 lg:max-h-[calc(100dvh-2rem)] lg:overflow-y-auto">
          <h2 className="judul-kecil mb-w3 text-sm text-tinta">Asumsi</h2>
          <PanelAsumsi
            masukan={masukan}
            ubah={(parsial) => setMasukan((lama) => ({ ...lama, ...parsial }))}
          />
        </aside>

        <div className="min-w-0 space-y-w5">
          <section aria-label="Indikator kelayakan">
            <div className="grid gap-w3 sm:grid-cols-2 xl:grid-cols-4">
              <KartuMetrik
                sorot
                label="ROI kumulatif 3 tahun"
                nilai={tampil(kelayakan.roi, (v) => formatPersenPresisi(v, 2))}
                badge={<BadgeDeviasi nilai={kelayakan.roi} dasar={dasar.kelayakan.roi} />}
              />
              <KartuMetrik
                sorot
                label="IRR"
                nilai={tampil(kelayakan.irr, (v) => formatPersenPresisi(v, 2))}
                badge={<BadgeDeviasi nilai={kelayakan.irr} dasar={dasar.kelayakan.irr} />}
              />
              <KartuMetrik
                sorot
                label="Payback period"
                nilai={tampil(
                  kelayakan.paybackBulan,
                  (v) => `bulan ke-${v.toLocaleString("id-ID")}`,
                  "Tidak tercapai dalam 36 bulan",
                )}
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
                label={`NPV @ ${Math.round(masukan.diskonto * 100)}%`}
                nilai={tampil(kelayakan.npv, (v) => formatJuta(v))}
                badge={<BadgeDeviasi nilai={kelayakan.npv} dasar={dasar.kelayakan.npv} />}
              />
            </div>

            <div className="mt-w3 grid gap-w3 sm:grid-cols-3">
              <KartuMetrik label="Investasi awal" nilai={formatRupiah(kelayakan.modalAwal)} />
              <KartuMetrik
                label="Gross profit margin Tahun 1"
                nilai={formatPersenPresisi(y1.marginKotor, 2)}
                badge={
                  <BadgeDeviasi
                    nilai={y1.marginKotor}
                    dasar={dasar.proyeksi.tahun[0].marginKotor}
                  />
                }
              />
              <KartuMetrik
                label="BEP pendapatan Tahun 1"
                nilai={tampil(kelayakan.bepPendapatan[0], (v) => formatRupiah(Math.round(v)))}
                catatan={tampil(
                  kelayakan.bepVolumeTon,
                  (v) => `Setara ±${formatTon(v, 0)} material`,
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

          <section aria-label="Tabel proyeksi" className="space-y-w3">
            <h2 className="judul-kecil text-sm text-tinta">Proyeksi laba rugi 3 tahun</h2>
            <TabelProyeksi proyeksi={proyeksi} />
          </section>

          <AcuanProposal />

          <p className="rounded-kartu border border-garis bg-kain px-w4 py-w3 text-xs text-tinta-pudar">
            <span className="font-medium text-tinta">Catatan metodologi.</span> Biaya
            logistik dan handling dianggap tetap per kg, sedangkan biaya payment gateway
            dan insentif pengepul proporsional terhadap GMV. Volume impas dihitung dengan
            pendapatan layanan grading premium bertambah proporsional terhadap volume,
            seperti BEP pada Tabel 4.5. Seluruh angka adalah asumsi/data contoh dan
            skenario Tinggi bukan angka tabel proposal.
          </p>
        </div>
      </div>
    </Halaman>
  );
}
