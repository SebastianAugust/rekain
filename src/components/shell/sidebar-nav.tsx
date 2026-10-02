"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { Logo } from "@/components/brand/logo";
import { isNavItemActive, NAV } from "@/components/shell/nav-config";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Persistent desktop sidebar, 248px, pinned to the viewport. Hidden below `md`,
 * where BottomNav takes over. White cloth, thin line icons, and a pale-indigo
 * pill marks where you are.
 */
export function SidebarNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const rootHref = `/${role}`;

  return (
    <nav
      aria-label="Navigasi utama"
      className="permukaan sticky top-0 hidden h-dvh w-[calc(15.5rem+env(safe-area-inset-left))] shrink-0 flex-col self-start border-r border-garis pl-[env(safe-area-inset-left)] md:flex"
    >
      <div className="flex h-18 items-center px-w5">
        <Link href="/" aria-label="ReKain — beranda" className="rounded-input">
          <Logo />
        </Link>
      </div>

      <ul className="flex-1 space-y-w1 overflow-y-auto px-w3 py-w2">
        {NAV[role].map((item) => {
          const active = isNavItemActive(pathname, item, rootHref);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 w-full items-center gap-w3 rounded-input px-w3 text-sm",
                  active
                    ? "bg-nila-1/45 font-semibold text-nila-9"
                    : "text-tinta-pudar hover:bg-kain hover:text-tinta",
                )}
              >
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="px-w3 pb-w4">
        <Link
          href="/"
          className="flex min-h-11 w-full items-center gap-w3 rounded-input px-w3 text-sm text-tinta-pudar hover:bg-kain hover:text-tinta"
        >
          <LogOut size={20} strokeWidth={1.8} aria-hidden="true" />
          Keluar
        </Link>
      </div>
    </nav>
  );
}
