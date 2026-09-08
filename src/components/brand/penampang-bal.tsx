import { buatLapisan, jitter, jumlahLapisan, tataLapisan } from "@/lib/strata";

/*
  ── The signature element ─────────────────────────────────────────────────────

  A listing is not a card with a photo. It is a bale of compressed cloth seen in
  cross-section — the way it actually looks on a warehouse floor once it has been
  cut open. The strata carry real information: how many layers is a function of
  the weight, the colour mix is the material, and roughly one layer in eight is a
  contrasting fleck because bales are mixed offcuts.

  This is also the only place natural fibre colour is allowed to appear. It is
  penned into an 18px binding edge; every frame, badge and rule around it stays
  on the dip ladder, so the material reads as data and the chrome stays brand.
*/

/** Strip geometry in user units. The SVG stretches vertically over this. */
const TINGGI_STRIP = 200;
const LEBAR_STRIP = 18;

export function PenampangBal({
  seed,
  dasar,
  berat,
  lebar = LEBAR_STRIP,
}: {
  /** Grading code — seeds the layout, so the same listing always looks the same. */
  seed: string;
  /** The material's true colour. */
  dasar: string;
  berat: number;
  lebar?: number;
}) {
  const lapisan = tataLapisan(buatLapisan(seed, dasar, jumlahLapisan(berat)), TINGGI_STRIP);

  /*
    Absolutely positioned, not a flex child. As a flex child the strip would have
    to be measured to size the row, but its own height is `100%` of that row —
    a circular dependency that SVG resolves by falling back to its 150px default
    intrinsic size, which silently stretches every card in the grid. Taking it
    out of flow removes the cycle: the copy alone sets the card's height and the
    strip simply spans whatever that turns out to be.
  */
  return (
    <div className="absolute inset-y-0 left-0" style={{ width: lebar }} aria-hidden="true">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${lebar} ${TINGGI_STRIP}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        <g className="bal-strata">
          {/*
            Layers overhang the strip on both sides so the displacement filter
            never pulls a transparent notch in at the edges.
          */}
          <g filter="url(#rk-tepi-v)">
            {lapisan.map((l) => (
              <rect
                key={l.mulai}
                x={-4}
                y={l.mulai}
                width={lebar + 8}
                height={l.panjang + 0.7}
                fill={l.warna}
              />
            ))}
          </g>

          {/*
            The separators are what decompress on hover: nearly invisible at
            rest, opening into visible gaps as the stack loosens.
          */}
          <g className="bal-renggang" stroke="#ffffff" strokeWidth={1.1}>
            {lapisan.slice(1).map((l) => (
              <line key={l.mulai} x1={0} y1={l.mulai} x2={lebar} y2={l.mulai} />
            ))}
          </g>
        </g>

        {/* Selvedge guard thread — one of only two warm marks in the whole app. */}
        <line x1={0.5} y1={0} x2={0.5} y2={TINGGI_STRIP} stroke="#a63a2c" strokeWidth={1} />
      </svg>
    </div>
  );
}

export type BalPita = {
  id: string;
  berat: number;
  swatch: string;
};

const PITA_W = 1200;
const PITA_H = 118;
/** Where the cloth met the surface of the vat, as a fraction of band height. */
const GARIS_AIR = 0.44;

/**
 * The hero band: a row of real bales in cross-section, each column's width
 * proportional to its actual weight, the lower part still submerged in the vat.
 *
 * The waterline is a jittered path pushed through a displacement filter, not a
 * linear-gradient. A soft blue-to-blue gradient is the single most templated
 * move available here, and it would undo the whole texture argument.
 */
export function PitaPenampang({
  bal,
  terendam = true,
  tinggi = PITA_H,
}: {
  bal: BalPita[];
  /**
   * Whether the lower part is still in the vat. On the hero this is the whole
   * point; on a material detail page it is switched off, because a buyer
   * inspecting one lot needs to see the cloth, not the dye over it.
   */
  terendam?: boolean;
  tinggi?: number;
}) {
  const totalBerat = bal.reduce((sum, b) => sum + b.berat, 0) || 1;

  /*
    Each column is as wide as its bale is heavy. Offsets are derived from the
    weights ahead of each item rather than accumulated in a closure variable —
    React Compiler rejects reassignment inside a render callback, and with at
    most a handful of bales the quadratic walk costs nothing.
  */
  const kolom = bal.map((b, i) => {
    const sebelumnya = bal.slice(0, i).reduce((sum, o) => sum + o.berat, 0);
    return {
      ...b,
      x: (sebelumnya / totalBerat) * PITA_W,
      w: (b.berat / totalBerat) * PITA_W,
    };
  });

  // 26 sample points across the band, each nudged off the true waterline.
  const goyang = jitter("garis-air", 27, 6.5);
  const yDasar = PITA_H * GARIS_AIR;
  const titik = goyang.map((d, i) => ({
    x: (i / (goyang.length - 1)) * PITA_W,
    y: yDasar + d,
  }));

  const garisAir = titik.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const bidangTerendam = `${garisAir} L${PITA_W},${PITA_H} L0,${PITA_H} Z`;

  return (
    <svg
      width="100%"
      height={tinggi}
      viewBox={`0 0 ${PITA_W} ${PITA_H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={{ display: "block", isolation: "isolate" }}
    >
      <g filter="url(#rk-tepi-pita)">
        {kolom.map((k, i) => {
          /*
            Denser than the 18px card strip: at this size a bale needs enough
            layers to read as compressed cloth rather than as a colour wash, and
            the hairlines between them are what make the compression legible.
          */
          const lapisan = tataLapisan(
            buatLapisan(k.id, k.swatch, Math.round(jumlahLapisan(k.berat) * 1.6)),
            PITA_H,
          );
          return (
            <g key={k.id} className="mengendap" style={{ animationDelay: `${i * 55}ms` }}>
              {lapisan.map((l) => (
                <rect
                  key={l.mulai}
                  x={k.x - 2}
                  y={l.mulai}
                  width={k.w + 4}
                  height={l.panjang + 0.8}
                  fill={l.warna}
                />
              ))}
              <g stroke="#1a1208" strokeWidth={0.7} strokeOpacity={0.22}>
                {lapisan.slice(1).map((l) => (
                  <line key={l.mulai} x1={k.x} y1={l.mulai} x2={k.x + k.w} y2={l.mulai} />
                ))}
              </g>
              {/* Bales are baled separately: a hard seam where two lots meet. */}
              <line
                x1={k.x + k.w}
                y1={0}
                x2={k.x + k.w}
                y2={PITA_H}
                stroke="#101c2b"
                strokeWidth={1.2}
                strokeOpacity={0.35}
              />
            </g>
          );
        })}
      </g>

      {terendam && (
        <>
          {/* Everything below the waterline is still in the vat. */}
          <path d={bidangTerendam} fill="#103868" opacity={0.72} />
          {/* Dye concentrates and dries darker exactly at the tide mark. */}
          <path d={garisAir} fill="none" stroke="#003060" strokeWidth={1.5} opacity={0.55} />
        </>
      )}
      {/* Guard thread along the cut edge. */}
      <line x1={0} y1={PITA_H - 0.5} x2={PITA_W} y2={PITA_H - 0.5} stroke="#a63a2c" strokeWidth={1} />
    </svg>
  );
}
