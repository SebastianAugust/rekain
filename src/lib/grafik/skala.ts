/**
 * Skala dan tick untuk grafik yang digambar tangan.
 *
 * Repo ini belum pernah menggambar sumbu — grafik yang ada semuanya dekoratif.
 * Modul ini yang menanggung aritmetikanya supaya komponen SVG tinggal memetakan
 * angka ke koordinat, dan supaya logikanya bisa diuji tanpa DOM.
 */

/** Memetakan satu nilai domain ke satu koordinat viewBox. */
export type Skala = (nilai: number) => number;

export function skalaLinear(
  domain: readonly [number, number],
  rentang: readonly [number, number],
): Skala {
  const [d0, d1] = domain;
  const [r0, r1] = rentang;
  const lebarDomain = d1 - d0;

  // Domain selebar nol akan membagi nol; taruh semuanya di tengah rentang.
  if (lebarDomain === 0) {
    const tengah = (r0 + r1) / 2;
    return () => tengah;
  }
  return (nilai) => r0 + ((nilai - d0) / lebarDomain) * (r1 - r0);
}

/** Langkah tick terdekat yang berbentuk 1, 2, atau 5 dikali pangkat sepuluh. */
function langkahBagus(kasar: number): number {
  if (kasar <= 0 || !Number.isFinite(kasar)) return 1;
  const pangkat = 10 ** Math.floor(Math.log10(kasar));
  const sisa = kasar / pangkat;
  if (sisa <= 1) return pangkat;
  if (sisa <= 2) return 2 * pangkat;
  if (sisa <= 5) return 5 * pangkat;
  return 10 * pangkat;
}

const TOLERANSI = 1e-9;

/*
  Pembulatan yang memaafkan galat float. `max / langkah` yang secara matematis
  tepat 3 bisa keluar sebagai 2,9999999999999996, dan `Math.floor` biasa akan
  membuang tick terakhir. Argumennya selalu berupa rasio berorde satuan, jadi
  toleransi absolut sudah memadai.
*/
function lantai(x: number): number {
  const bulat = Math.round(x);
  return Math.abs(x - bulat) < TOLERANSI ? bulat : Math.floor(x);
}

function atap(x: number): number {
  const bulat = Math.round(x);
  return Math.abs(x - bulat) < TOLERANSI ? bulat : Math.ceil(x);
}

/**
 * Membulatkan ke presisi yang dibawa langkahnya, karena `3 * 0,1` bernilai
 * 0,30000000000000004 dan angka itu akan tercetak apa adanya sebagai label sumbu.
 * Sekalian menormalkan −0 menjadi 0.
 */
function bulatkanKe(nilai: number, langkah: number): number {
  const desimal = Math.min(20, Math.max(0, -Math.floor(Math.log10(langkah))));
  const hasil = Number(nilai.toFixed(desimal));
  return hasil === 0 ? 0 : hasil;
}

/**
 * Tick pada kelipatan bulat di dalam [min, max].
 *
 * Dihitung lewat perkalian indeks, bukan penjumlahan berulang, supaya galat float
 * tidak menumpuk sepanjang sumbu.
 */
export function tickBagus(min: number, max: number, target = 5): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max) || target < 1) return [];
  if (min === max) return [min];
  if (min > max) [min, max] = [max, min];

  const langkah = langkahBagus((max - min) / target);
  const mulai = atap(min / langkah);
  const selesai = lantai(max / langkah);

  const tick: number[] = [];
  for (let i = mulai; i <= selesai; i++) tick.push(bulatkanKe(i * langkah, langkah));
  return tick;
}

/**
 * Melebarkan [min, max] ke kelipatan tick terdekat, supaya sumbu berakhir di angka
 * bulat alih-alih memotong tepat di data. Nol selalu ikut masuk ketika data
 * melintasinya — batang yang tidak berpijak pada nol itu berbohong.
 */
export function domainBagus(
  min: number,
  max: number,
  target = 5,
): [number, number] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min > max) [min, max] = [max, min];

  const bawah = Math.min(0, min);
  const atas = Math.max(0, max);
  if (bawah === atas) return [bawah, bawah + 1];

  const langkah = langkahBagus((atas - bawah) / target);
  return [
    bulatkanKe(lantai(bawah / langkah) * langkah, langkah),
    bulatkanKe(atap(atas / langkah) * langkah, langkah),
  ];
}
