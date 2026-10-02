import { SWATCH } from "@/lib/data/seed";
import { buatLapisan, tataLapisan } from "@/lib/strata";
import type { MaterialKind } from "@/lib/types";
import { cn } from "@/lib/utils";

/*
  One swatch per fibre, drawn with CSS gradients so it costs no image request and
  prints as flat colour. The base hex is the same SWATCH colour the strata use;
  the texture on top is deliberately faint, readable at arm's length and never
  strong enough to compete with type beside it.
*/

const GARIS_TIPIS = (arah: string, warna: string, pitch: number) =>
  `repeating-linear-gradient(${arah}, ${warna} 0 1px, transparent 1px ${pitch}px)`;

function teksturMaterial(material: MaterialKind, seed: string): string {
  switch (material) {
    case "Cotton Cutting Scraps":
      // Plain weave: fine warp and weft lines on cream, with a soft light fall-off.
      return [
        "linear-gradient(135deg, rgb(255 255 255 / 0.35), transparent 55%)",
        GARIS_TIPIS("0deg", "rgb(110 90 60 / 0.16)", 4),
        GARIS_TIPIS("90deg", "rgb(110 90 60 / 0.12)", 4),
      ].join(", ");
    case "Denim Deadstock":
      // 3/1 twill ribs climbing right, plus faint warp streaks.
      return [
        "linear-gradient(160deg, rgb(255 255 255 / 0.12), transparent 60%)",
        "repeating-linear-gradient(63deg, rgb(255 255 255 / 0.16) 0 2px, transparent 2px 5px)",
        GARIS_TIPIS("90deg", "rgb(0 20 50 / 0.18)", 7),
      ].join(", ");
    case "Katun Campuran":
      // Heathered blend: light and dark flecks over a fine diagonal weave.
      return [
        "radial-gradient(rgb(90 70 40 / 0.24) 0.8px, transparent 1.3px) 0 0 / 6px 6px",
        "radial-gradient(rgb(255 255 255 / 0.4) 0.8px, transparent 1.3px) 3px 3px / 7px 7px",
        "repeating-linear-gradient(45deg, rgb(110 90 60 / 0.1) 0 1px, transparent 1px 4px)",
      ].join(", ");
    case "Reject Roll Ends": {
      // Cut face of mixed offcuts: the same seeded strata the bale strip used.
      const lapisan = tataLapisan(buatLapisan(seed, SWATCH[material], 9), 100);
      const stops = lapisan
        .map((l) => `${l.warna} ${l.mulai.toFixed(2)}% ${(l.mulai + l.panjang).toFixed(2)}%`)
        .join(", ");
      return [GARIS_TIPIS("0deg", "rgb(40 25 10 / 0.12)", 3), `linear-gradient(to bottom, ${stops})`].join(", ");
    }
  }
}

/**
 * Rounded material thumbnail. Size it with `className` (e.g. `size-16`); radius
 * defaults to the swatch radius and can be overridden the same way.
 */
export function MaterialSwatch({
  material,
  seed,
  className,
}: {
  material: MaterialKind;
  /** Seeds the strata of reject cloth; pass the grading code. */
  seed?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block size-14 shrink-0 rounded-thumb shadow-[inset_0_0_0_1px_rgb(16_56_104/0.1)]",
        className,
      )}
      style={{
        backgroundColor: SWATCH[material],
        backgroundImage: teksturMaterial(material, seed ?? material),
      }}
    />
  );
}
