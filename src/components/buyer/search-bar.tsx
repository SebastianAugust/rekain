"use client";

import { Filter, Search } from "lucide-react";

/** Filter chips are illustrative in this prototype; search itself is live. */
const FILTER_CHIPS = ["Grade A", "Grade B", "< Rp5.000/kg", "Cimahi"];

export function SearchBar({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <>
      <div className="mb-w3 flex gap-w2">
        <div className="flex flex-1 items-center gap-w2 rounded-sm border border-garis bg-white px-w3 py-w2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-nila-3">
          <Search size={15} className="shrink-0 text-nila-3" aria-hidden="true" />
          <label htmlFor="cari-material" className="sr-only">
            Cari jenis material
          </label>
          <input
            id="cari-material"
            type="search"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="Cari jenis material…"
            className="min-w-0 flex-1 bg-transparent text-sm text-tinta outline-none placeholder:text-tinta-pudar"
          />
        </div>
        <button
          type="button"
          disabled
          title="Filter lanjutan belum tersedia di prototipe ini"
          className="flex items-center gap-1.5 rounded-sm border border-garis px-w3 text-xs font-medium text-tinta disabled:opacity-50"
        >
          <Filter size={13} aria-hidden="true" /> Filter
        </button>
      </div>

      <ul className="mb-w4 flex flex-wrap gap-w2">
        {FILTER_CHIPS.map((f) => (
          <li
            key={f}
            className="rounded-sm border border-garis bg-white px-w2 py-1 text-xs text-tinta-pudar"
          >
            {f}
          </li>
        ))}
      </ul>
    </>
  );
}
