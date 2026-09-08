import { jitter } from "@/lib/strata";
import { cn } from "@/lib/utils";

const LEBAR = 1200;
const TINGGI = 9;
const JUMLAH = 96;

/**
 * A sewn seam. Every stitch sits a fraction off the line and runs a fraction
 * long or short, because a real seam is sewn by a person feeding cloth through a
 * machine. `border-dashed` is the alternative, and it is perfectly, uniformly,
 * unmistakably machine-drawn — which is the tell this whole design is avoiding.
 *
 * Jitter is seeded, so the seam is identical on the server and in the browser.
 */
export function StitchLine({ className, seed = "jahitan" }: { className?: string; seed?: string }) {
  const langkah = LEBAR / JUMLAH;
  const naikTurun = jitter(seed, JUMLAH, 1.9);
  const panjang = jitter(`${seed}-panjang`, JUMLAH, 2.6);

  return (
    <svg
      className={cn("block w-full", className)}
      width="100%"
      height={TINGGI}
      viewBox={`0 0 ${LEBAR} ${TINGGI}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {naikTurun.map((dy, i) => {
        const x = i * langkah;
        const y = TINGGI / 2 + dy;
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x + langkah * 0.62 + panjang[i]}
            y2={y + dy * 0.35}
            stroke="#3880c0"
            strokeWidth={1.4}
            strokeLinecap="round"
            opacity={0.5}
          />
        );
      })}
    </svg>
  );
}
