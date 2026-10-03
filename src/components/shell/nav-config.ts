import {
  BadgeCheck,
  Clock,
  ClipboardCheck,
  ClipboardList,
  Factory,
  Heart,
  Home,
  Leaf,
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
  /** Shown in the mobile tab bar. The rest stay in the desktop sidebar. */
  tab?: boolean;
};

export const NAV: Record<Role, NavItem[]> = {
  pabrik: [
    { href: "/pabrik", label: "Beranda", icon: Home, tab: true },
    { href: "/pabrik/listing", label: "Listing", icon: ClipboardList, tab: true },
    { href: "/pabrik/upload", label: "Upload", icon: Upload, tab: true },
    { href: "/pabrik/transaksi", label: "Transaksi", icon: Clock, tab: true },
    { href: "/pabrik/dampak", label: "Dampak", icon: Leaf, tab: true },
    { href: "/pabrik/sertifikat", label: "Sertifikat", icon: BadgeCheck },
    { href: "/pabrik/profil", label: "Profil", icon: User },
  ],
  buyer: [
    { href: "/buyer", label: "Cari", icon: Search, tab: true },
    { href: "/buyer/favorit", label: "Favorit", icon: Heart, tab: true },
    { href: "/buyer/transaksi", label: "Transaksi", icon: Clock, tab: true },
    { href: "/buyer/profil", label: "Profil", icon: User, tab: true },
  ],
  /* Internal. Neither a factory nor a buyer ever sees these routes. */
  ops: [
    { href: "/ops", label: "Rencana Rute", icon: Route, tab: true },
    { href: "/ops/grading", label: "Grading", icon: ClipboardCheck, tab: true },
    { href: "/ops/pabrik", label: "Titik Jemput", icon: Factory, tab: true },
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
