/**
 * Angka acuan proposal: Tabel 4.6 dan Bagian 4.1.4.
 *
 * Seluruhnya dihitung dari BASELINE dengan mengubah satu variabel, sehingga tidak
 * pernah terpengaruh slider di halaman.
 */

import { hitungProyeksi, marginKontribusiPerKg } from "@/lib/finance/hitung";
import { hitungKelayakan } from "@/lib/finance/kelayakan";
import { bangunAsumsi, DISKONTO_PILIHAN, MASUKAN_BAWAAN } from "@/lib/finance/skenario";

/** Harga yang diuji Tabel 4.6. */
export const HARGA_ACUAN = [6_000, 4_500, 2_000] as const;

/** Biaya logistik Rp/kg yang dibandingkan di Bagian 4.1.4: 2,2% vs 3,0% GMV pada Rp6.000. */
export const LOGISTIK_ACUAN = [132, 180] as const;

function tahun1(ubah: Partial<typeof MASUKAN_BAWAAN>) {
  const asumsi = bangunAsumsi({ ...MASUKAN_BAWAAN, ...ubah });
  const proyeksi = hitungProyeksi(asumsi);
  return { asumsi, proyeksi, kelayakan: hitungKelayakan(asumsi, proyeksi) };
}

export function acuanHarga() {
  return HARGA_ACUAN.map((harga) => {
    const { asumsi, proyeksi, kelayakan } = tahun1({ harga });
    return {
      harga,
      marginKontribusiPerKg: marginKontribusiPerKg(asumsi),
      bepVolumeTon: kelayakan.bepVolumeTon,
      labaSebelumPajak: proyeksi.tahun[0].labaSebelumPajak,
    };
  });
}

export function acuanLogistik() {
  return LOGISTIK_ACUAN.map((logistikPerKg) => ({
    logistikPerKg,
    rasioGmv: logistikPerKg / MASUKAN_BAWAAN.harga,
    labaSebelumPajak: tahun1({ logistikPerKg }).proyeksi.tahun[0].labaSebelumPajak,
  }));
}

export function acuanNpv() {
  return DISKONTO_PILIHAN.map((diskonto) => ({
    diskonto,
    npv: tahun1({ diskonto }).kelayakan.npv,
  }));
}
