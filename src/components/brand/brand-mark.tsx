import { cn } from "@/lib/utils";

/**
 * The mark: a dyed square with a guard thread down its binding edge — the same
 * construction as a listing's cross-section strip, reduced to 28px. The logo and
 * the product's central object are built from one idea rather than two.
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
      <img
        src="/logo.png"
        alt="ReKain"
        className="shrink-0 size-7"
      />

      {showWordmark && (
        <span className={cn("judul-kecil", gelap ? "text-sm text-white" : "text-tinta")}>
          ReKain
        </span>
      )}
    </span>
  );
}
