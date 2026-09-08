import type { Listing, MaterialKind, Pabrik, Transaction } from "@/lib/types";

/** Material colour strips shown down the binding edge of every listing. */
export const SWATCH: Record<MaterialKind, string> = {
  "Cotton Cutting Scraps": "#E4D9C3",
  "Denim Deadstock": "#33506E",
  "Katun Campuran": "#D8CBA8",
  "Reject Roll Ends": "#8C6E52",
};

/** Grading-code prefix per material, e.g. Cotton Cutting Scraps -> `COT-B-014`. */
export const KODE_MATERIAL: Record<MaterialKind, string> = {
  "Cotton Cutting Scraps": "COT",
  "Denim Deadstock": "DNM",
  "Katun Campuran": "KTN",
  "Reject Roll Ends": "RJC",
};

/** Readonly tuple so it can be handed straight to `z.enum` in the upload schema. */
export const MATERIAL_OPTIONS = [
  "Cotton Cutting Scraps",
  "Denim Deadstock",
  "Katun Campuran",
  "Reject Roll Ends",
] as const satisfies readonly MaterialKind[];

/*
  ── Factory registry ────────────────────────────────────────────────────────

  The pickup coordinates the route planner runs on. Points are real locations in
  the three sub-districts of the Bandung textile belt, so the distances the
  planner reports are geographically meaningful rather than made up.

  `listing.pabrik` is the key into this table. A factory with `titik: null` has
  registered but has not had its loading bay surveyed yet — it is a real state in
  this business, and the planner reports it instead of silently skipping it.
*/
export const PABRIK: Record<string, Pabrik> = {
  "PT Mitra Garmindo": {
    nama: "PT Mitra Garmindo",
    kecamatan: "Cimahi",
    titik: { lat: -6.8785, lng: 107.5401 },
  },
  "CV Rajut Cibabat": {
    nama: "CV Rajut Cibabat",
    kecamatan: "Cimahi",
    titik: { lat: -6.8836, lng: 107.5462 },
  },
  "PT Sinar Cimindi": {
    nama: "PT Sinar Cimindi",
    kecamatan: "Cimahi",
    titik: { lat: -6.8901, lng: 107.5619 },
  },
  "Karya Tenun Jaya": {
    nama: "Karya Tenun Jaya",
    kecamatan: "Rancaekek",
    titik: { lat: -6.9601, lng: 107.7702 },
  },
  "PT Sandang Rancaekek": {
    nama: "PT Sandang Rancaekek",
    kecamatan: "Rancaekek",
    titik: { lat: -6.9489, lng: 107.7521 },
  },
  "CV Tekstil Linggar": {
    nama: "CV Tekstil Linggar",
    kecamatan: "Rancaekek",
    titik: { lat: -6.9712, lng: 107.7818 },
  },
  "CV Sumber Kain": {
    nama: "CV Sumber Kain",
    kecamatan: "Majalaya",
    titik: { lat: -7.0398, lng: 107.7592 },
  },
  "PT Majalaya Sentosa": {
    nama: "PT Majalaya Sentosa",
    kecamatan: "Majalaya",
    titik: { lat: -7.0521, lng: 107.7703 },
  },
  "CV Wangi Tekstil": {
    nama: "CV Wangi Tekstil",
    kecamatan: "Majalaya",
    titik: { lat: -7.0289, lng: 107.7448 },
  },
  "CV Pandu Tekstil": {
    nama: "CV Pandu Tekstil",
    kecamatan: "Majalaya",
    titik: null,
  },
};

