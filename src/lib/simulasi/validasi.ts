/**
 * Validasi di batas sistem.
 *
 * Mesin perhitungan di `lib/finance` sengaja tidak menjaga dirinya dari masukan
 * ngawur — ia bertugas menghitung, bukan menebak maksud user. Penjagaannya di
 * sini, tepat di titik angka masuk dari kolom isian.
 */

import { z } from "zod";

export type Batas = { min: number; max: number; step: number };

const skemaAngka = z.number().finite();

/**
 * `null` berarti masukannya belum berupa angka — kolom kosong, tanda minus yang
 * baru diketik, atau teks. Pemanggilnya menahan nilai lama alih-alih menulis NaN
 * ke asumsi.
 */
export function bersihkanAngka(mentah: string, batas: Batas): number | null {
  const teks = mentah.trim().replace(",", ".");
  if (teks === "" || teks === "-") return null;

  const hasil = skemaAngka.safeParse(Number(teks));
  if (!hasil.success) return null;

  return jepit(hasil.data, batas);
}

export function jepit(nilai: number, { min, max }: Batas): number {
  return Math.min(max, Math.max(min, nilai));
}

/*
  Batas atas dipilih supaya slider tetap berguna, bukan supaya model terkurung:
  ujung-ujungnya sengaja jauh di luar rentang yang masuk akal secara bisnis agar
  skenario ekstrem tetap bisa diuji.
*/
export const BATAS = {
  hargaPerKg: { min: 0, max: 15_000, step: 100 },
  volumeTon: { min: 0, max: 3_000, step: 10 },
  komisi: { min: 0, max: 0.3, step: 0.0025 },
  marginLogistik: { min: 0, max: 0.2, step: 0.0025 },
  biayaLogistik: { min: 0, max: 0.15, step: 0.001 },
  biayaPayment: { min: 0, max: 0.05, step: 0.0005 },
  insentifPengepul: { min: 0, max: 0.1, step: 0.0005 },
  tarifPajak: { min: 0, max: 0.5, step: 0.005 },
  wacc: { min: 0, max: 0.6, step: 0.005 },
  modalAwal: { min: 0, max: 1_000_000_000, step: 1_000_000 },
  /** Untuk kolom bernominal rupiah yang diisi dalam satuan juta. */
  rupiahJuta: { min: 0, max: 5_000, step: 1 },
} satisfies Record<string, Batas>;
