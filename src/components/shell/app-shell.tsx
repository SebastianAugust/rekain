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
    <div className="flex min-h-dvh">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-nila-6 focus:px-w3 focus:py-w2 focus:text-sm focus:text-white"
      >
        Lompat ke konten
      </a>

      <SidebarNav role={role} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar role={role} />
        {/* pb keeps content clear of the fixed mobile tab bar */}
        <main id="konten" className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>

      <BottomNav role={role} />
    </div>
  );
}
