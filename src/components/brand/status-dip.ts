import type { DipTone } from "@/components/brand/dip-chip";
import type { ListingStatus, TransactionStatus } from "@/lib/types";

/*
  One table per status family, so a status looks identical on every screen that
  shows it. The further along a trade, the deeper the dip.
*/
export const LISTING_DIP: Record<ListingStatus, DipTone> = {
  "Menunggu Grading": "d0",
  Tersedia: "d6",
  "Dalam Negosiasi": "d1",
  Terjual: "d0",
};

export const TRANSAKSI_DIP: Record<TransactionStatus, DipTone> = {
  "Menunggu Konfirmasi": "d0",
  Dikirim: "d1",
  Selesai: "d6",
  Ditolak: "d0",
};
