"use client";

import { toast } from "sonner";

import { JahitanMuat } from "@/components/brand/jahitan-muat";
import { tombol } from "@/components/brand/tombol";
import { useKonfirmasiTerima, useTerimaPenawaran, useTolakPenawaran } from "@/lib/data/hooks";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

/*
  Loading is not disabled: a pending button stays at full strength with a seam in
  place of its label, and the click is simply ignored. `disabled` would dim it,
  which reads as "you cannot do this" rather than "this is happening".
*/

function pesan(e: unknown): string {
  return e instanceof Error ? e.message : "Silakan coba lagi.";
}

/** Factory side: answer an incoming offer. */
export function AksiPabrik({ t }: { t: Transaction }) {
  const terima = useTerimaPenawaran();
  const tolak = useTolakPenawaran();
  const sibuk = terima.isPending || tolak.isPending;

  if (t.status !== "Menunggu Konfirmasi") return null;

  async function jalankan(aksi: "terima" | "tolak") {
    if (sibuk) return;
    try {
      if (aksi === "terima") {
        await terima.mutateAsync(t.id);
        toast.success("Penawaran diterima", { description: `${t.id}: dana ditahan (simulasi) sampai buyer menerima barang.` });
      } else {
        await tolak.mutateAsync(t.id);
        toast.success("Penawaran ditolak", { description: `${t.id}: material kembali tersedia untuk buyer.` });
      }
    } catch (e) {
      toast.error(aksi === "terima" ? "Gagal menerima penawaran" : "Gagal menolak penawaran", { description: pesan(e) });
    }
  }

  return (
    <div className="flex flex-wrap gap-w2" aria-busy={sibuk}>
      <button type="button" onClick={() => jalankan("terima")} aria-disabled={sibuk} className={tombol()}>
        {terima.isPending ? (
          <>
            <JahitanMuat /> Menerima…
          </>
        ) : (
          <>
            Terima<span className="sr-only"> penawaran {t.id}</span>
          </>
        )}
      </button>
      <button type="button" onClick={() => jalankan("tolak")} aria-disabled={sibuk} className={tombol({ nada: "garis" })}>
        {tolak.isPending ? (
          <>
            <JahitanMuat /> Menolak…
          </>
        ) : (
          <>
            Tolak<span className="sr-only"> penawaran {t.id}</span>
          </>
        )}
      </button>
    </div>
  );
}

/** Buyer side: the goods have arrived, release the (simulated) escrow. */
export function AksiBuyer({ t, className }: { t: Transaction; className?: string }) {
  const konfirmasi = useKonfirmasiTerima();

  if (t.status !== "Dikirim") return null;

  async function jalankan() {
    if (konfirmasi.isPending) return;
    try {
      await konfirmasi.mutateAsync(t.id);
      toast.success("Barang diterima", { description: `${t.id}: dana dilepas ke pabrik (simulasi). Sertifikat dan dampak sudah tercatat.` });
    } catch (e) {
      toast.error("Gagal mengonfirmasi penerimaan", { description: pesan(e) });
    }
  }

  return (
    <button
      type="button"
      onClick={jalankan}
      aria-disabled={konfirmasi.isPending}
      aria-busy={konfirmasi.isPending}
      className={cn(tombol(), className)}
    >
      {konfirmasi.isPending ? (
        <>
          <JahitanMuat /> Mengonfirmasi…
        </>
      ) : (
        <>
          Konfirmasi barang diterima<span className="sr-only"> untuk {t.id}</span>
        </>
      )}
    </button>
  );
}
