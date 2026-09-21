"use client";

import {
  type AsumsiSimulasi,
  KOMPONEN_MODAL,
  KOMPONEN_TETAP,
  LABEL_MODAL,
  LABEL_TETAP,
  totalModalAwal,
} from "@/lib/finance/asumsi";
import { BASELINE } from "@/lib/finance/asumsi";
import { formatJuta, formatPersenPresisi, formatRupiah, formatTon } from "@/lib/format";
import { BATAS } from "@/lib/simulasi/validasi";
import { KendaliAngka, KendaliSlider } from "@/components/simulasi/kendali";

const JUTA = 1_000_000;
const TAHUN = ["Tahun 1", "Tahun 2", "Tahun 3"] as const;

export type UbahAsumsi = (pembaru: (draf: AsumsiSimulasi) => void) => void;

function Seksi({
  judul,
  catatan,
  children,
}: {
  judul: string;
  catatan?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-garis pt-w3 first:border-t-0 first:pt-0">
      <h3 className="judul-kecil text-xs text-tinta uppercase">{judul}</h3>
      {catatan && <p className="mt-1 text-xs text-tinta-pudar">{catatan}</p>}
      <div className="mt-w3">{children}</div>
    </section>
  );
}

/** Baris tiga kolom untuk angka yang punya satu nilai per tahun proyeksi. */
function BarisTigaTahun({
  label,
  nilai,
  ubah,
  satuan,
}: {
  label: string;
  nilai: readonly number[];
  ubah: (indeks: number, nilai: number) => void;
  satuan: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-tinta-pudar">
        {label} <span className="text-tinta-pudar">({satuan})</span>
      </div>
      <div className="grid grid-cols-3 gap-w2">
        {nilai.map((v, i) => (
          <KendaliAngka
            key={i}
            ringkas
            label={`${label} ${TAHUN[i]}`}
            nilai={v}
            ubah={(baru) => ubah(i, baru)}
            batas={BATAS.rupiahJuta}
          />
        ))}
      </div>
    </div>
  );
}

