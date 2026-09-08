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

export function formatPersen(rasio: number): string {
  return `${Math.round(rasio * 100)}%`;
}
