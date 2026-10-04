import { acuanHarga, acuanLogistik, acuanNpv } from "@/lib/finance/sensitivitas";
import { formatJuta, formatPersenPresisi, formatRupiah } from "@/lib/format";

/* Statis: dihitung dari BASELINE sekali, tidak bergantung pada slider. */
const HARGA = acuanHarga();
const LOGISTIK = acuanLogistik();
const NPV = acuanNpv();

const Sel = ({ children, kiri }: { children: React.ReactNode; kiri?: boolean }) => (
  <td className={`px-w4 py-1.5 font-mono tabular-nums ${kiri ? "text-left" : "text-right"}`}>
    {children}
  </td>
);

function Kartu({
  judul,
  children,
}: {
  judul: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-kartu permukaan px-w4 py-w4 shadow-bal">
      <h3 className="judul-kecil text-xs text-tinta uppercase">{judul}</h3>
      <div className="mt-w3">{children}</div>
    </div>
  );
}

const th = "px-w4 py-w2 text-right text-xs font-medium text-tinta-pudar";

export function AcuanProposal() {
  return (
    <section aria-labelledby="judul-acuan" className="space-y-w3">
      <div>
        <h2 id="judul-acuan" className="judul-kecil text-sm text-tinta">
          Angka acuan proposal
        </h2>
        <p className="mt-1 text-xs text-tinta-pudar">
          Tetap, tidak berubah saat asumsi digeser. Tahun 1, volume 200 ton, biaya tetap
          Rp67 juta, grading premium Rp12 juta.
        </p>
      </div>

      <Kartu judul="Tabel 4.6 — sensitivitas harga">
        <div className="overflow-x-auto">
          <table className="w-full min-w-md border-collapse text-sm">
            <caption className="sr-only">Sensitivitas harga rata-rata material, Tahun 1</caption>
            <thead>
              <tr className="border-b border-garis">
                <th scope="col" className={`${th} text-left`}>Harga</th>
                <th scope="col" className={th}>Margin kontribusi</th>
                <th scope="col" className={th}>Volume impas</th>
                <th scope="col" className={th}>Laba sebelum pajak</th>
              </tr>
            </thead>
            <tbody>
              {HARGA.map((h) => (
                <tr key={h.harga} className="border-t border-garis first:border-t-0">
                  <Sel kiri>{formatRupiah(h.harga)}/kg</Sel>
                  <Sel>{formatRupiah(h.marginKontribusiPerKg)}/kg</Sel>
                  <Sel>±{Math.round(h.bepVolumeTon ?? 0).toLocaleString("id-ID")} ton</Sel>
                  <Sel>{formatRupiah(Math.round(h.labaSebelumPajak))}</Sel>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Kartu>

      <div className="grid gap-w3 md:grid-cols-2">
        <Kartu judul="Biaya logistik naik">
          <dl className="space-y-w2 text-sm">
            {LOGISTIK.map((l) => (
              <div key={l.logistikPerKg} className="flex justify-between gap-w3">
                <dt className="text-tinta-pudar">
                  {formatPersenPresisi(l.rasioGmv, 1)} GMV · {formatRupiah(l.logistikPerKg)}/kg
                </dt>
                <dd className="font-mono font-semibold text-tinta tabular-nums">
                  {l.rasioGmv > 0.0225 ? "±" : ""}
                  {formatJuta(l.labaSebelumPajak)}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-w2 text-xs text-tinta-pudar">Laba sebelum pajak Tahun 1.</p>
        </Kartu>

        <Kartu judul="NPV menurut diskonto">
          <dl className="space-y-w2 text-sm">
            {NPV.map((n) => (
              <div key={n.diskonto} className="flex justify-between gap-w3">
                <dt className="text-tinta-pudar">Diskonto {Math.round(n.diskonto * 100)}%</dt>
                <dd className="font-mono font-semibold text-tinta tabular-nums">
                  {n.diskonto > 0.1 ? "±" : ""}
                  {n.npv === null ? "tidak terdefinisi" : formatJuta(n.npv)}
                </dd>
              </div>
            ))}
          </dl>
        </Kartu>
      </div>
    </section>
  );
}
