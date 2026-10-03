/**
 * Preview-only iPhone status bar. It is always in the DOM but `display:none`
 * unless `<html data-mockup="true">` is set (see layout.tsx and globals.css), so
 * on a real device the system's own status bar is the only one.
 */
export function StatusBarTiruan() {
  return (
    <div
      aria-hidden="true"
      className="status-bar-tiruan pointer-events-none fixed inset-x-0 top-0 z-40 hidden h-[59px] items-center justify-between px-7 text-tinta md:hidden"
    >
      <span className="text-[17px] font-semibold tracking-tight">9:41</span>
      <span className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.8" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
          <rect x="10" y="3" width="3" height="9" rx="0.8" />
          <rect x="15" y="0" width="3" height="12" rx="0.8" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M1.5 4.2a10.5 10.5 0 0 1 14 0" />
          <path d="M4 7a7 7 0 0 1 9 0" />
          <circle cx="8.5" cy="10" r="1.1" fill="currentColor" stroke="none" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="20" height="9" rx="2.2" fill="currentColor" />
          <path d="M25 4.5v4c.8-.3 1.5-1.1 1.5-2s-.7-1.7-1.5-2z" fill="currentColor" opacity="0.5" />
        </svg>
      </span>
    </div>
  );
}
