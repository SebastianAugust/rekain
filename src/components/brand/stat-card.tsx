import type { LucideIcon } from "lucide-react";

import { Eyebrow } from "@/components/brand/eyebrow";

/**
 * Stat tile. The value is mono — these are readings off a scale, not prose.
 *
 * On a phone three tiles share the width, so the icon steps out and the figure
 * steps down: the label and the number are what the tile is for, and a 16px
 * glyph competing for 80px of column was pushing the label onto two lines and
 * leaving the row of tiles ragged.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-sm border border-garis permukaan px-w2 py-w3 sm:px-w4">
      <div className="flex items-start justify-between gap-w2">
        <Eyebrow className="mb-w2">{label}</Eyebrow>
        <Icon size={16} className="hidden shrink-0 text-nila-3 sm:block" aria-hidden="true" />
      </div>
      {/* No wrapping: "Rp3,3 jt" breaking after the comma made one tile taller
          than its neighbours and the whole row ragged. */}
      <div className="font-mono text-base font-semibold whitespace-nowrap text-tinta sm:text-2xl">
        {value}
      </div>
    </div>
  );
}
