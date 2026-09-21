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
          Twill wale. Denim is a 3/1 twill: the weft passes under three warp
          threads and over one, and the offset steps each row, so the face shows
          fine diagonal ribs climbing to the right. A 5px repeat with a 2px rib
          rotated to the classic ~63° of a right-hand twill.
        */}
        <pattern
          id="rk-kepar"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(27)"
        >
          <rect width="2" height="5" fill="#ffffff" />
        </pattern>

        {/*
          Indigo denim, as one grey overlay layer. Three things real denim shows,
          summed around mid-grey so `mix-blend-mode: overlay` both lightens and
          darkens:

          1. The twill ribs above, pushed through low-amplitude displacement so
             they wander the way yarn under tension does instead of ruling
             perfectly straight.
          2. Slub streaks along the warp. Indigo only dyes the outside of a yarn
             (ring dyeing), and slub yarn varies in thickness, so a denim face is
             streaked lengthwise — high x-frequency, very low y-frequency.
          3. Vat mottling — the slow cloud that uneven dipping leaves behind.
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
            baseFrequency="0.035 0.21"
            numOctaves={2}
            seed={7}
            result="goyang"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="goyang"
            scale={2.6}
            xChannelSelector="R"
            yChannelSelector="G"
            result="kepar-mentah"
          />
          {/* Pattern alpha becomes a 0/1 grey value with an opaque alpha. */}
          <feColorMatrix
            in="kepar-mentah"
            type="matrix"
            values="0 0 0 1 0
                    0 0 0 1 0
                    0 0 0 1 0
                    0 0 0 0 1"
            result="kepar"
          />

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.42 0.008"
            numOctaves={2}
            seed={5}
            result="slub-mentah"
          />
          <feColorMatrix
            in="slub-mentah"
            type="matrix"
            values="1 0 0 0 0
                    1 0 0 0 0
                    1 0 0 0 0
                    0 0 0 0 1"
            result="slub"
          />

          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0065 0.017"
            numOctaves={3}
            seed={11}
            result="awan-mentah"
          />
          <feColorMatrix
            in="awan-mentah"
            type="matrix"
            values="1 0 0 0 0
                    1 0 0 0 0
                    1 0 0 0 0
                    0 0 0 0 1"
            result="awan"
          />

          {/* 0.5 + 0.18·(rib − 0.5) + 0.62·(slub − 0.5) */}
          <feComposite
            in="kepar"
            in2="slub"
            operator="arithmetic"
            k2={0.18}
            k3={0.62}
            k4={0.1}
            result="tenun"
          />
          {/* … + 0.8·(vat − 0.5) */}
          <feComposite
            in="tenun"
            in2="awan"
            operator="arithmetic"
            k2={1}
            k3={0.8}
            k4={-0.4}
            result="denim"
          />
          <feColorMatrix
            in="denim"
            type="matrix"
            values="1 0 0 0 0
                    1 0 0 0 0
                    1 0 0 0 0
                    0 0 0 0 1"
          />
        </filter>

        {/*
          Dye wicking. Cloth pulled out of a vat does not have a clean tide mark:
          dye climbs the threads by capillary action, higher up some yarns than
          others. Displacing the submerged shape in y with noise that changes fast
          across x and hardly at all down y draws exactly that — fine fingers of
          blue creeping up the cut face.
        */}
        <filter
          id="rk-rembes"
          x="-2%"
          y="-40%"
          width="104%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          {/*
            Two octaves, not three, and a gentle scale: the third octave and a
            16-unit push turned the tide mark into a row of grass blades.
          */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.07 0.02"
            numOctaves={2}
            seed={29}
            result="t"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="t"
            scale={7}
            xChannelSelector="A"
            yChannelSelector="R"
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
 * The denim layer. Drop inside any element carrying `.celup` — it fills the
 * surface and weaves it. Never put this on a light ground; overlay on near-white
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
      <rect width="100%" height="100%" fill="url(#rk-kepar)" filter="url(#rk-celup)" />
    </svg>
  );
}
