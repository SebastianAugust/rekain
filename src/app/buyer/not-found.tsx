import Link from "next/link";
import { PackageX } from "lucide-react";

import { EmptyState } from "@/components/brand/empty-state";
import { Halaman } from "@/components/brand/page-header";
import { tombol } from "@/components/brand/tombol";

/*
  A material the buyer cannot open — an unknown code, a lot not graded yet, or
  one that has been withdrawn. Rendered inside the buyer shell so the navigation
  is still there, rather than dropping the buyer out onto a bare 404.
*/
export default function BuyerNotFound() {
  return (
    <Halaman className="max-w-xl">
      <EmptyState
        judul="h1"
        icon={PackageX}
        title="Material tidak ditemukan"
        description="Bal ini mungkin sudah ditarik, belum selesai dinilai, atau kodenya salah. Material lain di klaster Bandung masih tersedia."
        action={
          <Link href="/buyer" className={tombol()}>
            Kembali ke katalog
          </Link>
        }
      />
    </Halaman>
  );
}
