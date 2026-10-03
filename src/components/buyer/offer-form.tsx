"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";

import { JahitanMuat } from "@/components/brand/jahitan-muat";
import { tombol } from "@/components/brand/tombol";
import { Field } from "@/components/shared/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOffer } from "@/lib/data/hooks";
import { formatBerat, formatRupiah } from "@/lib/format";
import type { Listing, Transaction } from "@/lib/types";
import {
  buildPenawaranSchema,
  type PenawaranParsed,
  type PenawaranValues,
} from "@/lib/validation/ajukan-penawaran";

export function OfferForm({ listing }: { listing: Listing }) {
  const [terkirim, setTerkirim] = useState<Transaction | null>(null);
  const createOffer = useCreateOffer();

  // The max depends on this listing's stock, so the schema is built per listing.
  const schema = useMemo(() => buildPenawaranSchema(listing.berat), [listing.berat]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PenawaranValues, unknown, PenawaranParsed>({
    resolver: zodResolver(schema),
    defaultValues: { jumlah: "", catatan: "" },
  });

  // `useWatch` rather than `watch()`: the latter returns a fresh function each
  // render, which makes React Compiler skip memoizing this component entirely.
  const jumlahMentah = Number(useWatch({ control, name: "jumlah" }));
  const estimasi =
    listing.harga !== null && Number.isFinite(jumlahMentah) && jumlahMentah > 0
      ? jumlahMentah * listing.harga
      : null;

  async function onSubmit(values: PenawaranParsed) {
    try {
      const transaksi = await createOffer.mutateAsync({
        listingId: listing.id,
        jumlah: values.jumlah,
        catatan: values.catatan || undefined,
      });
      toast.success("Penawaran terkirim", {
        description: `${formatBerat(values.jumlah)} ${listing.material} ke ${listing.pabrik}.`,
      });
      setTerkirim(transaksi);
    } catch (e) {
      // The store's own message ("sudah terjual", "melebihi stok") is the useful one.
      toast.error("Gagal mengirim penawaran", {
        description: e instanceof Error ? e.message : "Silakan coba lagi.",
      });
    }
  }

  if (listing.harga === null) {
    return (
      <p className="text-sm text-tinta-pudar">
        Material ini masih menunggu penilaian mutu, jadi belum bisa ditawar. Simpan ke favorit
        untuk dapat kabar begitu harganya keluar.
      </p>
    );
  }

  if (listing.status === "Terjual") {
    return (
      <p className="text-sm text-tinta-pudar">
        Bal ini sudah terjual.{" "}
        <Link href="/buyer" className="font-medium text-nila-tinta underline underline-offset-2">
          Cari material serupa
        </Link>
        .
      </p>
    );
  }

  if (terkirim) {
    return (
      <div role="status" className="relative rounded-kartu bg-nila-1/35 px-w4 py-w4">
        <div className="relative flex items-start gap-w3">
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-nila-6 shadow-tombol"
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" focusable="false">
              <path
                className="jahit-tutup"
                d="M5 12.5 10 17 19 7"
                fill="none"
                stroke="#ffffff"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="judul-kecil text-sm text-tinta">
              Penawaran terkirim ke {listing.pabrik}
            </p>
            <p className="mt-w1 text-xs text-tinta-pudar">
              <span className="font-mono">{terkirim.id}</span> · {formatBerat(terkirim.berat)} ·{" "}
              <span className="font-mono">{formatRupiah(terkirim.total)}</span> — menunggu
              konfirmasi pabrik.
            </p>
            <Link
              href="/buyer/transaksi"
              className="group mt-w2 inline-flex items-center gap-1 rounded-input text-sm font-medium text-nila-tinta hover:underline"
            >
              Pantau di Transaksi
              <ArrowRight
                size={12}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (listing.status === "Dalam Negosiasi") {
    return (
      <p className="text-sm text-tinta-pudar">
        Material ini sedang dalam negosiasi, jadi belum bisa ditawar lagi. Kalau penawaran itu
        ditolak, material kembali tersedia.{" "}
        <Link href="/buyer" className="font-medium text-nila-tinta underline underline-offset-2">
          Cari material serupa
        </Link>
        .
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isSubmitting}
      className="space-y-w4"
    >
      <Field
        label="Jumlah yang ditawar (kg)"
        required
        error={errors.jumlah?.message}
        description={`Stok tersedia ${formatBerat(listing.berat)}.`}
      >
        {(a11y) => (
          <Input
            {...a11y}
            {...register("jumlah")}
            type="number"
            inputMode="decimal"
            min={0}
            max={listing.berat}
            step="any"
            placeholder={`maks. ${listing.berat}`}
            className="bg-white"
          />
        )}
      </Field>

      <Field label="Catatan untuk pabrik (opsional)" error={errors.catatan?.message}>
        {(a11y) => (
          <Textarea
            {...a11y}
            {...register("catatan")}
            rows={3}
            placeholder="mis. jadwal pengambilan, kebutuhan sortir."
            className="bg-white"
          />
        )}
      </Field>

      <div className="flex items-center justify-between rounded-input bg-kain px-w4 py-w3 text-base">
        <span className="text-tinta-pudar">Estimasi total</span>
        <span className="font-mono font-semibold text-tinta tabular-nums" aria-live="polite">
          {estimasi === null ? "—" : formatRupiah(estimasi)}
        </span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={tombol({ ukuran: "besar", penuh: true })}
      >
        {isSubmitting ? (
          <>
            <JahitanMuat /> Mengirim…
          </>
        ) : (
          <>
            <Send size={18} strokeWidth={1.8} aria-hidden="true" /> Ajukan Penawaran
          </>
        )}
      </button>
    </form>
  );
}
