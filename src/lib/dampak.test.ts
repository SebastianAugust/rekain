import { describe, expect, it } from "vitest";

import { bacaTanggal, dampakPerBulan, hitungDampak, jumlahkanDampak, FAKTOR_DAMPAK } from "@/lib/dampak";
import type { Transaction } from "@/lib/types";

const tx = (material: Transaction["material"], berat: number, tanggal: string): Transaction => ({
  id: "TX-1", material, pabrik: "P", buyer: "B", berat, total: 0, tanggal, status: "Selesai",
});

describe("dampak", () => {
  it("menghitung berat x faktor per serat", () => {
    const d = hitungDampak({ material: "Denim Deadstock", berat: 100 });
    expect(d.co2eKg).toBe(100 * FAKTOR_DAMPAK["Denim Deadstock"].co2ePerKg);
    expect(d.limbahKg).toBe(100);
  });

  it("menjumlahkan beberapa transaksi", () => {
    const r = jumlahkanDampak([tx("Katun Campuran", 10, "1 Agu 2026"), tx("Katun Campuran", 30, "2 Agu 2026")]);
    expect(r.limbahKg).toBe(40);
    expect(r.jumlahTransaksi).toBe(2);
  });

  it("membaca tanggal ledger berbahasa Indonesia", () => {
    expect(bacaTanggal("24 Agu 2026")).toEqual({ tahun: 2026, bulan: 7 });
    expect(bacaTanggal("rusak")).toBeNull();
  });

  it("tren enam bulan berakhir di bulan transaksi terbaru", () => {
    const t = dampakPerBulan([tx("Katun Campuran", 10, "3 Des 2025"), tx("Katun Campuran", 20, "9 Jan 2026")]);
    expect(t.map((b) => b.label)).toEqual(["Agu", "Sep", "Okt", "Nov", "Des", "Jan"]);
    expect(t[4].limbahKg).toBe(10);
    expect(t[5].limbahKg).toBe(20);
  });
});
