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
export function StitchLine({
  className,
  seed = "jahitan",
  arah = "horizontal",
  warna = "#3880c0",
}: {
  className?: string;
  seed?: string;
  /** `vertikal` runs the seam top to bottom — e.g. down the inside of the sidebar. */
  arah?: "horizontal" | "vertikal";
  warna?: string;
}) {
  const langkah = LEBAR / JUMLAH;
  const naikTurun = jitter(seed, JUMLAH, 1.9);
  const panjang = jitter(`${seed}-panjang`, JUMLAH, 2.6);
  const tegak = arah === "vertikal";

  return (
    <svg
      className={cn("block", tegak ? "h-full" : "w-full", className)}
      width={tegak ? TINGGI : "100%"}
      height={tegak ? "100%" : TINGGI}
      viewBox={tegak ? `0 0 ${TINGGI} ${LEBAR}` : `0 0 ${LEBAR} ${TINGGI}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {naikTurun.map((dy, i) => {
        const along = i * langkah;
        const across = TINGGI / 2 + dy;
        const ujung = along + langkah * 0.62 + panjang[i];
        const miring = across + dy * 0.35;
        return (
          <line
            key={i}
            x1={tegak ? across : along}
            y1={tegak ? along : across}
            x2={tegak ? miring : ujung}
            y2={tegak ? ujung : miring}
            stroke={warna}
            strokeWidth={1.4}
            strokeLinecap="round"
            opacity={0.5}
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
    </svg>
  );
}

/*
  Irregular on purpose: a repeating 7-4 dash is a CSS border with extra steps.
  These run long and short the way a hand-fed seam does.
*/
const JAHIT_UTUH = "7 4 5 4.5 8 3.5 6 5";
/* The same seam with a stretch unpicked — used for errors: something came apart. */
const JAHIT_PUTUS = "7 4 5 4.5 8 3.5 6 5 7 4 5 4.5 8 3.5 6 46";

/**
 * A seam sewn around the inside of a panel, set in from its cut edge. Place in
 * a `relative` parent; the stitching follows whatever size that turns out to be.
 */
export function BingkaiJahit({
  putus,
  rapat,
  warna = "#3880c0",
}: {
  putus?: boolean;
  /** Sew 4px in from the edge instead of 8px — for small objects like a patch. */
  rapat?: boolean;
  warna?: string;
}) {
  /*
    The SVG sits in a positioned span rather than being positioned itself: an
    <svg> is a replaced element, so four insets alone would not stretch it.
  */
  return (
    <span
      className={cn("pointer-events-none absolute", rapat ? "inset-1" : "inset-w2")}
      aria-hidden="true"
    >
      <svg className="block size-full overflow-visible" focusable="false">
        <rect
          width="100%"
          height="100%"
          rx={1.5}
          fill="none"
          stroke={warna}
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeDasharray={putus ? JAHIT_PUTUS : JAHIT_UTUH}
          opacity={0.5}
        />
      </svg>
    </span>
  );
}
