/**
 * Masukan kalkulator, jembatannya ke model dasar, dan tiga preset skenario.
 *
 * Lampiran 7 proposal menyebut tiga skenario: Pesimis, Moderat (sesuai proyeksi
 * proposal), dan Tinggi. Hanya Tinggi yang bukan angka proposal, dan UI wajib
 * menandainya sebagai asumsi tim.
 */

import { type AsumsiSimulasi, BASELINE, salinAsumsi } from "@/lib/finance/asumsi";

/** Lima kontrol di halaman. Semuanya angka mentah, tanpa satuan tersembunyi. */
export type Masukan = {
  /** Rupiah per kg. */
  harga: number;
  /** Biaya logistik dan handling, rupiah per kg. */
  logistikPerKg: number;
  /** Rasio terhadap GMV (0,08 = 8%). */
  komisi: number;
  /** Pengali volume proyeksi proposal (1 = 100%). */
  volumeFaktor: number;
  /** Discount rate NPV. */
  diskonto: number;
};

/** Logistik Rp132/kg = 2,2% GMV pada harga dasar Rp6.000/kg (Tabel 4.2). */
export const MASUKAN_BAWAAN: Masukan = {
  harga: BASELINE.hargaPerKg,
  logistikPerKg: BASELINE.biayaLogistik * BASELINE.hargaPerKg,
  komisi: BASELINE.komisi,
  volumeFaktor: 1,
  diskonto: BASELINE.wacc,
};

export const DISKONTO_PILIHAN = [0.1, 0.2, 0.25] as const;

export const BATAS_MASUKAN = {
  harga: { min: 2_000, max: 8_000, step: 100 },
  logistikPerKg: { min: 60, max: 300, step: 6 },
  komisi: { min: 0.04, max: 0.12, step: 0.005 },
  volumeFaktor: { min: 0.5, max: 1.5, step: 0.05 },
} as const;

/**
 * Menerjemahkan masukan ke asumsi model. Model dasarnya tidak disentuh:
 * - logistik dijaga tetap Rp/kg dengan menyimpannya sebagai rasio terhadap harga
 *   yang berlaku; payment gateway dan insentif pengepul tetap proporsional GMV;
 * - grading premium ikut proporsional terhadap volume, seperti BEP Tabel 4.5;
 * - SaaS dan komponen lain tetap sama dengan BASELINE.
 */
export function bangunAsumsi(m: Masukan): AsumsiSimulasi {
  const a = salinAsumsi(BASELINE);
  a.hargaPerKg = m.harga;
  a.biayaLogistik = m.logistikPerKg / m.harga;
  a.komisi = m.komisi;
  a.volumeTon = BASELINE.volumeTon.map((v) => v * m.volumeFaktor) as AsumsiSimulasi["volumeTon"];
  a.gradingPremium = BASELINE.gradingPremium.map(
    (v) => v * m.volumeFaktor,
  ) as AsumsiSimulasi["gradingPremium"];
  a.wacc = m.diskonto;
  return a;
}

export type NamaSkenario = "pesimis" | "moderat" | "tinggi";

export type Skenario = {
  nama: NamaSkenario;
  label: string;
  ringkas: string;
  /** Dari mana angkanya berasal, ditampilkan apa adanya ke user. */
  sumber: string;
  /** true = bukan angka proposal; UI harus memberi penanda "asumsi tim". */
  asumsiTim: boolean;
  masukan: Masukan;
};

export const SKENARIO: Record<NamaSkenario, Skenario> = {
  pesimis: {
    nama: "pesimis",
    label: "Pesimis",
    ringkas: "Harga Rp4.500/kg, biaya logistik Rp180/kg",
    sumber:
      "Bagian 4.1.4, dua titik stres yang disebut proposal (harga turun ke Rp4.500, biaya logistik naik ke 3,0% GMV atau Rp180/kg pada harga dasar) digabung.",
    asumsiTim: false,
    masukan: { ...MASUKAN_BAWAAN, harga: 4_500, logistikPerKg: 180 },
  },
  moderat: {
    nama: "moderat",
    label: "Moderat",
    ringkas: "Sesuai dengan Proyeksi Proposal",
    sumber: "Tabel 4.1–4.5 proposal, apa adanya.",
    asumsiTim: false,
    masukan: MASUKAN_BAWAAN,
  },
  tinggi: {
    nama: "tinggi",
    label: "Tinggi",
    ringkas: "Harga Rp7.500/kg, biaya logistik Rp84/kg",
    sumber:
      "Cermin simetris Pesimis (harga +25%, logistik -0,8 poin persen GMV pada harga dasar). BUKAN angka tabel proposal; asumsi tim.",
    asumsiTim: true,
    masukan: { ...MASUKAN_BAWAAN, harga: 7_500, logistikPerKg: 84 },
  },
};

export const URUTAN_SKENARIO: NamaSkenario[] = ["pesimis", "moderat", "tinggi"];

/**
 * Preset yang sedang aktif, atau `null` (kustom) kalau salah satu slider digeser.
 * Diskonto NPV tidak ikut dibandingkan: ia mengganti cara menilai, bukan skenarionya.
 */
export function cocokkanPreset(m: Masukan): NamaSkenario | null {
  const sama = (a: Masukan, b: Masukan) =>
    a.harga === b.harga &&
    a.logistikPerKg === b.logistikPerKg &&
    a.komisi === b.komisi &&
    a.volumeFaktor === b.volumeFaktor;
  return URUTAN_SKENARIO.find((n) => sama(SKENARIO[n].masukan, m)) ?? null;
}
