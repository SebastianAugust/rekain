import type { LucideIcon } from "lucide-react";

import { Eyebrow } from "@/components/brand/eyebrow";
import { DyeWash } from "@/components/brand/textile-filters";
import { cn } from "@/lib/utils";

/**
 * Stat tile: the figure is the tile. Large, tight, set in the display face.
 *
 * `utama` marks the one tile that leads the screen: dyed indigo with the denim
 * wash, so the eye lands there first and the other tiles stay quiet white cloth.
 */
export function StatCard({
  label,
  value,
  satuan,
  catatan,
  icon: Icon,
  utama,
  className,
}: {
  label: string;
  value: string | number;
  /** Unit set small beside the figure, e.g. "kg". */
  satuan?: string;
  catatan?: string;
  icon?: LucideIcon;
  utama?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative min-w-0 rounded-kartu px-w4 py-w4 sm:px-w5",
        utama ? "celup di-nila overflow-hidden bg-nila-6 text-white" : "permukaan shadow-bal",
        className,
      )}
    >
      {utama && <DyeWash />}
      <div className={cn("flex items-start justify-between gap-w2", utama && "di-atas-celup")}>
        <Eyebrow className={cn("mb-w3", utama && "text-nila-1")}>{label}</Eyebrow>
        {Icon && (
          <Icon
            size={20}
            strokeWidth={1.8}
            className={cn("shrink-0", utama ? "text-nila-1" : "text-nila-3")}
            aria-hidden="true"
          />
        )}
      </div>
      <div
        className={cn(
          "judul font-bold tabular-nums whitespace-nowrap",
          utama ? "di-atas-celup text-5xl sm:text-6xl" : "text-3xl text-tinta sm:text-4xl",
        )}
      >
        {value}
        {satuan && (
          <span
            className={cn(
              "ml-1.5 text-base font-semibold tracking-normal sm:text-lg",
              utama ? "text-nila-1" : "text-tinta-pudar",
            )}
          >
            {satuan}
          </span>
        )}
      </div>
      {catatan && (
        <p className={cn("mt-w2 text-sm", utama ? "di-atas-celup text-nila-1" : "text-tinta-pudar")}>
          {catatan}
        </p>
      )}
    </div>
  );
}
