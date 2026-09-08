"use client";

import { Heart } from "lucide-react";

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
      onClick={() => toggle.mutate(listingId)}
      aria-pressed={disimpan}
      aria-label={
        disimpan ? `Hapus ${materialLabel} dari favorit` : `Simpan ${materialLabel} ke favorit`
      }
      className="p-1 text-tinta-pudar hover:text-benang"
    >
      <Heart
        size={15}
        aria-hidden="true"
        className={cn(disimpan && "fill-benang text-benang")}
      />
    </button>
  );
}
