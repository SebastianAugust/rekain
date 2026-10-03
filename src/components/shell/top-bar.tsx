import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { RoleSwitcher } from "@/components/shell/role-switcher";
import { PERSONA } from "@/lib/session";
import type { Role } from "@/lib/types";

export function TopBar({ role }: { role: Role }) {
  const persona = PERSONA[role];

  return (
    /* The status bar / notch strip is added on top of the 4rem bar, not taken out of it. */
    <header className="print:hidden flex h-[calc(3.5rem+var(--aman-atas))] shrink-0 md:h-[calc(4rem+var(--aman-atas))] items-center justify-between gap-w3 pt-(--aman-atas) pr-[calc(var(--spacing-w4)+env(safe-area-inset-right))] pl-[calc(var(--spacing-w4)+env(safe-area-inset-left))] sm:pr-[calc(var(--spacing-w5)+env(safe-area-inset-right))] sm:pl-[calc(var(--spacing-w5)+env(safe-area-inset-left))] md:pl-w5">
      {/* The wordmark doubles as the way home on mobile, where the sidebar is hidden. */}
      <Link href="/" className="inline-flex min-h-11 items-center rounded-input md:hidden" aria-label="ReKain — kembali ke beranda">
        <Logo />
      </Link>
      <div className="hidden md:block" />

      <div className="flex items-center gap-w2 sm:gap-w3">
        <RoleSwitcher role={role} />
        {/* The avatar is the way to the profile page on mobile, where the tab bar has no room for it. */}
        <Link
          href={`/${role}/profil`}
          aria-label={`Profil ${persona.nama}`}
          className="flex items-center gap-w2 rounded-full pr-w1 hover:bg-awan sm:pr-w3"
        >
          <span
            className="flex size-11 items-center justify-center rounded-full bg-nila-1 text-sm font-bold text-nila-9"
            aria-hidden="true"
          >
            {persona.nama.charAt(0)}
          </span>
          <span className="hidden text-sm font-medium text-tinta sm:inline">{persona.nama}</span>
        </Link>
      </div>
    </header>
  );
}
