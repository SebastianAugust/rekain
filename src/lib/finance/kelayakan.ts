/**
 * Indikator kelayakan usaha — Tabel 5.5.
 *
 * Semua fungsi mengembalikan `null` alih-alih `NaN`/`Infinity` ketika hasilnya
 * tidak terdefinisi, supaya UI bisa menampilkan "tidak terdefinisi" dengan jujur
 * daripada memamerkan angka sampah.
 */

import type { AsumsiSimulasi, PerTahun } from "@/lib/finance/asumsi";
import type { Proyeksi } from "@/lib/finance/hitung";

/** Arus kas proyeksi: modal keluar di t=0, laba bersih masuk di t=1..3. */
function arusKas(labaBersih: readonly number[], modalAwal: number): number[] {
  return [-modalAwal, ...labaBersih];
}

export function roiKumulatif(totalLabaBersih: number, modalAwal: number): number | null {
  if (modalAwal <= 0) return null;
  return totalLabaBersih / modalAwal;
}

export function npv(
  labaBersih: readonly number[],
  modalAwal: number,
  rate: number,
): number | null {
  if (rate <= -1) return null;
  return arusKas(labaBersih, modalAwal).reduce(
    (sum, kas, t) => sum + kas / (1 + rate) ** t,
    0,
  );
}

const IRR_BATAS_BAWAH = -0.9999;
const IRR_BATAS_ATAS = 100;

/**
 * IRR lewat bisection, bukan Newton — Newton bisa lari ke luar domain pada arus
 * kas yang ekstrem, sedangkan bisection selalu konvergen begitu ada pergantian
 * tanda di rentang pencarian.
 *
 * `null` berarti tidak ada akar di rentang tersebut: arus kas yang seluruhnya
 * negatif atau seluruhnya positif tidak punya IRR.
 */
export function irr(labaBersih: readonly number[], modalAwal: number): number | null {
  const kas = arusKas(labaBersih, modalAwal);
  const f = (r: number) => kas.reduce((sum, k, t) => sum + k / (1 + r) ** t, 0);

  let bawah = IRR_BATAS_BAWAH;
  let atas = IRR_BATAS_ATAS;
  const fBawah = f(bawah);
  const fAtas = f(atas);

  if (!Number.isFinite(fBawah) || !Number.isFinite(fAtas)) return null;
  if (fBawah === 0) return bawah;
  if (fAtas === 0) return atas;
  if (fBawah > 0 === fAtas > 0) return null;

  for (let i = 0; i < 200; i++) {
    const tengah = (bawah + atas) / 2;
    if (f(tengah) > 0 === fBawah > 0) bawah = tengah;
    else atas = tengah;
  }
  return (bawah + atas) / 2;
}

const BULAN_PROYEKSI = 36;

/**
 * Bulan pertama saat akumulasi laba bersih menutup modal awal, dengan laba tiap
 * tahun dibagi rata ke 12 bulan — persis cara proposal sampai di "bulan ke-22".
 */
export function paybackBulan(
  labaBersih: readonly number[],
  modalAwal: number,
): number | null {
  if (modalAwal <= 0) return 0;

  let kumulatif = 0;
  for (let bulan = 1; bulan <= BULAN_PROYEKSI; bulan++) {
    const tahunKe = Math.floor((bulan - 1) / 12);
    kumulatif += (labaBersih[tahunKe] ?? 0) / 12;
    if (kumulatif >= modalAwal) return bulan;
  }
  return null;
}

/**
 * BEP dalam rupiah pendapatan, memakai rumus proposal: biaya tetap dibagi rasio
 * margin kotor.
 *
 * Rumus ini mengasumsikan seluruh pendapatan punya rasio kontribusi yang sama.
 * Itu tidak sepenuhnya benar di sini — grading premium dan SaaS bernominal tetap
 * dan tidak menanggung biaya variabel — tapi rumus inilah yang dipakai Tabel 5.5,
 * jadi rumus ini yang dipertahankan agar angkanya bisa direproduksi. Ukuran yang
 * lebih presisi ada di `bepVolumeTon`.
 */
export function bepPendapatan(
  totalBiayaTetap: number,
  marginKotor: number,
): number | null {
  if (marginKotor <= 0) return null;
  return totalBiayaTetap / marginKotor;
}

/**
 * BEP dalam ton material — turunan, tidak tercantum di proposal.
 *
 * Di sini aliran pendapatan bernominal tetap diperlakukan sebagaimana adanya:
 * berapa ton yang harus diperantarai supaya kontribusi dari GMV menutup sisa
 * biaya tetap setelah grading & SaaS.
 */
export function bepVolumeTon(
  asumsi: AsumsiSimulasi,
  proyeksi: Proyeksi,
  indeks: number,
): number | null {
  const baris = proyeksi.tahun[indeks];
  const kontribusi = proyeksi.marginKontribusiGmv;
  if (kontribusi <= 0 || asumsi.hargaPerKg <= 0) return null;

  const sisaBiayaTetap = baris.totalBiayaTetap - baris.gradingPremium - baris.saas;
  if (sisaBiayaTetap <= 0) return 0;

  return sisaBiayaTetap / kontribusi / asumsi.hargaPerKg / 1_000;
}

export type Kelayakan = {
  modalAwal: number;
  totalLabaBersih: number;
  /** Rasio, bukan persen: 3,7899 = 378,99%. */
  roi: number | null;
  npv: number | null;
  irr: number | null;
  paybackBulan: number | null;
  bepPendapatan: PerTahun<number | null>;
  bepVolumeTon: PerTahun<number | null>;
};

export function hitungKelayakan(
  asumsi: AsumsiSimulasi,
  proyeksi: Proyeksi,
): Kelayakan {
  const { labaBersih, modalAwal, totalLabaBersih, tahun } = proyeksi;

  return {
    modalAwal,
    totalLabaBersih,
    roi: roiKumulatif(totalLabaBersih, modalAwal),
    npv: npv(labaBersih, modalAwal, asumsi.wacc),
    irr: irr(labaBersih, modalAwal),
    paybackBulan: paybackBulan(labaBersih, modalAwal),
    bepPendapatan: [
      bepPendapatan(tahun[0].totalBiayaTetap, tahun[0].marginKotor),
      bepPendapatan(tahun[1].totalBiayaTetap, tahun[1].marginKotor),
      bepPendapatan(tahun[2].totalBiayaTetap, tahun[2].marginKotor),
    ],
    bepVolumeTon: [
      bepVolumeTon(asumsi, proyeksi, 0),
      bepVolumeTon(asumsi, proyeksi, 1),
      bepVolumeTon(asumsi, proyeksi, 2),
    ],
  };
}
