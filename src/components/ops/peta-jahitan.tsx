import { jitter } from "@/lib/strata";
import type { Perhentian, Titik } from "@/lib/types";

/*
  A route drawn as a seam.

  A collection run is a needle passing through the cluster: it enters at each
  factory, and the thread between the punctures is the road. So the polyline is
  sewn rather than stroked — same seeded-jitter stitching used elsewhere in the
  product, applied here to a path that is entirely determined by real
  coordinates. Change the truck size and the seam re-routes, because the geometry
  underneath it is real.

  The projection is isotropic: one scale for both axes, with longitude
  compressed by cos(latitude). A map that stretched to fill the box would be
  drawing angles that do not exist on the ground.
*/

/*
  The Bandung belt is about 1.4 times wider than it is tall, so a wide banner
  viewBox would letterbox the drawing down to a third of the box on a phone.
  These proportions sit close to the data's own, which is what keeps the seam
  large enough to read without ever distorting the geography.
*/
const W = 480;
const H = 300;
const PAD = 26;

type Pt = { x: number; y: number };

function buatProyeksi(semua: Titik[]): (t: Titik) => Pt {
  const lats = semua.map((t) => t.lat);
  const lngs = semua.map((t) => t.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  const midLat = (minLat + maxLat) / 2;
  const kx = Math.cos((midLat * Math.PI) / 180);

  const spanX = (maxLng - minLng) * kx;
  const spanY = maxLat - minLat;

  // Every point in the same place: nothing to scale, just centre it.
  if (spanX < 1e-9 && spanY < 1e-9) {
    return () => ({ x: W / 2, y: H / 2 });
  }

  const skala = Math.min(
    spanX > 1e-9 ? (W - 2 * PAD) / spanX : Infinity,
    spanY > 1e-9 ? (H - 2 * PAD) / spanY : Infinity,
  );

  const offX = (W - spanX * skala) / 2;
  const offY = (H - spanY * skala) / 2;

  return (t) => ({
    x: offX + (t.lng - minLng) * kx * skala,
    y: offY + (maxLat - t.lat) * skala,
  });
}

type Jahitan = { x1: number; y1: number; x2: number; y2: number };

/** One leg of the route, broken into individual stitches that sit slightly off the line. */
function jahitSegmen(a: Pt, b: Pt, seed: string): Jahitan[] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const panjang = Math.hypot(dx, dy);
  if (panjang < 0.5) return [];

  const jumlah = Math.max(2, Math.round(panjang / 11));
  const ux = dx / panjang;
  const uy = dy / panjang;
  // Perpendicular, so the wobble is across the thread rather than along it.
  const px = -uy;
  const py = ux;

  const geser = jitter(seed, jumlah, 1.5);
  const ragam = jitter(`${seed}-panjang`, jumlah, 1.5);

  return Array.from({ length: jumlah }, (_, i) => {
    const mulai = (i / jumlah) * panjang;
    const jahit = Math.max(2.5, (panjang / jumlah) * 0.62 + ragam[i]);
    const o = geser[i];
    return {
      x1: a.x + ux * mulai + px * o,
      y1: a.y + uy * mulai + py * o,
      x2: a.x + ux * (mulai + jahit) + px * o,
      y2: a.y + uy * (mulai + jahit) + py * o,
    };
  });
}

export function PetaJahitan({
  depot,
  perhentian,
  ruteId,
  bingkai,
}: {
  depot: Titik;
  perhentian: Perhentian[];
  /** Seeds the stitching, so each route has its own hand but never changes. */
  ruteId: string;
  /**
   * Every point in the whole plan, so all route maps share one frame and one
   * scale. Fitting each card to its own stops would silently redraw the cluster
   * at a different zoom per card, making a two-kilometre hop and a twenty-five
   * kilometre run look identical.
   */
  bingkai: Titik[];
}) {
  const proyeksi = buatProyeksi(bingkai.length > 0 ? bingkai : [depot]);
  const pDepot = proyeksi(depot);
  const titik = perhentian.map((p) => ({ ...p, pos: proyeksi(p.titik) }));

  /*
    Every other pickup in the plan, drawn faintly. A shared frame leaves each
    route sitting in one corner of an empty box; showing the rest of the cluster
    turns that emptiness into the answer to the dispatcher's actual question —
    where in the belt does this truck work, and what is it leaving to others.
  */
  const milikSendiri = new Set(perhentian.map((p) => `${p.titik.lat},${p.titik.lng}`));
  const konteks = bingkai
    .filter((t) => {
      const kunci = `${t.lat},${t.lng}`;
      const iniDepot = t.lat === depot.lat && t.lng === depot.lng;
      return !iniDepot && !milikSendiri.has(kunci);
    })
    .filter(
      (t, i, arr) => arr.findIndex((o) => o.lat === t.lat && o.lng === t.lng) === i,
    )
    .map((t) => ({ kunci: `${t.lat},${t.lng}`, pos: proyeksi(t) }));

  const kaki: { jahitan: Jahitan[]; pulang: boolean }[] = [];
  let sebelumnya = pDepot;
  titik.forEach((t, i) => {
    kaki.push({ jahitan: jahitSegmen(sebelumnya, t.pos, `${ruteId}-${i}`), pulang: false });
    sebelumnya = t.pos;
  });
  if (titik.length > 0) {
    kaki.push({ jahitan: jahitSegmen(sebelumnya, pDepot, `${ruteId}-pulang`), pulang: true });
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      /* The parent sets an explicit height, so percentages resolve; `meet` keeps
         the projection isotropic and letterboxes rather than distorting it. */
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {konteks.map((t) => (
        <circle key={t.kunci} cx={t.pos.x} cy={t.pos.y} r={3} fill="#3880c0" opacity={0.28} />
      ))}

      {kaki.map((k, i) => (
        <g
          key={i}
          stroke={k.pulang ? "#3880c0" : "#103868"}
          strokeWidth={k.pulang ? 1.3 : 1.7}
          strokeLinecap="round"
          /* The run home is empty, so its thread is lighter. */
          opacity={k.pulang ? 0.45 : 0.9}
        >
          {k.jahitan.map((j, n) => (
            <line key={n} x1={j.x1} y1={j.y1} x2={j.x2} y2={j.y2} />
          ))}
        </g>
      ))}

      {/* Depot: a square knot where the thread is anchored. */}
      <rect
        x={pDepot.x - 6}
        y={pDepot.y - 6}
        width={12}
        height={12}
        rx={1.5}
        fill="#003060"
        stroke="#ffffff"
        strokeWidth={1.5}
      />

      {titik.map((t) => (
        <g key={`${t.pabrik}-${t.urutan}`}>
          <circle cx={t.pos.x} cy={t.pos.y} r={9} fill="#103868" stroke="#ffffff" strokeWidth={1.5} />
          <text
            x={t.pos.x}
            y={t.pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#ffffff"
            fontSize={10}
            fontFamily="var(--font-plex-mono), ui-monospace, monospace"
            fontWeight={600}
          >
            {t.urutan}
          </text>
        </g>
      ))}
    </svg>
  );
}
