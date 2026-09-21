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
    <section aria-label="Skala masalah" className="rounded-sm border border-garis permukaan">
      <div className="px-w4 pt-w3">
        <Eyebrow>Skala masalahnya</Eyebrow>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-3">
        {ANGKA.map((a) => (
          <div key={a.label} className="border-t border-garis px-w4 py-w3 sm:border-t-0 sm:border-l sm:first:border-l-0">
            <dd className="font-mono text-3xl font-semibold text-nila-6">
              {a.nilai}
              <span className="ml-1 text-base font-normal text-tinta-pudar">{a.satuan}</span>
            </dd>
            <dt className="mt-w1 text-sm text-tinta-pudar">{a.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
