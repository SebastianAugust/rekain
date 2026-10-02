import { FlaskConical } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Marks any figure that is a placeholder rather than a measurement. Text plus an
 * icon, so it never relies on colour alone. Amber is not in the palette, so it
 * stays on the neutral ladder with a border.
 */
export function DataContoh({ className, children = "Data contoh" }: { className?: string; children?: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-garis-kuat bg-white px-w2 py-1 text-xs font-medium text-tinta-pudar",
        className,
      )}
    >
      <FlaskConical size={12} strokeWidth={1.8} aria-hidden="true" />
      {children}
    </span>
  );
}
