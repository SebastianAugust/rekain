import React, { useState } from "react";
import {
  Package, Search, Upload, CheckCircle2, MapPin, Tag, ArrowRight, Menu, X,
  Home, ClipboardList, Heart, User, Monitor, Smartphone, Filter, ChevronLeft,
  Scale, Building2, Recycle, ArrowUpRight, Plus, Send, Star, Clock, TrendingUp,
  Scissors,
} from "lucide-react";

/* ============ DESIGN TOKENS ============ */
const C = {
  indigo: "#1F2A44",      // deep denim indigo — hero / primary nav
  indigoMid: "#33456A",   // secondary panels
  indigoSoft: "#EAEDF3",  // pale indigo tint for subtle bg
  canvas: "#F4EFE3",      // unbleached cotton canvas
  canvasDeep: "#E9E1CD",  // deeper canvas for card borders
  amber: "#B9791F",       // kraft tag stamp
  amberSoft: "#F3E3C4",
  thread: "#B23A2A",      // selvage guard-thread red — used sparingly
  stampInk: "#6B2A3A",    // rubber ink-stamp color for grade marks
  sage: "#4C7A5E",        // status-available green, restrained use
  sageSoft: "#DEE9E1",
  ink: "#201B15",
  inkSoft: "#5C554A",
};

/* twill/weave texture helper — two-tone diagonal stripe pattern
   used inside swatch blocks so materials read as woven fabric, not flat color */
function twillBg(base, dark) {
  return {
    backgroundColor: base,
    backgroundImage: `repeating-linear-gradient(45deg, ${dark} 0px, ${dark} 3px, transparent 3px, transparent 9px)`,
  };
}

/* subtle herringbone texture for large surfaces (page bg) */
const HERRINGBONE_BG = {
  backgroundImage: `repeating-linear-gradient(45deg, rgba(32,27,21,0.035) 0, rgba(32,27,21,0.035) 2px, transparent 2px, transparent 10px),
                     repeating-linear-gradient(-45deg, rgba(32,27,21,0.035) 0, rgba(32,27,21,0.035) 2px, transparent 2px, transparent 10px)`,
};

/* ============ MOCK DATA ============ */
const swatch = {
  cotton: { base: "#E4D9C3", dark: "#CBBB98" },
  denim: { base: "#33506E", dark: "#25394F" },
  katun: { base: "#D8CBA8", dark: "#BEAC80" },
  reject: { base: "#8C6E52", dark: "#6E543C" },
};

const seedListings = [
  { id: "COT-B-014", material: "Cotton Cutting Scraps", grade: "B", berat: 820, harga: 4500, lokasi: "Cimahi, Bandung", pabrik: "PT Mitra Garmindo", status: "Tersedia", swatch: swatch.cotton, umur: "2 hari lalu" },
  { id: "DNM-A-007", material: "Denim Deadstock", grade: "A", berat: 340, harga: 7200, lokasi: "Rancaekek, Bandung", pabrik: "Karya Tenun Jaya", status: "Tersedia", swatch: swatch.denim, umur: "5 jam lalu" },
  { id: "KTN-C-022", material: "Katun Campuran", grade: "C", berat: 1150, harga: 2800, lokasi: "Majalaya, Bandung", pabrik: "CV Sumber Kain", status: "Dalam Negosiasi", swatch: swatch.katun, umur: "1 hari lalu" },
  { id: "RJC-B-031", material: "Reject Roll Ends", grade: "B", berat: 560, harga: 3600, lokasi: "Cimahi, Bandung", pabrik: "PT Mitra Garmindo", status: "Tersedia", swatch: swatch.reject, umur: "3 hari lalu" },
];

const seedTransaksiPabrik = [
  { id: "TX-2291", material: "Denim Deadstock", buyer: "Ulang Studio", berat: 210, total: 1512000, tanggal: "24 Agu 2026", status: "Selesai" },
  { id: "TX-2278", material: "Cotton Cutting Scraps", buyer: "Daur Tekstil ID", berat: 400, total: 1800000, tanggal: "18 Agu 2026", status: "Selesai" },
];

const seedTransaksiBuyer = [
  { id: "TX-2291", material: "Denim Deadstock", pabrik: "Karya Tenun Jaya", berat: 210, total: 1512000, tanggal: "24 Agu 2026", status: "Dikirim" },
];

