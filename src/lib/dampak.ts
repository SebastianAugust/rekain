import type { MaterialKind, Transaction } from "@/lib/types";

/*
  Estimasi dampak lingkungan per transaksi: berat (kg) x faktor per jenis serat.

  Kata yang dipakai selalu "estimasi dampak". Ini bukan kredit karbon dan tidak
  boleh ditampilkan atau dijual sebagai kredit karbon.
*/

export type FaktorDampak = {
  serat: string;
  /** kg CO2e yang dihindari per kg limbah yang dialihkan dari TPA. */
  co2ePerKg: number;
  /** liter air yang dihemat per kg limbah yang dialihkan. */
  airLiterPerKg: number;
  sumber: string;
  tahun: number;
  /** Selama true, UI wajib menandai angka sebagai "Data contoh". */
  demo: boolean;
};

/*
  DEMO. Semua angka di bawah adalah konstanta contoh untuk menggambar antarmuka.
  Angka ini BUKAN hasil penelitian dan tidak boleh dikutip.
  TODO: ganti dengan faktor dari sumber yang bisa dikutip (studi LCA serat atau
  database emisi publik), isi `sumber` dan `tahun` dengan rujukan sebenarnya, lalu
  ubah `demo` menjadi false.
*/
const SUMBER_DEMO = "Konstanta contoh (DEMO), belum bersumber";

export const FAKTOR_DAMPAK: Record<MaterialKind, FaktorDampak> = {
  "Cotton Cutting Scraps": { serat: "Katun", co2ePerKg: 2, airLiterPerKg: 100, sumber: SUMBER_DEMO, tahun: 2026, demo: true },
  "Denim Deadstock": { serat: "Denim (katun)", co2ePerKg: 3, airLiterPerKg: 150, sumber: SUMBER_DEMO, tahun: 2026, demo: true },
  "Katun Campuran": { serat: "Katun campuran", co2ePerKg: 1.5, airLiterPerKg: 80, sumber: SUMBER_DEMO, tahun: 2026, demo: true },
  "Reject Roll Ends": { serat: "Campuran (reject)", co2ePerKg: 1, airLiterPerKg: 50, sumber: SUMBER_DEMO, tahun: 2026, demo: true },
};

/** Tanggal pembaruan tabel faktor, ditampilkan di kartu "Cara kami menghitung". */
export const FAKTOR_DIPERBARUI = "Oktober 2026";

export type Dampak = {
  /** kg CO2e dihindari (estimasi). */
  co2eKg: number;
  /** liter air dihemat (estimasi). */
  airLiter: number;
  /** kg limbah dialihkan dari TPA. */
  limbahKg: number;
};

type Baris = Pick<Transaction, "material" | "berat">;

export function hitungDampak({ material, berat }: Baris): Dampak {
  const f = FAKTOR_DAMPAK[material];
  return { co2eKg: berat * f.co2ePerKg, airLiter: berat * f.airLiterPerKg, limbahKg: berat };
}

export function jumlahkanDampak(daftar: Baris[]): Dampak & { jumlahTransaksi: number } {
  const awal = { co2eKg: 0, airLiter: 0, limbahKg: 0, jumlahTransaksi: daftar.length };
  return daftar.reduce((acc, t) => {
    const d = hitungDampak(t);
    return {
      co2eKg: acc.co2eKg + d.co2eKg,
      airLiter: acc.airLiter + d.airLiter,
      limbahKg: acc.limbahKg + d.limbahKg,
      jumlahTransaksi: acc.jumlahTransaksi,
    };
  }, awal);
}

const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

/** "24 Agu 2026" (format ledger) -> { tahun, bulan } dengan bulan 0-11, atau null. */
export function bacaTanggal(tanggal: string): { tahun: number; bulan: number } | null {
  const [, nama, tahun] = tanggal.trim().split(/\s+/);
  const bulan = BULAN.findIndex((b) => b.toLowerCase() === nama?.replace(".", "").toLowerCase());
  const th = Number(tahun);
  return bulan >= 0 && Number.isFinite(th) ? { tahun: th, bulan } : null;
}

export type DampakBulan = Dampak & { kunci: string; label: string };

/**
 * Tren per bulan untuk `jumlah` bulan berakhir pada bulan transaksi terbaru
 * (bukan bulan hari ini, supaya data contoh tetap terbaca kapan pun dibuka).
 */
export function dampakPerBulan(daftar: Transaction[], jumlah = 6): DampakBulan[] {
  const bertanggal = daftar.flatMap((t) => {
    const d = bacaTanggal(t.tanggal);
    return d ? [{ t, ...d }] : [];
  });
  if (bertanggal.length === 0) return [];

  const akhir = Math.max(...bertanggal.map((x) => x.tahun * 12 + x.bulan));
  return Array.from({ length: jumlah }, (_, i) => {
    const idx = akhir - (jumlah - 1 - i);
    const tahun = Math.floor(idx / 12);
    const bulan = idx % 12;
    const ringkas = jumlahkanDampak(
      bertanggal.filter((x) => x.tahun === tahun && x.bulan === bulan).map((x) => x.t),
    );
    return {
      kunci: `${tahun}-${String(bulan + 1).padStart(2, "0")}`,
      label: BULAN[bulan],
      co2eKg: ringkas.co2eKg,
      airLiter: ringkas.airLiter,
      limbahKg: ringkas.limbahKg,
    };
  });
}

export type DampakMaterial = Dampak & { material: MaterialKind; serat: string; jumlahTransaksi: number };

export function dampakPerMaterial(daftar: Transaction[]): DampakMaterial[] {
  const kunci = [...new Set(daftar.map((t) => t.material))];
  return kunci
    .map((material) => {
      const r = jumlahkanDampak(daftar.filter((t) => t.material === material));
      return { material, serat: FAKTOR_DAMPAK[material].serat, ...r };
    })
    .sort((a, b) => b.limbahKg - a.limbahKg);
}

/** Transaksi yang dihitung dampaknya: hanya yang sudah selesai. */
export function transaksiSelesai(daftar: Transaction[]): Transaction[] {
  return daftar.filter((t) => t.status === "Selesai");
}

/** Berat dalam kg -> ton untuk angka utama. */
export const kgKeTon = (kg: number) => kg / 1000;
