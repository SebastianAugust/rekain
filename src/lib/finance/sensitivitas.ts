/**
 * Analisis sensitivitas one-at-a-time.
 *
 * Tiap penggerak digeser ±deviasi dari nilai saat ini sementara yang lain ditahan,
 * lalu metrik targetnya dihitung ulang. Lebar rentangnya yang jadi panjang batang
 * tornado — makin lebar, makin menentukan variabel itu.
 */

import {
  type AsumsiSimulasi,
  KOMPONEN_TETAP,
  salinAsumsi,
  setTotalModalAwal,
  totalModalAwal,
} from "@/lib/finance/asumsi";
import { hitungProyeksi } from "@/lib/finance/hitung";
import { hitungKelayakan } from "@/lib/finance/kelayakan";

export type Penggerak =
  | "hargaPerKg"
  | "volume"
  | "komisi"
  | "marginLogistik"
  | "biayaLogistik"
  | "biayaPayment"
  | "insentifPengepul"
  | "gradingPremium"
  | "saas"
  | "biayaTetap"
  | "modalAwal"
  | "wacc"
  | "tarifPajak";

export type MetrikTarget = "npv" | "roi" | "labaBersih";

export const LABEL_PENGGERAK: Record<Penggerak, string> = {
  hargaPerKg: "Harga rata-rata material",
  volume: "Volume material",
  komisi: "Take rate komisi",
  marginLogistik: "Margin layanan logistik",
  biayaLogistik: "Biaya logistik aktual",
  biayaPayment: "Biaya payment gateway & escrow",
  insentifPengepul: "Insentif mitra pengepul",
  gradingPremium: "Pendapatan grading premium",
  saas: "Pendapatan SaaS traceability",
  biayaTetap: "Biaya tetap operasional",
  modalAwal: "Modal awal",
  wacc: "WACC (discount rate)",
  tarifPajak: "Tarif PPh Badan",
};

export const LABEL_METRIK: Record<MetrikTarget, string> = {
  npv: "NPV",
  roi: "ROI kumulatif",
  labaBersih: "Laba bersih 3 tahun",
};

export const PENGGERAK: Penggerak[] = Object.keys(LABEL_PENGGERAK) as Penggerak[];

/** Mengembalikan salinan asumsi dengan satu penggerak dikalikan `faktor`. */
export function geser(
  asumsi: AsumsiSimulasi,
  penggerak: Penggerak,
  faktor: number,
): AsumsiSimulasi {
  const a = salinAsumsi(asumsi);

  switch (penggerak) {
    case "hargaPerKg":
      a.hargaPerKg *= faktor;
      break;
    case "volume":
      a.volumeTon = [
        a.volumeTon[0] * faktor,
        a.volumeTon[1] * faktor,
        a.volumeTon[2] * faktor,
      ];
      break;
    case "gradingPremium":
      a.gradingPremium = [
        a.gradingPremium[0] * faktor,
        a.gradingPremium[1] * faktor,
        a.gradingPremium[2] * faktor,
      ];
      break;
    case "saas":
      a.saas = [a.saas[0] * faktor, a.saas[1] * faktor, a.saas[2] * faktor];
      break;
    case "biayaTetap":
      for (const k of KOMPONEN_TETAP) {
        a.biayaTetap[k] = [
          a.biayaTetap[k][0] * faktor,
          a.biayaTetap[k][1] * faktor,
          a.biayaTetap[k][2] * faktor,
        ];
      }
      break;
    case "modalAwal":
      return setTotalModalAwal(a, totalModalAwal(a) * faktor);
    default:
      a[penggerak] *= faktor;
  }
  return a;
}

export function ukurMetrik(
  asumsi: AsumsiSimulasi,
  metrik: MetrikTarget,
): number | null {
  const proyeksi = hitungProyeksi(asumsi);
  if (metrik === "labaBersih") return proyeksi.totalLabaBersih;

  const kelayakan = hitungKelayakan(asumsi, proyeksi);
  return metrik === "npv" ? kelayakan.npv : kelayakan.roi;
}

export type BarisSensitivitas = {
  penggerak: Penggerak;
  label: string;
  dasar: number | null;
  turun: number | null;
  naik: number | null;
  /** Lebar batang tornado. 0 kalau salah satu ujungnya tidak terdefinisi. */
  rentang: number;
};

export const DEVIASI_BAWAAN = 0.2;

export function analisisSensitivitas(
  asumsi: AsumsiSimulasi,
  { deviasi = DEVIASI_BAWAAN, metrik = "npv" as MetrikTarget } = {},
): BarisSensitivitas[] {
  const dasar = ukurMetrik(asumsi, metrik);

  return PENGGERAK.map((penggerak) => {
    const turun = ukurMetrik(geser(asumsi, penggerak, 1 - deviasi), metrik);
    const naik = ukurMetrik(geser(asumsi, penggerak, 1 + deviasi), metrik);
    const rentang = turun === null || naik === null ? 0 : Math.abs(naik - turun);

    return { penggerak, label: LABEL_PENGGERAK[penggerak], dasar, turun, naik, rentang };
  }).sort((a, b) => b.rentang - a.rentang);
}
