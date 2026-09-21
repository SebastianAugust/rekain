"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import { useFavorit, useToggleFavorit } from "@/lib/data/hooks";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  listingId,
  materialLabel,
}: {
  listingId: string;
  materialLabel: string;
}) {
  const { data: favorit } = useFavorit();
  const toggle = useToggleFavorit();

  const disimpan = favorit?.includes(listingId) ?? false;

  return (
    <button
      type="button"
      onClick={() =>
        toggle.mutate(listingId, {
          onError: () =>
            toast.error("Favorit belum tersimpan", { description: "Silakan coba lagi." }),
        })
      }
      aria-pressed={disimpan}
      aria-label={
        disimpan ? `Hapus ${materialLabel} dari favorit` : `Simpan ${materialLabel} ke favorit`
      }
      /* 32px target: the 23px glyph-sized button fell under WCAG 2.5.8's 24px floor. */
      className="tekan flex size-8 items-center justify-center rounded-sm text-tinta-pudar hover:bg-benang/8 hover:text-benang"
    >
      <Heart
        size={16}
        aria-hidden="true"
        className={cn(
          "transition-transform duration-200",
          disimpan && "scale-110 fill-benang text-benang",
        )}
      />
    </button>
  );
}
