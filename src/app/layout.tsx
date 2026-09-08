import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { TextileFilters } from "@/components/brand/textile-filters";
import { Providers } from "@/app/providers";
import "./globals.css";

/*
  Three roles, three reasons.

  Archivo carries the `wdth` axis, so headings can be pushed to expanded — heavy
  wide caps read as lettering stencilled onto a crate, which is the register a
  warehouse trading floor actually speaks in, and it is pointedly not the
  high-contrast display serif that shows up on every brief.

  Plus Jakarta Sans was drawn in Jakarta, for Jakarta. On an Indonesian B2B
  platform that is a reason rather than a decoration, and its geometric warmth
  offsets a palette that is entirely cool.

  IBM Plex Mono is a real industrial data face. Grading codes, weights and
  rupiah figures are readings, and they are set as readings everywhere.
*/
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ReKain — Pasar limbah tekstil B2B",
  description:
    "ReKain menghubungkan pabrik garmen dengan recycler, upcycler, dan brand berkelanjutan — dengan grading kualitas, harga transparan, dan logistik terkelola.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${archivo.variable} ${jakarta.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Filter definitions must exist in the document before anything references them. */}
        <TextileFilters />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
