import { describe, expect, it } from "vitest";

import { BASELINE } from "@/lib/finance/asumsi";
import { hitungProyeksi } from "@/lib/finance/hitung";
import { hitungKelayakan } from "@/lib/finance/kelayakan";
import {
  analisisSensitivitas,
  geser,
  PENGGERAK,
  ukurMetrik,
} from "@/lib/finance/sensitivitas";
import { SKENARIO, URUTAN_SKENARIO } from "@/lib/finance/skenario";

const RUPIAH = 2;
const jalankan = (nama: keyof typeof SKENARIO) => {
  const asumsi = SKENARIO[nama].asumsi;
  const proyeksi = hitungProyeksi(asumsi);
  return { asumsi, proyeksi, kelayakan: hitungKelayakan(asumsi, proyeksi) };
};

describe("preset skenario", () => {
  it("menyediakan keempat preset dalam urutan yang ditampilkan", () => {
    expect(URUTAN_SKENARIO).toEqual(["pesimis", "moderat", "optimis", "slide"]);
    for (const nama of URUTAN_SKENARIO) expect(SKENARIO[nama]).toBeDefined();
  });

  it("menandai preset yang bukan berasal dari proposal", () => {
    expect(SKENARIO.moderat.turunan).toBe(false);
    expect(SKENARIO.pesimis.turunan).toBe(false);
    expect(SKENARIO.optimis.turunan).toBe(true);
    expect(SKENARIO.slide.turunan).toBe(true);
  });

  it("moderat identik dengan baseline proposal", () => {
    const { kelayakan } = jalankan("moderat");
    expect(kelayakan.roi! * 100).toBeCloseTo(378.99, 2);
    expect(kelayakan.irr! * 100).toBeCloseTo(71.32, 2);
    expect(kelayakan.paybackBulan).toBe(22);
  });

  it("pesimis memakai persis dua angka stres Bab 5.4", () => {
    expect(SKENARIO.pesimis.asumsi.hargaPerKg).toBe(4_500);
    expect(SKENARIO.pesimis.asumsi.biayaLogistik).toBe(0.03);
  });

  it("pesimis tetap layak tapi jauh lebih tipis daripada baseline", () => {
    const { kelayakan } = jalankan("pesimis");
    expect(kelayakan.npv!).toBeGreaterThan(0);
    expect(kelayakan.irr!).toBeGreaterThan(BASELINE.wacc);
    expect(kelayakan.roi!).toBeLessThan(jalankan("moderat").kelayakan.roi!);
    expect(kelayakan.paybackBulan!).toBeGreaterThan(22);
  });

  it("optimis lebih baik daripada baseline di setiap indikator", () => {
    const optimis = jalankan("optimis").kelayakan;
    const moderat = jalankan("moderat").kelayakan;

    expect(optimis.roi!).toBeGreaterThan(moderat.roi!);
    expect(optimis.npv!).toBeGreaterThan(moderat.npv!);
    expect(optimis.paybackBulan!).toBeLessThan(moderat.paybackBulan!);
  });

  it("hanya mengubah harga dan biaya logistik pada pesimis dan optimis", () => {
    for (const nama of ["pesimis", "optimis"] as const) {
      const a = SKENARIO[nama].asumsi;
      expect(a.volumeTon).toEqual(BASELINE.volumeTon);
      expect(a.komisi).toBe(BASELINE.komisi);
      expect(a.marginLogistik).toBe(BASELINE.marginLogistik);
      expect(a.biayaTetap).toEqual(BASELINE.biayaTetap);
      expect(a.modalAwal).toEqual(BASELINE.modalAwal);
    }
  });
});

