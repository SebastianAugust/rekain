import { jarakJalan, panjangTur } from "@/lib/logistik/jarak";
import type {
  Kecamatan,
  Listing,
  ListingStatus,
  Pabrik,
  Perhentian,
  RencanaRute,
  Rute,
  TidakTerutekan,
  Titik,
} from "@/lib/types";

/*
  ── Route planner ───────────────────────────────────────────────────────────

  A capacitated vehicle routing problem, solved with the standard cluster-first,
  route-second heuristic:

    1. roll every collectable listing up to one load per factory
    2. split any factory whose stock exceeds one truckload into several visits
    3. group visits by sub-district — the pilot runs one truck per cluster per
       day, which is the operational constraint, not an algorithmic one
    4. pack visits into trips with first-fit-decreasing bin packing
    5. order each trip nearest-neighbour from the depot
    6. improve each trip with 2-opt until no swap shortens it

  Exact VRP is NP-hard and pointless at this size; nearest-neighbour alone leaves
  obvious crossings on the map, and 2-opt removes them for a few microseconds of
  work. Everything here is pure and deterministic: same inputs, same plan, every
  time. Ties break on factory name so ordering never depends on object identity.
*/

/** Truck sizes ReKain can actually charter in the pilot cluster, in kilograms. */
export const KAPASITAS_OPSI = [1500, 2000, 2500, 3500] as const;
export const KAPASITAS_DEFAULT = 2000;

/** Bandung inter-district average, allowing for traffic. */
export const KECEPATAN_KMJ = 26;
/** Loading, weighing and paperwork at each factory. */
export const MENIT_PER_PERHENTIAN = 20;

/**
 * Only graded material still sitting at the factory can be collected. Ungraded
 * stock has no confirmed weight or price yet, and sold stock has already moved.
 */
const SIAP_JEMPUT: ListingStatus[] = ["Tersedia", "Dalam Negosiasi"];

const KODE_KECAMATAN: Record<Kecamatan, string> = {
  Cimahi: "CMH",
  Rancaekek: "RCK",
  Majalaya: "MJL",
};

/** Fixed cluster order, so two runs never disagree about which route is first. */
const URUTAN_KECAMATAN: Kecamatan[] = ["Cimahi", "Rancaekek", "Majalaya"];

type Kunjungan = {
  pabrik: string;
  kecamatan: Kecamatan;
  titik: Titik;
  listingIds: string[];
  muatan: number;
};

/**
 * Split one factory's stock into truck-sized visits. A listing may straddle two
 * visits — scrap is collected by weight, not by indivisible parcel — so it is
 * recorded against both.
 */
function pecahKunjungan(
  pabrik: string,
  kecamatan: Kecamatan,
  titik: Titik,
  listings: Listing[],
  kapasitas: number,
): Kunjungan[] {
  const hasil: Kunjungan[] = [];
  let muatan = 0;
  let ids: string[] = [];

  const simpan = () => {
    if (muatan > 0) hasil.push({ pabrik, kecamatan, titik, listingIds: ids, muatan });
    muatan = 0;
    ids = [];
  };

  for (const l of listings) {
    let sisa = l.berat;
    while (sisa > 0) {
      const ambil = Math.min(sisa, kapasitas - muatan);
      if (ambil > 0) {
        muatan += ambil;
        if (!ids.includes(l.id)) ids.push(l.id);
        sisa -= ambil;
      }
      if (muatan >= kapasitas) simpan();
    }
  }
  simpan();

  return hasil;
}

/** First-fit decreasing. Good enough here and stable given the name tie-break. */
function kemasKeTrip(kunjungan: Kunjungan[], kapasitas: number): Kunjungan[][] {
  const urut = [...kunjungan].sort(
    (a, b) => b.muatan - a.muatan || a.pabrik.localeCompare(b.pabrik),
  );

  const trip: Kunjungan[][] = [];
  const beban: number[] = [];

  for (const k of urut) {
    let idx = beban.findIndex((b) => b + k.muatan <= kapasitas + 1e-9);
    if (idx === -1) {
      trip.push([]);
      beban.push(0);
      idx = trip.length - 1;
    }
    trip[idx].push(k);
    beban[idx] += k.muatan;
  }

  return trip;
}

function tetanggaTerdekat(depot: Titik, kunjungan: Kunjungan[]): Kunjungan[] {
  const sisa = [...kunjungan];
  const urut: Kunjungan[] = [];
  let posisi = depot;

  while (sisa.length > 0) {
    let terbaik = 0;
    let jarakTerbaik = Infinity;
    for (let i = 0; i < sisa.length; i++) {
      const d = jarakJalan(posisi, sisa[i].titik);
      if (d < jarakTerbaik - 1e-9) {
        jarakTerbaik = d;
        terbaik = i;
      }
    }
    const [k] = sisa.splice(terbaik, 1);
    urut.push(k);
    posisi = k.titik;
  }

  return urut;
}

/** Reverse any sub-path that shortens the tour. Removes nearest-neighbour crossings. */
function duaOpt(depot: Titik, awal: Kunjungan[]): Kunjungan[] {
  if (awal.length < 4) return awal;

  let terbaik = [...awal];
  let jarakTerbaik = panjangTur(depot, terbaik.map((k) => k.titik));
  let membaik = true;
  let putaran = 0;

  while (membaik && putaran < 50) {
    membaik = false;
    putaran++;
    for (let i = 0; i < terbaik.length - 1; i++) {
      for (let j = i + 1; j < terbaik.length; j++) {
        const kandidat = [
          ...terbaik.slice(0, i),
          ...terbaik.slice(i, j + 1).reverse(),
          ...terbaik.slice(j + 1),
        ];
        const d = panjangTur(depot, kandidat.map((k) => k.titik));
        if (d < jarakTerbaik - 1e-9) {
          terbaik = kandidat;
          jarakTerbaik = d;
          membaik = true;
        }
      }
    }
  }

  return terbaik;
}

