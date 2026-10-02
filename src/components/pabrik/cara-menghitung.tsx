import { Calculator } from "lucide-react";

import { DataContoh } from "@/components/brand/data-contoh";
import { FAKTOR_DAMPAK, FAKTOR_DIPERBARUI } from "@/lib/dampak";
import { formatDesimal } from "@/lib/format";

/** The method card. Shown wherever an impact figure appears, so no number stands without its formula. */
export function CaraMenghitung() {
  const faktor = Object.values(FAKTOR_DAMPAK);
  const demo = faktor.some((f) => f.demo);

  return (
    <section aria-labelledby="cara-menghitung" className="rounded-kartu bg-awan p-w5">
      <div className="flex flex-wrap items-center justify-between gap-w2">
        <h2 id="cara-menghitung" className="judul-kecil flex items-center gap-w2 text-xl text-tinta">
          <Calculator size={20} strokeWidth={1.8} aria-hidden="true" /> Cara kami menghitung
        </h2>
        {demo && <DataContoh>Faktor contoh</DataContoh>}
      </div>
      <p className="mt-w3 text-tinta">
        Estimasi dampak per transaksi = <strong>berat (kg) x faktor per jenis serat</strong>. Limbah
        yang dialihkan dihitung sama dengan berat material yang terjual.
      </p>

      <div className="mt-w4 overflow-x-auto rounded-input bg-white">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <caption className="sr-only">Faktor estimasi per jenis serat</caption>
          <thead>
            <tr className="border-b border-garis text-left text-xs text-tinta-pudar">
              <th scope="col" className="px-w3 py-w2 font-medium">Serat</th>
              <th scope="col" className="px-w3 py-w2 font-medium">CO2e (kg per kg)</th>
              <th scope="col" className="px-w3 py-w2 font-medium">Air (L per kg)</th>
              <th scope="col" className="px-w3 py-w2 font-medium">Sumber, tahun</th>
            </tr>
          </thead>
          <tbody>
            {faktor.map((f) => (
              <tr key={f.serat} className="border-b border-garis last:border-b-0">
                <th scope="row" className="px-w3 py-w2 text-left font-medium text-tinta">{f.serat}</th>
                <td className="px-w3 py-w2 tabular-nums">{formatDesimal(f.co2ePerKg, 1)}</td>
                <td className="px-w3 py-w2 tabular-nums">{f.airLiterPerKg.toLocaleString("id-ID")}</td>
                <td className="px-w3 py-w2 text-tinta-pudar">{f.sumber}, {f.tahun}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-w3 text-sm text-tinta-pudar">
        Tabel faktor diperbarui {FAKTOR_DIPERBARUI}.{" "}
        {demo
          ? "Angka faktor saat ini adalah konstanta contoh dan belum bersumber, jadi seluruh hasilnya hanya untuk memperagakan tampilan."
          : ""}{" "}
        Ini estimasi dampak, bukan kredit karbon.
      </p>
    </section>
  );
}
