"use client";

import { useEffect, useState } from "react";

import { BrandMark } from "@/components/brand/brand-mark";
import { DyeWash } from "@/components/brand/textile-filters";
import { cn } from "@/lib/utils";

/*
  Held for a minimum beat so it never strobes on a fast connection or a warm
  cache, then unstitches itself away. Root layout does not remount across
  client-side navigations in the App Router, so this mounts — and therefore
  shows — exactly once per real page load, the way opening an app should feel.
*/
const TAMPIL_MS = 650;
const KELUAR_MS = 300;

export function SplashScreen() {
  const [fase, setFase] = useState<"tampil" | "keluar" | "selesai">("tampil");

  useEffect(() => {
    const mulaiKeluar = setTimeout(() => setFase("keluar"), TAMPIL_MS);
    return () => clearTimeout(mulaiKeluar);
  }, []);

  useEffect(() => {
    if (fase !== "keluar") return;
    const lepas = setTimeout(() => setFase("selesai"), KELUAR_MS);
    return () => clearTimeout(lepas);
  }, [fase]);

  if (fase === "selesai") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "celup di-nila fixed inset-0 z-50 flex flex-col items-center justify-center gap-w4 bg-nila-6 transition-opacity ease-out",
        fase === "keluar" ? "pointer-events-none opacity-0 duration-300" : "opacity-100",
      )}
    >
      <DyeWash />

      <div className="di-atas-celup flex flex-col items-center gap-w4">
        <BrandMark tone="dark" className="scale-125" />

        {/* A shuttle sweeping the width of a woven strip — a loom running, not a bar filling. */}
        <div className="h-px w-28 overflow-hidden rounded-full bg-nila-9">
          <div className="h-full w-1/3 animate-tenun-sapu rounded-full bg-nila-1 motion-reduce:hidden" />
        </div>

        <span className="sr-only">Memuat ReKain…</span>
      </div>
    </div>
  );
}