/* ============ SMALL PRIMITIVES ============ */
function TagChip({ children, tone = "sage" }) {
  const tones = {
    sage: { bg: C.sageSoft, fg: C.sage },
    amber: { bg: C.amberSoft, fg: C.amber },
    thread: { bg: "#F3DAD5", fg: C.thread },
    indigo: { bg: C.indigoSoft, fg: C.indigo },
  };
  const t = tones[tone];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono tracking-tight rounded-sm"
      style={{ backgroundColor: t.bg, color: t.fg }}
    >
      {children}
    </span>
  );
}

/* Grade shown as a rubber ink-stamp mark, not a filled chip —
   double ring border + slight rotation, the way mills stamp quality grade on bale tags */
function StampBadge({ grade }) {
  return (
    <div
      className="inline-flex items-center justify-center px-2 py-1 font-mono font-bold tracking-widest uppercase select-none"
      style={{
        fontSize: "11px",
        color: C.stampInk,
        border: `3px double ${C.stampInk}`,
        transform: "rotate(-4deg)",
        opacity: 0.88,
      }}
    >
      GRADE {grade}
    </div>
  );
}

/* pinking-shears zigzag trim — the literal cut edge fabric stores use,
   drawn as a repeating triangle wave with a thin guard-thread line following it */
function PinkingEdge({ flip }) {
  const teeth = 40;
  const w = 14;
  const points = Array.from({ length: teeth * 2 + 1 }, (_, i) => {
    const x = (i * w) / 2;
    const y = i % 2 === 0 ? 0 : 8;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg
      viewBox={`0 0 ${(teeth * w) / 2} 8`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: 8, transform: flip ? "scaleY(-1)" : undefined, display: "block" }}
    >
      <polyline points={points} fill="none" stroke={C.canvasDeep} strokeWidth="1.5" />
      <polyline points={points} fill="none" stroke={C.thread} strokeWidth="0.75" strokeDasharray="2 3" opacity="0.6" />
    </svg>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: C.amber }}>
      {children}
    </div>
  );
}

/* Signature element: a swatch-book hang tag — woven-texture color block,
   3-hole ring binder edge, dashed "topstitch" border, ink-stamp grade */
function SwatchCard({ item, onClick, compact }) {
  const statusTone = item.status === "Tersedia" ? "sage" : "amber";
  const sw = item.swatch;
  return (
    <button
      onClick={onClick}
      className="text-left relative w-full bg-white hover:-translate-y-0.5 transition-transform duration-150"
      style={{ border: `1.5px dashed ${C.canvasDeep}` }}
    >
      <div className="flex">
        <div className="relative w-9 shrink-0" style={twillBg(sw.base, sw.dark)}>
          {/* ring-binder holes */}
          {[0.22, 0.5, 0.78].map((p, i) => (
            <div
              key={i}
              className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border"
              style={{ top: `${p * 100}%`, borderColor: "rgba(32,27,21,0.4)", backgroundColor: C.canvas }}
            />
          ))}
        </div>
        <div className={`flex-1 ${compact ? "p-3 pl-4" : "p-4 pl-5"}`}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-mono tracking-wide" style={{ color: C.inkSoft, fontSize: "11px" }}>{item.id}</div>
              <div className="font-semibold leading-snug mt-0.5" style={{ color: C.ink }}>{item.material}</div>
            </div>
            <StampBadge grade={item.grade} />
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: C.inkSoft }}>
            <span className="inline-flex items-center gap-1"><Scale size={12} /> {item.berat} kg</span>
            <span className="inline-flex items-center gap-1"><MapPin size={12} /> {item.lokasi}</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="font-mono font-semibold" style={{ color: C.ink }}>
              Rp{item.harga.toLocaleString("id-ID")}<span className="text-xs font-normal" style={{ color: C.inkSoft }}>/kg</span>
            </div>
            <TagChip tone={statusTone}>{item.status}</TagChip>
          </div>
        </div>
      </div>
    </button>
  );
}

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="bg-white border p-4" style={{ borderColor: C.canvasDeep }}>
      <div className="flex items-center justify-between">
        <Eyebrow>{label}</Eyebrow>
        <Icon size={16} style={{ color: accent || C.amber }} />
      </div>
      <div className="font-mono text-2xl font-semibold" style={{ color: C.ink }}>{value}</div>
    </div>
  );
}

function SelvageRule() {
  return (
    <div className="w-full my-8">
      <PinkingEdge />
    </div>
  );
}

/* Hero signature illustration: a fan of folded fabric swatches with pinked
   edges — the single characteristic image of ReKain's world */
