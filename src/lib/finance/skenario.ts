/**
 * Preset skenario.
 *
 * Hanya `moderat` dan `pesimis` yang sepenuhnya berasal dari proposal. Dua sisanya
 * ditandai `turunan: true` dan WAJIB ditampilkan dengan catatan asalnya di UI —
 * jangan pernah disajikan seolah-olah angka proposal.
 */

import {
  type AsumsiSimulasi,
  BASELINE,
  type PerTahun,
  salinAsumsi,
} from "@/lib/finance/asumsi";

export type NamaSkenario = "pesimis" | "moderat" | "optimis" | "slide";

export type Skenario = {
  nama: NamaSkenario;
  label: string;
  ringkas: string;
  /** Dari mana angkanya berasal — ditampilkan apa adanya ke user. */
  sumber: string;
  /** true = bukan angka proposal; UI harus memberi penanda. */
  turunan: boolean;
  asumsi: AsumsiSimulasi;
};

function pesimis(): AsumsiSimulasi {
  const a = salinAsumsi(BASELINE);
  a.hargaPerKg = 4_500;
  a.biayaLogistik = 0.03;
  return a;
}

function optimis(): AsumsiSimulasi {
  const a = salinAsumsi(BASELINE);
  // Cerminan simetris dari pesimis: harga +25%, porsi logistik −0,8 poin persen.
  a.hargaPerKg = 7_500;
  a.biayaLogistik = 0.014;
  return a;
}

/* Angka yang tertulis di slide Executive Summary — bukan di Tabel 5.3. */
const SLIDE_GMV: PerTahun<number> = [1_200_000_000, 2_880_000_000, 5_520_000_000];
const SLIDE_PENDAPATAN: PerTahun<number> = [204_000_000, 490_000_000, 942_200_000];

/**
 * Rekonstruksi angka slide Executive Summary.
 *
 * Slide hanya menyebut GMV dan total pendapatan, tanpa rincian per aliran. Volume
 * diturunkan dari GMV ÷ harga; selisih pendapatan yang tidak tertutup komisi dan
 * margin logistik dibebankan ke grading premium + SaaS dengan menskalakannya
 * proporsional. Faktor skala yang keluar — 6,0× di Tahun 1 melawan 1,0× di Tahun 3 —
 * justru memperlihatkan bahwa angka slide tidak berasal dari model yang sama.
 */
function slide(): AsumsiSimulasi {
  const a = salinAsumsi(BASELINE);
  const takeRateGmv = BASELINE.komisi + BASELINE.marginLogistik;

  for (let i = 0; i < 3; i++) {
    a.volumeTon[i] = SLIDE_GMV[i] / BASELINE.hargaPerKg / 1_000;

    const dariGmv = SLIDE_GMV[i] * takeRateGmv;
    const perluTetap = SLIDE_PENDAPATAN[i] - dariGmv;
    const tetapBaseline = BASELINE.gradingPremium[i] + BASELINE.saas[i];
    const faktor = tetapBaseline > 0 ? perluTetap / tetapBaseline : 0;

    a.gradingPremium[i] = BASELINE.gradingPremium[i] * faktor;
    a.saas[i] = BASELINE.saas[i] * faktor;
  }
  return a;
}

export const SKENARIO: Record<NamaSkenario, Skenario> = {
  pesimis: {
    nama: "pesimis",
    label: "Pesimis",
    ringkas: "Harga Rp4.500/kg, biaya logistik 3,0% GMV",
    sumber: "Bab 5.4 proposal — dua angka stres yang disebut eksplisit di sana.",
    turunan: false,
    asumsi: pesimis(),
  },
  moderat: {
    nama: "moderat",
    label: "Moderat",
    ringkas: "Asumsi baseline proposal",
    sumber: "Tabel 5.1–5.4 proposal, apa adanya.",
    turunan: false,
    asumsi: salinAsumsi(BASELINE),
  },
  optimis: {
    nama: "optimis",
    label: "Optimis",
    ringkas: "Harga Rp7.500/kg, biaya logistik 1,4% GMV",
    sumber:
      "Tidak didefinisikan di proposal. Dibuat sebagai cerminan simetris skenario pesimis Bab 5.4: harga +25%, porsi logistik −0,8 poin persen.",
    turunan: true,
    asumsi: optimis(),
  },
  slide: {
    nama: "slide",
    label: "Slide Exec Summary",
    ringkas: "GMV 1.200 / 2.880 / 5.520 jt, pendapatan 204 / 490 / 942,2 jt",
    sumber:
      "Rekonstruksi dari angka slide Executive Summary, bukan data Tabel 5.3. Slide hanya menyebut GMV dan total pendapatan; komposisi per aliran di sini diturunkan agar totalnya pas. Pembanding untuk melihat dampak angka slide, bukan basis perhitungan.",
    turunan: true,
    asumsi: slide(),
  },
};

export const URUTAN_SKENARIO: NamaSkenario[] = ["pesimis", "moderat", "optimis", "slide"];

/**
 * Dua titik stres yang disebut proposal sebagai variabel paling menentukan
 * (Bab 5.4) — ditandai khusus di grafik sensitivitas.
 */
export const STRES_PROPOSAL = [
  {
    penggerak: "hargaPerKg" as const,
    nilai: 4_500,
    catatan: "Bab 5.4: harga tertimbang turun ke Rp4.500/kg",
  },
  {
    penggerak: "biayaLogistik" as const,
    nilai: 0.03,
    catatan: "Bab 5.4: porsi biaya logistik naik ke 3,0% GMV",
  },
];
