"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { StitchLine } from "@/components/brand/stitch-line";
import { DyeWash } from "@/components/brand/textile-filters";
import { isNavItemActive, NAV } from "@/components/shell/nav-config";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Mobile tab bar. Replaces the sidebar below `md`.
 *
 * And it inherits the sidebar's dye with it. In this system the primary
 * navigation is the dyed surface — that is what the indigo is for. Leaving this
 * bar plain white meant that below `md`, where the sidebar is gone, an entire
 * dashboard had no dyed cloth on it anywhere: the brand's whole material
 * argument vanished at the exact width most people would see it.
 */
export function BottomNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const rootHref = `/${role}`;

  return (
    <nav
      aria-label="Navigasi utama"
      className="celup di-nila fixed inset-x-0 bottom-0 z-30 flex overflow-hidden border-t border-nila-9 bg-nila-6 pr-[env(safe-area-inset-right)] pb-(--aman-bawah) pl-[env(safe-area-inset-left)] md:hidden"
    >
      <DyeWash halus />
      <span className="pointer-events-none absolute inset-x-0 top-0.5 z-1" aria-hidden="true">
        <StitchLine seed="tab" warna="#a0d0f8" />
      </span>

      {NAV[role].map((item) => {
        const active = isNavItemActive(pathname, item, rootHref);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "di-atas-celup relative flex flex-1 flex-col items-center gap-0.5 py-w2",
              /* 11.6:1 and 7.15:1 on this ground respectively. */
              active ? "text-white" : "text-nila-1",
            )}
          >
            {/* Mirrors the sidebar's marker, rotated onto the top edge. */}
            {active && (
              <span
                aria-hidden="true"
                className="absolute inset-x-w4 top-0 bg-nila-1"
                style={{ height: 2 }}
              />
            )}
            <Icon size={18} aria-hidden="true" />
            <span className={cn("text-xs", active && "font-semibold")}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
