import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The ReKain mark plus a typeset wordmark, so nothing depends on a lettered
 * image. `horizontal` is mark + text (sidebar, header); `lambang` is the mark
 * alone (favicon-size and tight mobile slots). `putih` is the one-colour white
 * version for indigo grounds: the mark is flattened to white, "Re" is white and
 * "Kain" steps to the lightest dip.
 */
export function Logo({
  varian = "horizontal",
  putih = false,
  className,
}: {
  varian?: "horizontal" | "lambang";
  putih?: boolean;
  className?: string;
}) {
  const tanpaTeks = varian === "lambang";

  return (
    <span className={cn("inline-flex items-center gap-w2", className)}>
      <Image
        src="/logo-mark.png"
        alt={tanpaTeks ? "ReKain" : ""}
        width={512}
        height={417}
        sizes="48px"
        className={cn("h-8 w-auto shrink-0", putih && "brightness-0 invert")}
      />
      {!tanpaTeks && (
        <span className="text-xl font-bold tracking-tight" style={{ letterSpacing: "-0.03em" }}>
          <span className={putih ? "text-white" : "text-nila-6"}>Re</span>
          <span className={putih ? "text-nila-1" : "text-nila-3"}>Kain</span>
        </span>
      )}
    </span>
  );
}
