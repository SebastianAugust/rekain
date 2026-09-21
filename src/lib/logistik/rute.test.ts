import { describe, expect, it } from "vitest";

import { PABRIK, seedListings } from "@/lib/data/seed";
import { FAKTOR_JALAN, haversine, jarakJalan, panjangTur } from "@/lib/logistik/jarak";
import { KAPASITAS_OPSI, susunRencana } from "@/lib/logistik/rute";
import { DEPOT } from "@/lib/session";
import type { Listing, RencanaRute } from "@/lib/types";

const rencanakan = (kapasitas: number, listings: Listing[] = seedListings): RencanaRute =>
  susunRencana({ listings, pabrik: PABRIK, depot: DEPOT, kapasitas });

/** Material that is graded and still sitting at a factory — what a truck can collect. */
const siapJemput = seedListings.filter(
  (l) => l.status === "Tersedia" || l.status === "Dalam Negosiasi",
);
const totalSiapJemput = siapJemput.reduce((sum, l) => sum + l.berat, 0);

describe("haversine", () => {
  it("cocok dengan panjang satu derajat lintang yang sudah diketahui", () => {
    // One degree of latitude is ~111.19 km anywhere on a sphere of this radius.
    expect(haversine({ lat: 0, lng: 0 }, { lat: 1, lng: 0 })).toBeCloseTo(111.19, 1);
  });

  it("nol untuk titik yang sama, dan simetris", () => {
    const a = { lat: -6.8785, lng: 107.5401 };
    const b = { lat: -7.0521, lng: 107.7703 };
    expect(haversine(a, a)).toBe(0);
    expect(haversine(a, b)).toBeCloseTo(haversine(b, a), 10);
  });

  it("menempatkan klaster Bandung pada rentang jarak yang masuk akal", () => {
    const cimahi = PABRIK["PT Mitra Garmindo"].titik!;
    const majalaya = PABRIK["PT Majalaya Sentosa"].titik!;
    const d = haversine(cimahi, majalaya);
    expect(d).toBeGreaterThan(20);
    expect(d).toBeLessThan(40);
  });

  it("jarak jalan adalah jarak lurus dikali faktor jalan", () => {
    const a = DEPOT;
    const b = PABRIK["Karya Tenun Jaya"].titik!;
    expect(jarakJalan(a, b)).toBeCloseTo(haversine(a, b) * FAKTOR_JALAN, 10);
  });
});

describe("susunRencana — kekekalan material", () => {
  it("tidak menghilangkan atau menggandakan satu kilogram pun", () => {
    for (const kapasitas of KAPASITAS_OPSI) {
      const r = rencanakan(kapasitas);
      const dirutekan = r.ringkasan.totalMuatan;
      const gagal = r.tidakTerutekan.reduce((sum, t) => sum + t.muatan, 0);
      expect(dirutekan + gagal).toBeCloseTo(totalSiapJemput, 6);
    }
  });

  it("tidak pernah menjemput material yang belum digrading", () => {
    const belumDigrading = seedListings
      .filter((l) => l.status === "Menunggu Grading")
      .map((l) => l.id);
    expect(belumDigrading.length).toBeGreaterThan(0);

    const r = rencanakan(2000);
    const dijemput = new Set(r.rute.flatMap((x) => x.perhentian).flatMap((p) => p.listingIds));
    for (const id of belumDigrading) expect(dijemput.has(id)).toBe(false);
  });

  it("melaporkan pabrik tanpa titik jemput alih-alih membuangnya diam-diam", () => {
    const r = rencanakan(2000);
    const pandu = r.tidakTerutekan.find((t) => t.pabrik === "CV Pandu Tekstil");

    expect(pandu).toBeDefined();
    expect(pandu!.muatan).toBeGreaterThan(0);
    expect(pandu!.listingIds.length).toBeGreaterThan(0);

    // …and it must not also appear on a route.
    const diRute = r.rute.flatMap((x) => x.perhentian).map((p) => p.pabrik);
    expect(diRute).not.toContain("CV Pandu Tekstil");
  });
});

