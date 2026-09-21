import { describe, expect, it } from "vitest";

import { domainBagus, skalaLinear, tickBagus } from "@/lib/grafik/skala";

describe("skalaLinear", () => {
  it("memetakan ujung domain ke ujung rentang", () => {
    const s = skalaLinear([0, 100], [0, 300]);
    expect(s(0)).toBe(0);
    expect(s(100)).toBe(300);
    expect(s(50)).toBe(150);
  });

  it("bisa membalik arah — sumbu y SVG tumbuh ke bawah", () => {
    const s = skalaLinear([0, 100], [280, 20]);
    expect(s(0)).toBe(280);
    expect(s(100)).toBe(20);
    expect(s(50)).toBe(150);
  });

  it("menangani domain yang melintasi nol", () => {
    const s = skalaLinear([-50, 150], [0, 200]);
    expect(s(-50)).toBe(0);
    expect(s(0)).toBe(50);
    expect(s(150)).toBe(200);
  });

  it("mengekstrapolasi di luar domain alih-alih menjepit", () => {
    const s = skalaLinear([0, 10], [0, 100]);
    expect(s(20)).toBe(200);
    expect(s(-5)).toBe(-50);
  });

  it("menaruh semuanya di tengah saat domain selebar nol, bukan membagi nol", () => {
    const s = skalaLinear([42, 42], [0, 200]);
    expect(s(42)).toBe(100);
    expect(Number.isFinite(s(0))).toBe(true);
  });
});

describe("tickBagus", () => {
  it("memilih langkah bulat di rentang yang sudah rapi", () => {
    expect(tickBagus(0, 100, 5)).toEqual([0, 20, 40, 60, 80, 100]);
  });

  it("hanya memakai langkah berbentuk 1, 2, atau 5 kali pangkat sepuluh", () => {
    const kasus: [number, number][] = [
      [0, 1],
      [0, 37],
      [0, 943_000_000],
      [-250, 1_100],
      [0, 0.004],
    ];
    for (const [min, max] of kasus) {
      const tick = tickBagus(min, max);
      if (tick.length < 2) continue;
      const langkah = tick[1] - tick[0];
      const mantissa = langkah / 10 ** Math.floor(Math.log10(langkah));
      expect([1, 2, 5, 10]).toContain(Math.round(mantissa));
    }
  });

  it("menjaga seluruh tick di dalam rentang yang diminta", () => {
    for (const [min, max] of [
      [0, 942_200_000],
      [-85_000_000, 322_144_400],
      [12.5, 87.3],
    ]) {
      for (const t of tickBagus(min, max)) {
        expect(t).toBeGreaterThanOrEqual(min);
        expect(t).toBeLessThanOrEqual(max);
      }
    }
  });

  it("memberi jumlah tick yang mendekati target, bukan puluhan", () => {
    for (const [min, max] of [
      [0, 100],
      [0, 942_200_000],
      [-85_000_000, 322_144_400],
    ]) {
      const n = tickBagus(min, max, 5).length;
      expect(n).toBeGreaterThanOrEqual(3);
      expect(n).toBeLessThanOrEqual(11);
    }
  });

  it("menyertakan nol saat rentangnya melintasi nol", () => {
    expect(tickBagus(-100, 100)).toContain(0);
    expect(tickBagus(-85_000_000, 322_144_400)).toContain(0);
  });

  it("tidak kehilangan tick terakhir karena galat pembulatan float", () => {
    // 0.1 + 0.2 !== 0.3; penjumlahan berulang akan melewatkan ujungnya.
    expect(tickBagus(0, 0.3, 3)).toContain(0.3);
    expect(tickBagus(0, 1, 10)).toContain(1);
  });

  it("mengembalikan satu nilai saat min sama dengan max", () => {
    expect(tickBagus(5, 5)).toEqual([5]);
  });

  it("memperlakukan rentang terbalik sama dengan rentang normal", () => {
    expect(tickBagus(100, 0)).toEqual(tickBagus(0, 100));
  });

  it("mengembalikan array kosong untuk masukan tidak terhingga", () => {
    expect(tickBagus(NaN, 10)).toEqual([]);
    expect(tickBagus(0, Infinity)).toEqual([]);
  });
});

describe("domainBagus", () => {
  it("melebar keluar sampai kelipatan bulat, tidak memotong di data", () => {
    const [bawah, atas] = domainBagus(0, 942_200_000);
    expect(bawah).toBe(0);
    expect(atas).toBeGreaterThanOrEqual(942_200_000);
  });

  it("selalu menyertakan nol supaya batang berpijak jujur", () => {
    const [bawah, atas] = domainBagus(120, 460);
    expect(bawah).toBe(0);
    expect(atas).toBeGreaterThanOrEqual(460);
  });

  it("merentang ke bawah nol saat ada nilai negatif", () => {
    const [bawah, atas] = domainBagus(-85_000_000, 322_144_400);
    expect(bawah).toBeLessThanOrEqual(-85_000_000);
    expect(atas).toBeGreaterThanOrEqual(322_144_400);
  });

  it("selalu memberi domain yang punya lebar", () => {
    for (const [min, max] of [
      [0, 0],
      [7, 7],
      [-3, -3],
    ]) {
      const [bawah, atas] = domainBagus(min, max);
      expect(atas).toBeGreaterThan(bawah);
    }
  });

  it("memberi domain terpakai untuk masukan tidak terhingga alih-alih pecah", () => {
    expect(domainBagus(NaN, 10)).toEqual([0, 1]);
  });
});
