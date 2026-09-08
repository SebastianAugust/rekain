"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { DyeWash } from "@/components/brand/textile-filters";
import { isNavItemActive, NAV } from "@/components/shell/nav-config";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Persistent desktop sidebar. Hidden below `md`, where BottomNav takes over.
 *
 * The navy here is dyed, not filled — a flat #103868 column down the left edge
 * is the single most recognisable shape in enterprise software, and the wash is
 * what stops it reading that way.
 */
export function SidebarNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const rootHref = `/${role}`;

  return (
    <nav
      aria-label="Navigasi utama"
      className="celup di-nila hidden w-56 shrink-0 flex-col bg-nila-6 md:flex"
    >
      <DyeWash halus />

      <div className="di-atas-celup flex flex-1 flex-col">
        <div className="flex h-14 items-center border-b border-nila-9 px-w4">
          <BrandMark tone="dark" />
        </div>

        <ul className="flex-1 space-y-w1 px-w2 py-w3">
          {NAV[role].map((item) => {
            const active = isNavItemActive(pathname, item, rootHref);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex w-full items-center gap-w3 rounded-sm px-w3 py-2.5 text-sm",
                    active
                      ? "bg-nila-9 font-semibold text-white"
                      : "text-nila-1 hover:bg-nila-9/60 hover:text-white",
                  )}
                >
                  {/* The deepest dip marks where you are. */}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-1 left-0 rounded-sm bg-nila-1"
                      style={{ width: 2 }}
                    />
                  )}
                  <Icon size={16} aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="px-w2 pb-w3">
          <Link
            href="/"
            className="flex w-full items-center gap-w3 rounded-sm px-w3 py-2.5 text-sm text-nila-1 hover:bg-nila-9/60 hover:text-white"
          >
            <LogOut size={16} aria-hidden="true" />
            Keluar
          </Link>
        </div>
      </div>
    </nav>
  );
}
