import { KODE_MATERIAL, PABRIK, SWATCH, seedFavoritIds, seedListings, seedTransaksi } from "@/lib/data/seed";
import { formatTanggal } from "@/lib/format";
import type {
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
 * `X` in the grade slot until ReKain grades it.
 */
function generateId(material: NewListingInput["material"]): string {
  const prefix = KODE_MATERIAL[material];
  const sequence = listings.filter((l) => l.id.startsWith(prefix)).length + 1;
  const nextNumber = String(sequence + 13).padStart(3, "0");
  return `${prefix}-X-${nextNumber}`;
}

/** Only graded listings are offered to buyers — grading gates visibility. */
function terlihatOlehBuyer(l: Listing): boolean {
  return l.status !== "Menunggu Grading";
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
  const listing = listings.find((l) => l.id === input.listingId);
  if (!listing) throw new Error(`Listing ${input.listingId} tidak ditemukan`);
  if (listing.harga === null) throw new Error("Material ini belum digrading");
  if (listing.status === "Terjual") throw new Error("Material ini sudah terjual");
  if (input.jumlah > listing.berat) throw new Error("Jumlah melebihi stok tersedia");

  listings = listings.map((l) =>
    l.id === input.listingId ? { ...l, status: "Dalam Negosiasi" as const } : l,
  );

  const nomor = Math.max(...transaksi.map((t) => Number(t.id.slice(3))), 2300) + 1;
  const record: Transaction = {
    id: `TX-${nomor}`,
    listingId: listing.id,
    material: listing.material,
    pabrik: listing.pabrik,
    buyer: BUYER_AKTIF,
    berat: input.jumlah,
    total: Math.round(input.jumlah * listing.harga),
    tanggal: formatTanggal(new Date()),
    status: "Menunggu Konfirmasi",
  };
  transaksi = [record, ...transaksi];
  return record;
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
