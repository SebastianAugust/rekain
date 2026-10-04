import type { Metadata } from "next";

import { Simulator } from "@/components/simulasi/simulator";

export const metadata: Metadata = {
  title: "Analisis Sensitivitas — ReKain",
  description: "Kalkulator skenario proyeksi keuangan ReKain. Halaman internal.",
  robots: { index: false, follow: false },
};

export default function AnalisisSensitivitasPage() {
  return <Simulator />;
}
