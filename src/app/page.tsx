import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { MacroStats } from "@/components/landing/macro-stats";
import { ValueProps } from "@/components/landing/value-props";

export default function LandingPage() {
  return (
    /* Side insets keep the page out from under a landscape notch / Dynamic Island. */
    <div className="min-h-dvh pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)]">
      <a
        href="#konten"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-nila-6 focus:px-w3 focus:py-w2 focus:text-sm focus:text-white"
      >
        Lompat ke konten
      </a>

      <LandingNav />

      <main id="konten">
        <Hero />
        {/* Vertical rhythm is one step tighter than the horizontal gutter throughout. */}
        <div className="mx-auto flex max-w-6xl flex-col gap-w6 px-w4 py-w6 sm:px-w5">
          <MacroStats />
          <HowItWorks />
          <ValueProps />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
