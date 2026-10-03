import { Halaman, PageHeader } from "@/components/brand/page-header";
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
    { label: "Mode", nilai: "Prototipe — data dan pembayaran simulasi, kembali ke awal saat halaman dimuat ulang" },
  ];

  return (
    <Halaman className="max-w-2xl">
      <PageHeader eyebrow="Profil" title="Akun Anda" />

      <div className="relative rounded-kartu border border-garis permukaan px-w5 py-w5 shadow-bal">
        <div className="relative flex items-center gap-w4">
          <span
            className="flex size-16 shrink-0 items-center justify-center rounded-full bg-nila-6 text-2xl font-bold text-white shadow-tombol"
            aria-hidden="true"
          >
            {persona.nama.charAt(0)}
          </span>
          <div className="min-w-0">
            <div className="judul-kecil text-2xl text-tinta">{persona.nama}</div>
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
