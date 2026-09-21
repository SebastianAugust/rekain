import { cn } from "@/lib/utils";

/**
 * Inline "working" mark for buttons: a short wavy seam with the stitches running
 * along it, like a needle mid-pass. It inherits `currentColor`, so it works on a
 * dyed button and a plain one alike. Reduced motion freezes it to a still seam.
 */
export function JahitanMuat({ className }: { className?: string }) {
  return (
    <svg
      width="22"
      height="8"
      viewBox="0 0 22 8"
      aria-hidden="true"
      focusable="false"
      className={cn("jahit-jalan shrink-0", className)}
    >
      <path
        d="M1 4 Q 6 1.5 11 4 T 21 4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </svg>
  );
}