export function PanelAsumsi({
  asumsi,
  ubah,
  lengkap,
}: {
  asumsi: AsumsiSimulasi;
  ubah: UbahAsumsi;
  /** Mode kerja membuka seluruh ekor asumsi; mode presentasi hanya penggeraknya. */
  lengkap: boolean;
}) {
  const persen = (v: number) => formatPersenPresisi(v, 2);

  return (
    <div className="space-y-w4">
      <Seksi judul="Penggerak utama">
        <div className="space-y-w3">
          <KendaliSlider
            label="Harga rata-rata material"
            nilai={asumsi.hargaPerKg}
            ubah={(v) => ubah((d) => void (d.hargaPerKg = v))}
            batas={BATAS.hargaPerKg}
            dasar={BASELINE.hargaPerKg}
            tampilkan={(v) => `${formatRupiah(v)}/kg`}
          />

          {asumsi.volumeTon.map((v, i) => (
            <KendaliSlider
              key={i}
              label={`Volume ${TAHUN[i]}`}
              nilai={v}
              ubah={(baru) => ubah((d) => void (d.volumeTon[i] = baru))}
              batas={BATAS.volumeTon}
              dasar={BASELINE.volumeTon[i]}
              tampilkan={(x) => formatTon(x, 0)}
            />
          ))}

          <KendaliSlider
            label="Take rate komisi"
            nilai={asumsi.komisi}
            ubah={(v) => ubah((d) => void (d.komisi = v))}
            batas={BATAS.komisi}
            dasar={BASELINE.komisi}
            tampilkan={persen}
          />

          <KendaliSlider
            label="Margin layanan logistik"
            nilai={asumsi.marginLogistik}
            ubah={(v) => ubah((d) => void (d.marginLogistik = v))}
            batas={BATAS.marginLogistik}
            dasar={BASELINE.marginLogistik}
            tampilkan={persen}
          />

          <KendaliSlider
            label="Biaya logistik aktual"
            nilai={asumsi.biayaLogistik}
            ubah={(v) => ubah((d) => void (d.biayaLogistik = v))}
            batas={BATAS.biayaLogistik}
            dasar={BASELINE.biayaLogistik}
            tampilkan={persen}
            catatan="Bab 5.4 menguji kenaikan dari 2,20% ke 3,00% GMV."
          />

          <KendaliSlider
            label="WACC (discount rate NPV)"
            nilai={asumsi.wacc}
            ubah={(v) => ubah((d) => void (d.wacc = v))}
            batas={BATAS.wacc}
            dasar={BASELINE.wacc}
            tampilkan={persen}
          />

          <KendaliSlider
            label="Modal awal"
            nilai={totalModalAwal(asumsi)}
            ubah={(v) =>
              ubah((d) => {
                const sekarang = totalModalAwal(d);
                // Skala proporsional supaya rincian Tabel 5.1 tetap bermakna.
                const faktor = sekarang > 0 ? v / sekarang : 0;
                for (const k of KOMPONEN_MODAL) {
                  d.modalAwal[k] = sekarang > 0 ? d.modalAwal[k] * faktor : v / KOMPONEN_MODAL.length;
                }
              })
            }
            batas={BATAS.modalAwal}
            dasar={totalModalAwal(BASELINE)}
            tampilkan={(v) => formatJuta(v, 0)}
          />
        </div>
      </Seksi>

      {lengkap && (
        <>
          <Seksi judul="Biaya variabel lain" catatan="Rasio terhadap GMV.">
            <div className="space-y-w3">
              <KendaliSlider
                label="Payment gateway & escrow"
                nilai={asumsi.biayaPayment}
                ubah={(v) => ubah((d) => void (d.biayaPayment = v))}
                batas={BATAS.biayaPayment}
                dasar={BASELINE.biayaPayment}
                tampilkan={persen}
              />
              <KendaliSlider
                label="Insentif mitra pengepul"
                nilai={asumsi.insentifPengepul}
                ubah={(v) => ubah((d) => void (d.insentifPengepul = v))}
                batas={BATAS.insentifPengepul}
                dasar={BASELINE.insentifPengepul}
                tampilkan={persen}
              />
              <KendaliSlider
                label="Tarif PPh Badan efektif"
                nilai={asumsi.tarifPajak}
                ubah={(v) => ubah((d) => void (d.tarifPajak = v))}
                batas={BATAS.tarifPajak}
                dasar={BASELINE.tarifPajak}
                tampilkan={persen}
              />
            </div>
          </Seksi>

          <Seksi
            judul="Pendapatan bernominal tetap"
            catatan="Tidak ikut naik saat GMV naik — diisi langsung per tahun."
          >
            <div className="space-y-w3">
              <BarisTigaTahun
                label="Grading & verifikasi premium"
                satuan="Rp juta"
                nilai={asumsi.gradingPremium.map((v) => v / JUTA)}
                ubah={(i, v) => ubah((d) => void (d.gradingPremium[i] = v * JUTA))}
              />
              <BarisTigaTahun
                label="Langganan SaaS traceability"
                satuan="Rp juta"
                nilai={asumsi.saas.map((v) => v / JUTA)}
                ubah={(i, v) => ubah((d) => void (d.saas[i] = v * JUTA))}
              />
            </div>
          </Seksi>

          <Seksi judul="Biaya tetap operasional" catatan="Tabel 5.2 bagian B, dalam Rp juta.">
            <div className="space-y-w3">
              {KOMPONEN_TETAP.map((k) => (
                <BarisTigaTahun
                  key={k}
                  label={LABEL_TETAP[k]}
                  satuan="Rp juta"
                  nilai={asumsi.biayaTetap[k].map((v) => v / JUTA)}
                  ubah={(i, v) => ubah((d) => void (d.biayaTetap[k][i] = v * JUTA))}
                />
              ))}
            </div>
          </Seksi>

          <Seksi judul="Rincian modal awal" catatan="Tabel 5.1, dalam Rp juta.">
            <div className="grid gap-w3 sm:grid-cols-2">
              {KOMPONEN_MODAL.map((k) => (
                <KendaliAngka
                  key={k}
                  label={LABEL_MODAL[k]}
                  nilai={asumsi.modalAwal[k] / JUTA}
                  ubah={(v) => ubah((d) => void (d.modalAwal[k] = v * JUTA))}
                  batas={BATAS.rupiahJuta}
                />
              ))}
            </div>
          </Seksi>
        </>
      )}
    </div>
  );
}
