"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  NAMA_COOKIE,
  tokenCocok,
  tokenDari,
  tokenSah,
  UMUR_SESI_DETIK,
} from "@/lib/simulasi/sandi";

export type HasilGerbang = { error?: string };

export async function bukaGerbang(
  _sebelumnya: HasilGerbang,
  formData: FormData,
): Promise<HasilGerbang> {
  const sah = tokenSah();
  if (!sah) {
    return { error: "SIMULASI_SANDI belum diset di .env.local." };
  }

  const diberikan = String(formData.get("sandi") ?? "");
  if (!tokenCocok(tokenDari(diberikan), sah)) {
    return { error: "Sandi tidak cocok." };
  }

  (await cookies()).set(NAMA_COOKIE, sah, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: UMUR_SESI_DETIK,
    path: "/simulasi",
  });

  // Cookie saja tidak menjalankan ulang server component; redirect yang memaksa
  // halaman dirender ulang dan kalkulatornya muncul.
  redirect("/simulasi");
}