function FabricStack() {
  const cards = [
    { color: swatch.denim.base, dark: swatch.denim.dark, rot: -10, x: 0 },
    { color: swatch.cotton.base, dark: swatch.cotton.dark, rot: -3, x: 26 },
    { color: C.amber, dark: "#8F5F16", rot: 4, x: 52 },
    { color: swatch.reject.base, dark: swatch.reject.dark, rot: 11, x: 78 },
  ];
  return (
    <div className="relative w-full h-56 sm:h-64">
      {cards.map((c, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 w-32 h-40 sm:w-36 sm:h-44 shadow-lg"
          style={{
            ...twillBg(c.color, c.dark),
            transform: `translate(-50%, -50%) translateX(${c.x - 39}px) rotate(${c.rot}deg)`,
            clipPath:
              "polygon(0% 3%,4% 0%,8% 3%,12% 0%,16% 3%,20% 0%,24% 3%,28% 0%,32% 3%,36% 0%,40% 3%,44% 0%,48% 3%,52% 0%,56% 3%,60% 0%,64% 3%,68% 0%,72% 3%,76% 0%,80% 3%,84% 0%,88% 3%,92% 0%,96% 3%,100% 0%,100% 97%,96% 100%,92% 97%,88% 100%,84% 97%,80% 100%,76% 97%,72% 100%,68% 97%,64% 100%,60% 97%,56% 100%,52% 97%,48% 100%,44% 97%,40% 100%,36% 97%,32% 100%,28% 97%,24% 100%,20% 97%,16% 100%,12% 97%,8% 100%,4% 97%,0% 100%)",
          }}
        />
      ))}
    </div>
  );
}

