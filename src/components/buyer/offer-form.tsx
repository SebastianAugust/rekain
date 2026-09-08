"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Field } from "@/components/shared/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateOffer } from "@/lib/data/hooks";
import { formatBerat, formatRupiah } from "@/lib/format";
import type { Listing } from "@/lib/types";
import {
  buildPenawaranSchema,
  type PenawaranParsed,
  type PenawaranValues,
} from "@/lib/validation/ajukan-penawaran";

export function OfferForm({ listing }: { listing: Listing }) {
  const [terkirim, setTerkirim] = useState(false);
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
      await createOffer.mutateAsync({
        listingId: listing.id,
        jumlah: values.jumlah,
        catatan: values.catatan || undefined,
      });
      toast.success("Penawaran terkirim", {
        description: `${formatBerat(values.jumlah)} ${listing.material} ke ${listing.pabrik}.`,
      });
      setTerkirim(true);
    } catch {
      toast.error("Gagal mengirim penawaran", { description: "Silakan coba lagi." });
    }
  }

  if (listing.harga === null) {
    return (
      <p className="text-sm text-tinta-pudar">
        Material ini masih menunggu grading, jadi belum bisa ditawar. Simpan ke favorit untuk
        dapat kabar begitu harganya keluar.
      </p>
    );
  }

  if (terkirim) {
    return (
      <p
        role="status"
        className="rounded-sm bg-nila-1 px-w3 py-w3 text-sm font-medium text-nila-6"
      >
        Penawaran terkirim ke {listing.pabrik}. Menunggu konfirmasi.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-w4">
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
            className="h-10 rounded-sm border-garis bg-white"
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
            className="rounded-sm border-garis bg-white"
          />
        )}
      </Field>

      <div className="flex items-center justify-between rounded-sm bg-kain px-w3 py-w2 text-sm">
        <span className="text-tinta-pudar">Estimasi total</span>
        <span className="font-mono font-semibold text-tinta">
          {estimasi === null ? "—" : formatRupiah(estimasi)}
        </span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-w2 rounded-sm bg-nila-6 py-2.5 text-sm font-medium text-white hover:bg-nila-9 disabled:opacity-40"
      >
        <Send size={14} aria-hidden="true" />
        {isSubmitting ? "Mengirim…" : "Ajukan Penawaran"}
      </button>
    </form>
  );
}
