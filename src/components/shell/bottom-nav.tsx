"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavItemActive, NAV } from "@/components/shell/nav-config";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Mobile tab bar: translucent white over a blur, so content scrolls softly
 * beneath it. Four or five items; the rest live in the sidebar on desktop and
 * are linked from the pages themselves. The bottom padding is the home-indicator
 * inset (`--aman-bawah`).
 */
export function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const rootHref = `/${role}`;
  const items = NAV[role].filter((i) => i.tab);

  return (
    <nav
      aria-label="Navigasi utama"
      className="print:hidden fixed inset-x-0 bottom-0 z-30 flex border-t border-garis bg-white/80 pr-[env(safe-area-inset-right)] pb-(--aman-bawah) pl-[env(safe-area-inset-left)] backdrop-blur-xl md:hidden"
    >
      {items.map((item) => {
        const active = isNavItemActive(pathname, item, rootHref);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 pt-w2 pb-w1 text-xs",
              active ? "font-semibold text-nila-6" : "text-tinta-pudar",
            )}
          >
            <span
              className={cn(
                "flex h-7 w-12 items-center justify-center rounded-full",
                active && "bg-nila-1/45",
              )}
            >
              <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="max-w-full truncate px-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
