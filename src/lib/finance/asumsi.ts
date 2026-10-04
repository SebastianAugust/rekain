/**
 * Asumsi keuangan ReKain, ditranskrip dari Tabel 4.1–4.5 proposal v3.
 *
 * Setiap angka di `BASELINE` berasal dari tabel proposal, bukan dari perkiraan.
 * Sumbernya dicatat per blok. Kalau baseline diubah, `hitung.test.ts` akan gagal —
 * itu memang gunanya: tabel proposal adalah kontrak yang dijaga oleh test.
 * Angka Tabel 4.3 mereproduksi ROI 378,99%, IRR 71,32%, payback bulan ke-22,
 * BEP Rp96.867.470, dan NPV Rp166.785.081 (Tabel 4.5).
 */

/** Proyeksi proposal berjalan tiga tahun; indeks 0 = Tahun 1. */
export type PerTahun<T> = [T, T, T];

export type KomponenModal =
  | "platform"
  | "infrastruktur"
  | "legalitas"
  | "akuisisiLapangan"
  | "modalKerja"
  | "pemasaran"
  | "administrasi";

export type KomponenTetap =
  | "timInti"
  | "operasionalLapangan"
  | "teknologi"
  | "infrastruktur"
  | "pemasaran"
  | "administrasi";

export type AsumsiSimulasi = {
  /** Harga rata-rata tertimbang material, rupiah per kg. */
  hargaPerKg: number;
  volumeTon: PerTahun<number>;

  /* Aliran pendapatan yang proporsional terhadap GMV, sebagai rasio (0,08 = 8%). */
  komisi: number;
  marginLogistik: number;

  /* Aliran pendapatan bernominal tetap — tidak ikut naik saat GMV naik. */
  gradingPremium: PerTahun<number>;
  saas: PerTahun<number>;

  /* Biaya variabel, rasio terhadap GMV. */
  biayaLogistik: number;
  biayaPayment: number;
  insentifPengepul: number;

  biayaTetap: Record<KomponenTetap, PerTahun<number>>;
  modalAwal: Record<KomponenModal, number>;

  tarifPajak: number;
  /** Discount rate untuk NPV. */
  wacc: number;
};

export const BASELINE: AsumsiSimulasi = {
  // Tabel 4.3 — harga tertimbang Rp6.000/kg, volume per tahun.
  hargaPerKg: 6_000,
  volumeTon: [200, 300, 920],

  // Tabel 4.3 — komisi 8% GMV, margin layanan logistik 3% GMV.
  komisi: 0.08,
  marginLogistik: 0.03,

  // Tabel 4.3 — SaaS traceability baru mulai Tahun 2, sesuai Bab 3.3.2.
  gradingPremium: [12_000_000, 30_000_000, 60_000_000],
  saas: [0, 80_000_000, 275_000_000],

  // Tabel 4.2 bagian A — total 3,70% GMV.
  biayaLogistik: 0.022,
  biayaPayment: 0.005,
  insentifPengepul: 0.01,

  // Tabel 4.2 bagian B — total 67 / 164 / 486 juta.
  biayaTetap: {
    timInti: [15_000_000, 30_000_000, 60_000_000],
    operasionalLapangan: [16_000_000, 36_000_000, 180_000_000],
    teknologi: [0, 30_000_000, 90_000_000],
    infrastruktur: [6_000_000, 18_000_000, 36_000_000],
    pemasaran: [18_000_000, 30_000_000, 70_000_000],
    administrasi: [12_000_000, 20_000_000, 50_000_000],
  },

  // Tabel 4.1 — total Rp85.000.000.
  modalAwal: {
    platform: 25_000_000,
    infrastruktur: 6_000_000,
    legalitas: 12_000_000,
    akuisisiLapangan: 15_000_000,
    modalKerja: 15_000_000,
    pemasaran: 8_000_000,
    administrasi: 4_000_000,
  },

  // Tabel 4.4 — PPh Badan tarif efektif Pasal 31E. Tabel 4.5 — WACC 10%.
  tarifPajak: 0.11,
  wacc: 0.1,
};

export const LABEL_MODAL: Record<KomponenModal, string> = {
  platform: "Pengembangan aplikasi MVP (tim teknologi freelance)",
  infrastruktur: "Setup awal infrastruktur cloud, domain & tools",
  legalitas: "Legalitas usaha & HKI",
  akuisisiLapangan: "Operasional akuisisi lapangan",
  modalKerja: "Modal kerja talangan escrow",
  pemasaran: "Pemasaran & materi promosi",
  administrasi: "Administrasi & ATK",
};

export const LABEL_TETAP: Record<KomponenTetap, string> = {
  timInti: "Honor tim inti (freelance)",
  operasionalLapangan: "Insentif mitra validator & operasional lapangan",
  teknologi: "Honor tim teknologi (freelance)",
  infrastruktur: "Infrastruktur cloud operasional, tools & lisensi",
  pemasaran: "Pemasaran & kemitraan",
  administrasi: "Administrasi, legal rutin, dan sewa",
};

export const KOMPONEN_MODAL = Object.keys(LABEL_MODAL) as KomponenModal[];
export const KOMPONEN_TETAP = Object.keys(LABEL_TETAP) as KomponenTetap[];

export function totalModalAwal(asumsi: AsumsiSimulasi): number {
  return KOMPONEN_MODAL.reduce((sum, k) => sum + asumsi.modalAwal[k], 0);
}

/**
 * Deep clone — setiap pengubahan asumsi menghasilkan objek baru supaya React
 * melihat perubahan referensi, dan supaya `BASELINE` tidak pernah termutasi.
 */
export function salinAsumsi(asumsi: AsumsiSimulasi): AsumsiSimulasi {
  return {
    ...asumsi,
    volumeTon: [...asumsi.volumeTon],
    gradingPremium: [...asumsi.gradingPremium],
    saas: [...asumsi.saas],
    biayaTetap: Object.fromEntries(
      KOMPONEN_TETAP.map((k) => [k, [...asumsi.biayaTetap[k]]]),
    ) as Record<KomponenTetap, PerTahun<number>>,
    modalAwal: { ...asumsi.modalAwal },
  };
}
