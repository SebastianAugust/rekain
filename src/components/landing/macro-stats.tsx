import { DataContoh } from "@/components/brand/data-contoh";
import { Eyebrow } from "@/components/brand/eyebrow";

/*
  These three numbers are the reason the business exists, so they get their own
  quiet strip rather than being stacked under the headline. A hero built out of
  one big number plus supporting stats is the stock answer; the pipeline band is
  a better one, and it leaves these free to read as what they are — a citation.
*/
const ANGKA = [
  { nilai: "2,3", satuan: "juta ton", label: "limbah tekstil Indonesia per tahun" },
  { nilai: "<15", satuan: "%", label: "porsi yang benar-benar didaur ulang" },
  { nilai: "1", satuan: "klaster", label: "percontohan — Bandung Raya" },
];

export function MacroStats() {
  return (
    <section aria-label="Skala masalah">
      <div className="mb-w4 flex flex-wrap items-center justify-between gap-w2">
        <Eyebrow>Skala masalahnya</Eyebrow>
        {/* TODO: cantumkan sumber yang bisa dikutip untuk ketiga angka ini. */}
        <DataContoh>Perkiraan, belum bersumber</DataContoh>
      </div>
      <dl className="grid grid-cols-1 gap-w3 sm:grid-cols-3 sm:gap-w4">
        {ANGKA.map((a) => (
          <div key={a.label} className="rounded-kartu permukaan px-w5 py-w5 shadow-bal">
            <dd className="judul text-5xl tabular-nums text-nila-6 sm:text-6xl">
              {a.nilai}
              <span className="ml-1.5 text-xl font-semibold tracking-normal text-tinta-pudar">{a.satuan}</span>
            </dd>
            <dt className="mt-w2 text-base text-tinta-pudar">{a.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
