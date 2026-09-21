import {
  Clock,
  ClipboardList,
  Factory,
  Heart,
  Home,
  Route,
  Search,
  Upload,
  User,
  type LucideIcon,
} from "lucide-react";

import type { Role } from "@/lib/types";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV: Record<Role, NavItem[]> = {
  pabrik: [
    { href: "/pabrik", label: "Beranda", icon: Home },
    { href: "/pabrik/upload", label: "Upload", icon: Upload },
    { href: "/pabrik/listing", label: "Listing", icon: ClipboardList },
    { href: "/pabrik/transaksi", label: "Transaksi", icon: Clock },
    { href: "/pabrik/profil", label: "Profil", icon: User },
  ],
  buyer: [
    { href: "/buyer", label: "Cari", icon: Search },
    { href: "/buyer/favorit", label: "Favorit", icon: Heart },
    { href: "/buyer/transaksi", label: "Transaksi", icon: Clock },
    { href: "/buyer/profil", label: "Profil", icon: User },
  ],
  /* Internal. Neither a factory nor a buyer ever sees these routes. */
  ops: [
    { href: "/ops", label: "Rencana Rute", icon: Route },
    { href: "/ops/pabrik", label: "Titik Jemput", icon: Factory },
  ],
};

/**
 * A nav item is active on its own route. The section root (`/pabrik`, `/buyer`)
 * would otherwise match every child, so it alone requires an exact match.
 */
export function isNavItemActive(pathname: string, item: NavItem, rootHref: string): boolean {
  if (item.href === rootHref) return pathname === rootHref;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
