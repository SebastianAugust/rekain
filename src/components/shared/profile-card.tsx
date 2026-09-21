import { Halaman, PageHeader } from "@/components/brand/page-header";
import { BingkaiJahit } from "@/components/brand/stitch-line";
import { KLASTER, PERSONA } from "@/lib/session";
import type { Role } from "@/lib/types";

/*
  An account card cut like a woven garment label: the monogram on dyed ground,
  a seam sewn around the edge.
*/
export function ProfileCard({ role }: { role: Role }) {
  const persona = PERSONA[role];

  const rincian = [
    { label: "Jenis akun", nilai: persona.deskripsi },
    { label: "Klaster", nilai: KLASTER },
    { label: "Mode", nilai: "Prototipe — data tersimpan di browser ini" },
  ];

  return (
    <Halaman className="max-w-2xl">
      <PageHeader eyebrow="Profil" title="Akun Anda" />

      <div className="relative rounded-sm border border-garis permukaan px-w4 py-w5 shadow-panel">
        <BingkaiJahit />
        <div className="relative flex items-center gap-w4">
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-sm bg-nila-6 font-mono text-xl font-semibold text-white shadow-tombol"
            aria-hidden="true"
          >
            {persona.nama.charAt(0)}
          </span>
          <div className="min-w-0">
            <div className="judul-kecil text-lg text-tinta">{persona.nama}</div>
            <div className="mt-0.5 text-sm text-tinta-pudar">{persona.deskripsi}</div>
          </div>
        </div>

        <dl className="relative mt-w4 divide-y divide-garis border-t border-garis">
          {rincian.map((r) => (
            <div key={r.label} className="flex flex-wrap justify-between gap-x-w4 gap-y-w1 py-w2 text-sm">
              <dt className="text-tinta-pudar">{r.label}</dt>
              <dd className="font-medium text-tinta">{r.nilai}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Halaman>
  );
}