/* ============ LANDING PAGE ============ */
function Landing({ onEnter, device }) {
  const mobile = device === "mobile";
  const steps = [
    { n: "01", t: "Pabrik unggah limbah", d: "Jenis material, berat, lokasi, foto kondisi." },
    { n: "02", t: "Grading & estimasi harga", d: "Klasifikasi kualitas dan harga pasar wajar." },
    { n: "03", t: "Pencocokan pembeli", d: "Ditawarkan ke buyer sesuai kebutuhan mereka." },
    { n: "04", t: "Logistik & escrow", d: "Pengambilan barang dan pembayaran terjamin." },
    { n: "05", t: "Sampai ke buyer", d: "Recycler, upcycler, atau brand berkelanjutan." },
  ];
  return (
    <div className="min-h-full" style={{ backgroundColor: C.canvas, ...HERRINGBONE_BG }}>
      {/* NAV */}
      <div className="border-b" style={{ borderColor: C.canvasDeep }}>
        <div className={`max-w-6xl mx-auto ${mobile ? "px-4 py-3" : "px-6 py-4"} flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 flex items-center justify-center font-mono font-bold text-sm shrink-0" style={{ backgroundColor: C.indigo, color: C.canvas }}>R</div>
            <span className="font-semibold tracking-tight" style={{ color: C.ink }}>ReKain</span>
          </div>
          {!mobile && (
            <>
              <div className="flex items-center gap-6 text-sm" style={{ color: C.inkSoft }}>
                <span>Untuk Pabrik</span>
                <span>Untuk Buyer</span>
                <span>Cara Kerja</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onEnter("pabrik")} className="text-sm px-3 py-1.5 font-medium" style={{ color: C.indigo }}>Masuk Pabrik</button>
                <button onClick={() => onEnter("buyer")} className="text-sm px-3 py-1.5 font-medium text-white" style={{ backgroundColor: C.indigo }}>Masuk Buyer</button>
              </div>
            </>
          )}
          {mobile && (
            <button onClick={() => onEnter("pabrik")} className="text-xs px-2.5 py-1.5 font-medium text-white" style={{ backgroundColor: C.indigo }}>Masuk</button>
          )}
        </div>
      </div>

      {/* HERO */}
      <div style={{ backgroundColor: C.indigo }}>
        <div
          className={`max-w-6xl mx-auto ${mobile ? "px-4 pt-10 pb-8" : "px-6 pt-16 pb-10"} ${mobile ? "" : "grid gap-10 items-center"}`}
          style={mobile ? undefined : { gridTemplateColumns: "1fr 320px" }}
        >
          <div>
            <Eyebrow>Infrastruktur limbah tekstil B2B</Eyebrow>
            <h1
              className={`font-semibold tracking-tight max-w-2xl ${mobile ? "text-3xl leading-tight" : "text-5xl"}`}
              style={{ color: C.canvas, textShadow: `2px 2px 0 rgba(178,58,42,0.35)`, lineHeight: mobile ? undefined : 1.08 }}
            >
              Limbah kain pabrik Anda, jadi bahan baku pilihan buyer lain.
            </h1>
            <p className="max-w-xl mt-5 text-base" style={{ color: "#C7CEDC" }}>
              ReKain menghubungkan pabrik garmen dengan recycler, upcycler, dan brand berkelanjutan —
              dengan grading kualitas, harga transparan, dan logistik yang dikelola dari satu tempat.
            </p>
            <div className={`flex ${mobile ? "flex-col" : "flex-wrap"} gap-3 mt-8`}>
              <button onClick={() => onEnter("pabrik")} className="inline-flex items-center justify-center gap-2 px-5 py-3 font-medium text-sm" style={{ backgroundColor: C.amber, color: C.indigo }}>
                Jual limbah pabrik saya <ArrowRight size={16} />
              </button>
              <button onClick={() => onEnter("buyer")} className="inline-flex items-center justify-center gap-2 px-5 py-3 font-medium text-sm border" style={{ borderColor: "#4A5A7C", color: C.canvas }}>
                Cari material daur ulang <Search size={16} />
              </button>
            </div>
          </div>
          {!mobile && <FabricStack />}
          {mobile && <div className="mt-6"><FabricStack /></div>}
        </div>
        <div className={`max-w-6xl mx-auto ${mobile ? "px-4 pb-8" : "px-6 pb-10"}`}>
          <div className={`flex ${mobile ? "flex-col gap-2" : "flex-wrap gap-x-8 gap-y-3"} pt-6 font-mono text-sm border-t`} style={{ color: "#C7CEDC", borderColor: "#3A4A6C" }}>
            <div><span className="text-lg font-semibold" style={{ color: C.canvas }}>2,3 jt ton</span> limbah tekstil/tahun</div>
            <div><span className="text-lg font-semibold" style={{ color: C.canvas }}>&lt;15%</span> yang didaur ulang</div>
            <div><span className="text-lg font-semibold" style={{ color: C.canvas }}>1</span> klaster percontohan — Bandung</div>
          </div>
        </div>
      </div>
      <PinkingEdge />

      {/* HOW IT WORKS */}
      <div className={`max-w-6xl mx-auto ${mobile ? "px-4 py-10" : "px-6 py-16"}`}>
        <Eyebrow>Cara kerja</Eyebrow>
        <h2 className="text-2xl font-semibold mb-8" style={{ color: C.ink }}>Dari gudang pabrik ke tangan buyer, lima langkah</h2>
        <div className={`grid ${mobile ? "grid-cols-1 gap-6" : "grid-cols-5 gap-4"}`}>
          {steps.map((s, i) => (
            <div key={s.n}>
              <div className="font-mono text-xs mb-2" style={{ color: C.amber }}>{s.n}</div>
              <div className="font-semibold text-sm mb-1" style={{ color: C.ink }}>{s.t}</div>
              <div className="text-xs" style={{ color: C.inkSoft }}>{s.d}</div>
            </div>
          ))}
        </div>

        <SelvageRule />

        <div className={`grid ${mobile ? "grid-cols-1 gap-4" : "grid-cols-3 gap-6"}`}>
          {[
            { icon: CheckCircle2, t: "Kualitas terverifikasi", d: "Setiap material digrading sebelum ditawarkan — bukan tebak-tebakan seperti transaksi WhatsApp." },
            { icon: Recycle, t: "Bukan pesaing pengepul", d: "Kami bermitra dengan pengepul untuk memperluas akses supply dan buyer mereka." },
            { icon: TrendingUp, t: "Fokus satu klaster dulu", d: "Mulai dari Bandung agar logistik masuk akal, baru diperluas bertahap." },
          ].map((v) => (
            <div key={v.t} className="bg-white border p-5" style={{ borderColor: C.canvasDeep }}>
              <v.icon size={18} style={{ color: C.indigo }} className="mb-3" />
              <div className="font-semibold text-sm mb-1" style={{ color: C.ink }}>{v.t}</div>
              <div className="text-xs" style={{ color: C.inkSoft }}>{v.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-xs py-6 border-t" style={{ borderColor: C.canvasDeep, color: C.inkSoft }}>
        Mockup non-fungsional — tidak ada data yang benar-benar tersimpan.
      </div>
    </div>
  );
}

/* ============ SHARED DASHBOARD SHELL ============ */
function NavItem({ icon: Icon, label, active, onClick, device }) {
  if (device === "mobile") {
    return (
      <button onClick={onClick} className="flex-1 flex flex-col items-center gap-0.5 py-2">
        <Icon size={18} style={{ color: active ? C.indigo : C.inkSoft }} />
        <span style={{ color: active ? C.indigo : C.inkSoft, fontWeight: active ? 600 : 400, fontSize: "10px" }}>{label}</span>
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left"
      style={{ backgroundColor: active ? "#2A3A5C" : "transparent", color: active ? C.canvas : "#AEB8CC" }}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function TopBar({ role, name, onBack, device }) {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 h-14 border-b bg-white" style={{ borderColor: C.canvasDeep }}>
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1 -ml-1" style={{ color: C.inkSoft }}><ChevronLeft size={18} /></button>
        {device === "mobile" && <span className="font-semibold text-sm" style={{ color: C.ink }}>ReKain</span>}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: C.indigoSoft, color: C.indigo }}>
          {name.charAt(0)}
        </div>
        {device !== "mobile" && <span className="text-sm" style={{ color: C.ink }}>{name}</span>}
      </div>
    </div>
  );
}

/* ============ PABRIK SCREENS ============ */
function PabrikHome({ listings, onNav, device }) {
  const mine = listings.filter((l) => l.pabrik === "PT Mitra Garmindo");
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <Eyebrow>Ringkasan</Eyebrow>
        <h2 className="text-lg font-semibold" style={{ color: C.ink }}>Selamat datang, PT Mitra Garmindo</h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total Terjual" value="640 kg" icon={Scale} />
        <StatCard label="Pendapatan" value="Rp3,3 jt" icon={TrendingUp} accent={C.sage} />
        <StatCard label="Listing Aktif" value={mine.length} icon={Package} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <Eyebrow>Listing saya</Eyebrow>
          <button onClick={() => onNav("upload")} className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5" style={{ backgroundColor: C.amber, color: C.indigo }}>
            <Plus size={13} /> Upload Limbah
          </button>
        </div>
        <div className={`grid ${device === "mobile" ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
          {mine.map((l) => <SwatchCard key={l.id} item={l} compact />)}
        </div>
      </div>
    </div>
  );
}

function PabrikUpload({ onSubmitted }) {
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ material: "", berat: "", lokasi: "Cimahi, Bandung", catatan: "" });

  if (done) {
    return (
      <div className="p-6 flex flex-col items-center text-center mt-10">
        <CheckCircle2 size={40} style={{ color: C.sage }} />
        <div className="font-semibold mt-3" style={{ color: C.ink }}>Limbah berhasil diunggah</div>
        <div className="text-sm mt-1 max-w-xs" style={{ color: C.inkSoft }}>
          Tim ReKain akan melakukan grading dalam 1–2 hari kerja sebelum ditampilkan ke buyer.
        </div>
        <button onClick={() => { setDone(false); onSubmitted(); }} className="mt-5 text-sm font-medium px-4 py-2 text-white" style={{ backgroundColor: C.indigo }}>
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-lg">
      <Eyebrow>Upload Limbah Baru</Eyebrow>
      <h2 className="text-lg font-semibold mb-5" style={{ color: C.ink }}>Ceritakan material yang Anda miliki</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: C.inkSoft }}>Jenis material</label>
          <select className="w-full border px-3 py-2 text-sm bg-white" style={{ borderColor: C.canvasDeep }}
            value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })}>
            <option value="">Pilih jenis material</option>
            <option>Cotton Cutting Scraps</option>
            <option>Denim Deadstock</option>
            <option>Katun Campuran</option>
            <option>Reject Roll Ends</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: C.inkSoft }}>Berat (kg)</label>
            <input type="number" placeholder="mis. 500" className="w-full border px-3 py-2 text-sm" style={{ borderColor: C.canvasDeep }}
              value={form.berat} onChange={(e) => setForm({ ...form, berat: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: C.inkSoft }}>Lokasi</label>
            <input className="w-full border px-3 py-2 text-sm" style={{ borderColor: C.canvasDeep }}
              value={form.lokasi} onChange={(e) => setForm({ ...form, lokasi: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: C.inkSoft }}>Foto kondisi material</label>
          <div className="border flex flex-col items-center justify-center py-8 text-xs" style={{ borderColor: C.canvasDeep, borderStyle: "dashed", borderWidth: 1.5, color: C.inkSoft }}>
            <Scissors size={18} className="mb-2" style={{ color: C.thread }} />
            Gunting & tempel foto di sini, atau klik untuk unggah
          </div>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1" style={{ color: C.inkSoft }}>Catatan tambahan (opsional)</label>
          <textarea rows={3} className="w-full border px-3 py-2 text-sm" style={{ borderColor: C.canvasDeep }}
            value={form.catatan} onChange={(e) => setForm({ ...form, catatan: e.target.value })} placeholder="mis. kondisi, campuran warna, dll." />
        </div>
        <button onClick={() => setDone(true)} disabled={!form.material || !form.berat}
          className="w-full py-2.5 text-sm font-medium text-white disabled:opacity-40" style={{ backgroundColor: C.indigo }}>
          Kirim untuk Grading
        </button>
      </div>
    </div>
  );
}

