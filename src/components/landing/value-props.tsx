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
      className="grid grid-cols-1 gap-w4 sm:grid-cols-3"
    >
      {PROPS.map((v) => {
        const Icon = v.icon;
        return (
          <div key={v.t} className="rounded-kartu permukaan p-w5 shadow-bal">
            <span className="mb-w4 flex size-11 items-center justify-center rounded-full bg-nila-1/45">
              <Icon size={22} strokeWidth={1.8} className="text-nila-6" aria-hidden="true" />
            </span>
            <h3 className="judul-kecil mb-w2 text-xl text-tinta">{v.t}</h3>
            <p className="text-base leading-relaxed text-pretty text-tinta-pudar">{v.d}</p>
          </div>
        );
      })}
    </section>
  );
}
