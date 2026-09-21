import { describe, expect, it } from "vitest";

import { BASELINE, salinAsumsi } from "@/lib/finance/asumsi";
import { SKENARIO } from "@/lib/finance/skenario";
import { dariParam, keParam } from "@/lib/simulasi/url";

const bolakBalik = (asumsi = salinAsumsi(BASELINE)) => dariParam(keParam(asumsi));

describe("penyandian skenario ke URL", () => {
  it("tidak menghasilkan param sama sekali untuk baseline murni", () => {
    expect(keParam(BASELINE)).toBeNull();
  });

  it("mengembalikan baseline saat param tidak ada", () => {
    expect(dariParam(null)).toEqual(BASELINE);
    expect(dariParam(undefined)).toEqual(BASELINE);
    expect(dariParam("")).toEqual(BASELINE);
  });

  it("memulihkan perubahan skalar", () => {
    const a = salinAsumsi(BASELINE);
    a.hargaPerKg = 4_500;
    a.wacc = 0.155;
    expect(bolakBalik(a)).toEqual(a);
  });

  it("memulihkan perubahan deret per tahun", () => {
    const a = salinAsumsi(BASELINE);
    a.volumeTon = [250, 610, 1_100];
    a.saas = [5_000_000, 90_000_000, 300_000_000];
    expect(bolakBalik(a)).toEqual(a);
  });

  it("memulihkan perubahan biaya tetap per komponen", () => {
    const a = salinAsumsi(BASELINE);
    a.biayaTetap.teknologi = [10_000_000, 45_000_000, 120_000_000];
    expect(bolakBalik(a)).toEqual(a);
  });

  it("memulihkan perubahan modal awal per komponen", () => {
    const a = salinAsumsi(BASELINE);
    a.modalAwal.platform = 40_000_000;
    a.modalAwal.legalitas = 3_000_000;
    expect(bolakBalik(a)).toEqual(a);
  });

  it("memulihkan keempat preset tanpa kehilangan satu angka pun", () => {
    for (const skenario of Object.values(SKENARIO)) {
      expect(bolakBalik(skenario.asumsi)).toEqual(skenario.asumsi);
    }
  });

  it("menyimpan hanya yang berubah, bukan seluruh asumsi", () => {
    const a = salinAsumsi(BASELINE);
    a.hargaPerKg = 4_500;

    const kecil = keParam(a)!;
    const semua = salinAsumsi(BASELINE);
    semua.volumeTon = [1, 2, 3];
    semua.hargaPerKg = 4_500;
    semua.biayaTetap.timInti = [1, 2, 3];
    semua.modalAwal.platform = 1;

    expect(kecil.length).toBeLessThan(keParam(semua)!.length);
    expect(kecil.length).toBeLessThan(120);
  });

  it("menghasilkan param yang aman dipakai di URL", () => {
    const a = salinAsumsi(BASELINE);
    a.volumeTon = [250, 610, 1_100];
    const param = keParam(a)!;

    expect(param).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(encodeURIComponent(param)).toBe(param);
  });
});

describe("param rusak", () => {
  it("kembali ke baseline alih-alih melempar", () => {
    for (const rusak of ["bukan-base64!!", "eyJ", "###", "e30", sandi("null"), sandi("[1,2,3]")]) {
      expect(() => dariParam(rusak)).not.toThrow();
      expect(dariParam(rusak)).toEqual(BASELINE);
    }
  });

  it("mengabaikan field bertipe salah dan menahan sisanya", () => {
    const param = sandi(
      JSON.stringify({ hargaPerKg: "banyak", wacc: 0.2, volumeTon: [1, 2] }),
    );
    const hasil = dariParam(param);

    expect(hasil.hargaPerKg).toBe(BASELINE.hargaPerKg);
    expect(hasil.volumeTon).toEqual(BASELINE.volumeTon);
    expect(hasil.wacc).toBe(0.2);
  });

  it("mengabaikan nilai tidak terhingga", () => {
    const param = sandi(JSON.stringify({ hargaPerKg: null, komisi: 1e999 }));
    const hasil = dariParam(param);

    expect(hasil.hargaPerKg).toBe(BASELINE.hargaPerKg);
    expect(hasil.komisi).toBe(BASELINE.komisi);
  });

  it("tidak memutasi BASELINE lewat param", () => {
    const param = sandi(JSON.stringify({ volumeTon: [9, 9, 9] }));
    dariParam(param);
    expect(BASELINE.volumeTon).toEqual([200, 300, 920]);
  });
});

function sandi(teks: string): string {
  return btoa(teks).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
