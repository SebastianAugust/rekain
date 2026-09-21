import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { DyeWash } from "@/components/brand/textile-filters";

/** Dyed ground, bookending the hero — the page opens and closes in the vat. */
export function LandingFooter() {
  return (
    <footer className="celup di-nila relative overflow-hidden bg-nila-6">
      <DyeWash />
      <div className="di-atas-celup mx-auto flex max-w-6xl flex-col gap-w3 px-w4 py-w5 sm:flex-row sm:items-center sm:justify-between sm:px-w5">
        <BrandMark tone="dark" />
        <div className="flex max-w-md flex-col gap-w2">
          <p className="text-xs text-nila-1">
            Prototipe business plan. Form dan alurnya berfungsi penuh, tetapi data hanya
            tersimpan di browser Anda selama sesi ini.
          </p>
          {/* Internal tool. In production this sits behind a staff role, not a footer link. */}
          <Link
            href="/ops"
            className="self-start rounded-sm text-xs font-medium text-white underline underline-offset-2 hover:text-nila-1"
          >
            Masuk panel Ops (internal)
          </Link>
        </div>
      </div>
    </footer>
  );
}
