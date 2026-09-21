/**
 * Menyandikan skenario ke query param supaya satu tautan bisa di-bookmark dan
 * dibagikan.
 *
 * Yang disimpan hanya selisih terhadap baseline, bukan seluruh ±40 angka: URL-nya
 * jadi pendek untuk perubahan kecil, dan skenario lama tetap terbaca kalau suatu
 * saat ada field asumsi baru yang ditambahkan.
 */

import {
  type AsumsiSimulasi,
  BASELINE,
  KOMPONEN_TETAP,
  type PerTahun,
  salinAsumsi,
} from "@/lib/finance/asumsi";

export const PARAM_SKENARIO = "s";

type Selisih = Partial<Record<string, number | number[] | Record<string, unknown>>>;

const SKALAR = [
  "hargaPerKg",
  "komisi",
  "marginLogistik",
  "biayaLogistik",
  "biayaPayment",
  "insentifPengepul",
  "tarifPajak",
  "wacc",
] as const;

const DERET = ["volumeTon", "gradingPremium", "saas"] as const;

const samaDeret = (a: PerTahun<number>, b: PerTahun<number>) =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

function sandikan(teks: string): string {
  return btoa(teks).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function baca(sandi: string): string {
  const pad = sandi.replace(/-/g, "+").replace(/_/g, "/");
  return atob(pad + "=".repeat((4 - (pad.length % 4)) % 4));
}

/** `null` berarti asumsinya persis baseline — tidak perlu param sama sekali. */
export function keParam(asumsi: AsumsiSimulasi): string | null {
  const selisih: Selisih = {};

  for (const k of SKALAR) {
    if (asumsi[k] !== BASELINE[k]) selisih[k] = asumsi[k];
  }
  for (const k of DERET) {
    if (!samaDeret(asumsi[k], BASELINE[k])) selisih[k] = [...asumsi[k]];
  }

  const tetap: Record<string, number[]> = {};
  for (const k of KOMPONEN_TETAP) {
    if (!samaDeret(asumsi.biayaTetap[k], BASELINE.biayaTetap[k])) {
      tetap[k] = [...asumsi.biayaTetap[k]];
    }
  }
  if (Object.keys(tetap).length > 0) selisih.biayaTetap = tetap;

  const modal: Record<string, number> = {};
  for (const [k, v] of Object.entries(asumsi.modalAwal)) {
    if (v !== BASELINE.modalAwal[k as keyof typeof BASELINE.modalAwal]) modal[k] = v;
  }
  if (Object.keys(modal).length > 0) selisih.modalAwal = modal;

  if (Object.keys(selisih).length === 0) return null;
  return sandikan(JSON.stringify(selisih));
}

const angka = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

const deret = (v: unknown): v is PerTahun<number> =>
  Array.isArray(v) && v.length === 3 && v.every(angka);

/**
 * Param yang rusak atau dikarang tidak boleh merobohkan halaman — apa pun yang
 * tidak terbaca diabaikan dan field itu kembali ke baseline.
 */
export function dariParam(param: string | null | undefined): AsumsiSimulasi {
  const asumsi = salinAsumsi(BASELINE);
  if (!param) return asumsi;

  let selisih: Selisih;
  try {
    const terurai: unknown = JSON.parse(baca(param));
    if (typeof terurai !== "object" || terurai === null) return asumsi;
    selisih = terurai as Selisih;
  } catch {
    return asumsi;
  }

  for (const k of SKALAR) {
    const v = selisih[k];
    if (angka(v)) asumsi[k] = v;
  }
  for (const k of DERET) {
    const v = selisih[k];
    if (deret(v)) asumsi[k] = [...v];
  }

  const tetap = selisih.biayaTetap;
  if (tetap && typeof tetap === "object") {
    for (const k of KOMPONEN_TETAP) {
      const v = (tetap as Record<string, unknown>)[k];
      if (deret(v)) asumsi.biayaTetap[k] = [...v];
    }
  }

  const modal = selisih.modalAwal;
  if (modal && typeof modal === "object") {
    for (const k of Object.keys(BASELINE.modalAwal) as (keyof typeof BASELINE.modalAwal)[]) {
      const v = (modal as Record<string, unknown>)[k];
      if (angka(v)) asumsi.modalAwal[k] = v;
    }
  }

  return asumsi;
}
