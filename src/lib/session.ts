import type { Role, Titik } from "@/lib/types";

/**
 * Stand-in for authentication. The mockup identified the logged-in factory by
 * comparing `listing.pabrik === "PT Mitra Garmindo"` inline in two places; those
 * comparisons now go through here so swapping in a real session later is one edit.
 */
export const PERSONA: Record<Role, { nama: string; deskripsi: string }> = {
  pabrik: { nama: "PT Mitra Garmindo", deskripsi: "Akun Pabrik" },
  buyer: { nama: "Ulang Studio", deskripsi: "Akun Buyer" },
  ops: { nama: "Ops ReKain", deskripsi: "Akun Operasional" },
};

export const PABRIK_AKTIF = PERSONA.pabrik.nama;
export const BUYER_AKTIF = PERSONA.buyer.nama;

export const KLASTER = "Klaster Bandung";
/** Same cluster, lowercased for mid-sentence use — the city name stays capitalised. */
export const KLASTER_INLINE = "klaster Bandung";

/**
 * Where every collection run starts and ends. Gedebage sits on the eastern
 * toll approach, between the Cimahi side of the cluster and the Rancaekek and
 * Majalaya side, which is why the pilot warehouse is there.
 */
export const DEPOT: Titik = { lat: -6.9438, lng: 107.6931 };
export const DEPOT_NAMA = "Hub ReKain Gedebage";