describe("susunRencana — kendala kapasitas", () => {
  it("tidak pernah melebihi kapasitas truk", () => {
    for (const kapasitas of KAPASITAS_OPSI) {
      for (const rute of rencanakan(kapasitas).rute) {
        expect(rute.totalMuatan).toBeLessThanOrEqual(kapasitas + 1e-9);
        expect(rute.utilisasi).toBeLessThanOrEqual(1 + 1e-9);
      }
    }
  });

  it("memecah pabrik yang stoknya melebihi satu truk ke beberapa kunjungan", () => {
    const berat: Listing = {
      ...seedListings[0],
      id: "COT-B-999",
      pabrik: "PT Mitra Garmindo",
      berat: 4600,
      status: "Tersedia",
    };
    const r = rencanakan(2000, [berat]);

    const kunjungan = r.rute.flatMap((x) => x.perhentian);
    expect(kunjungan.length).toBe(3); // 2000 + 2000 + 600
    expect(kunjungan.reduce((s, p) => s + p.muatan, 0)).toBeCloseTo(4600, 6);
  });

  it("truk lebih kecil berarti rute lebih banyak dan jarak tidak lebih pendek", () => {
    const kecil = rencanakan(1500);
    const besar = rencanakan(3500);

    expect(kecil.ringkasan.jumlahRute).toBeGreaterThanOrEqual(besar.ringkasan.jumlahRute);
    expect(kecil.ringkasan.totalJarak).toBeGreaterThanOrEqual(besar.ringkasan.totalJarak);
  });
});

describe("susunRencana — kualitas rute", () => {
  it("memberi nomor perhentian berurutan 1..n", () => {
    for (const rute of rencanakan(2000).rute) {
      expect(rute.perhentian.map((p) => p.urutan)).toEqual(
        rute.perhentian.map((_, i) => i + 1),
      );
    }
  });

  it("mengukur kaki pertama dari depot", () => {
    for (const rute of rencanakan(2000).rute) {
      const pertama = rute.perhentian[0];
      expect(pertama.jarakDariSebelumnya).toBeCloseTo(
        Math.round(jarakJalan(DEPOT, pertama.titik) * 10) / 10,
        6,
      );
    }
  });

  it("satu rute hanya berisi satu kecamatan", () => {
    for (const rute of rencanakan(2000).rute) {
      for (const p of rute.perhentian) expect(p.kecamatan).toBe(rute.kecamatan);
    }
  });

  it("tidak menyisakan pertukaran 2-opt yang masih memperpendek rute", () => {
    // The defining property of a 2-opt optimum: no segment reversal helps.
    for (const rute of rencanakan(1500).rute) {
      const titik = rute.perhentian.map((p) => p.titik);
      const dasar = panjangTur(DEPOT, titik);

      for (let i = 0; i < titik.length - 1; i++) {
        for (let j = i + 1; j < titik.length; j++) {
          const kandidat = [
            ...titik.slice(0, i),
            ...titik.slice(i, j + 1).reverse(),
            ...titik.slice(j + 1),
          ];
          expect(panjangTur(DEPOT, kandidat)).toBeGreaterThanOrEqual(dasar - 1e-9);
        }
      }
    }
  });
});

describe("susunRencana — klaim penghematan", () => {
  it("benar-benar lebih pendek daripada satu pulang-pergi per pengambilan", () => {
    const r = rencanakan(2000);
    expect(r.ringkasan.totalJarak).toBeLessThan(r.ringkasan.jarakTanpaKonsolidasi);
    expect(r.ringkasan.penghematanKm).toBeGreaterThan(0);
    expect(r.ringkasan.penghematanPersen).toBeGreaterThan(0);
    expect(r.ringkasan.penghematanPersen).toBeLessThan(100);
  });

  it("angka penghematan konsisten dengan kedua jarak yang dilaporkan", () => {
    const r = rencanakan(2500).ringkasan;
    expect(r.penghematanKm).toBeCloseTo(r.jarakTanpaKonsolidasi - r.totalJarak, 1);
  });
});

describe("susunRencana — determinisme", () => {
  it("dua kali jalan memberi rencana yang identik", () => {
    expect(JSON.stringify(rencanakan(2000))).toBe(JSON.stringify(rencanakan(2000)));
  });

  it("mengembalikan rencana kosong untuk kapasitas tidak valid", () => {
    const r = rencanakan(0);
    expect(r.rute).toEqual([]);
    expect(r.ringkasan.totalJarak).toBe(0);
  });

  it("mengembalikan rencana kosong ketika tidak ada material siap jemput", () => {
    const r = rencanakan(2000, []);
    expect(r.rute).toEqual([]);
    expect(r.tidakTerutekan).toEqual([]);
    expect(r.ringkasan.penghematanPersen).toBe(0);
  });
});
