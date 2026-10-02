import { ClipboardCheck, Handshake, MapPin } from "lucide-react";

const PROPS = [
  {
    icon: ClipboardCheck,
    t: "Kualitas terverifikasi",
    d: "Setiap bal dinilai mutunya sebelum ditawarkan, jadi Anda tahu persis apa yang dibeli — bukan menebak-nebak dari foto di WhatsApp.",
  },
  {
    icon: Handshake,
    t: "Bukan pesaing pengepul",
    d: "Kami bermitra dengan pengepul yang sudah ada untuk memperluas akses supply dan buyer mereka.",
  },
  {
    icon: MapPin,
    t: "Satu klaster dulu",
    d: "Mulai dari Bandung supaya logistik masuk akal, baru diperluas setelah alurnya terbukti.",
  },
];

export function ValueProps() {
  return (
    <section
      aria-label="Keunggulan ReKain"
      className="grid grid-cols-1 gap-x-w5 gap-y-w4 sm:grid-cols-3"
    >
      {PROPS.map((v) => {
        const Icon = v.icon;
        return (
          <div key={v.t} className="rounded-kartu border border-garis permukaan px-w4 py-w4 shadow-panel">
            <span className="mb-w3 flex size-9 items-center justify-center rounded-input bg-nila-1/35">
              <Icon size={18} className="text-nila-6" aria-hidden="true" />
            </span>
            <h3 className="judul-kecil mb-w1 text-base text-tinta">{v.t}</h3>
            <p className="text-sm leading-relaxed text-pretty text-tinta-pudar">{v.d}</p>
          </div>
        );
      })}
    </section>
  );
}
