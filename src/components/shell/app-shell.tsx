import { BottomNav } from "@/components/shell/bottom-nav";
import { SidebarNav } from "@/components/shell/sidebar-nav";
import { TopBar } from "@/components/shell/top-bar";
import type { Role } from "@/lib/types";

/**
 * One responsive shell for both dashboards — a sidebar from `md` up, a tab bar
 * below it. Real breakpoints, real viewport, no device frame.
 */
export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh print:block">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-full focus:bg-nila-6 focus:px-w3 focus:py-w2 focus:text-sm focus:text-white"
      >
        Lompat ke konten
      </a>

      <SidebarNav role={role} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar role={role} />
        {/*
          pb keeps content clear of the fixed mobile tab bar, home indicator included.
          The side insets keep it out from under a landscape notch / Dynamic Island;
          from `md` the sidebar already absorbs the left one.
        */}
        <main
          id="konten"
          className="flex flex-1 flex-col pr-[env(safe-area-inset-right)] pb-[calc(5rem+var(--aman-bawah))] pl-[env(safe-area-inset-left)] md:pb-0 md:pl-0"
        >
          <div className="flex-1">{children}</div>
          {/* Quiet, permanent, and honest about what this is. */}
          <footer className="px-w4 pt-w4 pb-w5 text-center text-xs text-tinta-pudar print:hidden">
            Prototipe · data dan pembayaran simulasi
          </footer>
        </main>
      </div>

      <BottomNav role={role} />
    </div>
  );
}
