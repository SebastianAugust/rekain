"use client";

import { BASELINE } from "@/lib/finance/asumsi";
import {
  BATAS_MASUKAN,
  DISKONTO_PILIHAN,
  MASUKAN_BAWAAN,
  type Masukan,
} from "@/lib/finance/skenario";
import { formatPersenPresisi, formatRupiah, formatTon } from "@/lib/format";
import { cn } from "@/lib/utils";
import { KendaliSlider } from "@/components/simulasi/kendali";

export function PanelAsumsi({
  masukan,
  ubah,
}: {
  masukan: Masukan;
  ubah: (parsial: Partial<Masukan>) => void;
}) {
  const volume = BASELINE.volumeTon.map((v) => formatTon(v * masukan.volumeFaktor, 0));

  return (
    <div className="space-y-w4">
      <KendaliSlider
        label="Harga rata-rata material"
        nilai={masukan.harga}
        ubah={(harga) => ubah({ harga })}
        batas={BATAS_MASUKAN.harga}
        dasar={MASUKAN_BAWAAN.harga}
        tampilkan={(v) => `${formatRupiah(v)}/kg`}
      />

      <KendaliSlider
        label="Biaya logistik dan handling"
        nilai={masukan.logistikPerKg}
        ubah={(logistikPerKg) => ubah({ logistikPerKg })}
        batas={BATAS_MASUKAN.logistikPerKg}
        dasar={MASUKAN_BAWAAN.logistikPerKg}
        tampilkan={(v) => `${formatRupiah(v)}/kg`}
        catatan={`Setara ${formatPersenPresisi(masukan.logistikPerKg / MASUKAN_BAWAAN.harga, 1)} GMV pada harga dasar.`}
      />

      <KendaliSlider
        label="Volume material"
        nilai={masukan.volumeFaktor}
        ubah={(volumeFaktor) => ubah({ volumeFaktor })}
        batas={BATAS_MASUKAN.volumeFaktor}
        dasar={MASUKAN_BAWAAN.volumeFaktor}
        tampilkan={(v) => `${Math.round(v * 100)}%`}
        catatan={`Tahun 1–3: ${volume.join(" / ")}.`}
      />

      <KendaliSlider
        label="Take rate komisi"
        nilai={masukan.komisi}
        ubah={(komisi) => ubah({ komisi })}
        batas={BATAS_MASUKAN.komisi}
        dasar={MASUKAN_BAWAAN.komisi}
        tampilkan={(v) => formatPersenPresisi(v, 1)}
      />

      <div className="space-y-1.5 border-t border-garis pt-w3">
        <div className="text-xs font-medium text-tinta-pudar" id="label-diskonto">
          Diskonto NPV
        </div>
        <div role="group" aria-labelledby="label-diskonto" className="grid grid-cols-3 gap-1">
          {DISKONTO_PILIHAN.map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={masukan.diskonto === d}
              onClick={() => ubah({ diskonto: d })}
              className={cn(
                "min-h-11 rounded-full px-w3 font-mono text-xs sm:min-h-0 sm:py-1.5",
                masukan.diskonto === d
                  ? "bg-nila-6 text-white"
                  : "border border-garis text-tinta-pudar hover:border-nila-3",
              )}
            >
              {Math.round(d * 100)}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
