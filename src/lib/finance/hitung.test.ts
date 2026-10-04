import { describe, expect, it } from "vitest";

import { BASELINE, salinAsumsi, totalModalAwal } from "@/lib/finance/asumsi";
import { hitungProyeksi } from "@/lib/finance/hitung";

const proyeksi = hitungProyeksi(BASELINE);
const [y1, y2, y3] = proyeksi.tahun;

/** Satu rupiah dibulatkan ke sen — lebih ketat dari yang dibutuhkan, cukup longgar untuk float. */
const RUPIAH = 2;

describe("Tabel 4.3 — proyeksi GMV dan pendapatan", () => {
  it("menurunkan GMV dari volume dikali harga tertimbang", () => {
    expect(y1.gmv).toBeCloseTo(1_200_000_000, RUPIAH);
    expect(y2.gmv).toBeCloseTo(1_800_000_000, RUPIAH);
    expect(y3.gmv).toBeCloseTo(5_520_000_000, RUPIAH);
  });

  it("memecah pendapatan Tahun 1 sesuai empat aliran di tabel", () => {
    expect(y1.komisi).toBeCloseTo(96_000_000, RUPIAH);
    expect(y1.marginLogistik).toBeCloseTo(36_000_000, RUPIAH);
    expect(y1.gradingPremium).toBeCloseTo(12_000_000, RUPIAH);
    expect(y1.saas).toBe(0);
    expect(y1.totalPendapatan).toBeCloseTo(144_000_000, RUPIAH);
  });

  it("memecah pendapatan Tahun 2 sesuai empat aliran di tabel", () => {
    expect(y2.komisi).toBeCloseTo(144_000_000, RUPIAH);
    expect(y2.marginLogistik).toBeCloseTo(54_000_000, RUPIAH);
    expect(y2.gradingPremium).toBeCloseTo(30_000_000, RUPIAH);
    expect(y2.saas).toBeCloseTo(80_000_000, RUPIAH);
    expect(y2.totalPendapatan).toBeCloseTo(308_000_000, RUPIAH);
  });

  it("memecah pendapatan Tahun 3 sesuai empat aliran di tabel", () => {
    expect(y3.komisi).toBeCloseTo(441_600_000, RUPIAH);
    expect(y3.marginLogistik).toBeCloseTo(165_600_000, RUPIAH);
    expect(y3.gradingPremium).toBeCloseTo(60_000_000, RUPIAH);
    expect(y3.saas).toBeCloseTo(275_000_000, RUPIAH);
    expect(y3.totalPendapatan).toBeCloseTo(942_200_000, RUPIAH);
  });

  it("menahan SaaS traceability sampai Tahun 2, sesuai Bab 3.3.2", () => {
    expect(y1.saas).toBe(0);
    expect(y2.saas).toBeGreaterThan(0);
  });
});

describe("Tabel 4.2 — struktur biaya", () => {
  it("menghitung ketiga komponen biaya variabel sebagai persentase GMV", () => {
    expect(y1.biayaLogistik).toBeCloseTo(26_400_000, RUPIAH);
    expect(y1.biayaPayment).toBeCloseTo(6_000_000, RUPIAH);
    expect(y1.insentifPengepul).toBeCloseTo(12_000_000, RUPIAH);

    expect(y2.biayaLogistik).toBeCloseTo(39_600_000, RUPIAH);
    expect(y2.biayaPayment).toBeCloseTo(9_000_000, RUPIAH);
    expect(y2.insentifPengepul).toBeCloseTo(18_000_000, RUPIAH);

    expect(y3.biayaLogistik).toBeCloseTo(121_440_000, RUPIAH);
    expect(y3.biayaPayment).toBeCloseTo(27_600_000, RUPIAH);
    expect(y3.insentifPengepul).toBeCloseTo(55_200_000, RUPIAH);
  });

  it("menjumlahkan biaya variabel ke total tabel", () => {
    expect(y1.totalBiayaVariabel).toBeCloseTo(44_400_000, RUPIAH);
    expect(y2.totalBiayaVariabel).toBeCloseTo(66_600_000, RUPIAH);
    expect(y3.totalBiayaVariabel).toBeCloseTo(204_240_000, RUPIAH);
  });

  it("menjaga biaya variabel tepat 3,70% dari GMV di setiap tahun", () => {
    for (const t of proyeksi.tahun) {
      expect(t.totalBiayaVariabel / t.gmv).toBeCloseTo(0.037, 10);
    }
  });

  it("menjumlahkan enam komponen biaya tetap ke total tabel", () => {
    expect(y1.totalBiayaTetap).toBeCloseTo(67_000_000, RUPIAH);
    expect(y2.totalBiayaTetap).toBeCloseTo(164_000_000, RUPIAH);
    expect(y3.totalBiayaTetap).toBeCloseTo(486_000_000, RUPIAH);
  });

  it("mereproduksi baris TOTAL BIAYA", () => {
    expect(y1.totalBiayaVariabel + y1.totalBiayaTetap).toBeCloseTo(111_400_000, RUPIAH);
    expect(y2.totalBiayaVariabel + y2.totalBiayaTetap).toBeCloseTo(230_600_000, RUPIAH);
    expect(y3.totalBiayaVariabel + y3.totalBiayaTetap).toBeCloseTo(690_240_000, RUPIAH);
  });

  it("tidak membebankan gaji tim teknologi sebelum Tahun 2", () => {
    expect(y1.biayaTetapRincian.teknologi).toBe(0);
    expect(y2.biayaTetapRincian.teknologi).toBeCloseTo(30_000_000, RUPIAH);
  });
});

