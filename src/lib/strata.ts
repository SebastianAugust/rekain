/*
  Strata generation for the Penampang Bal (bale cross-section).

  Everything here is seeded from the listing's grading code and therefore
  deterministic: the server and the client generate byte-identical strata, so
  React never reports a hydration mismatch. `Math.random()` would look the same
  in isolation and break the moment the page is server-rendered.
*/

/** mulberry32 — small, fast, well-distributed 32-bit PRNG. */
function mulberry32(a: number): () => number {
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a, so a grading code like `COT-B-014` becomes a stable numeric seed. */
function hashSeed(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

type Hsl = { h: number; s: number; l: number };

function hexToHsl(hex: string): Hsl {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  if (d === 0) return { h: 0, s: 0, l: l * 100 };

  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;

  return { h: (h * 60 + 360) % 360, s: s * 100, l: l * 100 };
}

function hslToHex({ h, s, l }: Hsl): string {
  const sN = Math.min(100, Math.max(0, s)) / 100;
  const lN = Math.min(100, Math.max(0, l)) / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));

  let rgb: [number, number, number];
  if (hp < 1) rgb = [c, x, 0];
  else if (hp < 2) rgb = [x, c, 0];
  else if (hp < 3) rgb = [0, c, x];
  else if (hp < 4) rgb = [0, x, c];
  else if (hp < 5) rgb = [x, 0, c];
  else rgb = [c, 0, x];

  const m = lN - c / 2;
  const toHex = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v + m)) * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}

export type Lapisan = {
  warna: string;
  /** Relative thickness. Callers normalise these into real lengths. */
  bagian: number;
};

/**
 * How many compressed layers a bale of this weight shows in cross-section.
 * Heavier bale, denser stack — the strip is a readout, not an ornament.
 */
export function jumlahLapisan(beratKg: number): number {
  return Math.max(7, Math.min(24, Math.round(7 + Math.sqrt(beratKg) / 2.4)));
}

/**
 * Build the layers for one bale. Layers vary in lightness, saturation and
 * thickness around the material's true colour, and roughly one in eight is a
 * contrasting fleck — real bales are mixed offcuts, not one uniform tone.
 */
export function buatLapisan(seed: string, dasar: string, jumlah: number): Lapisan[] {
  const rand = mulberry32(hashSeed(seed));
  const hsl = hexToHsl(dasar);
  const gelap = hsl.l < 45;

  return Array.from({ length: jumlah }, () => {
    const fleck = rand() < 0.13;

    // Flecks jump away from the base tone; ordinary layers only drift around it.
    const deltaL = fleck ? (gelap ? 16 + rand() * 14 : -(14 + rand() * 12)) : (rand() - 0.5) * 23;

    return {
      warna: hslToHex({
        h: hsl.h + (rand() - 0.5) * 9,
        s: Math.max(3, hsl.s + (rand() - 0.5) * 14),
        l: hsl.l + deltaL,
      }),
      bagian: 0.6 + rand() * 0.85,
    };
  });
}

/** Cumulative offsets in the 0..panjang range, plus each layer's own length. */
export function tataLapisan(
  lapisan: Lapisan[],
  panjang: number,
): { warna: string; mulai: number; panjang: number }[] {
  const total = lapisan.reduce((sum, l) => sum + l.bagian, 0);
  let cursor = 0;

  return lapisan.map((l) => {
    const size = (l.bagian / total) * panjang;
    const item = { warna: l.warna, mulai: cursor, panjang: size };
    cursor += size;
    return item;
  });
}

/**
 * Seeded jitter sequence for stitching. Returns `jumlah` offsets in roughly
 * ±`amplitudo` px — enough that the seam reads as hand-sewn rather than as a
 * CSS dashed border, which is always perfectly uniform.
 */
export function jitter(seed: string, jumlah: number, amplitudo: number): number[] {
  const rand = mulberry32(hashSeed(seed));
  return Array.from({ length: jumlah }, () => (rand() - 0.5) * 2 * amplitudo);
}
