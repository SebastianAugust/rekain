import { describe, expect, it } from "vitest";

import {
  bukaKembali,
  bukaNegosiasi,
  kodeMaterial,
  labelEscrow,
  lepasStok,
  nilaiGrading,
  selesaikan,
  terima,
  tolak,
} from "@/lib/data/alur";
import type { Listing, ListingStatus, Transaction, TransactionStatus } from "@/lib/types";

const listing = (status: ListingStatus, o: Partial<Listing> = {}): Listing => ({
  id: "COT-X-080",
  material: "Cotton Cutting Scraps",
  grade: status === "Menunggu Grading" ? null : "B",
  berat: 500,
  harga: status === "Menunggu Grading" ? null : 4000,
  lokasi: "Cimahi, Bandung",
  pabrik: "PT Mitra Garmindo",
  status,
  swatch: "#fff",
  umur: "Baru saja",
  ...o,
});

const tx = (status: TransactionStatus): Transaction => ({
  id: "TX-2400",
  listingId: "COT-X-080",
  material: "Cotton Cutting Scraps",
  pabrik: "PT Mitra Garmindo",
  buyer: "Ulang Studio",
  berat: 200,
  total: 800_000,
  tanggal: "3 Okt 2026",
  status,
});

describe("kodeMaterial", () => {
  it("mengisi slot grade pada kode yang belum digrading", () => {
    expect(kodeMaterial("COT-X-080", "A")).toBe("COT-A-080");
  });

  it("tidak mengubah kode yang slot gradenya sudah terisi", () => {
    expect(kodeMaterial("DNM-A-007", "B")).toBe("DNM-A-007");
  });
});

describe("nilaiGrading", () => {
  it("mengisi grade dan harga, status jadi Tersedia", () => {
    const hasil = nilaiGrading(listing("Menunggu Grading"), { grade: "A", harga: 5000 });
    expect(hasil).toMatchObject({ id: "COT-A-080", grade: "A", harga: 5000, status: "Tersedia" });
  });

  it("menolak listing yang bukan Menunggu Grading", () => {
    for (const s of ["Tersedia", "Dalam Negosiasi", "Terjual"] as const) {
      expect(() => nilaiGrading(listing(s), { grade: "A", harga: 5000 })).toThrow("sudah digrading");
    }
  });

  it("menolak grade atau harga tidak sah", () => {
    const l = listing("Menunggu Grading");
    expect(() => nilaiGrading(l, { grade: "D" as never, harga: 5000 })).toThrow("Grade");
    for (const harga of [0, -1, 4500.5, Number.NaN]) {
      expect(() => nilaiGrading(l, { grade: "A", harga })).toThrow("Harga");
    }
  });
});

describe("bukaNegosiasi", () => {
  it("Tersedia -> Dalam Negosiasi", () => {
    expect(bukaNegosiasi(listing("Tersedia"), 200).status).toBe("Dalam Negosiasi");
  });

  it("menerima tepat seluruh stok", () => {
    expect(bukaNegosiasi(listing("Tersedia"), 500).status).toBe("Dalam Negosiasi");
  });

  it("menolak setiap status selain Tersedia", () => {
    expect(() => bukaNegosiasi(listing("Menunggu Grading"), 100)).toThrow("belum digrading");
    expect(() => bukaNegosiasi(listing("Terjual"), 100)).toThrow("sudah terjual");
    expect(() => bukaNegosiasi(listing("Dalam Negosiasi"), 100)).toThrow("sedang dalam negosiasi");
  });

  it("menolak jumlah nol, negatif, dan melebihi stok", () => {
    expect(() => bukaNegosiasi(listing("Tersedia"), 0)).toThrow("lebih dari nol");
    expect(() => bukaNegosiasi(listing("Tersedia"), -5)).toThrow("lebih dari nol");
    expect(() => bukaNegosiasi(listing("Tersedia"), 501)).toThrow("melebihi stok");
  });
});

describe("bukaKembali", () => {
  it("Dalam Negosiasi -> Tersedia, berat tetap", () => {
    expect(bukaKembali(listing("Dalam Negosiasi"))).toMatchObject({ status: "Tersedia", berat: 500 });
  });

  it("menolak status lain", () => {
    for (const s of ["Menunggu Grading", "Tersedia", "Terjual"] as const) {
      expect(() => bukaKembali(listing(s))).toThrow("tidak sedang dalam negosiasi");
    }
  });
});

describe("lepasStok", () => {
  it("seluruh stok terambil -> Terjual", () => {
    expect(lepasStok(listing("Dalam Negosiasi"), 500)).toMatchObject({ status: "Terjual", berat: 500 });
  });

  it("sebagian -> berat berkurang dan kembali Tersedia", () => {
    expect(lepasStok(listing("Dalam Negosiasi"), 200)).toMatchObject({ status: "Tersedia", berat: 300 });
  });

  it("menolak status lain dan jumlah berlebih", () => {
    expect(() => lepasStok(listing("Tersedia"), 100)).toThrow("tidak sedang dalam negosiasi");
    expect(() => lepasStok(listing("Dalam Negosiasi"), 501)).toThrow("melebihi stok");
  });
});

describe("transaksi", () => {
  const SEMUA: TransactionStatus[] = ["Menunggu Konfirmasi", "Dikirim", "Selesai", "Ditolak"];

  it("transisi sah", () => {
    expect(terima(tx("Menunggu Konfirmasi")).status).toBe("Dikirim");
    expect(tolak(tx("Menunggu Konfirmasi")).status).toBe("Ditolak");
    expect(selesaikan(tx("Dikirim")).status).toBe("Selesai");
  });

  it("terima dan tolak hanya dari Menunggu Konfirmasi", () => {
    for (const s of SEMUA.filter((x) => x !== "Menunggu Konfirmasi")) {
      expect(() => terima(tx(s))).toThrow("Penawaran ini sudah");
      expect(() => tolak(tx(s))).toThrow("Penawaran ini sudah");
    }
  });

  it("selesaikan hanya dari Dikirim", () => {
    for (const s of SEMUA.filter((x) => x !== "Dikirim")) {
      expect(() => selesaikan(tx(s))).toThrow("bukan Dikirim");
    }
  });

  it("tidak mengubah record asal", () => {
    const asal = tx("Menunggu Konfirmasi");
    terima(asal);
    expect(asal.status).toBe("Menunggu Konfirmasi");
  });
});

describe("labelEscrow", () => {
  it("selalu berlabel simulasi, dan hanya saat dana benar-benar berpindah", () => {
    expect(labelEscrow("Dikirim")).toBe("Dana ditahan (simulasi)");
    expect(labelEscrow("Selesai")).toBe("Dana dilepas ke pabrik (simulasi)");
    expect(labelEscrow("Menunggu Konfirmasi")).toBeNull();
    expect(labelEscrow("Ditolak")).toBeNull();
  });
});
