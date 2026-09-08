import Link from "next/link";

import { BrandMark } from "@/components/brand/brand-mark";
import { RoleSwitcher } from "@/components/shell/role-switcher";
import { PERSONA } from "@/lib/session";
import type { Role } from "@/lib/types";

export function TopBar({ role }: { role: Role }) {
  const persona = PERSONA[role];

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-w3 border-b border-garis permukaan px-w4 sm:px-w5">
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
