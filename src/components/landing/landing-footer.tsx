import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { DyeWash } from "@/components/brand/textile-filters";

/** Dyed ground, bookending the hero — the page opens and closes in the vat. */
export function LandingFooter() {
  return (
    <footer className="celup di-nila relative mx-w3 mb-w3 overflow-hidden rounded-[2rem] bg-nila-6 sm:mx-w4 lg:mx-auto lg:max-w-[1190px]">
      <DyeWash />
      <div className="di-atas-celup mx-auto flex flex-col gap-w4 px-w5 py-w6 sm:flex-row sm:items-center sm:justify-between sm:px-w6">
        <Logo putih />
        <div className="flex max-w-md flex-col gap-w2">
          <p className="text-sm text-nila-1">
            Prototipe business plan. Form dan alurnya berfungsi penuh, tetapi data hanya
            tersimpan di browser Anda selama sesi ini.
          </p>
          {/* Internal tool. In production this sits behind a staff role, not a footer link. */}
          <Link
            href="/ops"
            className="inline-flex min-h-11 items-center self-start rounded-full text-sm font-medium text-white underline underline-offset-2 hover:text-nila-1"
          >
            Masuk panel Ops (internal)
          </Link>
        </div>
      </div>
    </footer>
  );
}
