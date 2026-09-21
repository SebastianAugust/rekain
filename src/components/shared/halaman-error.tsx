"use client";

import { ErrorState } from "@/components/brand/empty-state";
import { Halaman } from "@/components/brand/page-header";

/**
 * Body of every `error.tsx`. Placed per role segment, the boundary sits inside
 * that segment's layout, so a crash in a page keeps the sidebar and tab bar —
 * the user can still navigate away instead of being stranded.
 */
export function HalamanError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <Halaman className="max-w-xl">
      <ErrorState
        title="Halaman ini gagal ditampilkan"
        description="Terjadi kesalahan saat menyiapkan tampilan. Tidak ada data yang hilang — coba muat ulang."
        onRetry={retry}
      />
    </Halaman>
  );
}
