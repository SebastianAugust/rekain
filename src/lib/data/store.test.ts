import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import * as store from "@/lib/data/store";

/*
  The demo story end to end, through the real store: upload -> grading -> offer ->
  accept -> receipt confirmed, then the reject branch and a whole-lot sale. State is
  module-level and shared across the tests below, so they run in order.
*/

beforeAll(() => vi.useFakeTimers());
afterAll(() => vi.useRealTimers());

/** Start the call, let the simulated latency elapse, return its result. */
async function jalan<T>(p: Promise<T>): Promise<T> {
  // Attach the handler first so a rejection is never briefly unhandled.
  const hasil = p.then(
    (v) => ({ v }),
    (e: unknown) => ({ e }),
  );
  await vi.runAllTimersAsync();
  const r = await hasil;
  if ("e" in r) throw r.e;
  return r.v;
}

const listingDiBuyer = async (id: string) => (await jalan(store.fetchListingsForBuyer())).find((l) => l.id === id);

describe("alur demo end to end", () => {
  let kode = "";
  let transaksiId = "";
  const selesaiAwal = { n: 0 };

  it("1. unggahan menunggu grading, belum terlihat buyer, ada di antrean ops", async () => {
    selesaiAwal.n = (await jalan(store.fetchTransaksiSelesai())).length;
    const l = await jalan(store.createListing({ material: "Cotton Cutting Scraps", berat: 500, lokasi: "Cimahi, Bandung" }));
    expect(l.status).toBe("Menunggu Grading");
    expect(l.id).toMatch(/^COT-X-\d{3}$/);
    kode = l.id;

    expect(await listingDiBuyer(kode)).toBeUndefined();
    expect((await jalan(store.fetchAntreanGrading())).some((x) => x.id === kode)).toBe(true);
    expect((await jalan(store.fetchMyListings())).some((x) => x.id === kode)).toBe(true);
  });

  it("2. grading memberi grade dan harga, kode dilengkapi, listing muncul di buyer", async () => {
    const l = await jalan(store.gradeListing({ listingId: kode, grade: "B", harga: 4000 }));
    expect(l).toMatchObject({ grade: "B", harga: 4000, status: "Tersedia" });
    expect(l.id).toBe(kode.replace("-X-", "-B-"));
    kode = l.id;

    expect(await listingDiBuyer(kode)).toBeDefined();
    expect((await jalan(store.fetchAntreanGrading())).some((x) => x.id === kode)).toBe(false);
    await expect(jalan(store.gradeListing({ listingId: kode, grade: "A", harga: 9000 }))).rejects.toThrow("sudah digrading");
  });

  it("3. penawaran: listing Dalam Negosiasi, transaksi Menunggu Konfirmasi, penawaran kedua ditolak", async () => {
    const t = await jalan(store.createOffer({ listingId: kode, jumlah: 200 }));
    expect(t).toMatchObject({ status: "Menunggu Konfirmasi", berat: 200, total: 800_000, listingId: kode });
    transaksiId = t.id;

    expect((await listingDiBuyer(kode))?.status).toBe("Dalam Negosiasi");
    await expect(jalan(store.createOffer({ listingId: kode, jumlah: 50 }))).rejects.toThrow("sedang dalam negosiasi");
  });

  it("4. pabrik menerima: Dikirim (dana ditahan), dan tidak bisa menerima dua kali", async () => {
    expect((await jalan(store.terimaPenawaran(transaksiId))).status).toBe("Dikirim");
    await expect(jalan(store.terimaPenawaran(transaksiId))).rejects.toThrow("Penawaran ini sudah");
    await expect(jalan(store.tolakPenawaran(transaksiId))).rejects.toThrow("Penawaran ini sudah");
  });

  it("5. buyer konfirmasi: Selesai, stok berkurang dan listing Tersedia, dampak bertambah", async () => {
    const t = await jalan(store.konfirmasiTerima(transaksiId));
    expect(t.status).toBe("Selesai");
    await expect(jalan(store.konfirmasiTerima(transaksiId))).rejects.toThrow("bukan Dikirim");

    expect(await listingDiBuyer(kode)).toMatchObject({ status: "Tersedia", berat: 300 });
    const selesai = await jalan(store.fetchTransaksiSelesai());
    expect(selesai).toHaveLength(selesaiAwal.n + 1);
    expect(selesai.some((x) => x.id === transaksiId)).toBe(true);
  });

  it("6. cabang tolak: transaksi Ditolak, listing kembali Tersedia dengan stok utuh", async () => {
    const t = await jalan(store.createOffer({ listingId: kode, jumlah: 100 }));
    expect((await listingDiBuyer(kode))?.status).toBe("Dalam Negosiasi");

    expect((await jalan(store.tolakPenawaran(t.id))).status).toBe("Ditolak");
    expect(await listingDiBuyer(kode)).toMatchObject({ status: "Tersedia", berat: 300 });
    await expect(jalan(store.konfirmasiTerima(t.id))).rejects.toThrow("bukan Dikirim");
  });

  it("7. seluruh stok terambil: listing Terjual dan tidak bisa ditawar lagi", async () => {
    const t = await jalan(store.createOffer({ listingId: kode, jumlah: 300 }));
    await jalan(store.terimaPenawaran(t.id));
    await jalan(store.konfirmasiTerima(t.id));

    expect((await listingDiBuyer(kode))?.status).toBe("Terjual");
    await expect(jalan(store.createOffer({ listingId: kode, jumlah: 1 }))).rejects.toThrow("sudah terjual");
  });

  it("data contoh: barang Dikirim milik buyer bisa dikonfirmasi dan mengurangi stok DNM-A-007", async () => {
    const sebelum = (await listingDiBuyer("DNM-A-007"))?.berat ?? 0;
    expect((await jalan(store.konfirmasiTerima("TX-2291"))).status).toBe("Selesai");
    expect(await listingDiBuyer("DNM-A-007")).toMatchObject({ status: "Tersedia", berat: sebelum - 210 });
  });

  it("data contoh: pabrik aktif bisa menerima penawaran masuk, tapi bukan milik pabrik lain", async () => {
    await expect(jalan(store.terimaPenawaran("TX-2298"))).rejects.toThrow("bukan untuk pabrik Anda");
    expect((await jalan(store.terimaPenawaran("TX-2299"))).status).toBe("Dikirim");
  });
});
