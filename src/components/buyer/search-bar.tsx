"use client";

import { Check, Search, X } from "lucide-react";

import type { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";

type FilterMaterial = {
  id: string;
  label: string;
  /** Filters in the same group widen the result (OR); across groups they narrow it (AND). */
  grup: "grade" | "harga" | "lokasi";
  cocok: (l: Listing) => boolean;
};

/*
  These chips used to be decoration — rendered as list items that looked
  pressable and did nothing, next to a permanently disabled Filter button. Now
  they filter. Grade A plus Grade B means "either grade", which is what a buyer
  who ticks both actually wants; ticking a grade and Cimahi narrows to both.
*/
export const FILTER_MATERIAL: FilterMaterial[] = [
  { id: "grade-a", label: "Grade A", grup: "grade", cocok: (l) => l.grade === "A" },
  { id: "grade-b", label: "Grade B", grup: "grade", cocok: (l) => l.grade === "B" },
  {
    id: "harga-5000",
    label: "< Rp5.000/kg",
    grup: "harga",
    cocok: (l) => l.harga !== null && l.harga < 5000,
  },
  { id: "cimahi", label: "Cimahi", grup: "lokasi", cocok: (l) => l.lokasi.startsWith("Cimahi") },
];

/** Free text matches material, grading code, factory and location. */
export function saringListing(listings: Listing[], query: string, aktif: string[]): Listing[] {
  const q = query.trim().toLowerCase();
  const terpilih = FILTER_MATERIAL.filter((f) => aktif.includes(f.id));
  const grup = [...new Set(terpilih.map((f) => f.grup))];

  return listings.filter((l) => {
    if (q && ![l.material, l.id, l.pabrik, l.lokasi].some((s) => s.toLowerCase().includes(q))) {
      return false;
    }
    return grup.every((g) => terpilih.some((f) => f.grup === g && f.cocok(l)));
  });
}

export function SearchBar({
  value,
  onValueChange,
  aktif,
  onToggle,
  onReset,
}: {
  value: string;
  onValueChange: (value: string) => void;
  aktif: string[];
  onToggle: (id: string) => void;
  /** Present only while something is narrowing the list. */
  onReset?: () => void;
}) {
  return (
    <div className="mb-w4 space-y-w3">
      <div className="flex items-center gap-w2 rounded-kartu border border-garis-kuat bg-white px-w3 py-w2 transition-shadow focus-within:border-nila-3 focus-within:shadow-bal focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-nila-3">
        <Search size={20} strokeWidth={1.8} className="shrink-0 text-nila-3" aria-hidden="true" />
        <label htmlFor="cari-material" className="sr-only">
          Cari material, kode, pabrik, atau lokasi
        </label>
        <input
          id="cari-material"
          type="search"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          placeholder="Cari material, kode, pabrik, atau lokasi…"
          enterKeyHint="search"
          className="h-11 min-w-0 flex-1 bg-transparent text-base text-tinta outline-none placeholder:text-tinta-pudar [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
          <button
            type="button"
            onClick={() => onValueChange("")}
            aria-label="Kosongkan pencarian"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-tinta-pudar hover:bg-awan hover:text-tinta"
          >
            <X size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
        )}
      </div>

      {/*
        One row that scrolls sideways on a phone instead of wrapping to a second and
        third line. The right edge fades, so a chip cut off there reads as "more".
      */}
      <div
        role="group"
        aria-label="Saring material"
        className="-mx-w4 flex items-center gap-w2 overflow-x-auto px-w4 pr-w6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-sm:[mask-image:linear-gradient(to_right,black_calc(100%-2rem),transparent)] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {FILTER_MATERIAL.map((f) => {
          const nyala = aktif.includes(f.id);
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={nyala}
              onClick={() => onToggle(f.id)}
              className={cn(
                "tekan inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full px-w4 text-sm font-semibold",
                nyala
                  ? "bg-nila-6 text-white shadow-tombol"
                  : "bg-awan text-tinta hover:bg-awan-tua",
              )}
            >
              {nyala && <Check size={16} strokeWidth={2} aria-hidden="true" />}
              {f.label}
            </button>
          );
        })}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-full px-w3 text-sm font-semibold text-nila-tinta hover:bg-awan"
          >
            <X size={16} strokeWidth={1.8} aria-hidden="true" /> Hapus semua
          </button>
        )}
      </div>
    </div>
  );
}
