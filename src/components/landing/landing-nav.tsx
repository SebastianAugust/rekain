import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";

const SECTIONS = [
  { href: "#untuk-pabrik", label: "Untuk Pabrik" },
  { href: "#untuk-buyer", label: "Untuk Buyer" },
  { href: "#cara-kerja", label: "Cara Kerja" },
];

export function LandingNav() {
  return (
    <header className="border-b border-garis permukaan">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-w4 px-w4 py-w3 sm:px-w5">
        <Link href="/" aria-label="ReKain — beranda">
          <BrandMark />
        </Link>

        <nav
          aria-label="Bagian halaman"
          className="hidden items-center gap-w6 text-sm text-tinta-pudar lg:flex"
        >
          {SECTIONS.map((s) => (
            <a key={s.href} href={s.href} className="hover:text-nila-tinta">
              {s.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-w2">
          <Link
            href="/pabrik"
            className="rounded-sm px-w3 py-1.5 text-xs font-medium text-nila-tinta hover:underline sm:text-sm"
          >
            Masuk Pabrik
          </Link>
          <Link
            href="/buyer"
            className="rounded-sm bg-nila-6 px-w3 py-1.5 text-xs font-medium text-white hover:bg-nila-9 sm:text-sm"
          >
            Masuk Buyer
          </Link>
        </div>
      </div>
    </header>
  );
}
