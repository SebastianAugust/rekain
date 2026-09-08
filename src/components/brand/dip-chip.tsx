import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
  Status and grade badges, toned by depth of dip rather than by an arbitrary
  colour code. A listing that is live and tradeable is fully dyed; one still
  waiting on grading has not been in the vat yet. The hierarchy the eye reads is
  the same hierarchy the business has.
*/
const dipChipVariants = cva(
  "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 font-mono text-xs tracking-tight whitespace-nowrap",
  {
    variants: {
      dip: {
        /* 9 dips — deepest. Reserved for the one status that means "act now". */
        d9: "bg-nila-9 text-white",
        /* 6 dips — established, tradeable. */
        d6: "bg-nila-6 text-white",
        /* 1 dip — in progress, soft ground. 7.15:1. */
        d1: "bg-nila-1 text-nila-6",
        /* 3 dips, outlined — grading codes and classifications. */
        d3: "border border-nila-3 bg-white text-nila-tinta",
        /* undyed — nothing has happened to this yet. */
        d0: "border border-garis bg-white text-tinta-pudar",
      },
    },
    defaultVariants: { dip: "d1" },
  },
);

export type DipTone = NonNullable<VariantProps<typeof dipChipVariants>["dip"]>;

export function DipChip({
  dip,
  className,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof dipChipVariants>) {
  return <span className={cn(dipChipVariants({ dip }), className)} {...props} />;
}
