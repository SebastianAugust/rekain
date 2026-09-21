/** Indonesian number formatting, matched to the mockup's `toLocaleString("id-ID")` output. */

export function formatRupiah(value: number): string {
  return `Rp${value.toLocaleString("id-ID")}`;
}

/** Compact rupiah for stat tiles: 3312000 -> "Rp3,3 jt". */
export function formatRupiahRingkas(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp${(value / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} m`;
  }
  if (value >= 1_000_000) {
    return `Rp${(value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 1 })} jt`;
  }
  if (value >= 1_000) {
    return `Rp${(value / 1_000).toLocaleString("id-ID", { maximumFractionDigits: 0 })} rb`;
  }
  return formatRupiah(value);
}

export function formatBerat(kg: number): string {
  return `${kg.toLocaleString("id-ID")} kg`;
}

/** Distances are planning estimates, so one decimal is the honest precision. */
export function formatKm(km: number): string {
  return `${km.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} km`;
}

/** 135 -> "2j 15m". Minutes alone below an hour. */
export function formatDurasi(menit: number): string {
  const jam = Math.floor(menit / 60);
  const sisa = menit % 60;
  if (jam === 0) return `${sisa}m`;
  return sisa === 0 ? `${jam}j` : `${jam}j ${sisa}m`;
}

/** Ledger date, matching the seed records: "24 Agu 2026". */
export function formatTanggal(tanggal: Date): string {
  return tanggal.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function formatPersen(rasio: number): string {
  return `${Math.round(rasio * 100)}%`;
}

/**
 * Persen dengan desimal — indikator kelayakan disebut proposal sampai dua angka
 * di belakang koma (378,99%, 71,32%), dan membulatkannya jadi 379% menghapus
 * justru presisi yang sedang diverifikasi.
 */
export function formatPersenPresisi(rasio: number, desimal = 2): string {
  return `${(rasio * 100).toLocaleString("id-ID", {
    minimumFractionDigits: desimal,
    maximumFractionDigits: desimal,
  })}%`;
}

/**
 * Selalu dalam juta, tidak pernah berpindah satuan.
 *
 * `formatRupiahRingkas` berpindah ke "m" di atas satu miliar — bagus untuk satu
 * kartu berdiri sendiri, tapi merusak kolom tabel dan sumbu grafik, karena mata
 * jadi membandingkan "1,2 m" dengan "942,2 jt" alih-alih dua angka sekaligus.
 */
export function formatJuta(value: number, desimal = 1): string {
  return `${(value / 1_000_000).toLocaleString("id-ID", {
    minimumFractionDigits: desimal,
    maximumFractionDigits: desimal,
  })} jt`;
}

/** Ton dengan satu desimal: 125,57 -> "125,6 ton". */
export function formatTon(ton: number, desimal = 1): string {
  return `${ton.toLocaleString("id-ID", {
    minimumFractionDigits: desimal,
    maximumFractionDigits: desimal,
  })} ton`;
}
