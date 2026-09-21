import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { RoleSwitcher } from "@/components/shell/role-switcher";
import { PERSONA } from "@/lib/session";
import type { Role } from "@/lib/types";

export function TopBar({ role }: { role: Role }) {
  const persona = PERSONA[role];

  return (
    /* The status bar / notch strip is added on top of the 3.5rem bar, not taken out of it. */
    <header className="flex h-[calc(3.5rem+var(--aman-atas))] shrink-0 items-center justify-between gap-w3 border-b border-garis permukaan pt-(--aman-atas) pr-[calc(var(--spacing-w4)+env(safe-area-inset-right))] pl-[calc(var(--spacing-w4)+env(safe-area-inset-left))] sm:pr-[calc(var(--spacing-w5)+env(safe-area-inset-right))] sm:pl-[calc(var(--spacing-w5)+env(safe-area-inset-left))] md:pl-w5">
      {/* The wordmark doubles as the way home on mobile, where the sidebar is hidden. */}
      <Link href="/" className="md:hidden" aria-label="ReKain — kembali ke beranda">
        <BrandMark />
      </Link>
      <div className="hidden md:block" />

      <div className="flex items-center gap-w2 sm:gap-w3">
        <RoleSwitcher role={role} />
        <div className="flex items-center gap-w2">
          <span
            className="flex size-7 items-center justify-center rounded-sm bg-nila-1 font-mono text-xs font-semibold text-nila-6"
            aria-hidden="true"
          >
            {persona.nama.charAt(0)}
          </span>
          <span className="hidden text-sm text-tinta sm:inline">{persona.nama}</span>
        </div>
      </div>
    </header>
  );
}
