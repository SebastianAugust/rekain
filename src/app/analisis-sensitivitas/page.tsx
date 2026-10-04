import type { Metadata } from "next";

import { Simulator } from "@/components/simulasi/simulator";

/*
  Tidak tertaut dari navigasi mana pun dan tidak diindeks. Tidak ada `robots.ts`
  di repo, dan memang sengaja: `Disallow: /analisis-sensitivitas` di robots.txt
  justru mengumumkan alamat halaman ini.
*/
export const metadata: Metadata = {
  title: "Analisis Sensitivitas — ReKain",
  description: "Kalkulator skenario proyeksi keuangan ReKain. Halaman internal.",
  robots: { index: false, follow: false },
};

export default function AnalisisSensitivitasPage() {
  return <Simulator />;
}