function bulat(n: number, desimal = 1): number {
  const f = 10 ** desimal;
  return Math.round(n * f) / f;
}

export function susunRencana({
  listings,
  pabrik,
  depot,
  kapasitas,
}: {
  listings: Listing[];
  pabrik: Record<string, Pabrik>;
  depot: Titik;
  kapasitas: number;
}): RencanaRute {
  const kosong: RencanaRute = {
    rute: [],
    depot,
    kapasitas,
    tidakTerutekan: [],
    ringkasan: {
      totalJarak: 0,
      jarakTanpaKonsolidasi: 0,
      penghematanKm: 0,
      penghematanPersen: 0,
      totalMuatan: 0,
      jumlahRute: 0,
      jumlahPerhentian: 0,
    },
  };

  if (kapasitas <= 0) return kosong;

  // 1. Roll collectable listings up to one bucket per factory.
  const perPabrik = new Map<string, Listing[]>();
  for (const l of listings) {
    if (!SIAP_JEMPUT.includes(l.status)) continue;
    const bucket = perPabrik.get(l.pabrik);
    if (bucket) bucket.push(l);
    else perPabrik.set(l.pabrik, [l]);
  }

  // 2–3. Split by capacity where needed, and set aside anything unroutable.
  const kunjunganPerKecamatan = new Map<Kecamatan, Kunjungan[]>();
  const tidakTerutekan: TidakTerutekan[] = [];

  for (const [nama, miliknya] of [...perPabrik.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    const profil = pabrik[nama];
    const muatan = miliknya.reduce((sum, l) => sum + l.berat, 0);

    if (!profil || !profil.titik) {
      tidakTerutekan.push({
        pabrik: nama,
        alasan: profil
          ? "Titik jemput belum disurvei"
          : "Pabrik belum terdaftar di registri lokasi",
        listingIds: miliknya.map((l) => l.id),
        muatan,
      });
      continue;
    }

    const kunjungan = pecahKunjungan(
      nama,
      profil.kecamatan,
      profil.titik,
      miliknya,
      kapasitas,
    );
    const daftar = kunjunganPerKecamatan.get(profil.kecamatan);
    if (daftar) daftar.push(...kunjungan);
    else kunjunganPerKecamatan.set(profil.kecamatan, kunjungan);
  }

  // 4–6. Pack, order, improve.
  const rute: Rute[] = [];

  for (const kecamatan of URUTAN_KECAMATAN) {
    const kunjungan = kunjunganPerKecamatan.get(kecamatan);
    if (!kunjungan || kunjungan.length === 0) continue;

    kemasKeTrip(kunjungan, kapasitas).forEach((trip, i) => {
      const urut = duaOpt(depot, tetanggaTerdekat(depot, trip));

      let sebelumnya = depot;
      const perhentian: Perhentian[] = urut.map((k, idx) => {
        const jarak = jarakJalan(sebelumnya, k.titik);
        sebelumnya = k.titik;
        return {
          urutan: idx + 1,
          pabrik: k.pabrik,
          kecamatan: k.kecamatan,
          titik: k.titik,
          listingIds: k.listingIds,
          muatan: k.muatan,
          jarakDariSebelumnya: bulat(jarak),
        };
      });

      const totalJarak = panjangTur(depot, urut.map((k) => k.titik));
      const totalMuatan = urut.reduce((sum, k) => sum + k.muatan, 0);

      rute.push({
        id: `RT-${KODE_KECAMATAN[kecamatan]}-${String(i + 1).padStart(2, "0")}`,
        kecamatan,
        perhentian,
        totalJarak: bulat(totalJarak),
        totalMuatan,
        kapasitas,
        utilisasi: totalMuatan / kapasitas,
        estimasiMenit: Math.round(
          (totalJarak / KECEPATAN_KMJ) * 60 + perhentian.length * MENIT_PER_PERHENTIAN,
        ),
      });
    });
  }

  /*
    The baseline this plan is measured against: every pickup as its own dedicated
    round trip from the depot, which is what collection costs with no
    consolidation at all. Same number of pickups, no shared legs.
  */
  const jarakTanpaKonsolidasi = rute
    .flatMap((r) => r.perhentian)
    .reduce((sum, p) => sum + 2 * jarakJalan(depot, p.titik), 0);

  const totalJarak = rute.reduce((sum, r) => sum + r.totalJarak, 0);
  const penghematanKm = jarakTanpaKonsolidasi - totalJarak;

  return {
    rute,
    depot,
    kapasitas,
    tidakTerutekan,
    ringkasan: {
      totalJarak: bulat(totalJarak),
      jarakTanpaKonsolidasi: bulat(jarakTanpaKonsolidasi),
      penghematanKm: bulat(penghematanKm),
      penghematanPersen:
        jarakTanpaKonsolidasi > 0 ? bulat((penghematanKm / jarakTanpaKonsolidasi) * 100) : 0,
      totalMuatan: rute.reduce((sum, r) => sum + r.totalMuatan, 0),
      jumlahRute: rute.length,
      jumlahPerhentian: rute.reduce((sum, r) => sum + r.perhentian.length, 0),
    },
  };
}
