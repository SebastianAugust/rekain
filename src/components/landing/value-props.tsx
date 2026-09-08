import { ClipboardCheck, Handshake, MapPin } from "lucide-react";

const PROPS = [
  {
    icon: ClipboardCheck,
    t: "Kualitas terverifikasi",
    d: "Setiap bal digrading sebelum ditawarkan, jadi Anda tahu apa yang dibeli — bukan tebak-tebakan lewat foto di WhatsApp.",
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
          <div key={v.t} className="rounded-sm border border-garis permukaan px-w4 py-w4">
            <Icon size={18} className="mb-w3 text-nila-3" aria-hidden="true" />
            <h3 className="judul-kecil mb-w1 text-sm text-tinta">{v.t}</h3>
            <p className="text-xs leading-relaxed text-tinta-pudar">{v.d}</p>
          </div>
        );
      })}
    </section>
  );
}
