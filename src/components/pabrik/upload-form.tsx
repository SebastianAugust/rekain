"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ImageOff } from "lucide-react";
import { toast } from "sonner";

import { Eyebrow } from "@/components/brand/eyebrow";
import { UploadSuccess } from "@/components/pabrik/upload-success";
import { Field } from "@/components/shared/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MATERIAL_OPTIONS } from "@/lib/data/seed";
import { useCreateListing } from "@/lib/data/hooks";
import type { Listing } from "@/lib/types";
import {
  uploadLimbahSchema,
  type UploadLimbahParsed,
  type UploadLimbahValues,
} from "@/lib/validation/upload-limbah";

/** What happens to the lot after it is sent — the first three stations. */
const SETELAH_INI = [
  { kode: "ST-02", t: "Grading", d: "Tim kami menilai kualitas dalam 1–2 hari kerja." },
  { kode: "ST-03", t: "Harga wajar", d: "Estimasi harga per kg keluar bersama grade." },
  { kode: "ST-04", t: "Ditawarkan", d: "Buyer yang cocok melihat listing Anda." },
];

export function UploadForm() {
  const [berhasil, setBerhasil] = useState<Listing | null>(null);
  const createListing = useCreateListing();

  const form = useForm<UploadLimbahValues, unknown, UploadLimbahParsed>({
    resolver: zodResolver(uploadLimbahSchema),
    defaultValues: { material: "", berat: "", lokasi: "Cimahi, Bandung", catatan: "" },
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: UploadLimbahParsed) {
    try {
      const listing = await createListing.mutateAsync({
        material: values.material,
        berat: values.berat,
        lokasi: values.lokasi,
        catatan: values.catatan || undefined,
      });
      toast.success("Limbah berhasil diunggah", {
        description: `${listing.id} masuk antrean grading.`,
      });
      setBerhasil(listing);
    } catch {
      toast.error("Gagal mengunggah limbah", { description: "Silakan coba lagi." });
    }
  }

  if (berhasil) {
    return (
      <UploadSuccess
        listing={berhasil}
        onUploadLagi={() => {
          reset();
          setBerhasil(null);
        }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-w4 py-w4 sm:px-w5">
      <Eyebrow className="mb-w2">Upload limbah baru</Eyebrow>
      <h1 className="judul mb-w5 text-xl text-tinta">Ceritakan material yang Anda miliki</h1>

      <div className="grid max-w-5xl gap-x-w5 gap-y-w4 lg:grid-cols-3 lg:items-start">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-w4 rounded-sm border border-garis permukaan px-w4 py-w4 lg:col-span-2"
        >
          <Controller
            control={control}
            name="material"
            render={({ field }) => (
              <Field label="Jenis material" required error={errors.material?.message}>
                {({ id, ...a11y }) => (
                  <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger
                      id={id}
                      {...a11y}
                      onBlur={field.onBlur}
                      className="h-10 w-full rounded-sm border-garis bg-white"
                    >
                      <SelectValue placeholder="Pilih jenis material" />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false}>
                      {MATERIAL_OPTIONS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </Field>
            )}
          />

          <div className="grid gap-x-w4 gap-y-w3 sm:grid-cols-2">
            <Field label="Berat (kg)" required error={errors.berat?.message}>
              {(a11y) => (
                <Input
                  {...a11y}
                  {...register("berat")}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  placeholder="mis. 500"
                  className="h-10 rounded-sm border-garis bg-white"
                />
              )}
            </Field>

            <Field label="Lokasi" required error={errors.lokasi?.message}>
              {(a11y) => (
                <Input
                  {...a11y}
                  {...register("lokasi")}
                  className="h-10 rounded-sm border-garis bg-white"
                />
              )}
            </Field>
          </div>

          {/* Real file storage is out of scope, so this says so plainly rather
              than pretending to be a working uploader. */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-tinta-pudar">Foto kondisi material</span>
            <div className="flex items-center gap-w3 rounded-sm bg-kain px-w4 py-w3 text-xs text-tinta-pudar">
              <ImageOff size={16} className="shrink-0 text-nila-3" aria-hidden="true" />
              Unggah foto belum tersedia di prototipe ini. Jelaskan kondisinya di catatan.
            </div>
          </div>

          <Field label="Catatan tambahan (opsional)" error={errors.catatan?.message}>
            {(a11y) => (
              <Textarea
                {...a11y}
                {...register("catatan")}
                rows={3}
                placeholder="mis. kondisi, campuran warna, dll."
                className="rounded-sm border-garis bg-white"
              />
            )}
          </Field>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-sm bg-nila-6 py-2.5 text-sm font-medium text-white hover:bg-nila-9 disabled:opacity-40"
          >
            {isSubmitting ? "Mengirim…" : "Kirim untuk Grading"}
          </button>
        </form>

        <aside className="rounded-sm border border-garis permukaan px-w4 py-w4">
          <Eyebrow className="mb-w4">Setelah dikirim</Eyebrow>
          <ol className="space-y-w4">
            {SETELAH_INI.map((s) => (
              <li key={s.kode}>
                <span className="inline-block rounded-sm bg-nila-1 px-w2 py-0.5 font-mono text-xs text-nila-6">
                  {s.kode}
                </span>
                <h2 className="judul-kecil mt-w2 text-sm text-tinta">{s.t}</h2>
                <p className="mt-w1 text-xs text-tinta-pudar">{s.d}</p>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
