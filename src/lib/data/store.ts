import { KODE_MATERIAL, PABRIK, SWATCH, seedFavoritIds, seedListings, seedTransaksi } from "@/lib/data/seed";
import { bukaKembali, bukaNegosiasi, lepasStok, nilaiGrading, selesaikan, terima, tolak } from "@/lib/data/alur";
import { formatTanggal } from "@/lib/format";
import type {
  GradeListingInput,
  Listing,
  NewListingInput,
  NewOfferInput,
  Pabrik,
  RencanaRute,
  Transaction,
} from "@/lib/types";
import { BUYER_AKTIF, DEPOT, PABRIK_AKTIF } from "@/lib/session";
import { susunRencana } from "@/lib/logistik/rute";

/*
  In-memory stand-in for the backend. Everything here is deliberately shaped like a
  remote API — async, latency-bearing, returning plain records — so that swapping the
  bodies for `supabase.from(...)` calls later touches this file and nothing else.

  Data lives for the lifetime of the tab; only favourites are persisted, because a
  judge refreshing the page mid-demo shouldn't lose what they just saved.
*/

const FAVORIT_KEY = "rekain:favorit";

let listings: Listing[] = [...seedListings];
let transaksi: Transaction[] = [...seedTransaksi];

/** Simulated network latency, so loading states are actually exercised in the demo. */
function delay(ms = 450): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readFavorit(): string[] {
  if (typeof window === "undefined") return seedFavoritIds;
  try {
    const raw = window.localStorage.getItem(FAVORIT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : seedFavoritIds;
  } catch {
    return seedFavoritIds;
  }
}

function writeFavorit(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FAVORIT_KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable (private mode) — favourites simply don't persist */
  }
}

/**
 * Grading codes follow PREFIX-GRADE-SEQ, e.g. `COT-B-014`. An ungraded upload takes
 * `X` in the grade slot, and keeps that id for life: the displayed code is derived
 * from the grade (`kodeMaterial`), so grading never invalidates a reference.
 * The sequence is the highest one in use plus one, so ids cannot collide.
 */
function generateId(material: NewListingInput["material"]): string {
  const prefix = KODE_MATERIAL[material];
  const tertinggi = Math.max(0, ...listings.map((l) => Number(l.id.split("-")[2]) || 0));
  return `${prefix}-X-${String(tertinggi + 1).padStart(3, "0")}`;
}

/** Only graded listings are offered to buyers — grading gates visibility. */
function terlihatOlehBuyer(l: Listing): boolean {
  return l.status !== "Menunggu Grading";
}

function cariListing(id: string): Listing {
  const listing = listings.find((l) => l.id === id);
  if (!listing) throw new Error(`Listing ${id} tidak ditemukan`);
  return listing;
}

function cariTransaksi(id: string): Transaction {
  const record = transaksi.find((t) => t.id === id);
  if (!record) throw new Error(`Transaksi ${id} tidak ditemukan`);
  return record;
}

function simpanListing(baru: Listing): void {
  listings = listings.map((l) => (l.id === baru.id ? baru : l));
}

function simpanTransaksi(baru: Transaction): void {
  transaksi = transaksi.map((t) => (t.id === baru.id ? baru : t));
}

export async function fetchListingsForBuyer(): Promise<Listing[]> {
  await delay();
  return listings.filter(terlihatOlehBuyer);
}

/**
 * Same gate as the catalogue. Without it an ungraded lot was reachable by URL,
 * which contradicted the promise that nothing reaches buyers before grading.
 */
export async function fetchListing(id: string): Promise<Listing | null> {
  await delay(300);
  return listings.find((l) => l.id === id && terlihatOlehBuyer(l)) ?? null;
}

export async function fetchMyListings(): Promise<Listing[]> {
  await delay();
  return listings.filter((l) => l.pabrik === PABRIK_AKTIF);
}

export async function fetchTransaksiPabrik(): Promise<Transaction[]> {
  await delay();
  return transaksi.filter((t) => t.pabrik === PABRIK_AKTIF);
}

/** Completed trades of the active factory: the source for impact and certificates. */
export async function fetchTransaksiSelesai(): Promise<Transaction[]> {
  await delay();
  return transaksi.filter((t) => t.pabrik === PABRIK_AKTIF && t.status === "Selesai");
}

/** Ops queue: everything uploaded and not yet graded, across all factories. */
export async function fetchAntreanGrading(): Promise<Listing[]> {
  await delay();
  return listings.filter((l) => l.status === "Menunggu Grading");
}

