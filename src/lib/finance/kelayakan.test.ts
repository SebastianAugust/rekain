import { describe, expect, it } from "vitest";

import { BASELINE, salinAsumsi } from "@/lib/finance/asumsi";
import { hitungProyeksi } from "@/lib/finance/hitung";
import {
  bepPendapatan,
  hitungKelayakan,
  irr,
  npv,
  paybackBulan,
  roiKumulatif,
} from "@/lib/finance/kelayakan";

const proyeksi = hitungProyeksi(BASELINE);
const kelayakan = hitungKelayakan(BASELINE, proyeksi);

describe("Tabel 4.5 — indikator kelayakan usaha", () => {
  it("mereproduksi ROI kumulatif 378,99%", () => {
    expect(kelayakan.roi! * 100).toBeCloseTo(378.99, 2);
  });

  it("mereproduksi BEP Pendapatan Tahun 1 Rp96.867.470", () => {
    expect(kelayakan.bepPendapatan[0]!).toBeCloseTo(96_867_470, 0);
  });

  it("mereproduksi NPV Rp166.785.081 pada WACC 10%", () => {
    // Proposal menulis Rp166.785.081; perhitungan penuh memberi Rp166.785.078,89.
    // Selisih Rp2 berasal dari pembulatan di spreadsheet, bukan dari beda rumus.
    expect(kelayakan.npv!).toBeCloseTo(166_785_078.89, 2);
    expect(Math.abs(kelayakan.npv! - 166_785_081)).toBeLessThan(5);
  });

  it("mereproduksi IRR 71,32%", () => {
    expect(kelayakan.irr! * 100).toBeCloseTo(71.32, 2);
  });

  it("mereproduksi payback pada bulan ke-22", () => {
    expect(kelayakan.paybackBulan).toBe(22);
  });

  it("menempatkan payback tepat setelah modal tertutup, bukan sebelumnya", () => {
    const bulanan = proyeksi.labaBersih.map((l) => l / 12);
    const kumulatif = (bulan: number) =>
      Array.from({ length: bulan }, (_, i) => bulanan[Math.floor(i / 12)]).reduce(
        (a, b) => a + b,
        0,
      );

    expect(kumulatif(21)).toBeLessThan(proyeksi.modalAwal);
    expect(kumulatif(22)).toBeGreaterThanOrEqual(proyeksi.modalAwal);
  });

  it("memberi NPV positif dan IRR di atas WACC — syarat kelayakan proposal", () => {
    expect(kelayakan.npv!).toBeGreaterThan(0);
    expect(kelayakan.irr!).toBeGreaterThan(BASELINE.wacc);
  });
});

describe("BEP volume Tahun 1", () => {
  it("menghitung BEP Tahun 1 sekitar 134,5 ton (±135 ton di Tabel 4.5)", () => {
    expect(kelayakan.bepVolumeTon!).toBeCloseTo(134.54, 2);
  });

  it("berada di bawah volume rencana Tahun 1, jadi Tahun 1 memang untung", () => {
    expect(kelayakan.bepVolumeTon!).toBeLessThan(BASELINE.volumeTon[0]);
  });
});

describe("NPV", () => {
  it("sama dengan total laba bersih dikurangi modal saat discount rate nol", () => {
    expect(npv(proyeksi.labaBersih, proyeksi.modalAwal, 0)).toBeCloseTo(
      proyeksi.totalLabaBersih - proyeksi.modalAwal,
      2,
    );
  });

  it("menurun secara monoton seiring discount rate naik", () => {
    const rates = [0, 0.05, 0.1, 0.25, 0.5];
    const nilai = rates.map((r) => npv(proyeksi.labaBersih, proyeksi.modalAwal, r)!);
    for (let i = 1; i < nilai.length; i++) expect(nilai[i]).toBeLessThan(nilai[i - 1]);
  });

  it("mendekati nol tepat di IRR", () => {
    expect(npv(proyeksi.labaBersih, proyeksi.modalAwal, kelayakan.irr!)!).toBeCloseTo(0, 2);
  });

  it("tidak terdefinisi untuk discount rate −100% atau lebih rendah", () => {
    expect(npv(proyeksi.labaBersih, proyeksi.modalAwal, -1)).toBeNull();
    expect(npv(proyeksi.labaBersih, proyeksi.modalAwal, -1.5)).toBeNull();
  });
});

describe("IRR — kasus tidak konvergen", () => {
  it("tidak terdefinisi saat seluruh arus kas negatif", () => {
    expect(irr([-10_000_000, -5_000_000, -1_000_000], 85_000_000)).toBeNull();
  });

  it("tidak terdefinisi saat tidak ada modal keluar sama sekali", () => {
    // Tanpa arus keluar, NPV positif di semua discount rate — tidak ada akar.
    expect(irr([10_000_000, 20_000_000, 30_000_000], 0)).toBeNull();
  });

  it("menemukan akar yang sudah diketahui: modal 100 dengan tiga arus 100", () => {
    // Dengan a = 1/(1+r), NPV nol saat a + a² + a³ = 1. Akarnya a ≈ 0,54369,
    // jadi r = 1/a − 1 ≈ 83,929%.
    const r = irr([100, 100, 100], 100)!;
    expect(r).toBeCloseTo(0.83929, 4);
    expect(npv([100, 100, 100], 100, r)!).toBeCloseTo(0, 6);
  });
});

describe("payback", () => {
  it("tidak terdefinisi saat modal tidak pernah tertutup dalam 36 bulan", () => {
    expect(paybackBulan([1_000_000, 1_000_000, 1_000_000], 85_000_000)).toBeNull();
  });

  it("langsung nol saat tidak ada modal yang perlu dikembalikan", () => {
    expect(paybackBulan(proyeksi.labaBersih, 0)).toBe(0);
  });

  it("makin cepat seiring modal awal mengecil", () => {
    const besar = paybackBulan(proyeksi.labaBersih, 85_000_000)!;
    const kecil = paybackBulan(proyeksi.labaBersih, 20_000_000)!;
    expect(kecil).toBeLessThan(besar);
  });
});

describe("ROI dan BEP — kasus tepi", () => {
  it("ROI tidak terdefinisi tanpa modal awal", () => {
    expect(roiKumulatif(322_144_400, 0)).toBeNull();
    expect(roiKumulatif(322_144_400, -1)).toBeNull();
  });

  it("BEP pendapatan tidak terdefinisi saat margin kotor nol atau negatif", () => {
    expect(bepPendapatan(67_000_000, 0)).toBeNull();
    expect(bepPendapatan(67_000_000, -0.2)).toBeNull();
  });

  it("BEP volume tidak terdefinisi saat biaya variabel melampaui take rate", () => {
    const rugi = salinAsumsi(BASELINE);
    rugi.biayaLogistik = 0.2; // margin kontribusi jadi negatif
    const k = hitungKelayakan(rugi, hitungProyeksi(rugi));
    expect(k.bepVolumeTon).toBeNull();
  });

  it("seluruh indikator tetap terdefinisi atau null, tidak pernah NaN", () => {
    const aneh = salinAsumsi(BASELINE);
    aneh.volumeTon = [0, 0, 0];
    aneh.hargaPerKg = 0;
    const k = hitungKelayakan(aneh, hitungProyeksi(aneh));

    for (const nilai of [k.roi, k.npv, k.irr, k.paybackBulan]) {
      expect(nilai === null || Number.isFinite(nilai)).toBe(true);
    }
  });
});
