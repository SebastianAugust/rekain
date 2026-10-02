import { Eyebrow } from "@/components/brand/eyebrow";

/*
  Numbered markers are the reflex move on a landing page and usually decorate
  nothing. They earn their place here: this genuinely is an ordered pipeline, a
  bale cannot reach escrow before it is graded, and the operator needs to know
  which station a lot is sitting at. So they are set as station codes rather than
  as oversized display numerals.
*/
const STASIUN = [
  { kode: "ST-01", t: "Pabrik unggah limbah", d: "Jenis material, berat, lokasi, kondisi." },
  { kode: "ST-02", t: "Penilaian mutu dan harga", d: "Grade kualitas dan harga pasar yang wajar." },
  { kode: "ST-03", t: "Pencocokan pembeli", d: "Ditawarkan ke buyer sesuai kebutuhan mereka." },
  { kode: "ST-04", t: "Logistik dan escrow", d: "Pengambilan barang dan pembayaran terjamin." },
  { kode: "ST-05", t: "Sampai ke buyer", d: "Recycler, upcycler, atau brand berkelanjutan." },
];

export function HowItWorks() {
  return (
    <section id="cara-kerja" className="scroll-mt-8">
      <Eyebrow className="mb-w2">Cara kerja</Eyebrow>
      <h2 className="judul mb-w5 max-w-2xl text-3xl text-tinta sm:text-5xl sm:leading-[1.08]">
        Dari gudang pabrik ke tangan buyer, lima stasiun
      </h2>


      <ol className="grid grid-cols-1 gap-w3 sm:grid-cols-2 lg:grid-cols-5">
        {STASIUN.map((s) => (
          <li key={s.kode} className="rounded-kartu permukaan p-w4 shadow-bal">
            <span className="inline-block rounded-full bg-nila-1 px-w2 py-1 font-mono text-xs tracking-wide text-nila-6">
              {s.kode}
            </span>
            <h3 className="judul-kecil mt-w3 text-lg text-tinta">{s.t}</h3>
            <p className="mt-w1 text-sm text-pretty text-tinta-pudar">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