describe("preset slide Executive Summary", () => {
  const { proyeksi, kelayakan } = jalankan("slide");

  it("mereproduksi GMV yang tertulis di slide", () => {
    expect(proyeksi.tahun[0].gmv).toBeCloseTo(1_200_000_000, RUPIAH);
    expect(proyeksi.tahun[1].gmv).toBeCloseTo(2_880_000_000, RUPIAH);
    expect(proyeksi.tahun[2].gmv).toBeCloseTo(5_520_000_000, RUPIAH);
  });

  it("mereproduksi total pendapatan yang tertulis di slide", () => {
    expect(proyeksi.tahun[0].totalPendapatan).toBeCloseTo(204_000_000, RUPIAH);
    expect(proyeksi.tahun[1].totalPendapatan).toBeCloseTo(490_000_000, RUPIAH);
    expect(proyeksi.tahun[2].totalPendapatan).toBeCloseTo(942_200_000, RUPIAH);
  });

  it("menuntut volume Tahun 2 480 ton, bukan 300 ton seperti Tabel 5.3", () => {
    expect(SKENARIO.slide.asumsi.volumeTon[1]).toBeCloseTo(480, 6);
    expect(BASELINE.volumeTon[1]).toBe(300);
  });

  it("menuntut grading premium Tahun 1 enam kali lipat angka Tabel 5.3", () => {
    // Inilah bukti angka slide tidak berasal dari model yang sama.
    expect(SKENARIO.slide.asumsi.gradingPremium[0]).toBeCloseTo(72_000_000, RUPIAH);
    expect(BASELINE.gradingPremium[0]).toBe(12_000_000);
  });

  it("melebih-lebihkan ROI jauh di atas angka yang diklaim proposal", () => {
    // Slide mengklaim ROI 378,99% — padahal angka slide sendiri menghasilkan ~590%.
    expect(kelayakan.roi! * 100).toBeGreaterThan(500);
    expect(kelayakan.roi! * 100).toBeCloseTo(590.54, 1);
  });

  it("menyimpan Tahun 3 tidak berubah — hanya Y1 dan Y2 yang bentrok", () => {
    expect(SKENARIO.slide.asumsi.volumeTon[2]).toBeCloseTo(920, 6);
    expect(SKENARIO.slide.asumsi.gradingPremium[2]).toBeCloseTo(60_000_000, RUPIAH);
    expect(SKENARIO.slide.asumsi.saas[2]).toBeCloseTo(275_000_000, RUPIAH);
  });
});

describe("analisis sensitivitas", () => {
  const hasil = analisisSensitivitas(BASELINE);
  const rentang = (p: string) => hasil.find((b) => b.penggerak === p)!.rentang;

  it("menguji setiap penggerak, terurut dari yang paling menentukan", () => {
    expect(hasil).toHaveLength(PENGGERAK.length);
    for (let i = 1; i < hasil.length; i++) {
      expect(hasil[i].rentang).toBeLessThanOrEqual(hasil[i - 1].rentang);
    }
  });

  it("memberi dampak identik untuk harga dan volume — keduanya menskala GMV linier", () => {
    expect(rentang("hargaPerKg")).toBeCloseTo(rentang("volume"), 2);
  });

  it("mengurutkan ketiga komponen biaya variabel sesuai besaran persentasenya", () => {
    expect(rentang("biayaLogistik")).toBeGreaterThan(rentang("insentifPengepul"));
    expect(rentang("insentifPengepul")).toBeGreaterThan(rentang("biayaPayment"));
  });

  it("menempatkan harga dan biaya logistik di atas nol — keduanya memang menggerakkan model", () => {
    expect(rentang("hargaPerKg")).toBeGreaterThan(0);
    expect(rentang("biayaLogistik")).toBeGreaterThan(0);
  });

  it("tidak menggerakkan apa pun saat deviasinya nol", () => {
    for (const b of analisisSensitivitas(BASELINE, { deviasi: 0 })) {
      expect(b.rentang).toBeCloseTo(0, 6);
    }
  });

  it("melebar seiring deviasi membesar", () => {
    const sempit = analisisSensitivitas(BASELINE, { deviasi: 0.1 })[0].rentang;
    const lebar = analisisSensitivitas(BASELINE, { deviasi: 0.3 })[0].rentang;
    expect(lebar).toBeGreaterThan(sempit);
  });

  it("bekerja untuk ketiga metrik target", () => {
    for (const metrik of ["npv", "roi", "labaBersih"] as const) {
      const b = analisisSensitivitas(BASELINE, { metrik });
      expect(b[0].rentang).toBeGreaterThan(0);
      expect(b[0].dasar).not.toBeNull();
    }
  });
});

describe("geser", () => {
  it("tidak memutasi asumsi asal", () => {
    const sebelum = JSON.stringify(BASELINE);
    for (const p of PENGGERAK) geser(BASELINE, p, 1.5);
    expect(JSON.stringify(BASELINE)).toBe(sebelum);
  });

  it("mengembalikan asumsi setara saat faktornya satu", () => {
    for (const p of PENGGERAK) {
      expect(ukurMetrik(geser(BASELINE, p, 1), "npv")!).toBeCloseTo(
        ukurMetrik(BASELINE, "npv")!,
        2,
      );
    }
  });

  it("menskalakan modal awal tanpa merusak proporsi rincian Tabel 5.1", () => {
    const dua = geser(BASELINE, "modalAwal", 2);
    expect(dua.modalAwal.platform).toBeCloseTo(50_000_000, RUPIAH);
    expect(dua.modalAwal.administrasi).toBeCloseTo(8_000_000, RUPIAH);
  });
});
