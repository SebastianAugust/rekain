/*
  The filter sprite. Mounted once in the root layout; everything else references
  these by id.

  Why the texture is generated rather than applied: putting `filter: url(#…)` on
  a live DOM element that contains copy is the standard way this goes wrong —
  it forces the whole subtree through the filter pipeline, which is expensive and
  destroys subpixel anti-aliasing on the text. So the filters here only ever
  paint a *separate* layer, which is then composited over the surface with
  `mix-blend-mode`. Type is never inside a filtered element.

  `colorInterpolationFilters="sRGB"` is not optional. Filters default to
  linearRGB, which washes turbulence out to a barely visible grey haze.
*/
export function TextileFilters() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {/*
          Uneven vat dye. Low frequency, slightly stretched vertically because
          cloth hangs in the vat and pools along its length. The colour matrix
          copies the red channel into RGB (keeping full variance rather than
          averaging three channels down) and forces alpha to 1, producing a
          mid-grey cloud that `mix-blend-mode: overlay` reads in both directions:
          above 0.5 lightens, below 0.5 darkens.
        */}
        <filter
          id="rk-celup"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011 0.026"
            numOctaves={4}
            seed={11}
            result="vat"
          />
          <feColorMatrix
            in="vat"
            type="matrix"
            values="1 0 0 0 0
                    1 0 0 0 0
                    1 0 0 0 0
                    0 0 0 0 1"
          />
        </filter>

        {/* Fine fibre grain — the weave itself, an order of magnitude finer. */}
        <filter
          id="rk-serat"
          x="0"
          y="0"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.86"
            numOctaves={3}
            seed={4}
            result="serat"
          />
          <feColorMatrix
            in="serat"
            type="matrix"
            values="1 0 0 0 0
                    1 0 0 0 0
                    1 0 0 0 0
                    0 0 0 0 1"
          />
        </filter>

        {/*
          Strata edges, vertical strip. The layers stack downward, so their
          boundaries are horizontal and need to fray along x — hence high
          x-frequency, low y-frequency, and displacement taken mostly from the
          green channel into y.
        */}
        <filter
          id="rk-tepi-v"
          x="-20%"
          y="-8%"
          width="140%"
          height="116%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.62 0.08"
            numOctaves={3}
            seed={19}
            result="t"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="t"
            scale={4.5}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>

        {/*
          The hero band is 1200 user units wide, so it needs a much lower
          frequency than the 18px strip to land on the same apparent wavelength —
          roughly one undulation every 20px rather than 700 cycles of noise.
          Displacement runs in both axes here: a wide cut face frays every way.
        */}
        <filter
          id="rk-tepi-pita"
          x="-6%"
          y="-14%"
          width="112%"
          height="128%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.055 0.28"
            numOctaves={3}
            seed={23}
            result="t"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="t"
            scale={3.2}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * The uneven-dye layer. Drop inside any element carrying `.celup` — it fills the
 * surface and mottles it. Never put this on a light ground; overlay on near-white
 * does almost nothing and just costs a paint.
 */
export function DyeWash({ halus }: { halus?: boolean }) {
  return (
    <svg
      className={halus ? "celup-wash celup-wash-halus" : "celup-wash"}
      aria-hidden="true"
      focusable="false"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <rect width="100%" height="100%" filter="url(#rk-celup)" />
    </svg>
  );
}

/** The fibre-grain layer. Weaker sibling of DyeWash; safe on light surfaces too. */
export function FibreWash() {
  return (
    <svg
      className="serat-wash"
      aria-hidden="true"
      focusable="false"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <rect width="100%" height="100%" filter="url(#rk-serat)" />
    </svg>
  );
}
