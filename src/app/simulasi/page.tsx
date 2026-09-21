import type { Metadata } from "next";
import { cookies } from "next/headers";

import { GerbangSandi } from "@/components/simulasi/gerbang-sandi";
import { Simulator } from "@/components/simulasi/simulator";
import { NAMA_COOKIE, tokenCocok, tokenSah } from "@/lib/simulasi/sandi";

/*
  Satu-satunya halaman di app ini yang menolak diindeks. Tidak ada `robots.ts` di
  repo, dan memang sengaja tidak ditambahkan: menulis `Disallow: /simulasi` di
  robots.txt justru mengumumkan alamat halaman ini ke siapa pun yang membacanya.
*/
export const metadata: Metadata = {
  title: "Simulasi Proyeksi — ReKain",
  description: "Kalkulator skenario proyeksi keuangan ReKain. Halaman internal.",
  robots: { index: false, follow: false },
};

export default async function SimulasiPage() {
  const sah = tokenSah();
  const token = (await cookies()).get(NAMA_COOKIE)?.value;

  if (!tokenCocok(token, sah)) {
    return <GerbangSandi belumDisetel={sah === null} />;
  }
  return <Simulator />;
}
