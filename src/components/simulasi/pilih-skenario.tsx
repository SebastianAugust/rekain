"use client";

import { AlertTriangle, Printer, RotateCcw } from "lucide-react";

import { tombol } from "@/components/brand/tombol";
import { type NamaSkenario, SKENARIO, URUTAN_SKENARIO } from "@/lib/finance/skenario";
import { cn } from "@/lib/utils";

export function PilihSkenario({
  aktif,
  pilih,
  reset,
}: {
  /** `null` berarti user sudah menggeser sendiri — tidak ada preset yang cocok. */
  aktif: NamaSkenario | null;
  pilih: (nama: NamaSkenario) => void;
  reset: () => void;
}) {
  const keterangan = aktif ? SKENARIO[aktif] : null;

  return (
    <div className="space-y-w3">
      <div className="flex flex-wrap items-center gap-w2">
        <div
          role="group"
          aria-label="Preset skenario"
          className="flex flex-wrap gap-w2"
        >
          {URUTAN_SKENARIO.map((nama) => {
            const skenario = SKENARIO[nama];
            const dipilih = aktif === nama;
            return (
              <button
                key={nama}
                type="button"
                onClick={() => pilih(nama)}
                aria-pressed={dipilih}
                className={cn(
                  tombol({ nada: dipilih ? "utama" : "garis", ukuran: "kecil" }),
                  "gap-1.5",
                )}
              >
                {skenario.asumsiTim && (
                  <AlertTriangle
                    size={11}
                    aria-hidden="true"
                    className={dipilih ? "text-nila-1" : "text-benang"}
                  />
                )}
                {skenario.label}
                {skenario.asumsiTim && <span className="font-normal">· asumsi tim</span>}
              </button>
            );
          })}
        </div>

        <div className="ms-auto flex flex-wrap gap-w2 cetak-sembunyi">
          <button
            type="button"
            onClick={reset}
            className={tombol({ nada: "garis", ukuran: "kecil" })}
          >
            <RotateCcw size={12} aria-hidden="true" />
            Reset ke Moderat
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className={tombol({ nada: "garis", ukuran: "kecil" })}
          >
            <Printer size={12} aria-hidden="true" />
            Cetak
          </button>
        </div>
      </div>

      <p className="text-xs text-tinta-pudar" role="status" aria-live="polite">
        {keterangan ? (
          <>
            <span className="font-medium text-tinta">{keterangan.ringkas}.</span>{" "}
            {keterangan.asumsiTim && (
              <span className="text-benang">Asumsi tim, bukan angka proposal. </span>
            )}
            {keterangan.sumber}
          </>
        ) : (
          <>
            <span className="font-medium text-tinta">Skenario kustom.</span> Asumsi
            sudah digeser dari preset — tekan “Reset ke Moderat” untuk kembali ke
            angka Tabel 4.1–4.5.
          </>
        )}
      </p>
    </div>
  );
}
