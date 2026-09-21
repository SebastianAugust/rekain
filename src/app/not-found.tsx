import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { EmptyState } from "@/components/brand/empty-state";
import { tombol } from "@/components/brand/tombol";

/*
  Unmatched URLs. Next's built-in 404 is white, English, and unbranded — the one
  screen in the product that looked like a different product.
*/
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-garis permukaan">
        <div className="mx-auto flex max-w-6xl items-center px-w4 py-w3 sm:px-w5">
          <Link href="/" aria-label="ReKain — beranda" className="rounded-sm">
            <BrandMark />
          </Link>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-w4 py-w6">
        <p className="mb-w3 text-center font-mono text-xs tracking-widest text-nila-tinta uppercase">
          Kode 404
        </p>
        <EmptyState
          judul="h1"
          icon={PackageSearch}
          title="Halaman ini tidak ada di gudang kami"
          description="Tautannya mungkin salah ketik atau halamannya sudah dipindahkan."
          action={
            <div className="flex flex-wrap justify-center gap-w2">
              <Link href="/" className={tombol()}>
                Kembali ke beranda
              </Link>
              <Link href="/buyer" className={tombol({ nada: "garis" })}>
                Cari material
              </Link>
            </div>
          }
        />
      </main>
    </div>
  );
}
