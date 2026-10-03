"use client";

import { useState } from "react";
import { CircleCheck, ClipboardCheck, MapPin, Scale } from "lucide-react";
import { toast } from "sonner";

import { BaleCardSkeletonGrid } from "@/components/brand/bale-card-skeleton";
import { EmptyState, ErrorState } from "@/components/brand/empty-state";
import { DataContoh } from "@/components/brand/data-contoh";
import { JahitanMuat } from "@/components/brand/jahitan-muat";
import { MaterialSwatch } from "@/components/brand/material-swatch";
import { Halaman, PageHeader } from "@/components/brand/page-header";
import { tombol } from "@/components/brand/tombol";
import { Field } from "@/components/shared/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAntreanGrading, useGradeListing } from "@/lib/data/hooks";
import { formatBerat, formatRupiah } from "@/lib/format";
import type { Grade, Listing } from "@/lib/types";
import { cn } from "@/lib/utils";

const GRADE: Grade[] = ["A", "B", "C"];

type Selesai = { kode: string; material: string; grade: Grade; harga: number };

function BarisGrading({ listing, onSelesai }: { listing: Listing; onSelesai: (s: Selesai) => void }) {
  const [grade, setGrade] = useState<Grade | "">("");
  const [harga, setHarga] = useState("");
  const [galat, setGalat] = useState<{ grade?: string; harga?: string }>({});
  const gradeListing = useGradeListing();

  async function simpan(e: React.FormEvent) {
    e.preventDefault();
    const nilai = Number(harga);
    const baru: typeof galat = {};
    if (!grade) baru.grade = "Pilih grade.";
    if (!Number.isInteger(nilai) || nilai <= 0) baru.harga = "Isi harga per kg dalam rupiah bulat, lebih dari nol.";
    setGalat(baru);
    if (!grade || baru.harga) return;

    try {
      const hasil = await gradeListing.mutateAsync({ listingId: listing.id, grade, harga: nilai });
      toast.success("Grading tersimpan", { description: `${hasil.id} kini tampil di pencarian buyer.` });
      onSelesai({ kode: hasil.id, material: hasil.material, grade, harga: nilai });
    } catch (err) {
      toast.error("Gagal menyimpan grading", { description: err instanceof Error ? err.message : "Silakan coba lagi." });
    }
  }

  const memuat = gradeListing.isPending;

  return (
    <li>
      <form
        onSubmit={simpan}
        noValidate
        aria-busy={memuat}
        className="rounded-kartu permukaan p-w4 shadow-bal sm:p-w5"
      >
        <div className="flex items-start gap-w3">
          <MaterialSwatch material={listing.material} seed={listing.id} className="size-16 shrink-0" />
          <div className="min-w-0 flex-1">
            <span className="font-mono text-xs tracking-wide text-tinta-pudar">{listing.id}</span>
            <h2 className="judul-kecil mt-w1 text-lg leading-snug text-tinta">{listing.material}</h2>
            <div className="mt-w1 flex flex-wrap items-center gap-x-w3 gap-y-w1 text-sm text-tinta-pudar">
              <span className="inline-flex items-center gap-1">
                <Scale size={14} strokeWidth={1.8} aria-hidden="true" /> {formatBerat(listing.berat)}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} strokeWidth={1.8} aria-hidden="true" /> {listing.lokasi}
              </span>
            </div>
            <p className="mt-w1 text-sm text-tinta-pudar">
              {listing.pabrik} · {listing.umur}
            </p>
            {listing.catatan && <p className="mt-w1 text-sm text-tinta">Catatan: {listing.catatan}</p>}
          </div>
        </div>

        {/* items-start: a field with an error line must not stretch its neighbour. */}
        <div className="mt-w4 grid items-start gap-x-w3 gap-y-w3 sm:grid-cols-2">
          <Field label="Grade" required error={galat.grade}>
            {({ id, ...a11y }) => (
              <Select value={grade} onValueChange={(v) => setGrade(v as Grade)}>
                <SelectTrigger id={id} {...a11y} className="h-11 w-full bg-white">
                  <SelectValue placeholder="Pilih grade" />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {GRADE.map((g) => (
                    <SelectItem key={g} value={g}>
                      Grade {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </Field>

          <Field label="Harga per kg (Rp)" required error={galat.harga}>
            {(a11y) => (
              <Input
                {...a11y}
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                type="number"
                inputMode="numeric"
                min={1}
                step={1}
                placeholder="mis. 4500"
                className="bg-white"
              />
            )}
          </Field>
        </div>

        <div className="mt-w4 flex sm:justify-end">
          <button type="submit" disabled={memuat} className={cn(tombol(), "w-full sm:w-auto")}>
            {memuat ? (
              <>
                <JahitanMuat /> Menyimpan…
              </>
            ) : (
              "Simpan grading"
            )}
          </button>
        </div>
      </form>
    </li>
  );
}

export function AntreanGrading() {
  const { data, isPending, isError, refetch } = useAntreanGrading();
  const [selesai, setSelesai] = useState<Selesai[]>([]);

  return (
    <Halaman>
      <PageHeader
        eyebrow="Grading"
        title={
          isPending ? "Memuat antrean…" : isError ? "Antrean grading" : `${data?.length ?? 0} material menunggu grading`
        }
        description="Beri grade dan harga per kg. Setelah disimpan, material langsung tampil di pencarian buyer."
        action={<DataContoh />}
      />

      {selesai.length > 0 && (
        <ul className="mb-w4 space-y-w2" aria-label="Baru selesai digrading">
          {selesai.map((s) => (
            <li
              key={s.kode}
              role="status"
              className="flex flex-wrap items-center gap-x-w3 gap-y-w1 rounded-kartu bg-nila-1/35 px-w4 py-w3 text-sm text-tinta"
            >
              <CircleCheck size={18} strokeWidth={1.8} className="shrink-0 text-nila-6" aria-hidden="true" />
              <span className="font-mono font-semibold">{s.kode}</span>
              <span>
                {s.material}, grade {s.grade}, {formatRupiah(s.harga)}/kg. Sudah tampil untuk buyer.
              </span>
            </li>
          ))}
        </ul>
      )}

      {isPending ? (
        <BaleCardSkeletonGrid count={2} className="grid gap-w4 lg:grid-cols-2" />
      ) : isError ? (
        <ErrorState title="Antrean grading gagal dimuat" onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Antrean grading kosong"
          description="Semua material yang diunggah pabrik sudah dinilai. Unggahan baru muncul di sini untuk digrading."
        />
      ) : (
        <ul className="grid gap-w4 lg:grid-cols-2">
          {data.map((l) => (
            <BarisGrading key={l.id} listing={l} onSelesai={(s) => setSelesai((a) => [s, ...a])} />
          ))}
        </ul>
      )}
    </Halaman>
  );
}
