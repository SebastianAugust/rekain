/**
 * Gerbang passphrase untuk `/simulasi`.
 *
 * Sengaja ringan: halaman ini hanya berisi proyeksi yang sudah ada di proposal,
 * jadi yang dibutuhkan cuma penghalang terhadap akses iseng — bukan sistem
 * autentikasi. Yang tetap dijaga: sandinya tidak pernah masuk bundle klien dan
 * tidak pernah tersimpan mentah di cookie.
 *
 * Hanya boleh diimpor dari kode server (`page.tsx` dan Server Action-nya).
 */

import { createHash, timingSafeEqual } from "node:crypto";

export const NAMA_COOKIE = "rekain_simulasi";
export const UMUR_SESI_DETIK = 8 * 60 * 60;

const GARAM = "rekain-simulasi-v1";

export function tokenDari(sandi: string): string {
  return createHash("sha256").update(`${GARAM}:${sandi}`).digest("hex");
}

/**
 * Token yang sah saat ini, atau `null` kalau `SIMULASI_SANDI` belum diset.
 *
 * Dibaca saat request, bukan saat modul dimuat — kalau dibaca di module scope,
 * `next build` akan ikut mengevaluasinya dan halamannya gagal dibangun di mesin
 * yang belum punya `.env.local`.
 */
export function tokenSah(): string | null {
  const sandi = process.env.SIMULASI_SANDI;
  return sandi ? tokenDari(sandi) : null;
}

/** Gagal tertutup: tanpa sandi terpasang, tidak ada token yang bisa lolos. */
export function tokenCocok(diberikan: string | undefined, sah: string | null): boolean {
  if (!sah || !diberikan) return false;

  const a = Buffer.from(diberikan);
  const b = Buffer.from(sah);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
