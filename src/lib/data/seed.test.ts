import { describe, expect, it } from "vitest";

import { seedListings, seedTransaksi } from "@/lib/data/seed";
import { PABRIK_AKTIF } from "@/lib/session";

const TERBUKA = ["Menunggu Konfirmasi", "Dikirim"];

describe("data contoh", () => {
  it("id listing dan transaksi unik", () => {
    expect(new Set(seedListings.map((l) => l.id)).size).toBe(seedListings.length);
    expect(new Set(seedTransaksi.map((t) => t.id)).size).toBe(seedTransaksi.length);
  });

  it("total transaksi = berat x harga per kg listing-nya", () => {
    for (const t of seedTransaksi) {
      const l = seedListings.find((x) => x.id === t.listingId);
      expect(l, t.id).toBeDefined();
      expect(t.total, t.id).toBe(Math.round(t.berat * (l?.harga ?? 0)));
      expect(t.material, t.id).toBe(l?.material);
      expect(t.pabrik, t.id).toBe(l?.pabrik);
    }
  });

  it("setiap listing Dalam Negosiasi punya tepat satu transaksi terbuka, dan sebaliknya", () => {
    for (const l of seedListings) {
      const terbuka = seedTransaksi.filter((t) => t.listingId === l.id && TERBUKA.includes(t.status));
      expect(terbuka.length, l.id).toBe(l.status === "Dalam Negosiasi" ? 1 : 0);
    }
  });

  it("transaksi terbuka tidak melebihi stok listing", () => {
    for (const t of seedTransaksi.filter((x) => TERBUKA.includes(x.status))) {
      const l = seedListings.find((x) => x.id === t.listingId);
      expect(t.berat, t.id).toBeLessThanOrEqual(l?.berat ?? 0);
    }
  });

  it("grade dan harga terisi hanya setelah digrading", () => {
    for (const l of seedListings) {
      const dinilai = l.status !== "Menunggu Grading";
      expect(l.grade !== null, l.id).toBe(dinilai);
      expect(l.harga !== null, l.id).toBe(dinilai);
      if (dinilai) expect(l.id.split("-")[1], l.id).toBe(l.grade);
    }
  });

  it("pabrik aktif punya demo lengkap: tiap status listing, transaksi Selesai lintas material, penawaran masuk", () => {
    const milik = seedListings.filter((l) => l.pabrik === PABRIK_AKTIF);
    for (const status of ["Menunggu Grading", "Tersedia", "Dalam Negosiasi"]) {
      expect(milik.some((l) => l.status === status), status).toBe(true);
    }
    const trx = seedTransaksi.filter((t) => t.pabrik === PABRIK_AKTIF);
    const selesai = trx.filter((t) => t.status === "Selesai");
    expect(new Set(selesai.map((t) => t.material)).size).toBeGreaterThanOrEqual(3);
    expect(trx.some((t) => t.status === "Menunggu Konfirmasi")).toBe(true);
  });

  it("buyer aktif punya barang Dikirim untuk dikonfirmasi", () => {
    expect(seedTransaksi.some((t) => t.buyer === "Ulang Studio" && t.status === "Dikirim")).toBe(true);
  });
});
