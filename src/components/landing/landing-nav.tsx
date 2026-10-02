import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { tombol } from "@/components/brand/tombol";

const SECTIONS = [
  { href: "#untuk-pabrik", label: "Untuk Pabrik" },
  { href: "#untuk-buyer", label: "Untuk Buyer" },
  { href: "#cara-kerja", label: "Cara Kerja" },
];

export function LandingNav() {
  return (
    <header className="pt-(--aman-atas)">
      <div className="mx-auto flex max-w-[1190px] items-center justify-between gap-w4 px-w4 py-w3 sm:px-w5">
        <Link href="/" aria-label="ReKain — beranda" className="rounded-input">
          <Logo />
        </Link>

        {/* From `md`, not `lg`: a tablet had no way to reach these at all. */}
        <nav
          aria-label="Bagian halaman"
          className="hidden items-center gap-w5 text-sm text-tinta-pudar md:flex"
        >
          {SECTIONS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="inline-flex min-h-11 items-center rounded-full px-w3 hover:bg-awan hover:text-tinta"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-w2">
          <Link
            href="/pabrik"
            className="inline-flex min-h-11 items-center rounded-full px-w3 text-sm font-semibold text-nila-tinta hover:bg-awan"
          >
            Masuk Pabrik
          </Link>
          <Link href="/buyer" className={tombol({ ukuran: "kecil" })}>
            Masuk Buyer
          </Link>
        </div>
      </div>
    </header>
  );
}