describe("Tabel 4.4 — proyeksi laba rugi", () => {
  it("mereproduksi laba kotor", () => {
    expect(y1.labaKotor).toBeCloseTo(99_600_000, RUPIAH);
    expect(y2.labaKotor).toBeCloseTo(241_400_000, RUPIAH);
    expect(y3.labaKotor).toBeCloseTo(737_960_000, RUPIAH);
  });

  it("mereproduksi margin kotor 69,17% / 78,38% / 78,32%", () => {
    expect(y1.marginKotor * 100).toBeCloseTo(69.17, 2);
    expect(y2.marginKotor * 100).toBeCloseTo(78.38, 2);
    expect(y3.marginKotor * 100).toBeCloseTo(78.32, 2);
  });

  it("mereproduksi laba sebelum pajak", () => {
    expect(y1.labaSebelumPajak).toBeCloseTo(32_600_000, RUPIAH);
    expect(y2.labaSebelumPajak).toBeCloseTo(77_400_000, RUPIAH);
    expect(y3.labaSebelumPajak).toBeCloseTo(251_960_000, RUPIAH);
  });

  it("mereproduksi PPh Badan pada tarif efektif 11%", () => {
    expect(y1.pajak).toBeCloseTo(3_586_000, RUPIAH);
    expect(y2.pajak).toBeCloseTo(8_514_000, RUPIAH);
    expect(y3.pajak).toBeCloseTo(27_715_600, RUPIAH);
  });

  it("mereproduksi laba bersih", () => {
    expect(y1.labaBersih).toBeCloseTo(29_014_000, RUPIAH);
    expect(y2.labaBersih).toBeCloseTo(68_886_000, RUPIAH);
    expect(y3.labaBersih).toBeCloseTo(224_244_400, RUPIAH);
  });

  it("menjumlahkan laba bersih tiga tahun ke Rp322.144.400", () => {
    expect(proyeksi.totalLabaBersih).toBeCloseTo(322_144_400, RUPIAH);
  });
});

describe("Tabel 4.1 — modal awal", () => {
  it("menjumlahkan tujuh komponen ke Rp85.000.000", () => {
    expect(totalModalAwal(BASELINE)).toBeCloseTo(85_000_000, RUPIAH);
    expect(proyeksi.modalAwal).toBeCloseTo(85_000_000, RUPIAH);
  });
});

describe("konsistensi internal", () => {
  it("menjaga margin kontribusi per GMV di 7,3% — komisi+logistik dikurangi biaya variabel", () => {
    expect(proyeksi.marginKontribusiGmv).toBeCloseTo(0.073, 10);
  });

  it("menaikkan take rate efektif seiring SaaS masuk, bukan menahannya rata", () => {
    const takeRate = proyeksi.tahun.map((t) => t.totalPendapatan / t.gmv);
    expect(takeRate[0]).toBeCloseTo(0.12, 4);
    expect(takeRate[1]).toBeGreaterThan(takeRate[0]);
    expect(takeRate[2]).toBeGreaterThan(takeRate[0]);
  });

  it("tidak memutasi BASELINE saat asumsi disalin dan diubah", () => {
    const ubah = salinAsumsi(BASELINE);
    ubah.volumeTon[0] = 999;
    ubah.biayaTetap.timInti[0] = 999;
    ubah.modalAwal.platform = 999;

    expect(BASELINE.volumeTon[0]).toBe(200);
    expect(BASELINE.biayaTetap.timInti[0]).toBe(15_000_000);
    expect(BASELINE.modalAwal.platform).toBe(25_000_000);
  });

  it("memberi hasil identik untuk dua kali perhitungan", () => {
    expect(JSON.stringify(hitungProyeksi(BASELINE))).toBe(
      JSON.stringify(hitungProyeksi(BASELINE)),
    );
  });
});

describe("kasus tepi", () => {
  it("tidak crash dan tidak menghasilkan NaN saat volume nol", () => {
    const kosong = salinAsumsi(BASELINE);
    kosong.volumeTon = [0, 0, 0];
    const p = hitungProyeksi(kosong);

    expect(p.tahun[0].gmv).toBe(0);
    // Pendapatan grading tetap ada, jadi margin kotor masih terdefinisi.
    expect(p.tahun[0].totalPendapatan).toBeCloseTo(12_000_000, RUPIAH);
    expect(Number.isNaN(p.tahun[0].marginKotor)).toBe(false);
    expect(p.totalLabaBersih).toBeLessThan(0);
  });

  it("memberi margin kotor nol, bukan NaN, saat tidak ada pendapatan sama sekali", () => {
    const nol = salinAsumsi(BASELINE);
    nol.volumeTon = [0, 0, 0];
    nol.gradingPremium = [0, 0, 0];
    nol.saas = [0, 0, 0];
    const p = hitungProyeksi(nol);

    expect(p.tahun[0].totalPendapatan).toBe(0);
    expect(p.tahun[0].marginKotor).toBe(0);
  });

  it("tidak mengubah rugi menjadi subsidi pajak", () => {
    const rugi = salinAsumsi(BASELINE);
    rugi.volumeTon = [1, 1, 1];
    const p = hitungProyeksi(rugi);

    for (const t of p.tahun) {
      expect(t.labaSebelumPajak).toBeLessThan(0);
      expect(t.pajak).toBe(0);
      expect(t.labaBersih).toBe(t.labaSebelumPajak);
    }
  });

  it("memperlakukan harga negatif sebagai GMV negatif tanpa pecah", () => {
    const negatif = salinAsumsi(BASELINE);
    negatif.hargaPerKg = -6_000;
    const p = hitungProyeksi(negatif);

    expect(p.tahun[0].gmv).toBeCloseTo(-1_200_000_000, RUPIAH);
    expect(Number.isFinite(p.totalLabaBersih)).toBe(true);
  });
});
