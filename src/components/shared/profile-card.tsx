import { Eyebrow } from "@/components/brand/eyebrow";
import { KLASTER, PERSONA } from "@/lib/session";
import type { Role } from "@/lib/types";

export function ProfileCard({ role }: { role: Role }) {
  const persona = PERSONA[role];

  return (
    <div className="max-w-lg px-w4 py-w4 sm:px-w5">
      <Eyebrow className="mb-w2">Profil</Eyebrow>
      <h1 className="judul mb-w4 text-xl text-tinta">Akun Anda</h1>

      <div className="flex items-center gap-w4 rounded-sm border border-garis permukaan px-w4 py-w4">
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-nila-6 font-mono text-lg font-semibold text-white"
          aria-hidden="true"
        >
          {persona.nama.charAt(0)}
        </span>
        <div className="min-w-0">
          <div className="judul-kecil text-base text-tinta">{persona.nama}</div>
          <div className="mt-0.5 text-xs text-tinta-pudar">
            {persona.deskripsi} · {KLASTER}
          </div>
        </div>
      </div>
    </div>
  );
}