export async function fetchTransaksiBuyer(): Promise<Transaction[]> {
  await delay();
  return transaksi.filter((t) => t.buyer === BUYER_AKTIF);
}

export async function fetchFavorit(): Promise<string[]> {
  await delay(200);
  return readFavorit();
}

export async function toggleFavorit(id: string): Promise<string[]> {
  await delay(150);
  const current = readFavorit();
  const next = current.includes(id) ? current.filter((f) => f !== id) : [...current, id];
  writeFavorit(next);
  return next;
}

export async function createListing(input: NewListingInput): Promise<Listing> {
  await delay(700);
  const listing: Listing = {
    id: generateId(input.material),
    material: input.material,
    grade: null,
    berat: input.berat,
    harga: null,
    lokasi: input.lokasi,
    pabrik: PABRIK_AKTIF,
    status: "Menunggu Grading",
    swatch: SWATCH[input.material],
    umur: "Baru saja",
    catatan: input.catatan,
  };
  listings = [listing, ...listings];
  return listing;
}

/**
 * An offer opens a trade: the listing moves into negotiation and a pending record
 * lands in the shared ledger, so the buyer can find it again under Transaksi.
 */
export async function createOffer(input: NewOfferInput): Promise<Transaction> {
  await delay(700);
  const listing = cariListing(input.listingId);
  const dibuka = bukaNegosiasi(listing, input.jumlah);
  simpanListing(dibuka);

  const nomor = Math.max(...transaksi.map((t) => Number(t.id.slice(3))), 2300) + 1;
  const record: Transaction = {
    id: `TX-${nomor}`,
    listingId: listing.id,
    material: listing.material,
    pabrik: listing.pabrik,
    buyer: BUYER_AKTIF,
    berat: input.jumlah,
    total: Math.round(input.jumlah * (dibuka.harga ?? 0)),
    tanggal: formatTanggal(new Date()),
    status: "Menunggu Konfirmasi",
  };
  transaksi = [record, ...transaksi];
  return record;
}

/** Ops sets grade and price; the listing becomes visible to buyers. */
export async function gradeListing(input: GradeListingInput): Promise<Listing> {
  await delay(600);
  const graded = nilaiGrading(cariListing(input.listingId), input);
  simpanListing(graded);
  return graded;
}

/** Factory accepts the offer: funds are held in escrow (SIMULATED), nothing real moves. */
export async function terimaPenawaran(transaksiId: string): Promise<Transaction> {
  await delay(600);
  const record = cariTransaksi(transaksiId);
  if (record.pabrik !== PABRIK_AKTIF) throw new Error("Penawaran ini bukan untuk pabrik Anda");
  const diterima = terima(record);
  simpanTransaksi(diterima);
  return diterima;
}

/** Factory declines: the trade closes and the lot goes back on the shelf. */
export async function tolakPenawaran(transaksiId: string): Promise<Transaction> {
  await delay(600);
  const record = cariTransaksi(transaksiId);
  if (record.pabrik !== PABRIK_AKTIF) throw new Error("Penawaran ini bukan untuk pabrik Anda");
  const ditolak = tolak(record);
  if (record.listingId) simpanListing(bukaKembali(cariListing(record.listingId)));
  simpanTransaksi(ditolak);
  return ditolak;
}

/**
 * Buyer has the goods: escrow is released to the factory (SIMULATED) and the stock
 * leaves the listing, whole lot or part of it.
 */
export async function konfirmasiTerima(transaksiId: string): Promise<Transaction> {
  await delay(600);
  const record = cariTransaksi(transaksiId);
  if (record.buyer !== BUYER_AKTIF) throw new Error("Transaksi ini bukan milik Anda");
  // Both transitions are computed before either is stored, so a rule failing on the
  // listing cannot leave the ledger half-updated.
  const selesai = { ...selesaikan(record), tanggal: formatTanggal(new Date()) };
  if (record.listingId) simpanListing(lepasStok(cariListing(record.listingId), record.berat));
  simpanTransaksi(selesai);
  return selesai;
}

/*
  Logistics. The planner itself is a pure function in `@/lib/logistik/rute`; this
  is only the data-access seam around it, shaped like a remote call so it can
  become a real endpoint later without touching the UI.
*/

export async function fetchPabrik(): Promise<Pabrik[]> {
  await delay(300);
  return Object.values(PABRIK);
}

export async function fetchRencanaRute(kapasitas: number): Promise<RencanaRute> {
  await delay(600);
  return susunRencana({ listings, pabrik: PABRIK, depot: DEPOT, kapasitas });
}
