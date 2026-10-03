import type { Grade, GradeListingInput, Listing, Transaction, TransactionStatus } from "@/lib/types";

/*
  The trade lifecycle as pure functions: record in, new record out, or an Error in
  Indonesian when the move is not allowed. The store calls these and does the
  bookkeeping around them; keeping the rules here is what makes them testable.

  Listing:     Menunggu Grading -> Tersedia -> Dalam Negosiasi -> Terjual
                                       ^______________|  (offer rejected, or stock left over)
  Transaction: Menunggu Konfirmasi -> Dikirim -> Selesai
               Menunggu Konfirmasi -> Ditolak

  One open offer per listing: while it is Dalam Negosiasi nobody else can offer, so
  stock can never be promised twice.
*/

const GRADE: readonly Grade[] = ["A", "B", "C"];

/**
 * An ungraded upload carries `X` in the grade slot (`COT-X-080`); grading completes
 * the code (`COT-B-080`). Nothing can reference a listing before it is graded -
 * buyers cannot see, favourite or offer on it - so the id may change exactly once,
 * here, and the store moves any stray reference along with it.
 */
export function kodeMaterial(id: string, grade: Grade): string {
  return id.replace(/-X-/, `-${grade}-`);
}

export function nilaiGrading(listing: Listing, { grade, harga }: Pick<GradeListingInput, "grade" | "harga">): Listing {
  if (listing.status !== "Menunggu Grading") throw new Error("Material ini sudah digrading");
  if (!GRADE.includes(grade)) throw new Error("Grade harus A, B, atau C");
  if (!Number.isInteger(harga) || harga <= 0) throw new Error("Harga per kg harus berupa rupiah bulat lebih dari nol");
  return { ...listing, id: kodeMaterial(listing.id, grade), grade, harga, status: "Tersedia" };
}

/** An offer takes the listing into negotiation. */
export function bukaNegosiasi(listing: Listing, jumlah: number): Listing {
  if (listing.status === "Menunggu Grading" || listing.harga === null) throw new Error("Material ini belum digrading");
  if (listing.status === "Terjual") throw new Error("Material ini sudah terjual");
  if (listing.status === "Dalam Negosiasi") throw new Error("Material ini sedang dalam negosiasi");
  if (!(jumlah > 0)) throw new Error("Jumlah harus lebih dari nol");
  if (jumlah > listing.berat) throw new Error("Jumlah melebihi stok tersedia");
  return { ...listing, status: "Dalam Negosiasi" };
}

/** The offer was rejected: the lot goes back on the shelf untouched. */
export function bukaKembali(listing: Listing): Listing {
  if (listing.status !== "Dalam Negosiasi") throw new Error("Material ini tidak sedang dalam negosiasi");
  return { ...listing, status: "Tersedia" };
}

/**
 * The buyer has the goods. A whole-lot sale closes the listing (its weight stays as
 * the lot that was sold); a partial one takes the kilos off and puts the rest back.
 */
export function lepasStok(listing: Listing, jumlah: number): Listing {
  if (listing.status !== "Dalam Negosiasi") throw new Error("Material ini tidak sedang dalam negosiasi");
  if (jumlah > listing.berat) throw new Error("Jumlah melebihi stok tersedia");
  if (jumlah === listing.berat) return { ...listing, status: "Terjual" };
  return { ...listing, berat: listing.berat - jumlah, status: "Tersedia" };
}

function ubahStatus(t: Transaction, dari: TransactionStatus, ke: TransactionStatus): Transaction {
  if (t.status !== dari) {
    throw new Error(
      dari === "Menunggu Konfirmasi"
        ? `Penawaran ini sudah ${t.status.toLowerCase()}`
        : `Transaksi ini berstatus ${t.status}, bukan ${dari}`,
    );
  }
  return { ...t, status: ke };
}

/** Factory accepts: funds are held in escrow (simulated). */
export const terima = (t: Transaction) => ubahStatus(t, "Menunggu Konfirmasi", "Dikirim");
export const tolak = (t: Transaction) => ubahStatus(t, "Menunggu Konfirmasi", "Ditolak");
/** Buyer confirms receipt: funds are released to the factory (simulated). */
export const selesaikan = (t: Transaction) => ubahStatus(t, "Dikirim", "Selesai");

/** Escrow wording, in one place. Always says "simulasi": no real money moves. */
export function labelEscrow(status: TransactionStatus): string | null {
  if (status === "Dikirim") return "Dana ditahan (simulasi)";
  if (status === "Selesai") return "Dana dilepas ke pabrik (simulasi)";
  return null;
}
