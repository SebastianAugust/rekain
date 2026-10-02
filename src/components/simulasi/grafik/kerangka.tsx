/**
 * Perkakas bersama untuk keempat grafik.
 *
 * Repo ini belum pernah menggambar sumbu — grafik yang ada semuanya dekoratif dan
 * membawa maknanya lewat teks HTML di sekelilingnya. Grafik keuangan tidak bisa
 * begitu: tanpa tick, batang jadi sekadar bentuk. Jadi label tick ditulis sebagai
 * `<text>` di dalam SVG, mengikuti satu-satunya preseden yang ada di repo (nomor
 * perhentian di `peta-jahitan.tsx`): IBM Plex Mono, dikunci ke tengah.
 *
 * Warna ditulis sebagai hex tangga celup langsung di atribut `fill`/`stroke`,
 * karena kelas Tailwind tidak berlaku di sana — sama seperti SVG lain di sini.
 */

export const WARNA = {
  nila9: "#003060",
  nila6: "#103868",
  nila3: "#3880c0",
  nila1: "#a0d0f8",
  garis: "#e0e6ed",
  garisKuat: "#8392a4",
  tinta: "#101c2b",
  tintaPudar: "#4e5c6e",
  benang: "#a63a2c",
  putih: "#ffffff",
} as const;

export const MONO = "var(--font-plex-mono), ui-monospace, monospace";

export type Bingkai = {
  lebar: number;
  tinggi: number;
  atas: number;
  kanan: number;
  bawah: number;
  kiri: number;
};

/** Garis kisi horizontal beserta labelnya di tepi kiri. */
export function KisiY({
  tick,
  y,
  bingkai,
  label,
}: {
  tick: number[];
  y: (nilai: number) => number;
  bingkai: Bingkai;
  label: (nilai: number) => string;
}) {
  return (
    <g aria-hidden="true">
      {tick.map((t) => {
        const posisi = y(t);
        const nol = t === 0;
        return (
          <g key={t}>
            <line
              x1={bingkai.kiri}
              y1={posisi}
              x2={bingkai.lebar - bingkai.kanan}
              y2={posisi}
              stroke={nol ? WARNA.garisKuat : WARNA.garis}
              strokeWidth={nol ? 1.2 : 1}
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={bingkai.kiri - 8}
              y={posisi}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily={MONO}
              fontSize={11}
              fill={WARNA.tintaPudar}
            >
              {label(t)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/** Label kategori di bawah sumbu x. */
export function LabelX({
  posisi,
  bingkai,
  tebal,
}: {
  posisi: { x: number; teks: string }[];
  bingkai: Bingkai;
  tebal?: boolean;
}) {
  return (
    <g aria-hidden="true">
      {posisi.map((p) => (
        <text
          key={p.teks}
          x={p.x}
          y={bingkai.tinggi - bingkai.bawah + 18}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={MONO}
          fontSize={11}
          fontWeight={tebal ? 600 : 400}
          fill={tebal ? WARNA.tinta : WARNA.tintaPudar}
        >
          {p.teks}
        </text>
      ))}
    </g>
  );
}

/**
 * Pembungkus grafik: judul, keterangan warna, kanvas, dan ringkasan `sr-only`.
 *
 * SVG-nya sendiri selalu `aria-hidden` — maknanya dibawa `ringkasan`, sama seperti
 * komponen SVG lain di repo ini.
 */
export function Kanvas({
  judul,
  catatan,
  legenda,
  aksi,
  bingkai,
  ringkasan,
  children,
}: {
  judul: string;
  catatan?: string;
  legenda?: { warna: string; teks: string }[];
  /** Kendali kecil di sisi kanan judul, mis. pemilih tahun. */
  aksi?: React.ReactNode;
  bingkai: Bingkai;
  ringkasan: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="rounded-kartu border border-garis permukaan px-w4 py-w3 shadow-panel">
      <figcaption className="mb-w3">
        <div className="flex items-start justify-between gap-w3">
          <h3 className="judul-kecil text-sm text-tinta">{judul}</h3>
          {aksi && <div className="shrink-0 cetak-sembunyi">{aksi}</div>}
        </div>
        {catatan && <p className="mt-1 text-xs text-tinta-pudar">{catatan}</p>}

        {legenda && (
          <ul className="mt-w2 flex flex-wrap gap-x-w3 gap-y-1">
            {legenda.map((l) => (
              <li key={l.teks} className="flex items-center gap-1.5 text-xs text-tinta-pudar">
                <span
                  aria-hidden="true"
                  className="size-2.5 shrink-0 rounded-[1px]"
                  style={{ backgroundColor: l.warna }}
                />
                {l.teks}
              </li>
            ))}
          </ul>
        )}
      </figcaption>

      <svg
        viewBox={`0 0 ${bingkai.lebar} ${bingkai.tinggi}`}
        /*
          `meet`, bukan `none`: di sini ada teks tick dan garis tipis, dan
          peregangan tak seragam akan memiringkan hurufnya sekaligus membuat
          garis horizontal dan vertikal berbeda tebal.
        */
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block", width: "100%", height: "auto" }}
        aria-hidden="true"
        focusable="false"
      >
        {children}
      </svg>

      <p className="sr-only">{ringkasan}</p>
    </figure>
  );
}
