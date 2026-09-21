import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The ReKain mark plus wordmark.
 *
 * The source PNG is 2388×1944 and was being shipped whole for a 28px slot, and
 * squeezed into a square that flattened the loop of the R. `next/image` now
 * serves a right-sized file, and `h-7 w-auto` keeps the drawing's own ratio.
 *
 * The mark is drawn in navy, so on a dyed ground it simply disappeared. There it
 * sits on a small square of undyed cloth instead — a woven label sewn onto
 * denim, which is how a garment carries its brand anyway.
 */
export function BrandMark({
  className,
  tone = "light",
  showWordmark = true,
}: {
  className?: string;
  /** `light` = for light grounds; `dark` = for dyed navy grounds. */
  tone?: "light" | "dark";
  showWordmark?: boolean;
}) {
  const gelap = tone === "dark";

  return (
    <span className={cn("flex items-center gap-w2", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center",
          gelap && "rounded-sm bg-kain px-1 py-0.5 shadow-tombol",
        )}
      >
        <Image
          src="/logo.png"
          alt={showWordmark ? "" : "ReKain"}
          width={2388}
          height={1944}
          sizes="40px"
          className={gelap ? "h-6 w-auto" : "h-7 w-auto"}
        />
      </span>

      {showWordmark && (
        <span className={cn("judul-kecil", gelap ? "text-sm text-white" : "text-tinta")}>
          ReKain
        </span>
      )}
    </span>
  );
}