function PabrikListing({ listings, device }) {
  const mine = listings.filter((l) => l.pabrik === "PT Mitra Garmindo");
  return (
    <div className="p-4 sm:p-6">
      <Eyebrow>Listing Saya</Eyebrow>
      <h2 className="text-lg font-semibold mb-4" style={{ color: C.ink }}>{mine.length} material diunggah</h2>
      <div className={`grid ${device === "mobile" ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
        {mine.map((l) => <SwatchCard key={l.id} item={l} />)}
      </div>
    </div>
  );
}

function TransactionList({ items, isPabrik }) {
  return (
    <div className="p-4 sm:p-6">
      <Eyebrow>Transaksi</Eyebrow>
      <h2 className="text-lg font-semibold mb-4" style={{ color: C.ink }}>Riwayat transaksi</h2>
      <div className="space-y-2">
        {items.map((t) => (
          <div key={t.id} className="bg-white border p-3 flex items-center justify-between" style={{ borderColor: C.canvasDeep }}>
            <div>
              <div className="text-sm font-medium" style={{ color: C.ink }}>{t.material}</div>
              <div className="text-xs mt-0.5" style={{ color: C.inkSoft }}>
                {isPabrik ? `ke ${t.buyer}` : `dari ${t.pabrik}`} · {t.berat} kg · {t.tanggal}
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm font-semibold" style={{ color: C.ink }}>Rp{t.total.toLocaleString("id-ID")}</div>
              <TagChip tone={t.status === "Selesai" ? "sage" : "amber"}>{t.status}</TagChip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileScreen({ name, role }) {
  return (
    <div className="p-4 sm:p-6">
      <Eyebrow>Profil</Eyebrow>
      <div className="bg-white border p-5 flex items-center gap-4 mt-3" style={{ borderColor: C.canvasDeep }}>
        <div className="w-12 h-12 rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: C.indigoSoft, color: C.indigo }}>
          {name.charAt(0)}
        </div>
        <div>
          <div className="font-semibold" style={{ color: C.ink }}>{name}</div>
          <div className="text-xs" style={{ color: C.inkSoft }}>{role === "pabrik" ? "Akun Pabrik" : "Akun Buyer"} · Klaster Bandung</div>
        </div>
      </div>
    </div>
  );
}

/* ============ BUYER SCREENS ============ */
function BuyerSearch({ listings, onOpen, device }) {
  const [q, setQ] = useState("");
  const filtered = listings.filter((l) => l.material.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="p-4 sm:p-6">
      <Eyebrow>Cari Material</Eyebrow>
      <h2 className="text-lg font-semibold mb-4" style={{ color: C.ink }}>{filtered.length} material tersedia di klaster Bandung</h2>
      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 border px-3 py-2 bg-white" style={{ borderColor: C.canvasDeep }}>
          <Search size={15} style={{ color: C.inkSoft }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari jenis material..." className="text-sm outline-none flex-1" />
        </div>
        <button className="px-3 border flex items-center gap-1.5 text-xs font-medium" style={{ borderColor: C.canvasDeep, color: C.ink }}>
          <Filter size={13} /> Filter
        </button>
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {["Grade A", "Grade B", "< Rp5.000/kg", "Cimahi"].map((f) => (
          <span key={f} className="text-xs px-2.5 py-1 border" style={{ borderColor: C.canvasDeep, color: C.inkSoft }}>{f}</span>
        ))}
      </div>
      <div className={`grid ${device === "mobile" ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
        {filtered.map((l) => <SwatchCard key={l.id} item={l} onClick={() => onOpen(l)} />)}
      </div>
    </div>
  );
}

function BuyerDetail({ item, onBack, onOffered }) {
  const [sent, setSent] = useState(false);
  return (
    <div className="p-4 sm:p-6 max-w-lg">
      <button onClick={onBack} className="text-xs flex items-center gap-1 mb-4" style={{ color: C.inkSoft }}>
        <ChevronLeft size={14} /> Kembali ke pencarian
      </button>
      <div className="bg-white border" style={{ borderColor: C.canvasDeep }}>
        <div className="h-24" style={twillBg(item.swatch.base, item.swatch.dark)} />
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-xs" style={{ color: C.inkSoft }}>{item.id}</div>
              <div className="font-semibold text-lg" style={{ color: C.ink }}>{item.material}</div>
            </div>
            <StampBadge grade={item.grade} />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div><div className="text-xs" style={{ color: C.inkSoft }}>Berat tersedia</div><div className="font-mono font-medium">{item.berat} kg</div></div>
            <div><div className="text-xs" style={{ color: C.inkSoft }}>Harga</div><div className="font-mono font-medium">Rp{item.harga.toLocaleString("id-ID")}/kg</div></div>
            <div><div className="text-xs" style={{ color: C.inkSoft }}>Lokasi</div><div className="font-medium">{item.lokasi}</div></div>
            <div><div className="text-xs" style={{ color: C.inkSoft }}>Diunggah</div><div className="font-medium">{item.umur}</div></div>
          </div>
          <div className="flex items-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: C.canvasDeep }}>
            <Building2 size={15} style={{ color: C.inkSoft }} />
            <span className="text-sm" style={{ color: C.ink }}>{item.pabrik}</span>
          </div>
        </div>
      </div>

      {!sent ? (
        <button onClick={() => { setSent(true); onOffered && onOffered(); }} className="w-full mt-4 py-2.5 text-sm font-medium text-white inline-flex items-center justify-center gap-2" style={{ backgroundColor: C.indigo }}>
          <Send size={14} /> Ajukan Penawaran
        </button>
      ) : (
        <div className="w-full mt-4 py-3 text-sm text-center font-medium" style={{ backgroundColor: C.sageSoft, color: C.sage }}>
          Penawaran terkirim ke {item.pabrik}. Menunggu konfirmasi.
        </div>
      )}
    </div>
  );
}

function BuyerFavorit({ listings, onOpen, device }) {
  const favs = listings.slice(0, 2);
  return (
    <div className="p-4 sm:p-6">
      <Eyebrow>Favorit</Eyebrow>
      <h2 className="text-lg font-semibold mb-4" style={{ color: C.ink }}>Material yang Anda simpan</h2>
      <div className={`grid ${device === "mobile" ? "grid-cols-1" : "grid-cols-2"} gap-3`}>
        {favs.map((l) => <SwatchCard key={l.id} item={l} onClick={() => onOpen(l)} />)}
      </div>
    </div>
  );
}

/* ============ DASHBOARD FRAME ============ */
function Dashboard({ role, device, onExit }) {
  const [screen, setScreen] = useState("home");
  const [detailItem, setDetailItem] = useState(null);
  const [listings] = useState(seedListings);

  const name = role === "pabrik" ? "PT Mitra Garmindo" : "Ulang Studio";

  const pabrikNav = [
    { key: "home", label: "Beranda", icon: Home },
    { key: "upload", label: "Upload", icon: Upload },
    { key: "listing", label: "Listing", icon: ClipboardList },
    { key: "transaksi", label: "Transaksi", icon: Clock },
    { key: "profil", label: "Profil", icon: User },
  ];
  const buyerNav = [
    { key: "home", label: "Cari", icon: Search },
    { key: "favorit", label: "Favorit", icon: Heart },
    { key: "transaksi", label: "Transaksi", icon: Clock },
    { key: "profil", label: "Profil", icon: User },
  ];
  const nav = role === "pabrik" ? pabrikNav : buyerNav;

  function renderScreen() {
    if (role === "pabrik") {
      if (screen === "home") return <PabrikHome listings={listings} onNav={setScreen} device={device} />;
      if (screen === "upload") return <PabrikUpload onSubmitted={() => setScreen("listing")} />;
      if (screen === "listing") return <PabrikListing listings={listings} device={device} />;
      if (screen === "transaksi") return <TransactionList items={seedTransaksiPabrik} isPabrik />;
      if (screen === "profil") return <ProfileScreen name={name} role={role} />;
    } else {
      if (detailItem) return <BuyerDetail item={detailItem} onBack={() => setDetailItem(null)} />;
      if (screen === "home") return <BuyerSearch listings={listings} onOpen={setDetailItem} device={device} />;
      if (screen === "favorit") return <BuyerFavorit listings={listings} onOpen={setDetailItem} device={device} />;
      if (screen === "transaksi") return <TransactionList items={seedTransaksiBuyer} isPabrik={false} />;
      if (screen === "profil") return <ProfileScreen name={name} role={role} />;
    }
  }

  if (device === "mobile") {
    return (
      <div className="flex flex-col h-full">
        <TopBar role={role} name={name} onBack={onExit} device="mobile" />
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: C.canvas }}>{renderScreen()}</div>
        <div className="flex border-t bg-white" style={{ borderColor: C.canvasDeep }}>
          {nav.map((n) => (
            <NavItem key={n.key} icon={n.icon} label={n.label} active={screen === n.key && !detailItem}
              onClick={() => { setScreen(n.key); setDetailItem(null); }} device="mobile" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="w-56 flex flex-col shrink-0" style={{ backgroundColor: C.indigo }}>
        <div className="flex items-center gap-2 px-4 h-14 border-b" style={{ borderColor: "#33456A" }}>
          <div className="w-6 h-6 flex items-center justify-center font-mono font-bold text-xs" style={{ backgroundColor: C.amber, color: C.indigo }}>R</div>
          <span className="font-semibold text-sm" style={{ color: C.canvas }}>ReKain</span>
        </div>
        <div className="flex-1 py-3 space-y-0.5 px-2">
          {nav.map((n) => (
            <NavItem key={n.key} icon={n.icon} label={n.label} active={screen === n.key && !detailItem}
              onClick={() => { setScreen(n.key); setDetailItem(null); }} device="web" />
          ))}
        </div>
        <div className="px-2 pb-3">
          <NavItem icon={ChevronLeft} label="Keluar" onClick={onExit} device="web" />
        </div>
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar role={role} name={name} onBack={onExit} device="web" />
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: C.canvas }}>{renderScreen()}</div>
      </div>
    </div>
  );
}

/* ============ ROOT APP ============ */
export default function ReKainMockup() {
  const [view, setView] = useState("landing"); // landing | pabrik | buyer
  const [device, setDevice] = useState("web");

  const content =
    view === "landing" ? (
      <Landing onEnter={(role) => setView(role)} device={device} />
    ) : (
      <Dashboard role={view} device={device} onExit={() => setView("landing")} />
    );

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-6 px-3" style={{ backgroundColor: "#DEDDD3", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      {/* device toggle */}
      <div className="flex items-center gap-1 mb-5 bg-white border p-1" style={{ borderColor: C.canvasDeep }}>
        <button onClick={() => setDevice("web")} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
          style={{ backgroundColor: device === "web" ? C.indigo : "transparent", color: device === "web" ? C.canvas : C.inkSoft }}>
          <Monitor size={13} /> Web
        </button>
        <button onClick={() => setDevice("mobile")} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
          style={{ backgroundColor: device === "mobile" ? C.indigo : "transparent", color: device === "mobile" ? C.canvas : C.inkSoft }}>
          <Smartphone size={13} /> Mobile
        </button>
      </div>

      {device === "web" ? (
        <div className="w-full max-w-6xl bg-white shadow-xl border" style={{ borderColor: C.canvasDeep, height: "42rem" }}>
          <div className="flex items-center gap-1.5 h-8 px-3 border-b" style={{ borderColor: C.canvasDeep, backgroundColor: "#F1EFE9" }}>
            <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
            <span className="ml-3 font-mono" style={{ color: C.inkSoft, fontSize: "11px" }}>rekain.id</span>
          </div>
          <div id="app-frame-scroll" className={view === "landing" ? "overflow-y-auto" : "overflow-hidden"} style={{ height: "calc(100% - 2rem)" }}>{content}</div>
        </div>
      ) : (
        <div className="shadow-xl" style={{ borderColor: C.ink, borderWidth: 10, borderStyle: "solid", borderRadius: "2.2rem", width: "23rem", height: "46rem" }}>
          <div className="w-full h-full overflow-hidden relative bg-white" style={{ borderRadius: "1.4rem" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-xl z-10" />
            <div id="app-frame-scroll" className={`h-full ${view === "landing" ? "overflow-y-auto" : "overflow-hidden"}`}>{content}</div>
          </div>
        </div>
      )}
    </div>
  );
}