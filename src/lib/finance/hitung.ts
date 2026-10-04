/**
 * Mesin proyeksi laba rugi — murni, tanpa efek samping.
 *
 * Rantai perhitungannya mengikuti Tabel 4.2 → 4.3 → 4.4 persis:
 *   GMV → pendapatan per aliran → biaya variabel → laba kotor → biaya tetap →
 *   laba sebelum pajak → PPh → laba bersih.
 */

import {
  type AsumsiSimulasi,
  type KomponenTetap,
  KOMPONEN_TETAP,
  type PerTahun,
  totalModalAwal,
} from "@/lib/finance/asumsi";

export type BarisTahun = {
  /** 1, 2, atau 3 — bukan indeks, supaya aman dipakai langsung sebagai label. */
  tahun: number;
  volumeKg: number;
  gmv: number;

  komisi: number;
  marginLogistik: number;
  gradingPremium: number;
  saas: number;
  totalPendapatan: number;

  biayaLogistik: number;
  biayaPayment: number;
  insentifPengepul: number;
  totalBiayaVariabel: number;

  labaKotor: number;
  /** Rasio, bukan persen. 0 kalau tidak ada pendapatan. */
  marginKotor: number;

  biayaTetapRincian: Record<KomponenTetap, number>;
  totalBiayaTetap: number;

  labaSebelumPajak: number;
  pajak: number;
  labaBersih: number;
};

export type Proyeksi = {
  tahun: PerTahun<BarisTahun>;
  modalAwal: number;
  labaBersih: PerTahun<number>;
  totalLabaBersih: number;
  /**
   * Rupiah laba kotor yang dihasilkan tiap rupiah GMV, di luar aliran pendapatan
   * bernominal tetap. Dipakai BEP volume dan analisis sensitivitas.
   */
  marginKontribusiGmv: number;
};

export function marginKontribusiGmv(asumsi: AsumsiSimulasi): number {
  return (
    asumsi.komisi +
    asumsi.marginLogistik -
    asumsi.biayaLogistik -
    asumsi.biayaPayment -
    asumsi.insentifPengepul
  );
}

/**
 * Margin kontribusi per kg, dibulatkan ke rupiah terdekat (295,5 -> 296) seperti
 * Tabel 4.6. Biaya logistik dihitung dari rasio GMV, jadi nilainya sudah Rp/kg
 * pada harga yang berlaku.
 */
export function marginKontribusiPerKg(asumsi: AsumsiSimulasi): number {
  return Math.round(Number((marginKontribusiGmv(asumsi) * asumsi.hargaPerKg).toFixed(6)));
}

export function hitungTahun(asumsi: AsumsiSimulasi, indeks: number): BarisTahun {
  const volumeKg = asumsi.volumeTon[indeks] * 1_000;
  const gmv = volumeKg * asumsi.hargaPerKg;

  const komisi = gmv * asumsi.komisi;
  const marginLogistik = gmv * asumsi.marginLogistik;
  const gradingPremium = asumsi.gradingPremium[indeks];
  const saas = asumsi.saas[indeks];
  const totalPendapatan = komisi + marginLogistik + gradingPremium + saas;

  const biayaLogistik = gmv * asumsi.biayaLogistik;
  const biayaPayment = gmv * asumsi.biayaPayment;
  const insentifPengepul = gmv * asumsi.insentifPengepul;
  const totalBiayaVariabel = biayaLogistik + biayaPayment + insentifPengepul;

  const labaKotor = totalPendapatan - totalBiayaVariabel;
  const marginKotor = totalPendapatan === 0 ? 0 : labaKotor / totalPendapatan;

  const biayaTetapRincian = Object.fromEntries(
    KOMPONEN_TETAP.map((k) => [k, asumsi.biayaTetap[k][indeks]]),
  ) as Record<KomponenTetap, number>;
  const totalBiayaTetap = KOMPONEN_TETAP.reduce((sum, k) => sum + biayaTetapRincian[k], 0);

  const labaSebelumPajak = labaKotor - totalBiayaTetap;
  /*
    Rugi tidak menghasilkan pajak negatif. Proposal tidak pernah menyentuh kasus ini
    karena ketiga tahunnya untung, tapi skenario pesimis bisa membuat Tahun 1 rugi —
    dan mengalikan rugi dengan 11% akan berubah jadi subsidi yang tidak pernah ada.
  */
  const pajak = Math.max(0, labaSebelumPajak) * asumsi.tarifPajak;
  const labaBersih = labaSebelumPajak - pajak;

  return {
    tahun: indeks + 1,
    volumeKg,
    gmv,
    komisi,
    marginLogistik,
    gradingPremium,
    saas,
    totalPendapatan,
    biayaLogistik,
    biayaPayment,
    insentifPengepul,
    totalBiayaVariabel,
    labaKotor,
    marginKotor,
    biayaTetapRincian,
    totalBiayaTetap,
    labaSebelumPajak,
    pajak,
    labaBersih,
  };
}

export function hitungProyeksi(asumsi: AsumsiSimulasi): Proyeksi {
  const tahun: PerTahun<BarisTahun> = [
    hitungTahun(asumsi, 0),
    hitungTahun(asumsi, 1),
    hitungTahun(asumsi, 2),
  ];
  const labaBersih: PerTahun<number> = [
    tahun[0].labaBersih,
    tahun[1].labaBersih,
    tahun[2].labaBersih,
  ];

  return {
    tahun,
    modalAwal: totalModalAwal(asumsi),
    labaBersih,
    totalLabaBersih: labaBersih[0] + labaBersih[1] + labaBersih[2],
    marginKontribusiGmv: marginKontribusiGmv(asumsi),
  };
}
