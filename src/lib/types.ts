/** Domain types for ReKain. Kept narrow so status/grade can never drift into free strings. */

export type Role = "pabrik" | "buyer" | "ops";

export type Grade = "A" | "B" | "C";

/**
 * "Menunggu Grading" is the state a freshly uploaded listing sits in. The upload
 * success copy promises grading within 1–2 working days before buyers see it, so
 * the data model has to be able to represent that promise.
 */
export type ListingStatus =
  | "Menunggu Grading"
  | "Tersedia"
  | "Dalam Negosiasi"
  | "Terjual";

export type MaterialKind =
  | "Cotton Cutting Scraps"
  | "Denim Deadstock"
  | "Katun Campuran"
  | "Reject Roll Ends";

export type Listing = {
  /** Grading code, e.g. `COT-B-014`. Rendered in mono everywhere — it reads as a label. */
  id: string;
  material: MaterialKind;
  /** Null until ReKain has graded it — a freshly uploaded listing has no grade yet. */
  grade: Grade | null;
  /** Available stock in kilograms. */
  berat: number;
  /** Price per kilogram in rupiah. Null until grading sets a fair market price. */
  harga: number | null;
  lokasi: string;
  pabrik: string;
  status: ListingStatus;
  /** Hex of the material colour strip down the left edge of the hang tag. */
  swatch: string;
  /** Human relative age, e.g. "2 hari lalu". */
  umur: string;
  catatan?: string;
};

export type TransactionStatus = "Selesai" | "Dikirim" | "Menunggu Konfirmasi";

/**
 * One trade, recorded once. Both sides of the marketplace read the same ledger
 * and each sees its own slice of it — a transaction that looked different to the
 * factory and to the buyer would be a data bug, not a point of view.
 */
export type Transaction = {
  id: string;
  /** The listing this trade came from, when it originated on the platform. */
  listingId?: string;
  material: MaterialKind;
  pabrik: string;
  buyer: string;
  berat: number;
  /** Total in rupiah. */
  total: number;
  tanggal: string;
  status: TransactionStatus;
};

export type NewListingInput = {
  material: MaterialKind;
  berat: number;
  lokasi: string;
  catatan?: string;
};

export type NewOfferInput = {
  listingId: string;
  jumlah: number;
  catatan?: string;
};

/* ── Logistics ────────────────────────────────────────────────────────────── */

/** The three sub-districts of the Bandung pilot cluster. */
export type Kecamatan = "Cimahi" | "Rancaekek" | "Majalaya";

/** A WGS84 point. Latitude and longitude in decimal degrees. */
export type Titik = { lat: number; lng: number };

export type Pabrik = {
  nama: string;
  kecamatan: Kecamatan;
  /**
   * Null until the factory's pickup point has been surveyed on the ground. An
   * unsurveyed factory cannot be routed, and the planner has to say so rather
   * than quietly dropping its material off the plan.
   */
  titik: Titik | null;
};

/** One truck stop: a visit to a factory to collect part or all of its stock. */
export type Perhentian = {
  /** 1-based position in the trip, after optimisation. */
  urutan: number;
  pabrik: string;
  kecamatan: Kecamatan;
  titik: Titik;
  /** Which listings this visit collects. */
  listingIds: string[];
  /** Kilograms picked up at this stop. */
  muatan: number;
  /** Road-distance proxy from the previous point (the depot, for stop 1). */
  jarakDariSebelumnya: number;
};

export type Rute = {
  /** e.g. `RT-CMH-01` — cluster code plus trip number. */
  id: string;
  kecamatan: Kecamatan;
  perhentian: Perhentian[];
  /** Kilometres for the whole loop, depot back to depot. */
  totalJarak: number;
  totalMuatan: number;
  kapasitas: number;
  /** 0–1. How full the truck leaves the cluster. */
  utilisasi: number;
  estimasiMenit: number;
};

/** A factory whose material could not be placed on any route, and why. */
export type TidakTerutekan = {
  pabrik: string;
  alasan: string;
  listingIds: string[];
  muatan: number;
};

export type RencanaRute = {
  rute: Rute[];
  depot: Titik;
  kapasitas: number;
  tidakTerutekan: TidakTerutekan[];
  ringkasan: {
    totalJarak: number;
    /**
     * The status quo this engine is measured against: one dedicated round trip
     * per pickup, which is how collection works without consolidation.
     */
    jarakTanpaKonsolidasi: number;
    penghematanKm: number;
    penghematanPersen: number;
    totalMuatan: number;
    jumlahRute: number;
    jumlahPerhentian: number;
  };
};
