import { describe, expect, it } from "vitest";

import { BASELINE } from "@/lib/finance/asumsi";
import { hitungProyeksi } from "@/lib/finance/hitung";
import { hitungKelayakan } from "@/lib/finance/kelayakan";
import {
  bangunAsumsi,
  cocokkanPreset,
  MASUKAN_BAWAAN,
  SKENARIO,
  type Masukan,
} from "@/lib/finance/skenario";
import { acuanHarga, acuanLogistik, acuanNpv } from "@/lib/finance/sensitivitas";

const JT = 1_000_000;
const hitung = (m: Masukan) => {
  const a = bangunAsumsi(m);
  const p = hitungProyeksi(a);
  return { a, p, k: hitungKelayakan(a, p) };
};
const lsp = (p: ReturnType<typeof hitungProyeksi>) => p.tahun.map((t) => t.labaSebelumPajak);
const lb = (p: ReturnType<typeof hitungProyeksi>) => p.tahun.map((t) => t.labaBersih);

describe("bangunAsumsi", () => {
  it("masukan bawaan persis sama dengan BASELINE", () => {
    expect(bangunAsumsi(MASUKAN_BAWAAN)).toEqual(BASELINE);
  });

  it("volume dan grading premium ikut faktor, SaaS tidak", () => {
    const a = bangunAsumsi({ ...MASUKAN_BAWAAN, volumeFaktor: 1.5 });
    expect(a.volumeTon).toEqual([300, 450, 1380]);
    expect(a.gradingPremium[0]).toBe(18 * JT);
    expect(a.saas).toEqual(BASELINE.saas);
  });

  it("menjaga logistik tetap Rp/kg saat harga berubah", () => {
    const a = bangunAsumsi({ ...MASUKAN_BAWAAN, harga: 4_500 });
    expect(a.biayaLogistik * a.hargaPerKg).toBeCloseTo(132, 9);
  });
});

describe("Tabel 4.5 — BASELINE", () => {
  const { p, k } = hitung(MASUKAN_BAWAAN);
  it("mereproduksi seluruh indikator", () => {
    expect(k.modalAwal).toBe(85 * JT);
    expect(k.roi! * 100).toBeCloseTo(378.99, 2);
    expect(k.paybackBulan).toBe(22);
    expect(p.tahun[0].marginKotor * 100).toBeCloseTo(69.17, 2);
    expect(Math.round(k.bepPendapatan[0]!)).toBe(96_867_470);
    expect(Math.abs(k.npv! - 166_785_081)).toBeLessThan(5); // selisih Rp2: pembulatan spreadsheet proposal
    expect(k.irr! * 100).toBeCloseTo(71.32, 2);
    expect(k.bepVolumeTon!).toBeCloseTo(134.5, 1);
  });
  it("laba Tabel 4.4", () => {
    lsp(p).forEach((v, i) => expect(v).toBeCloseTo([32.6 * JT, 77.4 * JT, 251.96 * JT][i], 0));
    lb(p).forEach((v, i) =>
      expect(v).toBeCloseTo([29.014 * JT, 68.886 * JT, 224.2444 * JT][i], 0),
    );
  });
});

describe("Tabel 4.6 — harga", () => {
  const [h6, h45, h2] = acuanHarga();
  it("margin kontribusi per kg", () => {
    expect([h6.marginKontribusiPerKg, h45.marginKontribusiPerKg, h2.marginKontribusiPerKg]).toEqual([
      438, 296, 58,
    ]);
  });
  it("volume impas", () => {
    expect(Math.abs(h6.bepVolumeTon! - 135)).toBeLessThanOrEqual(1);
    expect(Math.abs(h45.bepVolumeTon! - 188)).toBeLessThanOrEqual(1);
    expect(Math.abs(h2.bepVolumeTon! - 568)).toBeLessThanOrEqual(1);
  });
  it("laba sebelum pajak Tahun 1", () => {
    expect(Math.round(h6.labaSebelumPajak)).toBe(32_600_000);
    expect(Math.round(h45.labaSebelumPajak)).toBe(4_100_000);
    expect(Math.round(h2.labaSebelumPajak)).toBe(-43_400_000);
  });
  it("margin kontribusi harga 4.500 sebelum pembulatan = 295,5", () => {
    expect(bangunAsumsi({ ...MASUKAN_BAWAAN, harga: 4_500 })).toBeDefined();
    expect(
      hitungProyeksi(bangunAsumsi({ ...MASUKAN_BAWAAN, harga: 4_500 })).marginKontribusiGmv * 4_500,
    ).toBeCloseTo(295.5, 6);
  });
});

describe("Bagian 4.1.4", () => {
  it("logistik 2,2% -> 3,0% GMV menurunkan laba Tahun 1 ke ±Rp23,0 juta", () => {
    const [dasar, naik] = acuanLogistik();
    expect(Math.round(dasar.labaSebelumPajak)).toBe(32_600_000);
    expect(Math.round(naik.labaSebelumPajak)).toBe(23_000_000);
    expect(naik.rasioGmv).toBeCloseTo(0.03, 10);
  });
  it("NPV pada diskonto 10%, 20%, 25%", () => {
    const [n10, n20, n25] = acuanNpv();
    expect(Math.abs(n10.npv! - 166_785_081)).toBeLessThan(5);
    expect(Math.abs(n20.npv! / JT - 116.8)).toBeLessThanOrEqual(0.1);
    expect(Math.abs(n25.npv! / JT - 97.1)).toBeLessThanOrEqual(0.1);
  });
});

describe("Lampiran 7 — tiga skenario", () => {
  const ukur = (nama: keyof typeof SKENARIO) => hitung(SKENARIO[nama].masukan);

  it("Moderat", () => {
    expect(cocokkanPreset(SKENARIO.moderat.masukan)).toBe("moderat");
    const { p, k } = ukur("moderat");
    expect(Math.abs(k.npv! - 166_785_081)).toBeLessThan(5); // selisih Rp2: pembulatan spreadsheet proposal
    expect(lsp(p)[2]).toBeCloseTo(251.96 * JT, 0);
  });

  it("Pesimis", () => {
    const { p, k } = ukur("pesimis");
    lsp(p).forEach((v, i) =>
      expect(Math.abs(v / JT - [-5.5, 20.25, 76.7][i])).toBeLessThanOrEqual(0.01),
    );
    expect(Math.abs(k.roi! * 100 - 95.04)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(k.npv! / JT - -23.82)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(k.irr! * 100 - -1.73)).toBeLessThanOrEqual(0.01);
    expect(k.paybackBulan).toBeNull();
    expect(Math.abs(p.tahun[0].marginKotor * 100 - 55.41)).toBeLessThanOrEqual(0.01);
  });

  it("Tinggi", () => {
    const { p, k } = ukur("tinggi");
    lsp(p).forEach((v, i) =>
      expect(Math.abs(v / JT - [70.7, 134.55, 427.22][i])).toBeLessThanOrEqual(0.01),
    );
    expect(Math.abs(k.roi! * 100 - 662.23)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(k.npv! / JT - 356.84)).toBeLessThanOrEqual(0.01);
    expect(Math.abs(k.irr! * 100 - 125.0)).toBeLessThanOrEqual(0.05);
    expect(k.paybackBulan).toBe(15);
    expect(Math.abs(p.tahun[0].marginKotor * 100 - 77.8)).toBeLessThanOrEqual(0.01);
  });

  it("menggeser slider menjadikan preset kustom", () => {
    expect(cocokkanPreset({ ...MASUKAN_BAWAAN, komisi: 0.085 })).toBeNull();
  });
});
