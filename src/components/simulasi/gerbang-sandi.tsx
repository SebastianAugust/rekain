"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { BingkaiJahit } from "@/components/brand/stitch-line";
import { DyeWash } from "@/components/brand/textile-filters";
import { tombol } from "@/components/brand/tombol";
import { Field } from "@/components/shared/field";
import { Input } from "@/components/ui/input";
import { bukaGerbang, type HasilGerbang } from "@/app/simulasi/gerbang";

const AWAL: HasilGerbang = {};

export function GerbangSandi({ belumDisetel }: { belumDisetel: boolean }) {
  const [hasil, kirim, menunggu] = useActionState(bukaGerbang, AWAL);

  return (
    <main className="celup di-nila relative flex min-h-dvh items-center justify-center overflow-hidden bg-nila-6 px-w4 py-w6">
      <DyeWash />

      <div className="di-atas-celup w-full max-w-sm">
        <div className="mb-w5 flex justify-center">
          <Logo putih />
        </div>

        <div className="di-kain relative rounded-kartu permukaan px-w5 py-w5 shadow-bal-angkat">
          <BingkaiJahit />

          <div className="relative">
            <div className="flex items-center gap-w2 text-nila-tinta">
              <Lock size={14} aria-hidden="true" />
              <span className="font-mono text-xs tracking-widest uppercase">
                Halaman internal
              </span>
            </div>

            <h1 className="judul mt-w3 text-lg text-tinta">Simulasi proyeksi bisnis</h1>
            <p className="mt-w2 text-sm text-tinta-pudar">
              Kalkulator skenario keuangan ReKain. Masukkan sandi untuk melanjutkan.
            </p>

            <form action={kirim} className="mt-w4 space-y-w3" noValidate>
              <Field label="Sandi" error={hasil.error} required>
                {(props) => (
                  <Input
                    {...props}
                    name="sandi"
                    type="password"
                    autoComplete="current-password"
                    autoFocus
                    disabled={belumDisetel}
                  />
                )}
              </Field>

              <button
                type="submit"
                disabled={menunggu || belumDisetel}
                className={tombol({ ukuran: "besar", penuh: true })}
              >
                {menunggu ? "Memeriksa…" : "Buka kalkulator"}
              </button>
            </form>

            {belumDisetel && (
              <p role="alert" className="mt-w3 text-xs text-benang">
                <code className="font-mono">SIMULASI_SANDI</code> belum diset. Tambahkan
                ke <code className="font-mono">.env.local</code>, lalu jalankan ulang dev
                server.
              </p>
            )}
          </div>
        </div>

        <p className="mt-w4 text-center text-xs text-nila-1">
          Tidak tertaut dari navigasi mana pun dan tidak diindeks mesin pencari.
        </p>
      </div>
    </main>
  );
}
