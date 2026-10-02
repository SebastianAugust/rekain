"use client";

import { useId } from "react";
import { Loader2, Truck } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatBerat } from "@/lib/format";
import { KAPASITAS_OPSI } from "@/lib/logistik/rute";

/**
 * Truck size is the one lever an ops planner actually has, so it drives the
 * query key: changing it re-solves the problem rather than re-filtering a
 * cached answer. That also makes the engine easy to check by hand — a smaller
 * truck must produce more routes and more kilometres.
 */
export function KontrolKapasitas({
  kapasitas,
  onKapasitasChange,
  sedangHitung,
}: {
  kapasitas: number;
  onKapasitasChange: (kapasitas: number) => void;
  sedangHitung: boolean;
}) {
  const id = useId();

  return (
    <div className="flex flex-wrap items-end gap-w4">
      <div className="space-y-1.5">
        <Label htmlFor={id} className="text-sm font-medium text-tinta">
          Kapasitas truk
        </Label>
        <Select value={String(kapasitas)} onValueChange={(v) => onKapasitasChange(Number(v))}>
          <SelectTrigger id={id} className="w-52 bg-white">
            <Truck size={18} strokeWidth={1.8} className="shrink-0 text-nila-3" aria-hidden="true" />
            {/* Base UI renders the raw value by default; the label is the kilogram figure. */}
            <SelectValue>{formatBerat(kapasitas)}</SelectValue>
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            {KAPASITAS_OPSI.map((k) => (
              <SelectItem key={k} value={String(k)}>
                {formatBerat(k)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p
        role="status"
        aria-live="polite"
        className="flex h-11 items-center gap-w2 text-sm text-tinta-pudar"
      >
        {sedangHitung ? (
          <>
            <Loader2 size={16} className="animate-spin text-nila-3" aria-hidden="true" />
            Menyusun ulang rute…
          </>
        ) : (
          <span className="sr-only">Rencana rute terbaru sudah ditampilkan.</span>
        )}
      </p>
    </div>
  );
}
