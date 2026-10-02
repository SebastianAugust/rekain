import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";

import type { Role } from "@/lib/types";

const LABEL: Record<Role, { panjang: string; pendek: string }> = {
  pabrik: { panjang: "Sisi Pabrik", pendek: "Pabrik" },
  buyer: { panjang: "Sisi Buyer", pendek: "Buyer" },
  ops: { panjang: "Sisi Ops", pendek: "Ops" },
};

const SEMUA: Role[] = ["pabrik", "buyer", "ops"];

/**
 * There is no authentication yet, so anyone running the demo needs a one-click
 * jump between the three sides of the marketplace — including the internal ops
 * view, which in production would sit behind a staff role rather than a link.
 */
export function RoleSwitcher({ role }: { role: Role }) {
  const lain = SEMUA.filter((r) => r !== role);

  return (
    <div className="flex items-center gap-w1">
      <ArrowLeftRight
        size={16}
        strokeWidth={1.8}
        className="mr-w1 hidden shrink-0 text-nila-3 sm:block"
        aria-hidden="true"
      />
      {lain.map((r) => (
        <Link
          key={r}
          href={`/${r}`}
          className="tekan inline-flex min-h-11 items-center rounded-full bg-awan px-w3 text-sm font-medium text-tinta hover:bg-awan-tua"
        >
          <span className="hidden sm:inline">{LABEL[r].panjang}</span>
          <span className="sm:hidden">{LABEL[r].pendek}</span>
        </Link>
      ))}
    </div>
  );
}
