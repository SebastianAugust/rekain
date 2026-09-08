import {
  KODE_MATERIAL,
  PABRIK,
  SWATCH,
  seedFavoritIds,
  seedListings,
  seedTransaksiBuyer,
  seedTransaksiPabrik,
} from "@/lib/data/seed";
import type {
  Listing,
  NewListingInput,
  NewOfferInput,
  Pabrik,
  RencanaRute,
  Transaction,
} from "@/lib/types";
import { DEPOT, PABRIK_AKTIF } from "@/lib/session";
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
const transaksiPabrik: Transaction[] = [...seedTransaksiPabrik];
const transaksiBuyer: Transaction[] = [...seedTransaksiBuyer];

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

export async function fetchListings(): Promise<Listing[]> {
  await delay();
  return [...listings];
}

/** Only graded listings are offered to buyers — grading gates visibility. */
export async function fetchListingsForBuyer(): Promise<Listing[]> {
  await delay();
  return listings.filter((l) => l.status !== "Menunggu Grading");
}

export async function fetchListing(id: string): Promise<Listing | null> {
  await delay(300);
  return listings.find((l) => l.id === id) ?? null;
}

export async function fetchMyListings(): Promise<Listing[]> {
  await delay();
  return listings.filter((l) => l.pabrik === PABRIK_AKTIF);
}

export async function fetchTransaksiPabrik(): Promise<Transaction[]> {
  await delay();
  return [...transaksiPabrik];
}

export async function fetchTransaksiBuyer(): Promise<Transaction[]> {
  await delay();
  return [...transaksiBuyer];
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

export type OfferResult = {
  listing: Listing;
  jumlah: number;
  total: number;
};

export async function createOffer(input: NewOfferInput): Promise<OfferResult> {
  await delay(700);
  const listing = listings.find((l) => l.id === input.listingId);
  if (!listing) throw new Error(`Listing ${input.listingId} tidak ditemukan`);
  if (listing.harga === null) throw new Error("Material ini belum digrading");
  if (input.jumlah > listing.berat) throw new Error("Jumlah melebihi stok tersedia");

  listings = listings.map((l) =>
    l.id === input.listingId ? { ...l, status: "Dalam Negosiasi" as const } : l,
  );

  return { listing, jumlah: input.jumlah, total: input.jumlah * listing.harga };
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
