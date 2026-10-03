import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { SplashScreen } from "@/components/brand/splash-screen";
import { TextileFilters } from "@/components/brand/textile-filters";
import { Providers } from "@/app/providers";
import "./globals.css";

/*
  Display and body use the Apple system stack (see globals.css). Plus Jakarta Sans
  is the loaded fallback for platforms without SF, so type still reads the same on
  Android and Windows. IBM Plex Mono carries grading codes and small labels.
*/
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

/*
  `cover` lets the page run under the notch and the home indicator, so the
  bars can paint those strips themselves and pad their content clear of them
  with `env(safe-area-inset-*)`. Without it the insets always read as 0.
*/
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // The software keyboard shrinks the layout viewport on Android too, as it does on
  // iOS, so bottom-pinned bars and dvh layouts follow it instead of hiding behind it.
  interactiveWidget: "resizes-content",
  // The page ground (--color-kain), so the status bar and browser chrome blend into it.
  themeColor: "#F7F9FC",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Filter definitions must exist in the document before anything references them. */}
        <TextileFilters />
        <Providers>{children}</Providers>
        <SplashScreen />
      </body>
    </html>
  );
}