export const seedListings: Listing[] = [
  {
    id: "COT-B-014",
    material: "Cotton Cutting Scraps",
    grade: "B",
    berat: 820,
    harga: 4500,
    lokasi: "Cimahi, Bandung",
    pabrik: "PT Mitra Garmindo",
    status: "Tersedia",
    swatch: SWATCH["Cotton Cutting Scraps"],
    umur: "2 hari lalu",
  },
  {
    id: "DNM-A-007",
    material: "Denim Deadstock",
    grade: "A",
    berat: 340,
    harga: 7200,
    lokasi: "Rancaekek, Bandung",
    pabrik: "Karya Tenun Jaya",
    status: "Tersedia",
    swatch: SWATCH["Denim Deadstock"],
    umur: "5 jam lalu",
  },
  {
    id: "KTN-C-022",
    material: "Katun Campuran",
    grade: "C",
    berat: 1150,
    harga: 2800,
    lokasi: "Majalaya, Bandung",
    pabrik: "CV Sumber Kain",
    status: "Dalam Negosiasi",
    swatch: SWATCH["Katun Campuran"],
    umur: "1 hari lalu",
  },
  {
    id: "RJC-B-031",
    material: "Reject Roll Ends",
    grade: "B",
    berat: 560,
    harga: 3600,
    lokasi: "Cimahi, Bandung",
    pabrik: "PT Mitra Garmindo",
    status: "Tersedia",
    swatch: SWATCH["Reject Roll Ends"],
    umur: "3 hari lalu",
  },
  {
    id: "COT-A-035",
    material: "Cotton Cutting Scraps",
    grade: "A",
    berat: 640,
    harga: 5400,
    lokasi: "Cimahi, Bandung",
    pabrik: "CV Rajut Cibabat",
    status: "Tersedia",
    swatch: SWATCH["Cotton Cutting Scraps"],
    umur: "4 jam lalu",
  },
  {
    id: "KTN-B-041",
    material: "Katun Campuran",
    grade: "B",
    berat: 910,
    harga: 3900,
    lokasi: "Cimahi, Bandung",
    pabrik: "PT Sinar Cimindi",
    status: "Tersedia",
    swatch: SWATCH["Katun Campuran"],
    umur: "1 hari lalu",
  },
  {
    id: "DNM-B-044",
    material: "Denim Deadstock",
    grade: "B",
    berat: 720,
    harga: 5800,
    lokasi: "Rancaekek, Bandung",
    pabrik: "Karya Tenun Jaya",
    status: "Tersedia",
    swatch: SWATCH["Denim Deadstock"],
    umur: "6 jam lalu",
  },
  {
    id: "KTN-B-047",
    material: "Katun Campuran",
    grade: "B",
    berat: 1250,
    harga: 3400,
    lokasi: "Rancaekek, Bandung",
    pabrik: "PT Sandang Rancaekek",
    status: "Tersedia",
    swatch: SWATCH["Katun Campuran"],
    umur: "2 hari lalu",
  },
  {
    id: "RJC-C-052",
    material: "Reject Roll Ends",
    grade: "C",
    berat: 480,
    harga: 2800,
    lokasi: "Rancaekek, Bandung",
    pabrik: "CV Tekstil Linggar",
    status: "Dalam Negosiasi",
    swatch: SWATCH["Reject Roll Ends"],
    umur: "3 hari lalu",
  },
  {
    id: "COT-B-058",
    material: "Cotton Cutting Scraps",
    grade: "B",
    berat: 980,
    harga: 4200,
    lokasi: "Majalaya, Bandung",
    pabrik: "PT Majalaya Sentosa",
    status: "Tersedia",
    swatch: SWATCH["Cotton Cutting Scraps"],
    umur: "8 jam lalu",
  },
  {
    id: "DNM-C-061",
    material: "Denim Deadstock",
    grade: "C",
    berat: 430,
    harga: 4100,
    lokasi: "Majalaya, Bandung",
    pabrik: "CV Wangi Tekstil",
    status: "Tersedia",
    swatch: SWATCH["Denim Deadstock"],
    umur: "1 hari lalu",
  },
  {
    id: "RJC-A-066",
    material: "Reject Roll Ends",
    grade: "A",
    berat: 1520,
    harga: 5100,
    lokasi: "Majalaya, Bandung",
    pabrik: "PT Majalaya Sentosa",
    status: "Tersedia",
    swatch: SWATCH["Reject Roll Ends"],
    umur: "5 hari lalu",
  },
  {
    id: "KTN-B-073",
    material: "Katun Campuran",
    grade: "B",
    berat: 650,
    harga: 3700,
    lokasi: "Majalaya, Bandung",
    pabrik: "CV Pandu Tekstil",
    status: "Tersedia",
    swatch: SWATCH["Katun Campuran"],
    umur: "2 hari lalu",
  },
  {
    /* Ungraded, so the planner must leave it out: nothing is collected before
       ReKain has graded it. */
    id: "COT-X-079",
    material: "Cotton Cutting Scraps",
    grade: null,
    berat: 300,
    harga: null,
    lokasi: "Majalaya, Bandung",
    pabrik: "CV Wangi Tekstil",
    status: "Menunggu Grading",
    swatch: SWATCH["Cotton Cutting Scraps"],
    umur: "3 jam lalu",
  },
];

export const seedTransaksiPabrik: Transaction[] = [
  {
    id: "TX-2291",
    material: "Denim Deadstock",
    buyer: "Ulang Studio",
    berat: 210,
    total: 1_512_000,
    tanggal: "24 Agu 2026",
    status: "Selesai",
  },
  {
    id: "TX-2278",
    material: "Cotton Cutting Scraps",
    buyer: "Daur Tekstil ID",
    berat: 400,
    total: 1_800_000,
    tanggal: "18 Agu 2026",
    status: "Selesai",
  },
];

export const seedTransaksiBuyer: Transaction[] = [
  {
    id: "TX-2291",
    material: "Denim Deadstock",
    pabrik: "Karya Tenun Jaya",
    berat: 210,
    total: 1_512_000,
    tanggal: "24 Agu 2026",
    status: "Dikirim",
  },
];

/** Buyer starts with the first two listings saved. */
export const seedFavoritIds: string[] = seedListings.slice(0, 2).map((l) => l.id);
